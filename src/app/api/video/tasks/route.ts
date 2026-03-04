import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitTask } from "@/lib/services/task-service";
import { VideoContextProvider } from "@/lib/video/context-provider";
import { ensureVideoSchema } from "@/lib/video/schema";
import { resolveModel } from "@/lib/agent/models";

const VIDEO_PRODUCT_SKILL_TAG = "video-core";
const VIDEO_ALLOWED_MCPS = [
  "skills",
  "mcp_manager",
  "ui",
  "memory",
  "video_mgr",
  "style_search",
  "video_memory",
] as const;
const VIDEO_ALLOWED_PRELOAD_MCPS = [
  "video_mgr",
  "style_search",
  "video_memory",
] as const;
const VIDEO_ALLOWED_SKILLS = [
  "video-mgr",
  "style-search",
  "video-memory",
  "upload",
] as const;

function filterAllowed(values: string[] | undefined, allowed: readonly string[]): string[] | undefined {
  if (!values || values.length === 0) return undefined;
  const allowedSet = new Set(allowed);
  const deduped = [...new Set(values)];
  const filtered = deduped.filter((item) => allowedSet.has(item));
  return filtered.length > 0 ? filtered : undefined;
}

const VideoContextSchema = z.object({
  projectId: z.string().min(1),
  sequenceKey: z.string().min(1),
});

const SubmitSchema = z.object({
  message: z.string().min(1),
  session_id: z.string().optional(),
  user: z.string().optional(),
  memory_user: z.string().optional().default("default"),
  images: z.array(z.string()).optional(),
  model: z.string().optional(),
  execution_mode: z.enum(["checkpoint", "yolo"]).optional().default("checkpoint"),
  video_context: VideoContextSchema,
  preload_mcps: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});

/** POST /api/video/tasks — submit a video workflow agent task */
export async function POST(req: NextRequest) {
  if (!process.env.LLM_API_KEY || process.env.LLM_API_KEY.trim().length === 0) {
    return NextResponse.json(
      { error: "LLM_API_KEY is not configured. Please set it before submitting video tasks." },
      { status: 503 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { message, session_id, user, memory_user, images, model, execution_mode, video_context, preload_mcps, skills } = parsed.data;
  const safePreloadMcps = filterAllowed(preload_mcps, VIDEO_ALLOWED_PRELOAD_MCPS) ?? [...VIDEO_ALLOWED_PRELOAD_MCPS];
  const safeSkills = filterAllowed(skills, VIDEO_ALLOWED_SKILLS) ?? ["video-mgr", "style-search", "video-memory"];

  const contextProvider = new VideoContextProvider({
    projectId: video_context.projectId,
    sequenceKey: video_context.sequenceKey,
    memoryUser: memory_user,
  });

  const result = await submitTask({
    message,
    sessionId: session_id,
    user,
    images,
    model: resolveModel(model),
    agentConfig: {
      contextProvider,
      preloadMcps: safePreloadMcps,
      allowedMcpNames: [...VIDEO_ALLOWED_MCPS],
      skills: safeSkills,
      skillTag: VIDEO_PRODUCT_SKILL_TAG,
      executionMode: execution_mode,
    },
    beforeRun: () => ensureVideoSchema(),
  });

  return NextResponse.json({
    task_id: result.taskId,
    session_id: result.sessionId,
  });
}
