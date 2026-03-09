import { z } from "zod";
import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types";
import type { McpProvider, ToolContext } from "../types";
import * as keyResourceService from "@/lib/services/key-resource-service";
import { createResource, upsertByKeyResource } from "@/lib/domain/resource-service";
import {
  callFcGenerateVideo,
  isFcVideoConfigured,
} from "@/lib/services/fc-video-client";
import {
  generateStoryboardGrid,
  saveClipPlan,
} from "@/lib/services/video-composition-service";
import {
  findLatestDialogueScript,
  saveDialogueScript,
} from "@/lib/services/video-dialogue-service";
import {
  buildDirectorImagePrompt,
  buildDirectorVideoPrompt,
  inferReferenceRolesFromVisualRefs,
  loadVideoDirectorRuntimeContext,
  mergeDirectorStyleReferenceUrls,
} from "@/lib/services/video-director-service";
import { compressDialogueContext } from "@/lib/services/video-prompt-language-service";
import { getSequenceRuntimeContext } from "@/lib/services/video-workflow-service";
import { buildDialogueContextText } from "@/lib/video/dialogue-script";
import { VisualReferenceRoleSchema } from "@/lib/video/reference-roles";

function text(t: string): CallToolResult {
  return { content: [{ type: "text", text: t }] };
}

function json(data: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

const ImageReferenceSchema = z.object({
  role: VisualReferenceRoleSchema,
  url: z.string().url(),
  note: z.string().min(1).optional(),
});

const MixedReferenceSchema = z.object({
  role: VisualReferenceRoleSchema,
  mediaType: z.enum(["image", "video"]),
  url: z.string().url(),
  note: z.string().min(1).optional(),
});

type VideoGenerationStrategy =
  | "prompt_only"
  | "first_frame"
  | "first_last_frame"
  | "mixed_refs";

interface ResolvedVideoStrategy {
  strategy: VideoGenerationStrategy;
  ignoredLastFrame: boolean;
  reason: string;
}

function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of urls) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output;
}

function mergeImageReferenceUrls(
  legacyUrls: string[] | undefined,
  refs: Array<z.infer<typeof ImageReferenceSchema>>,
): string[] {
  const fromRefs = refs.map((ref) => ref.url);
  return dedupeUrls([...(legacyUrls ?? []), ...fromRefs]);
}

function mergeVideoReferenceUrls(
  legacyImageUrls: string[] | undefined,
  legacyVideoUrls: string[] | undefined,
  refs: Array<z.infer<typeof MixedReferenceSchema>>,
): {
  imageUrls: string[];
  videoUrls: string[];
  firstFrameUrl: string | null;
  lastFrameUrl: string | null;
} {
  const imageUrls = dedupeUrls([
    ...(legacyImageUrls ?? []),
    ...refs.filter((ref) => ref.mediaType === "image").map((ref) => ref.url),
  ]);
  const videoUrls = dedupeUrls([
    ...(legacyVideoUrls ?? []),
    ...refs.filter((ref) => ref.mediaType === "video").map((ref) => ref.url),
  ]);
  const firstFrameUrl = refs.find(
    (ref) => ref.mediaType === "image" && ref.role === "first_frame_ref",
  )?.url ?? null;
  const lastFrameUrl = refs.find(
    (ref) => ref.mediaType === "image" && ref.role === "last_frame_ref",
  )?.url ?? null;
  return { imageUrls, videoUrls, firstFrameUrl, lastFrameUrl };
}

