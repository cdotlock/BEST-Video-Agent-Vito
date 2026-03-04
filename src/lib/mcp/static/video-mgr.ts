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

function text(t: string): CallToolResult {
  return { content: [{ type: "text", text: t }] };
}

function json(data: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

const ReferenceRoleSchema = z.enum([
  "style_ref",
  "scene_ref",
  "empty_shot_ref",
  "character_ref",
  "motion_ref",
]);

const ImageReferenceSchema = z.object({
  role: ReferenceRoleSchema,
  url: z.string().url(),
  note: z.string().min(1).optional(),
});

const MixedReferenceSchema = z.object({
  role: ReferenceRoleSchema,
  mediaType: z.enum(["image", "video"]),
  url: z.string().url(),
  note: z.string().min(1).optional(),
});

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
): { imageUrls: string[]; videoUrls: string[] } {
  const imageUrls = dedupeUrls([
    ...(legacyImageUrls ?? []),
    ...refs.filter((ref) => ref.mediaType === "image").map((ref) => ref.url),
  ]);
  const videoUrls = dedupeUrls([
    ...(legacyVideoUrls ?? []),
    ...refs.filter((ref) => ref.mediaType === "video").map((ref) => ref.url),
  ]);
  return { imageUrls, videoUrls };
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
      scopeType: z.enum(["project", "sequence"]),
      scopeId: z.string().min(1),
      title: z.string().optional(),
    }),
  ).min(1),
});

