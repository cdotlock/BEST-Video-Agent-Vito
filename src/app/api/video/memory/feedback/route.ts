import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  MemoryProviderSchema,
  recordPreferenceFeedback,
} from "@/lib/services/video-memory-service";

const FeedbackSchema = z.object({
  memoryUser: z.string().min(1),
  projectId: z.string().min(1).nullable().optional(),
  sequenceKey: z.string().min(1).nullable().optional(),
  eventType: z.enum([
    "style_profile_saved",
    "style_profile_applied",
    "generation_feedback",
    "manual_feedback",
  ]),
  styleTokens: z.array(z.string().min(1)).optional().default([]),
  providers: z.array(MemoryProviderSchema).optional().default([]),
  positivePrompt: z.string().nullable().optional(),
  negativePrompt: z.string().nullable().optional(),
  query: z.string().nullable().optional(),
  strength: z.number().min(-2).max(2).optional().default(1),
  note: z.string().nullable().optional(),
});

/**
 * POST /api/video/memory/feedback
 * Records preference events into long-term memory (default enabled).
 */
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = FeedbackSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    await recordPreferenceFeedback({
      memoryUser: parsed.data.memoryUser,
      projectId: parsed.data.projectId ?? null,
      sequenceKey: parsed.data.sequenceKey ?? null,
      eventType: parsed.data.eventType,
      styleTokens: parsed.data.styleTokens,
      providers: parsed.data.providers,
      positivePrompt: parsed.data.positivePrompt ?? null,
      negativePrompt: parsed.data.negativePrompt ?? null,
      query: parsed.data.query ?? null,
      strength: parsed.data.strength,
      note: parsed.data.note ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