function resolveVideoStrategy(input: {
  requestedStrategy: VideoGenerationStrategy | undefined;
  sourceImageUrl: string | undefined;
  firstFrameUrl: string | null;
  lastFrameUrl: string | null;
  referenceVideoUrls: string[];
}): ResolvedVideoStrategy {
  const {
    requestedStrategy,
    sourceImageUrl,
    firstFrameUrl,
    lastFrameUrl,
    referenceVideoUrls,
  } = input;

  const hasFirstFrame = Boolean(firstFrameUrl || sourceImageUrl);
  const hasLastFrame = Boolean(lastFrameUrl);
  const hasVideoRefs = referenceVideoUrls.length > 0;

  if (requestedStrategy === "mixed_refs") {
    return {
      strategy: "mixed_refs",
      ignoredLastFrame: false,
      reason: "explicit_mixed_refs",
    };
  }
  if (requestedStrategy === "first_last_frame") {
    if (hasFirstFrame && hasLastFrame) {
      return {
        strategy: "first_last_frame",
        ignoredLastFrame: false,
        reason: "explicit_first_last_frame",
      };
    }
    return {
      strategy: hasFirstFrame ? "first_frame" : "prompt_only",
      ignoredLastFrame: hasLastFrame,
      reason: hasFirstFrame
        ? "downgraded_missing_tail_frame"
        : "downgraded_missing_first_frame",
    };
  }
  if (requestedStrategy === "first_frame") {
    return {
      strategy: hasFirstFrame ? "first_frame" : "prompt_only",
      ignoredLastFrame: hasLastFrame,
      reason: hasFirstFrame
        ? "explicit_first_frame"
        : "downgraded_missing_first_frame",
    };
  }
  if (requestedStrategy === "prompt_only") {
    return {
      strategy: "prompt_only",
      ignoredLastFrame: hasLastFrame,
      reason: "explicit_prompt_only",
    };
  }

  if (hasVideoRefs) {
    return {
      strategy: "mixed_refs",
      ignoredLastFrame: false,
      reason: "inferred_video_refs",
    };
  }
  if (hasFirstFrame) {
    return {
      strategy: "first_frame",
      ignoredLastFrame: hasLastFrame,
      reason: hasLastFrame
        ? "inferred_first_frame_tail_ignored"
        : "inferred_first_frame",
    };
  }
  return {
    strategy: "prompt_only",
    ignoredLastFrame: hasLastFrame,
    reason: hasLastFrame
      ? "inferred_prompt_only_tail_ignored"
      : "inferred_prompt_only",
  };
}

function buildRuntimeVideoPrompt(basePrompt: string, dialogueContext: string | undefined): string {
  const compressedDialogue = compressDialogueContext(dialogueContext);
  if (!compressedDialogue) return basePrompt;
  return `${basePrompt}\n对白节奏：${compressedDialogue}。`;
}

interface RuntimeVideoScope {
  projectId: string;
  sequenceKey: string;
  sequenceId: string;
}

function parseVideoUserName(userName: string | undefined): { projectId: string; sequenceKey: string } | null {
  if (!userName) return null;
  const match = userName.match(/^video:([^:]+):(.+)$/);
  if (!match) return null;
  return {
    projectId: match[1] ?? "",
    sequenceKey: match[2] ?? "",
  };
}

async function resolveRuntimeVideoScope(context?: ToolContext): Promise<RuntimeVideoScope | null> {
  const parsed = parseVideoUserName(context?.userName);
  if (!parsed) return null;
  const runtime = await getSequenceRuntimeContext(parsed.projectId, parsed.sequenceKey);
  if (!runtime) return null;
  return {
    projectId: parsed.projectId,
    sequenceKey: parsed.sequenceKey,
    sequenceId: runtime.sequenceId,
  };
}

function resolveScopeTarget(
  input: { scopeType?: "project" | "sequence"; scopeId?: string },
  runtimeScope: RuntimeVideoScope | null,
): { scopeType: "project" | "sequence"; scopeId: string } {
  const normalizedScopeId = input.scopeId?.trim();
  if (input.scopeType === "project") {
    if (normalizedScopeId && normalizedScopeId.length > 0) {
      return { scopeType: "project", scopeId: normalizedScopeId };
    }
    if (runtimeScope) {
      return { scopeType: "project", scopeId: runtimeScope.projectId };
    }
    throw new Error("scopeId is required when scopeType=project");
  }
  if (input.scopeType === "sequence") {
    if (normalizedScopeId && normalizedScopeId.length > 0) {
      if (runtimeScope && normalizedScopeId === runtimeScope.sequenceKey) {
        return { scopeType: "sequence", scopeId: runtimeScope.sequenceId };
      }
      return { scopeType: "sequence", scopeId: normalizedScopeId };
    }
    if (runtimeScope) {
      return { scopeType: "sequence", scopeId: runtimeScope.sequenceId };
    }
    throw new Error("scopeId is required when scopeType=sequence");
  }

  if (runtimeScope) {
    if (normalizedScopeId && normalizedScopeId.length > 0) {
      if (normalizedScopeId === runtimeScope.sequenceKey) {
        return { scopeType: "sequence", scopeId: runtimeScope.sequenceId };
      }
      if (normalizedScopeId === runtimeScope.projectId) {
        return { scopeType: "project", scopeId: runtimeScope.projectId };
      }
      return { scopeType: "sequence", scopeId: normalizedScopeId };
    }
    return { scopeType: "sequence", scopeId: runtimeScope.sequenceId };
  }

  if (normalizedScopeId && normalizedScopeId.length > 0) {
    throw new Error("scopeType is required when scopeId is provided without video runtime context");
  }
  throw new Error("Missing scopeType/scopeId and failed to infer from current video context");
}

