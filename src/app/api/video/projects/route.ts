import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  listProjects,
  createProject,
} from "@/lib/services/video-workflow-service";

/** GET /api/video/projects — list all video projects */
export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json(projects);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

/** POST /api/video/projects — create a video project */
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const created = await createProject(
      parsed.data.name,
      parsed.data.description ?? null,
    );
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
