import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getResources,
  updateResourceData,
  deleteResource,
} from "@/lib/services/video-workflow-service";

/** GET /api/video/sequences/[sequenceId]/resources?projectId=xxx — get sequence resources */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sequenceId: string }> },
) {
  const { sequenceId } = await params;
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId query parameter" }, { status: 400 });
  }

  try {
    const resources = await getResources(sequenceId, projectId);
    return NextResponse.json(resources);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** PATCH /api/video/sequences/[sequenceId]/resources — update a domain resource's data */
export async function PATCH(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = z
    .object({
      resourceId: z.string().min(1),
      data: z.unknown(),
    })
    .safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing resourceId or data" }, { status: 400 });
  }

  try {
    await updateResourceData(parsed.data.resourceId, parsed.data.data);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/video/sequences/[sequenceId]/resources — delete a single domain resource */
export async function DELETE(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = z
    .object({
      resourceId: z.string().min(1),
    })
    .safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing resourceId" }, { status: 400 });
  }
  try {
    await deleteResource(parsed.data.resourceId);
    return NextResponse.json({ deleted: parsed.data.resourceId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
