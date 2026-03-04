import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clearMemory } from "@/lib/services/video-memory-service";

const ClearSchema = z.object({
  memoryUser: z.string().min(1),
});

/**
 * DELETE /api/video/memory
 * Body: { memoryUser }
 */
export async function DELETE(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ClearSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await clearMemory(parsed.data.memoryUser);
    return NextResponse.json({ ok: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
