import * as keyResourceService from "@/lib/services/key-resource-service";
import {
  createResource,
  getResourcesByScope,
  updateResourceData,
} from "@/lib/domain/resource-service";

export type StoryboardGridLayout = "grid_2x2" | "grid_3x3";

export interface StoryboardGridCellInput {
  prompt: string;
  title: string | null;
  referenceImageUrls: string[];
}

export interface GenerateStoryboardGridInput {
  sessionId: string;
  key: string;
  title: string | null;
  layout: StoryboardGridLayout;
  category: string;
  scopeType: "project" | "sequence";
  scopeId: string;
  cells: StoryboardGridCellInput[];
}

export interface GenerateStoryboardGridResult {
  key: string;
  layout: StoryboardGridLayout;
  gridResourceId: string;
  cells: Array<{
    index: number;
    key: string;
    keyResourceId: string;
    imageUrl: string;
    version: number;
    title: string | null;
    prompt: string;
  }>;
}

export type ClipTransition =
  | "none"
  | "cut"
  | "fade"
  | "dissolve"
  | "wipe_left"
  | "fade_black";

export interface ClipPlanItemInput {
  id?: string | null;
  resourceId: string | null;
  url: string | null;
  inSec: number;
  outSec: number;
  transition: ClipTransition;
  title: string | null;
  sourceDurationSec?: number | null;
}

export interface ClipPlanEditorStateInput {
  selectedClipId: string | null;
  selectedSourceResourceId: string | null;
  sourceInSec: number;
  sourceOutSec: number;
  sourceDurationSec: number | null;
  previewMode: "source" | "program";
  timelineZoom: number;
  snapEnabled: boolean;
  snapStepSec: number;
}

export interface SaveClipPlanInput {
  key: string;
  title: string | null;
  category: string;
  scopeType: "project" | "sequence";
  scopeId: string;
  clips: ClipPlanItemInput[];
  editorState?: ClipPlanEditorStateInput | null;
  saveMode?: "manual" | "autosave";
}

export interface SaveClipPlanResult {
  resourceId: string;
  clipCount: number;
  totalDurationSec: number;
  saveMode: "manual" | "autosave";
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function normalizeCellKey(baseKey: string, index: number): string {
  return `${baseKey}__cell_${index + 1}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readClipPlanKey(data: unknown): string | null {
  if (!isRecord(data)) return null;
  if (data.type !== "clip_plan") return null;
  return typeof data.key === "string" ? data.key : null;
}

export async function generateStoryboardGrid(
  input: GenerateStoryboardGridInput,
): Promise<GenerateStoryboardGridResult> {
  const expectedCount = input.layout === "grid_2x2" ? 4 : 9;
  if (input.cells.length !== expectedCount) {
    throw new Error(
      `layout=${input.layout} requires ${expectedCount} cells, got ${input.cells.length}`,
    );
  }

  const generated = await Promise.all(
    input.cells.map(async (cell, index) => {
      const cellKey = normalizeCellKey(input.key, index);
      const result = await keyResourceService.generateImage({
        sessionId: input.sessionId,
        key: cellKey,
        prompt: cell.prompt,
        refUrls: cell.referenceImageUrls.length > 0 ? cell.referenceImageUrls : undefined,
      });
      return {
        index,
        key: cellKey,
        keyResourceId: result.id,
        imageUrl: result.imageUrl,
        version: result.version,
        title: cell.title,
        prompt: cell.prompt,
      };
    }),
  );

  const gridResourceId = await createResource({
    scopeType: input.scopeType,
    scopeId: input.scopeId,
    category: input.category,
    mediaType: "json",
    title: input.title ?? `${input.layout}:${input.key}`,
    data: {
      key: input.key,
      type: "storyboard_grid",
      layout: input.layout,
      cells: generated.map((cell) => ({
        index: cell.index,
        key: cell.key,
        keyResourceId: cell.keyResourceId,
        imageUrl: cell.imageUrl,
        title: cell.title,
        prompt: cell.prompt,
      })),
    },
  });

  return {
    key: input.key,
    layout: input.layout,
    gridResourceId,
    cells: generated,
  };
}

export async function saveClipPlan(
  input: SaveClipPlanInput,
): Promise<SaveClipPlanResult> {
  const saveMode = input.saveMode ?? "manual";
  const normalizedClips = input.clips.map((clip, index) => {
    const inSec = clamp(clip.inSec, 0, Number.MAX_SAFE_INTEGER);
    const outSec = clamp(clip.outSec, inSec, Number.MAX_SAFE_INTEGER);
    return {
      id: clip.id ?? `clip_${index + 1}`,
      index,
      resourceId: clip.resourceId,
      url: clip.url,
      inSec,
      outSec,
      durationSec: Number((outSec - inSec).toFixed(3)),
      transition: clip.transition,
      title: clip.title,
      sourceDurationSec: clip.sourceDurationSec ?? null,
    };
  });
  const totalDurationSec = Number(
    normalizedClips.reduce((sum, clip) => sum + clip.durationSec, 0).toFixed(3),
  );
  const editorState = input.editorState
    ? {
        selectedClipId: input.editorState.selectedClipId,
        selectedSourceResourceId: input.editorState.selectedSourceResourceId,
        sourceInSec: clamp(input.editorState.sourceInSec, 0, Number.MAX_SAFE_INTEGER),
        sourceOutSec: clamp(
          input.editorState.sourceOutSec,
          clamp(input.editorState.sourceInSec, 0, Number.MAX_SAFE_INTEGER),
          Number.MAX_SAFE_INTEGER,
        ),
        sourceDurationSec: input.editorState.sourceDurationSec,
        previewMode: input.editorState.previewMode,
        timelineZoom: input.editorState.timelineZoom,
        snapEnabled: input.editorState.snapEnabled,
        snapStepSec: input.editorState.snapStepSec,
      }
    : null;
  const payload = {
    key: input.key,
    type: "clip_plan",
    format: "timeline_v2",
    saveMode,
    savedAt: new Date().toISOString(),
    clips: normalizedClips,
    totalDurationSec,
    editorState,
  };
  const existingResources = await getResourcesByScope(input.scopeType, input.scopeId);
  let existing: { id: string; sortOrder: number } | null = null;
  for (const resource of existingResources.flatMap((group) => group.items)) {
    if (readClipPlanKey(resource.data) !== input.key) continue;
    if (!existing || resource.sortOrder > existing.sortOrder) {
      existing = {
        id: resource.id,
        sortOrder: resource.sortOrder,
      };
    }
  }

  let resourceId: string;
  if (existing) {
    await updateResourceData(existing.id, payload);
    resourceId = existing.id;
  } else {
    resourceId = await createResource({
      scopeType: input.scopeType,
      scopeId: input.scopeId,
      category: input.category,
      mediaType: "json",
      title: input.title ?? input.key,
      data: payload,
    });
  }

  return {
    resourceId,
    clipCount: normalizedClips.length,
    totalDurationSec,
    saveMode,
  };
}
