import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveClipPlan } from "@/lib/services/video-composition-service";

const ClipTransitionSchema = z.enum(["none", "cut", "fade"]);

const SaveClipPlanSchema = z.object({
  key: z.string().min(1),
  title: z.string().nullable().optional(),
  category: z.string().min(1).optional().default("剪辑计划"),
  clips: z.array(
    z.object({
      resourceId: z.string().min(1).nullable().optional(),
      url: z.string().url().nullable().optional(),
      inSec: z.number().min(0),
      outSec: z.number().min(0),
      transition: ClipTransitionSchema.optional().default("none"),
      title: z.string().nullable().optional(),
    }),
  ).min(1),
});

/**
 * POST /api/video/sequences/[sequenceId]/clip-plan
 * Save lightweight clip composition plan as domain_resources JSON.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ sequenceId: string }> },
) {
  const { sequenceId } = await context.params;
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SaveClipPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await saveClipPlan({
      key: parsed.data.key,
      title: parsed.data.title ?? null,
      category: parsed.data.category,
      scopeType: "sequence",
      scopeId: sequenceId,
      clips: parsed.data.clips.map((clip) => ({
        resourceId: clip.resourceId ?? null,
        url: clip.url ?? null,
        inSec: clip.inSec,
        outSec: clip.outSec,
        transition: clip.transition,
        title: clip.title ?? null,
      })),
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
