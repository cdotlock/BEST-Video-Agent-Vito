import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  WorkflowPathIdSchema,
  recordWorkflowPathReview,
} from "@/lib/services/video-memory-service";

const PathReviewSchema = z.object({
  memoryUser: z.string().min(1),
  projectId: z.string().min(1).nullable().optional(),
  sequenceKey: z.string().min(1).nullable().optional(),
  pathId: WorkflowPathIdSchema,
  score: z.number().min(-2).max(2),
  note: z.string().nullable().optional(),
});

/**
 * POST /api/video/memory/path-review
 * Body: { memoryUser, pathId, score, projectId?, sequenceKey?, note? }
 */
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = PathReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    await recordWorkflowPathReview({
      memoryUser: parsed.data.memoryUser,
      projectId: parsed.data.projectId ?? null,
      sequenceKey: parsed.data.sequenceKey ?? null,
      pathId: parsed.data.pathId,
      score: parsed.data.score,
      note: parsed.data.note ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

