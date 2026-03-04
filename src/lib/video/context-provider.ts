/**
 * VideoContextProvider — lightweight context for video workflow LLM sessions.
 *
 * Injects only:
 *   1. project_id
 *   2. sequence_key
 *
 * All MCP tools read data directly from DB at execution time;
 * no need for heavyweight context injection.
 */

import type { ContextProvider } from "@/lib/agent/context-provider";
import { getMemoryRecommendations } from "@/lib/services/video-memory-service";
import { getStyleProfileById } from "@/lib/services/style-profile-service";
import { getSequenceRuntimeContext } from "@/lib/services/video-workflow-service";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

export interface VideoContextConfig {
  projectId: string;
  sequenceKey: string;
  memoryUser: string;
}

/* ------------------------------------------------------------------ */
/*  Provider implementation                                            */
/* ------------------------------------------------------------------ */

export class VideoContextProvider implements ContextProvider {
  constructor(private readonly config: VideoContextConfig) {}

  async build(): Promise<string> {
    const { projectId, sequenceKey, memoryUser } = this.config;
    const [runtimeContext, memory] = await Promise.all([
      getSequenceRuntimeContext(projectId, sequenceKey),
      getMemoryRecommendations(memoryUser),
    ]);

    const lines: string[] = [
      "# Video Workflow Context",
      `project_id: ${projectId}`,
      `sequence_key: ${sequenceKey}`,
      `memory_user: ${memoryUser}`,
      "",
      "## Prompt Layering",
      "Use four-layer composition for every generation:",
      "1) Base Layer: quality, coherence, safety, no artifacts.",
      "2) Style Layer: style profile tokens/prompts (if provided below).",
      "3) Content Layer: sequence content and current shot intent.",
      "4) Task Layer: tool-specific details (image/video motion/camera).",
    ];

    lines.push("");
    lines.push("## Long-Term Memory (Default Enabled)");
    if (memory.preferredStyleTokens.length > 0) {
      lines.push(`preferred_style_tokens: ${memory.preferredStyleTokens.join(", ")}`);
    } else {
      lines.push("preferred_style_tokens: (none yet)");
    }
    if (memory.preferredProviders.length > 0) {
      lines.push(`preferred_providers: ${memory.preferredProviders.join(", ")}`);
    }
    if (memory.positivePromptHint) {
      lines.push(`memory_positive_prompt_hint: ${memory.positivePromptHint}`);
    }
    if (memory.negativePromptHint) {
      lines.push(`memory_negative_prompt_hint: ${memory.negativePromptHint}`);
    }
    if (memory.queryHint) {
      lines.push(`memory_query_hint: ${memory.queryHint}`);
    }

    if (runtimeContext?.sequenceContent) {
      const content = runtimeContext.sequenceContent.length > 1800
        ? `${runtimeContext.sequenceContent.slice(0, 1800)}...`
        : runtimeContext.sequenceContent;
      lines.push("");
      lines.push("## Content Layer");
      lines.push(content);
    }

    if (runtimeContext?.activeStyleProfileId) {
      const profile = await getStyleProfileById(runtimeContext.activeStyleProfileId);
      if (profile) {
        lines.push("");
        lines.push("## Style Layer");
        lines.push(`active_style_profile_id: ${profile.id}`);
        lines.push(`style_profile_name: ${profile.name}`);
        if (profile.styleTokens.length > 0) {
          lines.push(`style_tokens: ${profile.styleTokens.join(", ")}`);
        }
        lines.push(`positive_prompt: ${profile.positivePrompt}`);
        lines.push(`negative_prompt: ${profile.negativePrompt}`);
      }
    }

    return lines.join("\n");
  }
}
