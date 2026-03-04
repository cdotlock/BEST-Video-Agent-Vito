import { NextRequest, NextResponse } from "next/server";
import { getSequenceStatus } from "@/lib/services/video-workflow-service";

/** GET /api/video/sequences/[sequenceId]/status — get sequence workflow status */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sequenceId: string }> },
) {
  const { sequenceId } = await params;
  try {
    const status = await getSequenceStatus(sequenceId);
    return NextResponse.json({ status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
