import { NextRequest, NextResponse } from "next/server";
import { getMemoryRecommendations } from "@/lib/services/video-memory-service";

/**
 * GET /api/video/memory/recommendations?memoryUser=...
 * Returns long-term memory defaults for style init and generation.
 */
export async function GET(req: NextRequest) {
  const memoryUser = req.nextUrl.searchParams.get("memoryUser") ?? "default";

  try {
    const recommendations = await getMemoryRecommendations(memoryUser);
    return NextResponse.json(recommendations);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