const GenerateImageParams = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1),
      prompt: z.string().min(1),
      referenceImageUrls: z.array(z.string().url()).optional(),
      references: z.array(ImageReferenceSchema).optional().default([]),
      /** Resource classification — required for auto-writeback to domain_resources */
      category: z.string().min(1),
      scopeType: z.enum(["project", "sequence"]).optional(),
      scopeId: z.string().min(1).optional(),
      title: z.string().optional(),
    }),
  ).min(1),
});

const GenerateVideoParams = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1),
      prompt: z.string().min(1),
      strategy: z.enum(["prompt_only", "first_frame", "first_last_frame", "mixed_refs"]).optional(),
      sourceImageUrl: z.string().url().optional(),
      firstFrameUrl: z.string().url().optional(),
      lastFrameUrl: z.string().url().optional(),
      referenceImageUrls: z.array(z.string().url()).optional().default([]),
      referenceVideoUrls: z.array(z.string().url()).optional().default([]),
      references: z.array(MixedReferenceSchema).optional().default([]),
      dialogueContext: z.string().min(1).optional(),
      category: z.string().min(1),
      scopeType: z.enum(["project", "sequence"]).optional(),
      scopeId: z.string().min(1).optional(),
      title: z.string().optional(),
    }),
  ).min(1),
});

const GenerateStoryboardGridParams = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1),
      layout: z.enum(["grid_2x2", "grid_3x3"]),
      category: z.string().min(1),
      scopeType: z.enum(["project", "sequence"]).optional(),
      scopeId: z.string().min(1).optional(),
      title: z.string().optional(),
      cells: z.array(
        z.object({
          prompt: z.string().min(1),
          title: z.string().nullable().optional(),
          referenceImageUrls: z.array(z.string().url()).optional().default([]),
        }),
      ),
    }),
  ).min(1),
});

const SaveClipPlanParams = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1),
      title: z.string().nullable().optional(),
      category: z.string().min(1).default("剪辑计划"),
      scopeType: z.enum(["project", "sequence"]).optional(),
      scopeId: z.string().min(1).optional(),
      clips: z.array(
        z.object({
          resourceId: z.string().nullable().optional(),
          url: z.string().url().nullable().optional(),
          inSec: z.number().min(0),
          outSec: z.number().min(0),
          transition: z.enum([
            "none",
            "cut",
            "fade",
            "dissolve",
            "wipe_left",
            "fade_black",
          ]).optional().default("none"),
          title: z.string().nullable().optional(),
        }),
      ).min(1),
    }),
  ).min(1),
});

const DialogueLineSchema = z.object({
  character: z.string().min(1),
  line: z.string().min(1),
  emotion: z.string().min(1).optional(),
  durationSec: z.number().positive().optional(),
});

const SaveDialogueScriptParams = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1),
      title: z.string().nullable().optional(),
      category: z.string().min(1).default("角色台词"),
      scopeType: z.enum(["project", "sequence"]).optional(),
      scopeId: z.string().min(1).optional(),
      sceneGoal: z.string().nullable().optional(),
      lines: z.array(DialogueLineSchema).min(1),
    }),
  ).min(1),
});

