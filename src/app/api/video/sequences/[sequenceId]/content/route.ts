import { NextRequest, NextResponse } from "next/server";
import { getSequenceContent } from "@/lib/services/video-workflow-service";

/** GET /api/video/sequences/[sequenceId]/content — get sequence source text */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sequenceId: string }> },
) {
  const { sequenceId } = await params;
  try {
    const content = await getSequenceContent(sequenceId);
    return NextResponse.json({ content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
