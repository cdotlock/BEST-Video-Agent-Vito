import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  reverseStyleFromReferences,
  StyleReferenceSchema,
} from "@/lib/services/style-profile-service";

const ReverseStyleSchema = z.object({
  projectId: z.string().min(1).nullable().optional(),
  memoryUser: z.string().min(1).nullable().optional(),
  sequenceKey: z.string().min(1).nullable().optional(),
  profileName: z.string().min(1),
  query: z.string().nullable().optional(),
  creativeGoal: z.string().nullable().optional(),
  references: z.array(StyleReferenceSchema).min(1),
  saveProfile: z.boolean().optional().default(true),
});

/** POST /api/video/style/reverse — infer style tokens + prompts from reference images */
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ReverseStyleSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await reverseStyleFromReferences({
      projectId: parsed.data.projectId ?? null,
      memoryUser: parsed.data.memoryUser ?? null,
      sequenceKey: parsed.data.sequenceKey ?? null,
      profileName: parsed.data.profileName,
      query: parsed.data.query ?? null,
      creativeGoal: parsed.data.creativeGoal ?? null,
      references: parsed.data.references,
      saveProfile: parsed.data.saveProfile,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
