import { NextRequest, NextResponse } from "next/server";
import { deleteProject } from "@/lib/services/video-workflow-service";

/** DELETE /api/video/projects/[projectId] — delete a project and all related data */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  try {
    await deleteProject(projectId);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