const GenerateVideoParams = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1),
      prompt: z.string().min(1),
      strategy: z.enum(["prompt_only", "first_frame", "first_last_frame", "mixed_refs"]).optional().default("prompt_only"),
      sourceImageUrl: z.string().url().optional(),
      firstFrameUrl: z.string().url().optional(),
      lastFrameUrl: z.string().url().optional(),
      referenceImageUrls: z.array(z.string().url()).optional().default([]),
      referenceVideoUrls: z.array(z.string().url()).optional().default([]),
      references: z.array(MixedReferenceSchema).optional().default([]),
      category: z.string().min(1),
      scopeType: z.enum(["project", "sequence"]),
      scopeId: z.string().min(1),
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
      scopeType: z.enum(["project", "sequence"]),
      scopeId: z.string().min(1),
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
      scopeType: z.enum(["project", "sequence"]),
      scopeId: z.string().min(1),
      clips: z.array(
        z.object({
          resourceId: z.string().nullable().optional(),
          url: z.string().url().nullable().optional(),
          inSec: z.number().min(0),
          outSec: z.number().min(0),
          transition: z.enum(["none", "cut", "fade"]).optional().default("none"),
          title: z.string().nullable().optional(),
        }),
      ).min(1),
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
          "Generate image(s) from text prompt(s) via FC. Images are automatically persisted to DB on success (both key_resource for version tracking and domain_resources for UI display) — no additional save step needed. Each item requires a unique `key` (session-scoped); re-using an existing key creates a new version. Returns array of {status, imageUrl, key, keyResourceId, version}.",
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
                    description: "Role-based image references. Roles: style_ref/scene_ref/empty_shot_ref/character_ref/motion_ref",
                    items: {
                      type: "object",
                      properties: {
                        role: {
                          type: "string",
                          enum: ["style_ref", "scene_ref", "empty_shot_ref", "character_ref", "motion_ref"],
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
                required: ["key", "prompt", "category", "scopeType", "scopeId"],
              },
            },
          },
          required: ["items"],
        },
      },
      {
        name: "generate_video",
        description:
          "Generate/store video tasks with flexible strategies: prompt_only, first_frame, first_last_frame, mixed_refs. On success, writes domain_resources(mediaType=video) with prompt, strategy, refs, and optional generated video URL.",
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
                  strategy: { type: "string", enum: ["prompt_only", "first_frame", "first_last_frame", "mixed_refs"], description: "Video generation strategy" },
                  sourceImageUrl: { type: "string", description: "Optional source image URL (typically from generate_image output) to animate" },
                  firstFrameUrl: { type: "string", description: "First frame reference URL" },
                  lastFrameUrl: { type: "string", description: "Last frame reference URL (for first_last_frame strategy)" },
                  referenceImageUrls: { type: "array", items: { type: "string" }, description: "Additional image references" },
                  referenceVideoUrls: { type: "array", items: { type: "string" }, description: "Additional video references (for mixed_refs strategy)" },
                  references: {
                    type: "array",
                    description: "Role-based mixed references (image/video).",
                    items: {
                      type: "object",
                      properties: {
                        role: {
                          type: "string",
                          enum: ["style_ref", "scene_ref", "empty_shot_ref", "character_ref", "motion_ref"],
                        },
                        mediaType: { type: "string", enum: ["image", "video"] },
                        url: { type: "string" },
                        note: { type: "string" },
                      },
                      required: ["role", "mediaType", "url"],
                    },
                  },
                  category: { type: "string", description: "Resource category for UI grouping (e.g. '分镜视频', '片头', '转场')" },
                  scopeType: { type: "string", enum: ["project", "sequence"], description: "Scope level: project or sequence" },
                  scopeId: { type: "string", description: "ID of the scope entity" },
                  title: { type: "string", description: "Human-readable label shown in resource panel" },
                },
                required: ["key", "prompt", "category", "scopeType", "scopeId"],
              },
            },
          },
          required: ["items"],
        },
      },
      {
        name: "generate_storyboard_grid",
        description:
          "Generate storyboard grid images (2x2 or 3x3). Each cell is generated as an image; then a grid-plan JSON resource is persisted for downstream review/composition.",
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
                required: ["key", "layout", "category", "scopeType", "scopeId", "cells"],
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
                        transition: { type: "string", enum: ["none", "cut", "fade"] },
                        title: { type: "string" },
                      },
                      required: ["inSec", "outSec"],
                    },
                  },
                },
                required: ["key", "scopeType", "scopeId", "clips"],
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
        const normalizedItems = items.map((item) => {
          const mergedReferenceImageUrls = mergeImageReferenceUrls(
            item.referenceImageUrls,
            item.references,
          );
          return {
            ...item,
            mergedReferenceImageUrls,
          };
        });

        const results = await Promise.allSettled(
          normalizedItems.map(({ key, prompt, mergedReferenceImageUrls }) =>
            keyResourceService.generateImage({
              sessionId,
              key,
              prompt,
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
        const vidOutput = await Promise.all(
          items.map(async (item, i) => {
            try {
              const mergedRefs = mergeVideoReferenceUrls(
                item.referenceImageUrls,
                item.referenceVideoUrls,
                item.references,
              );
              let generatedVideoUrl: string | null = null;
              let pollCount: number | null = null;
              const shouldGenerate = item.strategy !== "prompt_only";
              if (shouldGenerate && isFcVideoConfigured()) {
                const generated = await callFcGenerateVideo({
                  mode: item.strategy,
                  prompt: item.prompt,
                  firstFrameUrl: item.firstFrameUrl ?? item.sourceImageUrl ?? null,
                  lastFrameUrl: item.lastFrameUrl ?? null,
                  referenceImageUrls: mergedRefs.imageUrls,
                  referenceVideoUrls: mergedRefs.videoUrls,
                });
                generatedVideoUrl = generated.videoUrl;
                pollCount = generated.pollCount;
              }

              const resourceId = await createResource({
                scopeType: item.scopeType,
                scopeId: item.scopeId,
                category: item.category,
                mediaType: "video",
                title: item.title ?? undefined,
                url: generatedVideoUrl ?? undefined,
                data: {
                  key: item.key,
                  prompt: item.prompt,
                  strategy: item.strategy,
                  sourceImageUrl: item.sourceImageUrl ?? null,
                  firstFrameUrl: item.firstFrameUrl ?? null,
                  lastFrameUrl: item.lastFrameUrl ?? null,
                  referenceImageUrls: mergedRefs.imageUrls,
                  referenceVideoUrls: mergedRefs.videoUrls,
                  references: item.references,
                  generated: generatedVideoUrl != null,
                },
              });
              return {
                index: i,
                status: "ok" as const,
                key: item.key,
                resourceId,
                prompt: item.prompt,
                strategy: item.strategy,
                sourceImageUrl: item.sourceImageUrl ?? null,
                videoUrl: generatedVideoUrl,
                pollCount,
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
        const output = await Promise.all(
          items.map(async (item, index) => {
            try {
              const result = await generateStoryboardGrid({
                sessionId,
                key: item.key,
                title: item.title ?? null,
                layout: item.layout,
                category: item.category,
                scopeType: item.scopeType,
                scopeId: item.scopeId,
                cells: item.cells.map((cell) => ({
                  prompt: cell.prompt,
                  title: cell.title ?? null,
                  referenceImageUrls: cell.referenceImageUrls,
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
        const output = await Promise.all(
          items.map(async (item, index) => {
            try {
              const result = await saveClipPlan({
                key: item.key,
                title: item.title ?? null,
                category: item.category,
                scopeType: item.scopeType,
                scopeId: item.scopeId,
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

      default:
        return text(`Unknown tool: ${name}`);
    }
  },
};
