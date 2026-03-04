import * as keyResourceService from "@/lib/services/key-resource-service";
import { createResource } from "@/lib/domain/resource-service";

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

export type ClipTransition = "none" | "cut" | "fade";

export interface ClipPlanItemInput {
  resourceId: string | null;
  url: string | null;
  inSec: number;
  outSec: number;
  transition: ClipTransition;
  title: string | null;
}

export interface SaveClipPlanInput {
  key: string;
  title: string | null;
  category: string;
  scopeType: "project" | "sequence";
  scopeId: string;
  clips: ClipPlanItemInput[];
}

export interface SaveClipPlanResult {
  resourceId: string;
  clipCount: number;
  totalDurationSec: number;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function normalizeCellKey(baseKey: string, index: number): string {
  return `${baseKey}__cell_${index + 1}`;
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
  const normalizedClips = input.clips.map((clip, index) => {
    const inSec = clamp(clip.inSec, 0, Number.MAX_SAFE_INTEGER);
    const outSec = clamp(clip.outSec, inSec, Number.MAX_SAFE_INTEGER);
    return {
      index,
      resourceId: clip.resourceId,
      url: clip.url,
      inSec,
      outSec,
      durationSec: Number((outSec - inSec).toFixed(3)),
      transition: clip.transition,
      title: clip.title,
    };
  });
  const totalDurationSec = Number(
    normalizedClips.reduce((sum, clip) => sum + clip.durationSec, 0).toFixed(3),
  );

  const resourceId = await createResource({
    scopeType: input.scopeType,
    scopeId: input.scopeId,
    category: input.category,
    mediaType: "json",
    title: input.title ?? input.key,
    data: {
      key: input.key,
      type: "clip_plan",
      clips: normalizedClips,
      totalDurationSec,
    },
  });

  return {
    resourceId,
    clipCount: normalizedClips.length,
    totalDurationSec,
  };
}

