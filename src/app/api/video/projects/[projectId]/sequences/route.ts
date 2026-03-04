import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  listSequences,
  createSequence,
} from "@/lib/services/video-workflow-service";

/** GET /api/video/projects/[projectId]/sequences — list sequences of a project */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  try {
    const sequences = await listSequences(projectId);
    return NextResponse.json(sequences);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const CreateSequenceSchema = z.object({
  sequenceKey: z.string().min(1),
  sequenceName: z.string().nullable().optional(),
  sequenceContent: z.string().nullable().optional(),
});

/** POST /api/video/projects/[projectId]/sequences — create (upload) a sequence */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateSequenceSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const sequence = await createSequence(
      projectId,
      parsed.data.sequenceKey,
      parsed.data.sequenceName ?? null,
      parsed.data.sequenceContent ?? null,
    );
    return NextResponse.json({ id: sequence.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
