import { z } from "zod";
import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types";
import type { McpProvider } from "../types";
import {
  PublicImageProviderSchema,
  StyleReferenceSchema,
  searchStyleImages,
  reverseStyleFromReferences,
  listStyleProfiles,
  getStyleProfileById,
} from "@/lib/services/style-profile-service";

function text(t: string): CallToolResult {
  return { content: [{ type: "text", text: t }] };
}

function json(data: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

export const styleSearchMcp: McpProvider = {
  name: "style_search",

  async listTools(): Promise<Tool[]> {
    return [
      {
        name: "search_images",
        description:
          "Search reference images from public galleries (Unsplash / Pexels / Pixabay). Use this before generation to collect style references.",
        inputSchema: {
          type: "object" as const,
          properties: {
            query: { type: "string", description: "Style or visual query, e.g. 'cinematic cyberpunk street night'" },
            providers: {
              type: "array",
              items: { type: "string", enum: ["unsplash", "pexels", "pixabay"] },
              description: "Optional provider filter. If omitted, search all providers.",
            },
            page: { type: "number", description: "Result page, default 1" },
            perPage: { type: "number", description: "Items per provider (1-40), default 24" },
          },
          required: ["query"],
        },
      },
      {
        name: "analyze_references",
        description:
          "Reverse-engineer selected reference images into style tokens and reusable prompts. Can optionally save a reusable style profile.",
        inputSchema: {
          type: "object" as const,
          properties: {
            projectId: { type: "string", description: "Optional project ID to bind the style profile" },
            memoryUser: { type: "string", description: "Optional long-term memory user id. When provided, style preferences are learned automatically." },
            sequenceKey: { type: "string", description: "Optional sequence key for memory event tracking." },
            profileName: { type: "string", description: "Style profile name to save" },
            query: { type: "string", description: "Original search query (optional)" },
            creativeGoal: { type: "string", description: "Creative goal / intent to bias prompt reverse" },
            saveProfile: { type: "boolean", description: "Whether to persist profile. Default true." },
            references: {
              type: "array",
              description: "Selected reference image records (typically from style_search__search_images output)",
              items: {
                type: "object",
                properties: {
                  source: { type: "string", enum: ["unsplash", "pexels", "pixabay", "custom"] },
                  sourceId: { type: "string" },
                  imageUrl: { type: "string" },
                  thumbUrl: { type: "string" },
                  sourceUrl: { type: "string" },
                  title: { type: "string" },
                  authorName: { type: "string" },
                  authorUrl: { type: "string" },
                  license: { type: "string" },
                  width: { type: "number" },
                  height: { type: "number" },
                  color: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                },
                required: ["source", "sourceId", "imageUrl"],
              },
            },
          },
          required: ["profileName", "references"],
        },
      },
      {
        name: "list_profiles",
        description: "List reusable style profiles (global + optional project-scoped).",
        inputSchema: {
          type: "object" as const,
          properties: {
            projectId: { type: "string", description: "Optional project ID" },
          },
        },
      },
      {
        name: "get_profile",
        description: "Get a style profile by ID.",
        inputSchema: {
          type: "object" as const,
          properties: {
            profileId: { type: "string", description: "Style profile ID" },
          },
          required: ["profileId"],
        },
      },
    ];
  },

  async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<CallToolResult> {
    switch (name) {
      case "search_images": {
        const input = z
          .object({
            query: z.string().min(1),
            providers: z.array(PublicImageProviderSchema).optional().default([]),
            page: z.number().int().positive().optional().default(1),
            perPage: z.number().int().positive().max(40).optional().default(24),
          })
          .parse(args);

        const result = await searchStyleImages({
          query: input.query,
          providers: input.providers,
          page: input.page,
          perPage: input.perPage,
        });
        return json(result);
      }

      case "analyze_references": {
        const input = z
          .object({
            projectId: z.string().min(1).nullable().optional(),
            memoryUser: z.string().min(1).nullable().optional(),
            sequenceKey: z.string().min(1).nullable().optional(),
            profileName: z.string().min(1),
            query: z.string().nullable().optional(),
            creativeGoal: z.string().nullable().optional(),
            saveProfile: z.boolean().optional().default(true),
            references: z.array(StyleReferenceSchema).min(1),
          })
          .parse(args);

        const result = await reverseStyleFromReferences({
          projectId: input.projectId ?? null,
          memoryUser: input.memoryUser ?? null,
          sequenceKey: input.sequenceKey ?? null,
          profileName: input.profileName,
          query: input.query ?? null,
          creativeGoal: input.creativeGoal ?? null,
          references: input.references,
          saveProfile: input.saveProfile,
        });
        return json(result);
      }

      case "list_profiles": {
        const input = z
          .object({
            projectId: z.string().min(1).nullable().optional(),
          })
          .parse(args);

        const profiles = await listStyleProfiles(input.projectId ?? null);
        return json(profiles);
      }

      case "get_profile": {
        const input = z
          .object({
            profileId: z.string().min(1),
          })
          .parse(args);

        const profile = await getStyleProfileById(input.profileId);
        if (!profile) return text(`Style profile not found: ${input.profileId}`);
        return json(profile);
      }

      default:
        return text(`Unknown tool: ${name}`);
    }
  },
};
