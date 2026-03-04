import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { optimizePromptWithMemory } from "@/lib/services/video-memory-service";

const OptimizePromptSchema = z.object({
  memoryUser: z.string().min(1),
  prompt: z.string().min(1),
  mode: z.enum(["image", "video"]).optional().default("image"),
  projectId: z.string().min(1).nullable().optional(),
  sequenceKey: z.string().min(1).nullable().optional(),
  record: z.boolean().optional().default(true),
});

/**
 * POST /api/video/memory/optimize-prompt
 * Optimize prompt text with long-term memory hints and optionally record event.
 */
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = OptimizePromptSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await optimizePromptWithMemory({
      memoryUser: parsed.data.memoryUser,
      prompt: parsed.data.prompt,
      mode: parsed.data.mode,
      projectId: parsed.data.projectId ?? null,
      sequenceKey: parsed.data.sequenceKey ?? null,
      record: parsed.data.record,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
