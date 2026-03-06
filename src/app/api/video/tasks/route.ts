import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitTask } from "@/lib/services/task-service";
import { recordPreferenceFeedback } from "@/lib/services/video-memory-service";
import { VideoContextProvider } from "@/lib/video/context-provider";
import { ensureVideoSchema } from "@/lib/video/schema";
import { resolveModel } from "@/lib/agent/models";

const VIDEO_ALLOWED_MCPS = [
  "skills",
  "mcp_manager",
  "ui",
  "memory",
  "subagent",
  "video_mgr",
  "style_search",
  "video_memory",
  "oss",
  "biz_db",
  "apis",
] as const;
const VIDEO_ALLOWED_PRELOAD_MCPS = [
  "video_mgr",
  "style_search",
  "video_memory",
  "mcp_manager",
  "subagent",
] as const;
const VIDEO_ALLOWED_SKILLS = [
  "video-mgr",
  "style-search",
  "video-memory",
  "upload",
  "subagent",
  "skill-creator",
  "dynamic-mcp-builder",
  "api-builder",
  "business-database",
  "oss",
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
  context_resource_ids: z.array(z.string().min(1)).optional().default([]),
  style_reference_resource_ids: z.array(z.string().min(1)).optional().default([]),
  pro_config: z.object({
    customKnowledge: z.string().optional().default(""),
    workflowTemplate: z.string().optional().default(""),
    checkpointAlignmentRequired: z.boolean().optional().default(true),
    enableSelfReview: z.boolean().optional().default(true),
  }).optional(),
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

  const {
    message,
    session_id,
    user,
    memory_user,
    images,
    model,
    execution_mode,
    video_context,
    preload_mcps,
    skills,
    context_resource_ids,
    style_reference_resource_ids,
    pro_config,
  } = parsed.data;
  const safePreloadMcps = filterAllowed(preload_mcps, VIDEO_ALLOWED_PRELOAD_MCPS) ?? [...VIDEO_ALLOWED_PRELOAD_MCPS];
  const safeSkills = filterAllowed(skills, VIDEO_ALLOWED_SKILLS) ?? [
    "video-mgr",
    "style-search",
    "video-memory",
    "subagent",
    "skill-creator",
    "dynamic-mcp-builder",
  ];
  const resolvedModel = resolveModel(model);

  const contextProvider = new VideoContextProvider({
    projectId: video_context.projectId,
    sequenceKey: video_context.sequenceKey,
    memoryUser: memory_user,
    modelId: resolvedModel,
    executionMode: execution_mode,
    contextResourceIds: context_resource_ids,
    styleReferenceResourceIds: style_reference_resource_ids,
    customKnowledge: pro_config?.customKnowledge ?? "",
    workflowTemplate: pro_config?.workflowTemplate ?? "",
    checkpointAlignmentRequired: pro_config?.checkpointAlignmentRequired ?? true,
    enableSelfReview: pro_config?.enableSelfReview ?? true,
  });

  const result = await submitTask({
    message,
    sessionId: session_id,
    user,
    images,
    model: resolvedModel,
    agentConfig: {
      contextProvider,
      preloadMcps: safePreloadMcps,
      allowedMcpNames: [...VIDEO_ALLOWED_MCPS],
      skills: safeSkills,
    },
    beforeRun: () => ensureVideoSchema(),
  });

  try {
    await recordPreferenceFeedback({
      memoryUser: memory_user,
      projectId: video_context.projectId,
      sequenceKey: video_context.sequenceKey,
      eventType: "manual_feedback",
      styleTokens: [],
      workflowPaths: [],
      rejectedWorkflowPaths: [],
      providers: [],
      editingHints: [],
      cameraHints: [],
      modelIds: [resolvedModel],
      positivePrompt: null,
      negativePrompt: null,
      query: null,
      strength: 0.35,
      note: "task_submit_model_selection",
    });
  } catch {
    // best effort: task submission should not fail because memory writeback is unavailable
  }

  return NextResponse.json({
    task_id: result.taskId,
    session_id: result.sessionId,
  });
}
