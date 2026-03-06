import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recommendWorkflowPaths } from "@/lib/services/video-memory-service";

const PathRecommendationQuerySchema = z.object({
  memoryUser: z.string().min(1).default("default"),
  goal: z.string().optional(),
  storyboardDensity: z.enum(["single", "grid_2x2", "grid_3x3"]).optional(),
  hasImageReference: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  hasReferenceVideo: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  hasFirstFrameReference: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  hasLastFrameReference: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  wantsMultiClip: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  prefersCharacterPriority: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  prefersEmptyShotPriority: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

/**
 * GET /api/video/memory/path-recommendations
 * Query: memoryUser, goal?, storyboardDensity?, hasImageReference?, hasReferenceVideo?,
 *        hasFirstFrameReference?, hasLastFrameReference?, wantsMultiClip?,
 *        prefersCharacterPriority?, prefersEmptyShotPriority?
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const parsed = PathRecommendationQuerySchema.safeParse({
    memoryUser: params.get("memoryUser") ?? undefined,
    goal: params.get("goal") ?? undefined,
    storyboardDensity: params.get("storyboardDensity") ?? undefined,
    hasImageReference: params.get("hasImageReference") ?? undefined,
    hasReferenceVideo: params.get("hasReferenceVideo") ?? undefined,
    hasFirstFrameReference: params.get("hasFirstFrameReference") ?? undefined,
    hasLastFrameReference: params.get("hasLastFrameReference") ?? undefined,
    wantsMultiClip: params.get("wantsMultiClip") ?? undefined,
    prefersCharacterPriority: params.get("prefersCharacterPriority") ?? undefined,
    prefersEmptyShotPriority: params.get("prefersEmptyShotPriority") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await recommendWorkflowPaths({
      memoryUser: parsed.data.memoryUser,
      goal: parsed.data.goal ?? null,
      storyboardDensity: parsed.data.storyboardDensity ?? null,
      hasImageReference: parsed.data.hasImageReference ?? false,
      hasReferenceVideo: parsed.data.hasReferenceVideo ?? false,
      hasFirstFrameReference: parsed.data.hasFirstFrameReference ?? false,
      hasLastFrameReference: parsed.data.hasLastFrameReference ?? false,
      wantsMultiClip: parsed.data.wantsMultiClip ?? false,
      prefersCharacterPriority: parsed.data.prefersCharacterPriority ?? false,
      prefersEmptyShotPriority: parsed.data.prefersEmptyShotPriority ?? false,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