export const videoMgrMcp: McpProvider = {
  name: "video_mgr",

  async listTools(): Promise<Tool[]> {
    return [
      {
        name: "generate_image",
        description:
          "Generate image(s) from text prompt(s) via FC. The provider automatically enriches runtime prompts for director-grade animated short output (style refs, continuity, role-aware guidance) and persists success to DB (both key_resource for version tracking and domain_resources for UI display). Each item requires a unique `key` (session-scoped); re-using an existing key creates a new version. Returns array of {status, imageUrl, key, keyResourceId, version}.",
        inputSchema: {
          type: "object" as const,
          properties: {
            items: {
              type: "array",
              description: "Array of image generation tasks. Each item auto-creates a domain_resources entry.",
              items: {
                type: "object",
                properties: {
                  key: { type: "string", description: "Unique semantic key for this image within the session (e.g. char_alice_portrait, scene_1_bg, shot_1_3). Re-using an existing key creates a new version." },
                  prompt: { type: "string", description: "Text prompt describing the image to generate" },
                  referenceImageUrls: {
                    type: "array",
                    items: { type: "string" },
                    description: "Optional reference image URLs for style/content guidance",
                  },
                  references: {
                    type: "array",
                    description: "Role-based image references. Roles: style_ref/scene_ref/empty_shot_ref/character_ref/motion_ref/first_frame_ref/last_frame_ref/storyboard_ref",
                    items: {
                      type: "object",
                      properties: {
                        role: {
                          type: "string",
                          enum: [
                            "style_ref",
                            "scene_ref",
                            "empty_shot_ref",
                            "character_ref",
                            "motion_ref",
                            "first_frame_ref",
                            "last_frame_ref",
                            "storyboard_ref",
                          ],
                        },
                        url: { type: "string" },
                        note: { type: "string" },
                      },
                      required: ["role", "url"],
                    },
                  },
                  category: { type: "string", description: "Resource category for UI grouping (LLM decides, e.g. '角色立绘', '场景', '服装', '分镜')" },
                  scopeType: { type: "string", enum: ["project", "sequence"], description: "Scope level: 'project' for project-wide resources, 'sequence' for sequence-scoped resources" },
                  scopeId: { type: "string", description: "ID of the scope entity (project ID or sequence ID)" },
                  title: { type: "string", description: "Human-readable label shown in resource panel (e.g. character name, scene title)" },
                },
                required: ["key", "prompt", "category"],
              },
            },
          },
          required: ["items"],
        },
      },
      {
        name: "generate_video",
        description:
          "Generate/store video tasks with flexible strategies: prompt_only, first_frame, first_last_frame, mixed_refs. The provider automatically enriches runtime prompts for animated short continuity (style refs, motion discipline, character consistency, dialogue rhythm). On success, writes domain_resources(mediaType=video) with prompt, strategy, refs, and optional generated video URL.",
        inputSchema: {
          type: "object" as const,
          properties: {
            items: {
              type: "array",
              description: "Array of video generation entries. Each auto-creates a domain_resources entry with mediaType=video.",
              items: {
                type: "object",
                properties: {
                  key: { type: "string", description: "Unique semantic key for this video within the session (e.g. video_shot_1_3, video_scene_2_opening)" },
                  prompt: { type: "string", description: "Motion/animation prompt describing the desired video effect" },
                  strategy: { type: "string", enum: ["prompt_only", "first_frame", "first_last_frame", "mixed_refs"], description: "Optional video generation strategy. `first_last_frame` must be explicit. If omitted, the provider infers conservatively and will not silently upgrade a first-frame route into first-last-frame just because a tail frame exists." },
                  sourceImageUrl: { type: "string", description: "Optional source image URL (typically from generate_image output) to animate" },
                  firstFrameUrl: { type: "string", description: "First frame reference URL" },
                  lastFrameUrl: { type: "string", description: "Last frame reference URL (for first_last_frame strategy)" },
                  referenceImageUrls: { type: "array", items: { type: "string" }, description: "Additional image references" },
                  referenceVideoUrls: { type: "array", items: { type: "string" }, description: "Additional video references (for mixed_refs strategy)" },
                  references: {
                    type: "array",
                    description: "Role-based mixed references (image/video). Roles: style_ref/scene_ref/empty_shot_ref/character_ref/motion_ref/first_frame_ref/last_frame_ref/storyboard_ref",
                    items: {
                      type: "object",
                      properties: {
                        role: {
                          type: "string",
                          enum: [
                            "style_ref",
                            "scene_ref",
                            "empty_shot_ref",
                            "character_ref",
                            "motion_ref",
                            "first_frame_ref",
                            "last_frame_ref",
                            "storyboard_ref",
                          ],
                        },
                        mediaType: { type: "string", enum: ["image", "video"] },
                        url: { type: "string" },
                        note: { type: "string" },
                      },
                      required: ["role", "mediaType", "url"],
                    },
                  },
                  dialogueContext: {
                    type: "string",
                    description: "Optional hidden dialogue script context. When provided, it is merged into runtime video prompt.",
                  },
                  category: { type: "string", description: "Resource category for UI grouping (e.g. '分镜视频', '片头', '转场')" },
                  scopeType: { type: "string", enum: ["project", "sequence"], description: "Scope level: project or sequence" },
                  scopeId: { type: "string", description: "ID of the scope entity" },
                  title: { type: "string", description: "Human-readable label shown in resource panel" },
                },
                required: ["key", "prompt", "category"],
              },
            },
          },
          required: ["items"],
        },
      },
      {
        name: "generate_storyboard_grid",
        description:
          "Generate storyboard grid images (2x2 or 3x3). Each cell is automatically rewritten as a storyboard-first prompt for readable animated-short shot exploration, then a grid-plan JSON resource is persisted for downstream review/composition.",
        inputSchema: {
          type: "object" as const,
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  key: { type: "string" },
                  layout: { type: "string", enum: ["grid_2x2", "grid_3x3"] },
                  category: { type: "string" },
                  scopeType: { type: "string", enum: ["project", "sequence"] },
                  scopeId: { type: "string" },
                  title: { type: "string" },
                  cells: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        prompt: { type: "string" },
                        title: { type: "string" },
                        referenceImageUrls: { type: "array", items: { type: "string" } },
                      },
                      required: ["prompt"],
                    },
                  },
                },
                required: ["key", "layout", "category", "cells"],
              },
            },
          },
          required: ["items"],
        },
      },
      {
        name: "save_clip_plan",
        description:
          "Persist a lightweight clip composition plan (order/in-out/transition) as JSON resource for later stitching/export.",
        inputSchema: {
          type: "object" as const,
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  key: { type: "string" },
                  title: { type: "string" },
                  category: { type: "string" },
                  scopeType: { type: "string", enum: ["project", "sequence"] },
                  scopeId: { type: "string" },
                  clips: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        resourceId: { type: "string" },
                        url: { type: "string" },
                        inSec: { type: "number" },
                        outSec: { type: "number" },
                        transition: {
                          type: "string",
                          enum: ["none", "cut", "fade", "dissolve", "wipe_left", "fade_black"],
                        },
                        title: { type: "string" },
                      },
                      required: ["inSec", "outSec"],
                    },
                  },
                },
                required: ["key", "clips"],
              },
            },
          },
          required: ["items"],
        },
      },
      {
        name: "save_dialogue_script",
        description:
          "Persist structured dialogue script JSON (character lines + emotion + duration hints). Use this before dialogue-heavy video generation so script can be reused as context.",
        inputSchema: {
          type: "object" as const,
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  key: { type: "string" },
                  title: { type: "string" },
                  category: { type: "string", description: "Resource group label, e.g. 角色台词" },
                  scopeType: { type: "string", enum: ["project", "sequence"] },
                  scopeId: { type: "string" },
                  sceneGoal: { type: "string" },
                  lines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        character: { type: "string" },
                        line: { type: "string" },
                        emotion: { type: "string" },
                        durationSec: { type: "number" },
                      },
                      required: ["character", "line"],
                    },
                  },
                },
                required: ["key", "lines"],
              },
            },
          },
          required: ["items"],
        },
      },
    ];
  },

  async callTool(
    name: string,
    args: Record<string, unknown>,
    context?: ToolContext,
  ): Promise<CallToolResult> {
    switch (name) {
      case "generate_image": {
        const sessionId = context?.sessionId;
        if (!sessionId) {
          return text("Missing sessionId in tool context — generate_image requires a session.");
        }
        const { items } = GenerateImageParams.parse(args);
        const runtimeScope = await resolveRuntimeVideoScope(context);
        const directorRuntime = runtimeScope
          ? await loadVideoDirectorRuntimeContext(runtimeScope)
          : null;
        const normalizedItems = items.map((item) => {
          const mergedReferenceImageUrls = mergeImageReferenceUrls(
            item.referenceImageUrls,
            item.references,
          );
          const referenceRoles = inferReferenceRolesFromVisualRefs(item.references);
          const resolvedScope = resolveScopeTarget(
            { scopeType: item.scopeType, scopeId: item.scopeId },
            runtimeScope,
          );
          const runtimePrompt = directorRuntime
            ? buildDirectorImagePrompt({
                prompt: item.prompt,
                category: item.category,
                title: item.title,
                focusMode: directorRuntime.focusMode,
                sequenceContent: directorRuntime.sequenceContent,
                styleProfile: directorRuntime.activeStyleProfile,
                defaultStylePreset: directorRuntime.defaultStylePreset,
                roleAnchors: directorRuntime.roleAnchors,
                referenceRoles,
              })
            : item.prompt;
          return {
            ...item,
            scopeType: resolvedScope.scopeType,
            scopeId: resolvedScope.scopeId,
            referenceRoles,
            runtimePrompt,
            mergedReferenceImageUrls: directorRuntime
              ? mergeDirectorStyleReferenceUrls(
                  mergedReferenceImageUrls,
                  directorRuntime.styleReferenceUrls,
                )
              : mergedReferenceImageUrls,
          };
        });

        const results = await Promise.allSettled(
          normalizedItems.map(({ key, runtimePrompt, mergedReferenceImageUrls }) =>
            keyResourceService.generateImage({
              sessionId,
              key,
              prompt: runtimePrompt,
              refUrls: mergedReferenceImageUrls,
            }),
          ),
        );

        // Auto-writeback: create domain_resources entries for successful generations
        const imgOutput = await Promise.all(
          results.map(async (r, i) => {
            const item = normalizedItems[i];
            if (!item) {
              return {
                index: i,
                status: "error" as const,
                key: "unknown",
                error: "Missing normalized item",
              };
            }
            if (r.status !== "fulfilled") {
              return {
                index: i,
                status: "error" as const,
                key: item.key,
                error: r.reason instanceof Error ? r.reason.message : String(r.reason),
              };
            }
            const gen = r.value;
            try {
              await upsertByKeyResource({
                scopeType: item.scopeType,
                scopeId: item.scopeId,
                category: item.category,
                mediaType: "image",
                title: item.title ?? undefined,
                url: gen.imageUrl ?? undefined,
                keyResourceId: gen.id,
                data: {
                  key: item.key,
                  prompt: item.prompt,
                  runtimePrompt: item.runtimePrompt,
                  references: item.references,
                  referenceImageUrls: item.mergedReferenceImageUrls,
                },
              });
            } catch (e) {
              console.error(`[video_mgr] domain_resources writeback failed for key=${item.key}:`, e);
            }
            return {
              index: i,
              status: "ok" as const,
              key: gen.key,
              keyResourceId: gen.id,
              imageUrl: gen.imageUrl,
              version: gen.version,
            };
          }),
        );
        return json(imgOutput);
      }

      case "generate_video": {
        const { items } = GenerateVideoParams.parse(args);
        const runtimeScope = await resolveRuntimeVideoScope(context);
        const directorRuntime = runtimeScope
          ? await loadVideoDirectorRuntimeContext(runtimeScope)
          : null;
        const vidOutput = await Promise.all(
          items.map(async (item, i) => {
            try {
              const resolvedScope = resolveScopeTarget(
                { scopeType: item.scopeType, scopeId: item.scopeId },
                runtimeScope,
              );
              const mergedRefs = mergeVideoReferenceUrls(
                item.referenceImageUrls,
                item.referenceVideoUrls,
                item.references,
              );
              const mergedImageUrls = directorRuntime
                ? mergeDirectorStyleReferenceUrls(
                    mergedRefs.imageUrls,
                    directorRuntime.styleReferenceUrls,
                  )
                : mergedRefs.imageUrls;
              const firstFrameUrl = item.firstFrameUrl ?? mergedRefs.firstFrameUrl ?? item.sourceImageUrl ?? null;
              const lastFrameUrl = item.lastFrameUrl ?? mergedRefs.lastFrameUrl ?? null;
              const resolved = resolveVideoStrategy({
                requestedStrategy: item.strategy,
                sourceImageUrl: item.sourceImageUrl,
                firstFrameUrl,
                lastFrameUrl,
                referenceVideoUrls: mergedRefs.videoUrls,
              });
              const resolvedStrategy = resolved.strategy;
              const effectiveLastFrameUrl = resolvedStrategy === "first_last_frame"
                ? lastFrameUrl
                : null;
              const referenceRoles = inferReferenceRolesFromVisualRefs(
                item.references.map((ref) => ({ role: ref.role })),
              );
              const persistedDialogue = item.dialogueContext?.trim()
                ? null
                : await findLatestDialogueScript(resolvedScope.scopeType, resolvedScope.scopeId);
              const effectiveDialogueContext = item.dialogueContext?.trim()
                ? item.dialogueContext.trim()
                : persistedDialogue?.data
                  ? buildDialogueContextText(persistedDialogue.data)
                  : undefined;
              const directorPrompt = directorRuntime
                ? buildDirectorVideoPrompt({
                    prompt: item.prompt,
                    category: item.category,
                    title: item.title,
                    strategy: resolvedStrategy,
                    dialogueContext: effectiveDialogueContext,
                    focusMode: directorRuntime.focusMode,
                    sequenceContent: directorRuntime.sequenceContent,
                    styleProfile: directorRuntime.activeStyleProfile,
                    defaultStylePreset: directorRuntime.defaultStylePreset,
                    roleAnchors: directorRuntime.roleAnchors,
                    referenceRoles,
                  })
                : item.prompt;
              const runtimePrompt = directorRuntime
                ? directorPrompt
                : buildRuntimeVideoPrompt(directorPrompt, effectiveDialogueContext);
              let generatedVideoUrl: string | null = null;
              let pollCount: number | null = null;
              const shouldGenerate = resolvedStrategy !== "prompt_only";
              if (shouldGenerate && isFcVideoConfigured()) {
                const generated = await callFcGenerateVideo({
                  mode: resolvedStrategy,
                  prompt: runtimePrompt,
                  firstFrameUrl,
                  lastFrameUrl: effectiveLastFrameUrl,
                  referenceImageUrls: mergedImageUrls,
                  referenceVideoUrls: mergedRefs.videoUrls,
                });
                generatedVideoUrl = generated.videoUrl;
                pollCount = generated.pollCount;
              }

              const resourceId = await createResource({
                scopeType: resolvedScope.scopeType,
                scopeId: resolvedScope.scopeId,
                category: item.category,
                mediaType: "video",
                title: item.title ?? undefined,
                url: generatedVideoUrl ?? undefined,
                data: {
                  key: item.key,
                  prompt: item.prompt,
                  runtimePrompt,
                  strategy: resolvedStrategy,
                  strategyReason: resolved.reason,
                  requestedStrategy: item.strategy ?? null,
                  sourceImageUrl: item.sourceImageUrl ?? null,
                  firstFrameUrl,
                  lastFrameUrl: effectiveLastFrameUrl,
                  ignoredLastFrameUrl: resolved.ignoredLastFrame ? lastFrameUrl : null,
                  referenceImageUrls: mergedImageUrls,
                  referenceVideoUrls: mergedRefs.videoUrls,
                  references: item.references,
                  dialogueContext: effectiveDialogueContext ?? null,
                  generated: generatedVideoUrl != null,
                },
              });
              return {
                index: i,
                status: "ok" as const,
                key: item.key,
                resourceId,
                prompt: item.prompt,
                strategy: resolvedStrategy,
                sourceImageUrl: item.sourceImageUrl ?? null,
                videoUrl: generatedVideoUrl,
                pollCount,
                strategy_reason: resolved.reason,
                ignored_last_frame: resolved.ignoredLastFrame,
                note: shouldGenerate
                  ? generatedVideoUrl
                    ? "Video generated and stored."
                    : "Video task stored as prompt (FC unavailable)."
                  : "Prompt stored only (strategy=prompt_only).",
              };
            } catch (e) {
              return {
                index: i,
                status: "error" as const,
                key: item.key,
                error: e instanceof Error ? e.message : String(e),
              };
            }
          }),
        );
        return json(vidOutput);
      }

      case "generate_storyboard_grid": {
        const sessionId = context?.sessionId;
        if (!sessionId) {
          return text("Missing sessionId in tool context — generate_storyboard_grid requires a session.");
        }
        const { items } = GenerateStoryboardGridParams.parse(args);
        const runtimeScope = await resolveRuntimeVideoScope(context);
        const directorRuntime = runtimeScope
          ? await loadVideoDirectorRuntimeContext(runtimeScope)
          : null;
        const output = await Promise.all(
          items.map(async (item, index) => {
            try {
              const resolvedScope = resolveScopeTarget(
                { scopeType: item.scopeType, scopeId: item.scopeId },
                runtimeScope,
              );
              const result = await generateStoryboardGrid({
                sessionId,
                key: item.key,
                title: item.title ?? null,
                layout: item.layout,
                category: item.category,
                scopeType: resolvedScope.scopeType,
                scopeId: resolvedScope.scopeId,
                cells: item.cells.map((cell) => ({
                  prompt: directorRuntime
                    ? buildDirectorImagePrompt({
                        prompt: cell.prompt,
                        category: item.category,
                        title: cell.title ?? item.title,
                        roleOverride: "storyboard_ref",
                        focusMode: directorRuntime.focusMode,
                        sequenceContent: directorRuntime.sequenceContent,
                        styleProfile: directorRuntime.activeStyleProfile,
                        defaultStylePreset: directorRuntime.defaultStylePreset,
                        roleAnchors: directorRuntime.roleAnchors,
                        referenceRoles: [],
                      })
                    : cell.prompt,
                  title: cell.title ?? null,
                  referenceImageUrls: directorRuntime
                    ? mergeDirectorStyleReferenceUrls(
                        cell.referenceImageUrls,
                        directorRuntime.styleReferenceUrls,
                      )
                    : cell.referenceImageUrls,
                })),
              });
              return {
                index,
                status: "ok" as const,
                ...result,
              };
            } catch (err) {
              return {
                index,
                status: "error" as const,
                key: item.key,
                error: err instanceof Error ? err.message : String(err),
              };
            }
          }),
        );
        return json(output);
      }

      case "save_clip_plan": {
        const { items } = SaveClipPlanParams.parse(args);
        const runtimeScope = await resolveRuntimeVideoScope(context);
        const output = await Promise.all(
          items.map(async (item, index) => {
            try {
              const resolvedScope = resolveScopeTarget(
                { scopeType: item.scopeType, scopeId: item.scopeId },
                runtimeScope,
              );
              const result = await saveClipPlan({
                key: item.key,
                title: item.title ?? null,
                category: item.category,
                scopeType: resolvedScope.scopeType,
                scopeId: resolvedScope.scopeId,
                clips: item.clips.map((clip) => ({
                  resourceId: clip.resourceId ?? null,
                  url: clip.url ?? null,
                  inSec: clip.inSec,
                  outSec: clip.outSec,
                  transition: clip.transition,
                  title: clip.title ?? null,
                })),
              });
              return {
                index,
                status: "ok" as const,
                key: item.key,
                ...result,
              };
            } catch (err) {
              return {
                index,
                status: "error" as const,
                key: item.key,
                error: err instanceof Error ? err.message : String(err),
              };
            }
          }),
        );
        return json(output);
      }

      case "save_dialogue_script": {
        const { items } = SaveDialogueScriptParams.parse(args);
        const runtimeScope = await resolveRuntimeVideoScope(context);
        const output = await Promise.all(
          items.map(async (item, index) => {
            try {
              const resolvedScope = resolveScopeTarget(
                { scopeType: item.scopeType, scopeId: item.scopeId },
                runtimeScope,
              );
              const result = await saveDialogueScript({
                key: item.key,
                title: item.title ?? item.key,
                category: item.category,
                scopeType: resolvedScope.scopeType,
                scopeId: resolvedScope.scopeId,
                sceneGoal: item.sceneGoal ?? null,
                lines: item.lines,
              });
              return {
                index,
                status: "ok" as const,
                key: item.key,
                resourceId: result.resourceId,
                lineCount: result.lineCount,
              };
            } catch (e) {
              return {
                index,
                status: "error" as const,
                key: item.key,
                error: e instanceof Error ? e.message : String(e),
              };
            }
          }),
        );
        return json(output);
      }

      default:
        return text(`Unknown tool: ${name}`);
    }
  },
};
