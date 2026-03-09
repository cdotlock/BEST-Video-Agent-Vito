import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exportClipPlanToMp4 } from "@/lib/services/video-export-service";

export const runtime = "nodejs";

const ClipTransitionSchema = z.enum([
  "none",
  "cut",
  "fade",
  "dissolve",
  "wipe_left",
  "fade_black",
]);

const ExportClipPlanSchema = z.object({
  planName: z.string().min(1),
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
      audioEnabled: z.boolean().optional(),
      audioVolume: z.number().min(0).max(200).optional(),
    }),
  ).min(1),
  audioTracks: z.array(
    z.object({
      id: z.string().min(1).nullable().optional(),
      title: z.string().nullable().optional(),
      url: z.string().url().nullable(),
      startSec: z.number().min(0),
      sourceInSec: z.number().min(0),
      sourceOutSec: z.number().min(0),
      sourceDurationSec: z.number().min(0).nullable().optional(),
      volume: z.number().min(0).max(200).optional(),
      muted: z.boolean().optional(),
    }),
  ).optional().default([]),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ExportClipPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await exportClipPlanToMp4({
      planName: parsed.data.planName,
      clips: parsed.data.clips.map((clip) => ({
        id: clip.id ?? null,
        resourceId: clip.resourceId ?? null,
        url: clip.url ?? null,
        inSec: clip.inSec,
        outSec: clip.outSec,
        transition: clip.transition,
        title: clip.title ?? null,
        sourceDurationSec: clip.sourceDurationSec ?? null,
        audioEnabled: clip.audioEnabled ?? true,
        audioVolume: clip.audioVolume ?? 100,
      })),
      audioTracks: parsed.data.audioTracks.map((track) => ({
        id: track.id ?? null,
        title: track.title ?? null,
        url: track.url ?? null,
        startSec: track.startSec,
        sourceInSec: track.sourceInSec,
        sourceOutSec: track.sourceOutSec,
        sourceDurationSec: track.sourceDurationSec ?? null,
        volume: track.volume ?? 100,
        muted: track.muted ?? false,
      })),
    });

    const body = Uint8Array.from(result.buffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": result.mimeType,
        "Content-Length": String(result.buffer.byteLength),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(result.fileName)}"`,
        "X-Export-Duration-Sec": result.durationSec.toFixed(3),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "导出失败";
    const status = message.includes("缺少运行时依赖") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
