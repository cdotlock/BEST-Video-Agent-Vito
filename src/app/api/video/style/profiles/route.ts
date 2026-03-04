import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  listStyleProfiles,
  createStyleProfile,
  StyleReferenceSchema,
} from "@/lib/services/style-profile-service";

const CreateProfileSchema = z.object({
  projectId: z.string().min(1).nullable().optional(),
  memoryUser: z.string().min(1).nullable().optional(),
  name: z.string().min(1),
  query: z.string().nullable().optional(),
  positivePrompt: z.string().min(1),
  negativePrompt: z.string().optional().default(""),
  styleTokens: z.array(z.string().min(1)).min(1),
  references: z.array(StyleReferenceSchema).default([]),
  analysis: z.object({
    summary: z.string(),
    confidence: z.number().min(0).max(1),
    palette: z.enum(["warm", "cool", "neutral", "mixed"]),
    tokenWeights: z.array(
      z.object({
        token: z.string(),
        weight: z.number().positive(),
      }),
    ),
  }),
});

/** GET /api/video/style/profiles?projectId=... — list reusable style profiles */
export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");

  try {
    const profiles = await listStyleProfiles(projectId);
    return NextResponse.json(profiles);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/video/style/profiles — create a reusable style profile */
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const created = await createStyleProfile({
      projectId: parsed.data.projectId ?? null,
      memoryUser: parsed.data.memoryUser ?? null,
      name: parsed.data.name,
      query: parsed.data.query ?? null,
      positivePrompt: parsed.data.positivePrompt,
      negativePrompt: parsed.data.negativePrompt,
      styleTokens: parsed.data.styleTokens,
      references: parsed.data.references,
      analysis: parsed.data.analysis,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
