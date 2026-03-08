import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveClipPlan } from "@/lib/services/video-composition-service";

const ClipTransitionSchema = z.enum([
  "none",
  "cut",
  "fade",
  "dissolve",
  "wipe_left",
  "fade_black",
]);
const MonitorModeSchema = z.enum(["source", "program"]);

const SaveClipPlanSchema = z.object({
  key: z.string().min(1),
  title: z.string().nullable().optional(),
  category: z.string().min(1).optional().default("剪辑计划"),
  saveMode: z.enum(["manual", "autosave"]).optional().default("manual"),
  clips: z.array(
    z.object({
      id: z.string().min(1).nullable().optional(),
      resourceId: z.string().min(1).nullable().optional(),
      url: z.string().url().nullable().optional(),
      inSec: z.number().min(0),
      outSec: z.number().min(0),
      transition: ClipTransitionSchema.optional().default("none"),
      title: z.string().nullable().optional(),
      sourceDurationSec: z.number().min(0).nullable().optional(),
    }),
  ).min(1),
  editorState: z.object({
    selectedClipId: z.string().min(1).nullable().optional(),
    selectedSourceResourceId: z.string().min(1).nullable().optional(),
    sourceInSec: z.number().min(0),
    sourceOutSec: z.number().min(0),
    sourceDurationSec: z.number().min(0).nullable().optional(),
    previewMode: MonitorModeSchema,
    timelineZoom: z.number().min(8).max(120),
    snapEnabled: z.boolean(),
    snapStepSec: z.number().min(0.05).max(5),
  }).nullable().optional(),
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
      saveMode: parsed.data.saveMode,
      clips: parsed.data.clips.map((clip) => ({
        id: clip.id ?? null,
        resourceId: clip.resourceId ?? null,
        url: clip.url ?? null,
        inSec: clip.inSec,
        outSec: clip.outSec,
        transition: clip.transition,
        title: clip.title ?? null,
        sourceDurationSec: clip.sourceDurationSec ?? null,
      })),
      editorState: parsed.data.editorState
        ? {
            selectedClipId: parsed.data.editorState.selectedClipId ?? null,
            selectedSourceResourceId: parsed.data.editorState.selectedSourceResourceId ?? null,
            sourceInSec: parsed.data.editorState.sourceInSec,
            sourceOutSec: parsed.data.editorState.sourceOutSec,
            sourceDurationSec: parsed.data.editorState.sourceDurationSec ?? null,
            previewMode: parsed.data.editorState.previewMode,
            timelineZoom: parsed.data.editorState.timelineZoom,
            snapEnabled: parsed.data.editorState.snapEnabled,
            snapStepSec: parsed.data.editorState.snapStepSec,
          }
        : null,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
