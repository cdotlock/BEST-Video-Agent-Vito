import { NextRequest, NextResponse } from "next/server";
import { deleteSequence } from "@/lib/services/video-workflow-service";

/** DELETE /api/video/sequences/[sequenceId] — delete a sequence and related data */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ sequenceId: string }> },
) {
  const { sequenceId } = await params;
  try {
    await deleteSequence(sequenceId);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
