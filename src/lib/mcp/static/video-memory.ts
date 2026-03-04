import { z } from "zod";
import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types";
import type { McpProvider } from "../types";
import {
  MemoryProviderSchema,
  WorkflowPathIdSchema,
  getMemoryRecommendations,
  recommendWorkflowPaths,
  recordWorkflowPathReview,
  recordPreferenceFeedback,
  clearMemory,
  optimizePromptWithMemory,
} from "@/lib/services/video-memory-service";

function text(t: string): CallToolResult {
  return { content: [{ type: "text", text: t }] };
}

function json(data: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

export const videoMemoryMcp: McpProvider = {
  name: "video_memory",

  async listTools(): Promise<Tool[]> {
    return [
      {
        name: "recommend_defaults",
        description: "Get long-term memory recommendations (style tokens/providers/prompts) for a memory user.",
        inputSchema: {
          type: "object" as const,
          properties: {
            memoryUser: { type: "string", description: "Memory user id (e.g. agentForge.user)" },
          },
          required: ["memoryUser"],
        },
      },
      {
        name: "record_feedback",
        description: "Record preference feedback into long-term memory.",
        inputSchema: {
          type: "object" as const,
          properties: {
            memoryUser: { type: "string" },
            projectId: { type: "string" },
            sequenceKey: { type: "string" },
            eventType: {
              type: "string",
              enum: ["style_profile_saved", "style_profile_applied", "generation_feedback", "manual_feedback", "prompt_optimized", "workflow_path_review"],
            },
            styleTokens: { type: "array", items: { type: "string" } },
            workflowPaths: { type: "array", items: { type: "string" } },
            providers: { type: "array", items: { type: "string", enum: ["unsplash", "pexels", "pixabay"] } },
            positivePrompt: { type: "string" },
            negativePrompt: { type: "string" },
            query: { type: "string" },
            strength: { type: "number", description: "-2 ~ 2" },
            note: { type: "string" },
          },
          required: ["memoryUser", "eventType"],
        },
      },
      {
        name: "optimize_prompt",
        description: "Optimize an input prompt with long-term memory hints and record the optimization event.",
        inputSchema: {
          type: "object" as const,
          properties: {
            memoryUser: { type: "string" },
            prompt: { type: "string" },
            mode: { type: "string", enum: ["image", "video"] },
            projectId: { type: "string" },
            sequenceKey: { type: "string" },
            record: { type: "boolean", description: "Whether to write optimization event to memory (default true)" },
          },
          required: ["memoryUser", "prompt"],
        },
      },
      {
        name: "recommend_paths",
        description: "Recommend workflow paths (storyboard density, video strategy, compose strategy) from memory and current goal.",
        inputSchema: {
          type: "object" as const,
          properties: {
            memoryUser: { type: "string" },
            goal: { type: "string" },
            storyboardDensity: { type: "string", enum: ["single", "grid_2x2", "grid_3x3"] },
            hasReferenceVideo: { type: "boolean" },
            wantsMultiClip: { type: "boolean" },
          },
          required: ["memoryUser"],
        },
      },
      {
        name: "review_path",
        description: "Write back a workflow-path review result to long-term memory.",
        inputSchema: {
          type: "object" as const,
          properties: {
            memoryUser: { type: "string" },
            projectId: { type: "string" },
            sequenceKey: { type: "string" },
            pathId: { type: "string" },
            score: { type: "number", description: "-2 ~ 2" },
            note: { type: "string" },
          },
          required: ["memoryUser", "pathId", "score"],
        },
      },
      {
        name: "clear_memory",
        description: "Clear long-term memory data for a memory user.",
        inputSchema: {
          type: "object" as const,
          properties: {
            memoryUser: { type: "string" },
          },
          required: ["memoryUser"],
        },
      },
    ];
  },

  async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<CallToolResult> {
    switch (name) {
      case "recommend_defaults": {
        const input = z.object({ memoryUser: z.string().min(1) }).parse(args);
        const result = await getMemoryRecommendations(input.memoryUser);
        return json(result);
      }

      case "record_feedback": {
        const input = z.object({
          memoryUser: z.string().min(1),
          projectId: z.string().min(1).nullable().optional(),
          sequenceKey: z.string().min(1).nullable().optional(),
          eventType: z.enum([
            "style_profile_saved",
            "style_profile_applied",
            "generation_feedback",
            "manual_feedback",
            "prompt_optimized",
            "workflow_path_review",
          ]),
          styleTokens: z.array(z.string().min(1)).optional().default([]),
          workflowPaths: z.array(WorkflowPathIdSchema).optional().default([]),
          providers: z.array(MemoryProviderSchema).optional().default([]),
          positivePrompt: z.string().nullable().optional(),
          negativePrompt: z.string().nullable().optional(),
          query: z.string().nullable().optional(),
          strength: z.number().min(-2).max(2).optional().default(1),
          note: z.string().nullable().optional(),
        }).parse(args);

        await recordPreferenceFeedback({
          memoryUser: input.memoryUser,
          projectId: input.projectId ?? null,
          sequenceKey: input.sequenceKey ?? null,
          eventType: input.eventType,
          styleTokens: input.styleTokens,
          workflowPaths: input.workflowPaths,
          providers: input.providers,
          positivePrompt: input.positivePrompt ?? null,
          negativePrompt: input.negativePrompt ?? null,
          query: input.query ?? null,
          strength: input.strength,
          note: input.note ?? null,
        });

        return text("ok");
      }

      case "optimize_prompt": {
        const input = z.object({
          memoryUser: z.string().min(1),
          prompt: z.string().min(1),
          mode: z.enum(["image", "video"]).optional().default("image"),
          projectId: z.string().min(1).nullable().optional(),
          sequenceKey: z.string().min(1).nullable().optional(),
          record: z.boolean().optional().default(true),
        }).parse(args);

        const result = await optimizePromptWithMemory({
          memoryUser: input.memoryUser,
          prompt: input.prompt,
          mode: input.mode,
          projectId: input.projectId ?? null,
          sequenceKey: input.sequenceKey ?? null,
          record: input.record,
        });

        return json(result);
      }

      case "recommend_paths": {
        const input = z.object({
          memoryUser: z.string().min(1),
          goal: z.string().nullable().optional(),
          storyboardDensity: z.enum(["single", "grid_2x2", "grid_3x3"]).nullable().optional(),
          hasReferenceVideo: z.boolean().optional().default(false),
          wantsMultiClip: z.boolean().optional().default(false),
        }).parse(args);

        const result = await recommendWorkflowPaths({
          memoryUser: input.memoryUser,
          goal: input.goal ?? null,
          storyboardDensity: input.storyboardDensity ?? null,
          hasReferenceVideo: input.hasReferenceVideo,
          wantsMultiClip: input.wantsMultiClip,
        });
        return json(result);
      }

      case "review_path": {
        const input = z.object({
          memoryUser: z.string().min(1),
          projectId: z.string().min(1).nullable().optional(),
          sequenceKey: z.string().min(1).nullable().optional(),
          pathId: WorkflowPathIdSchema,
          score: z.number().min(-2).max(2),
          note: z.string().nullable().optional(),
        }).parse(args);

        await recordWorkflowPathReview({
          memoryUser: input.memoryUser,
          projectId: input.projectId ?? null,
          sequenceKey: input.sequenceKey ?? null,
          pathId: input.pathId,
          score: input.score,
          note: input.note ?? null,
        });
        return text("ok");
      }

      case "clear_memory": {
        const input = z.object({ memoryUser: z.string().min(1) }).parse(args);
        const result = await clearMemory(input.memoryUser);
        return json(result);
      }

      default:
        return text(`Unknown tool: ${name}`);
    }
  },
};
