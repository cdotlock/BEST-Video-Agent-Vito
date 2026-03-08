import { chatCompletion } from "@/lib/agent/llm-client";
import { DEFAULT_MODEL } from "@/lib/agent/models";
import { getResourcesByScope, updateResourceData } from "@/lib/domain/resource-service";
import { createResource } from "@/lib/domain/resource-service";
import { getProjectById, getSequenceContent, getResources } from "@/lib/services/video-workflow-service";
import {
  buildDialogueContextText,
  DialogueLineSchema,
  parseDialogueScriptData,
  type DialogueLine,
} from "@/lib/video/dialogue-script";
import { z } from "zod";

export interface SaveDialogueScriptInput {
  key: string;
  title: string | null;
  category: string;
  scopeType: "project" | "sequence";
  scopeId: string;
  sceneGoal: string | null;
  lines: DialogueLine[];
}

export interface SaveDialogueScriptResult {
  resourceId: string;
  lineCount: number;
  runtimeContext: string;
}

interface DialogueScriptResource {
  id: string;
  title: string | null;
  data: ReturnType<typeof parseDialogueScriptData>;
}

const DialogueDraftSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  sceneGoal: z.string().min(1).max(320).nullable().optional(),
  lines: z.array(DialogueLineSchema).min(1).max(12),
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readDialogueScriptKey(data: unknown): string | null {
  const parsed = parseDialogueScriptData(data);
  return parsed?.key ?? null;
}

function extractPromptLikeText(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const prompt = data.prompt;
  if (typeof prompt === "string" && prompt.trim().length > 0) return prompt.trim();
  const userPrompt = data.userPrompt;
  if (typeof userPrompt === "string" && userPrompt.trim().length > 0) return userPrompt.trim();
  return null;
}

function extractJsonPayload(rawText: string): unknown {
  const trimmed = rawText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  const jsonText = firstBrace >= 0 && lastBrace > firstBrace
    ? candidate.slice(firstBrace, lastBrace + 1)
    : candidate;
  return JSON.parse(jsonText);
}

export async function findLatestDialogueScript(
  scopeType: "project" | "sequence",
  scopeId: string,
): Promise<DialogueScriptResource | null> {
  const groups = await getResourcesByScope(scopeType, scopeId);
  let latest: DialogueScriptResource | null = null;
  for (const group of groups) {
    for (const item of group.items) {
      if (item.mediaType !== "json") continue;
      const parsed = parseDialogueScriptData(item.data);
      if (!parsed) continue;
      latest = {
        id: item.id,
        title: item.title,
        data: parsed,
      };
    }
  }
  return latest;
}

export async function saveDialogueScript(
  input: SaveDialogueScriptInput,
): Promise<SaveDialogueScriptResult> {
  const payload = {
    type: "dialogue_script" as const,
    key: input.key,
    sceneGoal: input.sceneGoal,
    lines: input.lines,
  };

  const existingResources = await getResourcesByScope(input.scopeType, input.scopeId);
  let existingId: string | null = null;
  for (const resource of existingResources.flatMap((group) => group.items)) {
    if (readDialogueScriptKey(resource.data) !== input.key) continue;
    existingId = resource.id;
  }

  if (existingId) {
    await updateResourceData(existingId, payload);
  } else {
    existingId = await createResource({
      scopeType: input.scopeType,
      scopeId: input.scopeId,
      category: input.category,
      mediaType: "json",
      title: input.title ?? input.key,
      data: payload,
    });
  }

  return {
    resourceId: existingId,
    lineCount: input.lines.length,
    runtimeContext: buildDialogueContextText(payload),
  };
}

export async function generateDialogueScriptDraft(input: {
  projectId: string;
  sequenceId: string;
  sequenceKey: string;
  title?: string | null;
  force?: boolean;
}): Promise<SaveDialogueScriptResult & { reused: boolean }> {
  if (!input.force) {
    const existing = await findLatestDialogueScript("sequence", input.sequenceId);
    if (existing?.data) {
      return {
        resourceId: existing.id,
        lineCount: existing.data.lines.length,
        runtimeContext: buildDialogueContextText(existing.data),
        reused: true,
      };
    }
  }

  const [project, sequenceContent, resources] = await Promise.all([
    getProjectById(input.projectId),
    getSequenceContent(input.sequenceId),
    getResources(input.sequenceId, input.projectId),
  ]);

  const storyText = sequenceContent?.trim() ?? "";
  const resourceDigest = resources.categories
    .flatMap((group) =>
      group.items
        .slice(0, 3)
        .map((item) => {
          const prompt = extractPromptLikeText(item.data);
          return [group.category, item.title ?? "", prompt ?? ""].filter((part) => part.length > 0).join(" | ");
        }),
    )
    .filter((line) => line.length > 0)
    .slice(0, 12)
    .join("\n");

  if (storyText.length === 0 && resourceDigest.length === 0) {
    throw new Error("当前工作区还没有足够的剧情或素材描述，暂时无法自动生成对白脚本。");
  }

  const completion = await chatCompletion(
    [
      {
        role: "system",
        content: [
          "你是一个视频导演助理。请根据剧情和已有镜头线索，输出可供音画同出模型使用的对白脚本草稿。",
          "只输出 JSON，不要输出解释，不要使用 Markdown 代码块。",
          "JSON schema:",
          "{\"title\":\"string\",\"sceneGoal\":\"string|null\",\"lines\":[{\"character\":\"string\",\"line\":\"string\",\"emotion\":\"string?\",\"durationSec\":number?}]}",
          "要求：",
          "1. 台词要自然、简洁、可表演。",
          "2. 行数控制在 2 到 8 行。",
          "3. 若剧情偏视觉，不要硬塞太多对白。",
          "4. 台词内容和场景目标要能直接服务镜头生成。",
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          `project=${project?.name ?? input.projectId}`,
          `sequence=${input.sequenceKey}`,
          project?.description ? `project_description=${project.description}` : "",
          storyText ? `story=\n${storyText}` : "",
          resourceDigest ? `resource_digest=\n${resourceDigest}` : "",
          "请生成一份对白脚本 JSON 草稿。",
        ].filter((line) => line.length > 0).join("\n\n"),
      },
    ],
    undefined,
    DEFAULT_MODEL,
  );

  const rawText = completion.choices[0]?.message.content?.trim();
  if (!rawText) {
    throw new Error("模型没有返回对白脚本内容。");
  }

  const parsed = DialogueDraftSchema.parse(extractJsonPayload(rawText));
  const saved = await saveDialogueScript({
    key: "dialogue_script_current",
    title: input.title ?? parsed.title ?? "对白脚本",
    category: "对白脚本",
    scopeType: "sequence",
    scopeId: input.sequenceId,
    sceneGoal: parsed.sceneGoal ?? (storyText.slice(0, 180) || null),
    lines: parsed.lines,
  });

  return {
    ...saved,
    reused: false,
  };
}
