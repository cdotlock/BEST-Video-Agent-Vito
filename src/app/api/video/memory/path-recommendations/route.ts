import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recommendWorkflowPaths } from "@/lib/services/video-memory-service";

const PathRecommendationQuerySchema = z.object({
  memoryUser: z.string().min(1).default("default"),
  goal: z.string().optional(),
  storyboardDensity: z.enum(["single", "grid_2x2", "grid_3x3"]).optional(),
  hasReferenceVideo: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  wantsMultiClip: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

/**
 * GET /api/video/memory/path-recommendations
 * Query: memoryUser, goal?, storyboardDensity?, hasReferenceVideo?, wantsMultiClip?
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const parsed = PathRecommendationQuerySchema.safeParse({
    memoryUser: params.get("memoryUser") ?? undefined,
    goal: params.get("goal") ?? undefined,
    storyboardDensity: params.get("storyboardDensity") ?? undefined,
    hasReferenceVideo: params.get("hasReferenceVideo") ?? undefined,
    wantsMultiClip: params.get("wantsMultiClip") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await recommendWorkflowPaths({
      memoryUser: parsed.data.memoryUser,
      goal: parsed.data.goal ?? null,
      storyboardDensity: parsed.data.storyboardDensity ?? null,
      hasReferenceVideo: parsed.data.hasReferenceVideo ?? false,
      wantsMultiClip: parsed.data.wantsMultiClip ?? false,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
