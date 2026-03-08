import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateDialogueScriptDraft } from "@/lib/services/video-dialogue-service";

const CreateDialogueScriptSchema = z.object({
  projectId: z.string().min(1),
  sequenceKey: z.string().min(1),
  title: z.string().min(1).optional(),
  force: z.boolean().optional().default(false),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sequenceId: string }> },
) {
  const { sequenceId } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateDialogueScriptSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await generateDialogueScriptDraft({
      projectId: parsed.data.projectId,
      sequenceId,
      sequenceKey: parsed.data.sequenceKey,
      title: parsed.data.title ?? null,
      force: parsed.data.force,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
