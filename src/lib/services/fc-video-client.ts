import { z } from "zod";

export type VideoGenerationMode =
  | "prompt_only"
  | "first_frame"
  | "first_last_frame"
  | "mixed_refs";

export interface GenerateVideoWithReferencesInput {
  mode: VideoGenerationMode;
  prompt: string;
  firstFrameUrl: string | null;
  lastFrameUrl: string | null;
  referenceImageUrls: string[];
  referenceVideoUrls: string[];
}

export interface GenerateVideoWithReferencesResult {
  videoUrl: string;
  mode: VideoGenerationMode;
  usedImageUrls: string[];
  usedVideoUrls: string[];
  pollCount: number;
}

const FcGenerateResponseSchema = z.object({
  result: z.string().url().optional(),
  error: z.string().optional(),
});

const FcSubmitSchema = z.object({
  code: z.number().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  data: z.object({
    task_id: z.string().optional(),
  }).optional(),
});

const FcGetSchema = z.object({
  code: z.number().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  data: z.object({
    status: z.string().optional(),
    video_url: z.string().url().optional(),
  }).optional(),
});

function getFcVideoConfig(): { url: string; token: string } {
  const url = process.env.FC_GENERATE_VIDEO_URL?.trim();
  const token = process.env.FC_GENERATE_VIDEO_TOKEN?.trim();
  if (!url || !token) {
    throw new Error("未配置 FC 视频生成服务 (FC_GENERATE_VIDEO_URL, FC_GENERATE_VIDEO_TOKEN)");
  }
  return { url, token };
}

export function isFcVideoConfigured(): boolean {
  return Boolean(
    process.env.FC_GENERATE_VIDEO_URL?.trim()
      && process.env.FC_GENERATE_VIDEO_TOKEN?.trim(),
  );
}

async function fcVideoRequest(body: Record<string, unknown>): Promise<unknown> {
  const fc = getFcVideoConfig();
  const res = await fetch(fc.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${fc.token}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`FC video response is not JSON: ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const errMsg = typeof parsed === "object" && parsed !== null
      && "error" in parsed && typeof (parsed as Record<string, unknown>).error === "string"
      ? String((parsed as Record<string, unknown>).error)
      : res.statusText;
    throw new Error(`FC video API ${res.status}: ${errMsg}`);
  }
  return parsed;
}

function buildImageRefs(input: GenerateVideoWithReferencesInput): string[] {
  const unique = new Set<string>();
  const out: string[] = [];

  const append = (value: string | null | undefined) => {
    if (!value) return;
    const trimmed = value.trim();
    if (!trimmed || unique.has(trimmed)) return;
    unique.add(trimmed);
    out.push(trimmed);
  };

  append(input.firstFrameUrl);
  append(input.lastFrameUrl);
  for (const url of input.referenceImageUrls) append(url);
  return out;
}

function pickFirstImageUrl(input: GenerateVideoWithReferencesInput): string {
  const refs = buildImageRefs(input);
  const first = refs[0];
  if (!first) {
    throw new Error("图生视频至少需要 1 张图片参考（firstFrameUrl 或 referenceImageUrls）");
  }
  return first;
}

function pickFirstLastImages(input: GenerateVideoWithReferencesInput): [string, string] {
  const first = pickFirstImageUrl(input);
  const last = input.lastFrameUrl?.trim() || first;
  return [first, last];
}

export async function callFcGenerateVideo(
  input: GenerateVideoWithReferencesInput,
): Promise<GenerateVideoWithReferencesResult> {
  if (input.mode === "prompt_only") {
    throw new Error("prompt_only mode does not generate actual video");
  }

  if (input.mode === "first_frame") {
    const imageUrl = pickFirstImageUrl(input);
    const raw = await fcVideoRequest({
      action: "generate",
      imageUrl,
      prompt: input.prompt,
    });
    const parsed = FcGenerateResponseSchema.parse(raw);
    if (parsed.error) {
      throw new Error(parsed.error);
    }
    if (!parsed.result) {
      throw new Error("FC 未返回视频 URL");
    }
    return {
      videoUrl: parsed.result,
      mode: input.mode,
      usedImageUrls: [imageUrl],
      usedVideoUrls: input.referenceVideoUrls,
      pollCount: 0,
    };
  }

  const imageUrls = input.mode === "first_last_frame"
    ? pickFirstLastImages(input)
    : (() => {
      const first = pickFirstImageUrl(input);
      const extra = input.referenceImageUrls
        .map((u) => u.trim())
        .filter((u) => u.length > 0 && u !== first)
        .slice(0, 1);
      const second = extra[0] ?? first;
      return [first, second] as [string, string];
    })();

  const submitRaw = await fcVideoRequest({
    action: "CVSync2AsyncSubmitTask",
    image_urls: imageUrls,
    prompt: input.prompt,
  });
  const submit = FcSubmitSchema.parse(submitRaw);
  if (submit.error) {
    throw new Error(submit.error);
  }
  const taskId = submit.data?.task_id;
  if (!taskId) {
    throw new Error(`FC submit 未返回 task_id: ${JSON.stringify(submitRaw)}`);
  }

  const maxPoll = 45;
  const intervalMs = 3000;
  for (let i = 0; i < maxPoll; i++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    const getRaw = await fcVideoRequest({
      action: "CVSync2AsyncGetResult",
      task_id: taskId,
    });
    const get = FcGetSchema.parse(getRaw);
    if (get.error) {
      throw new Error(get.error);
    }
    const status = (get.data?.status ?? "").toLowerCase();
    if (status === "done" && get.data?.video_url) {
      return {
        videoUrl: get.data.video_url,
        mode: input.mode,
        usedImageUrls: imageUrls,
        usedVideoUrls: input.referenceVideoUrls,
        pollCount: i + 1,
      };
    }
    if (status === "expired" || status === "not_found" || status === "failed") {
      throw new Error(`FC 视频任务失败: status=${status}`);
    }
  }

  throw new Error("FC 视频生成轮询超时");
}

