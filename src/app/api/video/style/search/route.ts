import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  searchStyleImages,
  PublicImageProviderSchema,
} from "@/lib/services/style-profile-service";

const SearchStyleSchema = z.object({
  query: z.string().min(1),
  providers: z.array(PublicImageProviderSchema).optional().default([]),
  page: z.number().int().positive().optional().default(1),
  perPage: z.number().int().positive().max(40).optional().default(24),
});

/** POST /api/video/style/search — search references from public galleries */
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SearchStyleSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const result = await searchStyleImages({
      query: parsed.data.query,
      providers: parsed.data.providers,
      page: parsed.data.page,
      perPage: parsed.data.perPage,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
