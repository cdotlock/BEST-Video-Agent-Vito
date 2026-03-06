/**
 * VideoContextProvider — Prompt OS compiler for video workflow sessions.
 *
 * Converts project/sequence state, memory, assets, and user overlays into a
 * layered runtime context so the agent can pick paths dynamically instead of
 * relying on one long monolithic prompt.
 */

import type { ContextProvider } from "@/lib/agent/context-provider";
import {
  getMemoryRecommendations,
  recommendWorkflowPaths,
} from "@/lib/services/video-memory-service";
import { getStyleProfileById } from "@/lib/services/style-profile-service";
import {
  getProjectById,
  getResources,
  getResourcesForContext,
  getSequenceRuntimeContext,
  type DomainResources,
} from "@/lib/services/video-workflow-service";
import { buildWorkflowGraphSnapshot } from "@/lib/services/video-workflow-graph-service";
import {
  pickBuiltinStylePreset,
} from "@/lib/video/builtin-style-presets";
import {
  compileVideoPrompt,
  deriveVideoPromptSignals,
} from "@/lib/video/prompt-compiler";

export interface VideoContextConfig {
  projectId: string;
  sequenceKey: string;
  memoryUser: string;
  modelId?: string;
  executionMode?: "checkpoint" | "yolo";
  customKnowledge?: string;
  workflowTemplate?: string;
  checkpointAlignmentRequired?: boolean;
  enableSelfReview?: boolean;
  contextResourceIds?: string[];
  styleReferenceResourceIds?: string[];
}

function dedupe(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output;
}

const EMPTY_RESOURCES: DomainResources = { categories: [] };

export class VideoContextProvider implements ContextProvider {
  constructor(private readonly config: VideoContextConfig) {}

  async build(): Promise<string> {
    const {
      projectId,
      sequenceKey,
      memoryUser,
      modelId,
      executionMode = "checkpoint",
      customKnowledge = "",
      workflowTemplate = "",
      checkpointAlignmentRequired = true,
      enableSelfReview = true,
    } = this.config;

    const contextResourceIds = dedupe(this.config.contextResourceIds ?? []);
    const styleReferenceResourceIds = dedupe(this.config.styleReferenceResourceIds ?? []);

    const [runtimeContext, memory, project] = await Promise.all([
      getSequenceRuntimeContext(projectId, sequenceKey),
      getMemoryRecommendations(memoryUser),
      getProjectById(projectId),
    ]);

    const goalSnippet = runtimeContext?.sequenceContent?.slice(0, 400)
      ?? project?.description?.slice(0, 400)
      ?? null;
    const defaultStylePreset = pickBuiltinStylePreset(goalSnippet);

    const activeStyleProfile = runtimeContext?.activeStyleProfileId
      ? await getStyleProfileById(runtimeContext.activeStyleProfileId)
      : null;

    const availableResources = runtimeContext
      ? await getResources(runtimeContext.sequenceId, projectId)
      : EMPTY_RESOURCES;

    const [attachedResources, styleReferenceResources] = runtimeContext
      ? await Promise.all([
          contextResourceIds.length > 0
            ? getResourcesForContext(runtimeContext.sequenceId, projectId, contextResourceIds)
            : Promise.resolve([]),
          styleReferenceResourceIds.length > 0
            ? getResourcesForContext(runtimeContext.sequenceId, projectId, styleReferenceResourceIds)
            : Promise.resolve([]),
        ])
      : [[], []];

    const signals = deriveVideoPromptSignals({
      sequenceContent: runtimeContext?.sequenceContent ?? null,
      workflowTemplate,
      customKnowledge,
      availableResources,
      attachedResources,
      executionMode,
      checkpointAlignmentRequired,
      enableSelfReview,
      hasStyleProfile: Boolean(activeStyleProfile),
    });

    const pathRecommendations = await recommendWorkflowPaths({
      memoryUser,
      goal: goalSnippet,
      storyboardDensity: signals.storyboardDensity,
      hasImageReference: signals.hasImageReference,
      hasReferenceVideo: signals.hasReferenceVideo,
      hasFirstFrameReference: signals.hasFirstFrameReference,
      hasLastFrameReference: signals.hasLastFrameReference,
      wantsMultiClip: signals.wantsMultiClip,
      prefersCharacterPriority: signals.prefersCharacterPriority,
      prefersEmptyShotPriority: signals.prefersEmptyShotPriority,
    });
    const workflowGraph = buildWorkflowGraphSnapshot({
      memory,
      pathRecommendations,
      resources: availableResources,
      signals,
    });

    return compileVideoPrompt({
      modelId,
      projectId,
      sequenceKey,
      sequenceId: runtimeContext?.sequenceId ?? null,
      memoryUser,
      executionMode,
      checkpointAlignmentRequired,
      enableSelfReview,
      project,
      sequenceContent: runtimeContext?.sequenceContent ?? null,
      defaultStylePreset,
      activeStyleProfile,
      memory,
      pathRecommendations,
      availableResources,
      attachedResources,
      styleReferenceResources,
      customKnowledge,
      workflowTemplate,
      signals,
      workflowGraph,
    });
  }
}
