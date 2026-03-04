import { z } from "zod";
import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types";
import type { McpProvider } from "../types";
import {
  MemoryProviderSchema,
  getMemoryRecommendations,
  recordPreferenceFeedback,
  clearMemory,
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
              enum: ["style_profile_saved", "style_profile_applied", "generation_feedback", "manual_feedback"],
            },
            styleTokens: { type: "array", items: { type: "string" } },
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
          ]),
          styleTokens: z.array(z.string().min(1)).optional().default([]),
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
          providers: input.providers,
          positivePrompt: input.positivePrompt ?? null,
          negativePrompt: input.negativePrompt ?? null,
          query: input.query ?? null,
          strength: input.strength,
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
