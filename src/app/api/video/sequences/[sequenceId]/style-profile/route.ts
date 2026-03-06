import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  setSequenceStyleProfile,
  getSequenceRuntimeContext,
} from "@/lib/services/video-workflow-service";
import { getStyleProfileById } from "@/lib/services/style-profile-service";
import {
  MemoryProviderSchema,
  recordPreferenceFeedback,
} from "@/lib/services/video-memory-service";

const PatchSchema = z.object({
  profileId: z.string().min(1).nullable(),
  projectId: z.string().min(1),
  sequenceKey: z.string().min(1),
  memoryUser: z.string().min(1).nullable().optional(),
});

/**
 * GET /api/video/sequences/[sequenceId]/style-profile?projectId=...&sequenceKey=...
 * Returns active style profile info for the sequence.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sequenceId: string }> },
) {
  const { sequenceId } = await params;
  const projectId = req.nextUrl.searchParams.get("projectId");
  const sequenceKey = req.nextUrl.searchParams.get("sequenceKey");

  if (!projectId || !sequenceKey) {
    return NextResponse.json(
      { error: "Missing projectId or sequenceKey query parameter" },
      { status: 400 },
    );
  }

  try {
    const context = await getSequenceRuntimeContext(projectId, sequenceKey);
    if (!context || context.sequenceId !== sequenceId) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    if (!context.activeStyleProfileId) {
      return NextResponse.json({ profile: null });
    }

    const profile = await getStyleProfileById(context.activeStyleProfileId);
    return NextResponse.json({ profile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/video/sequences/[sequenceId]/style-profile
 * Body: { projectId, sequenceKey, profileId|null }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sequenceId: string }> },
) {
  const { sequenceId } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  try {
    const runtimeContext = await getSequenceRuntimeContext(
      parsed.data.projectId,
      parsed.data.sequenceKey,
    );
    if (!runtimeContext || runtimeContext.sequenceId !== sequenceId) {
      return NextResponse.json({ error: "Sequence mismatch" }, { status: 400 });
    }

    if (parsed.data.profileId) {
      const profile = await getStyleProfileById(parsed.data.profileId);
      if (!profile) {
        return NextResponse.json({ error: "Style profile not found" }, { status: 404 });
      }
      await setSequenceStyleProfile(sequenceId, profile.id);
      if (parsed.data.memoryUser) {
        const providers = profile.references
          .map((ref) => {
            const parsedProvider = MemoryProviderSchema.safeParse(ref.source);
            return parsedProvider.success ? parsedProvider.data : null;
          })
          .filter((provider): provider is z.infer<typeof MemoryProviderSchema> => provider !== null);

        await recordPreferenceFeedback({
          memoryUser: parsed.data.memoryUser,
          projectId: parsed.data.projectId,
          sequenceKey: parsed.data.sequenceKey,
          eventType: "style_profile_applied",
          styleTokens: profile.styleTokens,
          workflowPaths: [],
          rejectedWorkflowPaths: [],
          providers,
          editingHints: [],
          cameraHints: [],
          modelIds: [],
          positivePrompt: profile.positivePrompt,
          negativePrompt: profile.negativePrompt,
          query: profile.query,
          strength: 1,
          note: `apply_profile:${profile.id}`,
        });
      }
      return NextResponse.json({ ok: true, profileId: profile.id });
    }

    await setSequenceStyleProfile(sequenceId, null);
    return NextResponse.json({ ok: true, profileId: null });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
