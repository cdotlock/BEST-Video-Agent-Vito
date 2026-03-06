import { z } from "zod";
import { bizPool } from "@/lib/biz-db";
import { resolveTable, GLOBAL_USER } from "@/lib/biz-db-namespace";
import { ensureVideoSchema } from "@/lib/video/schema";

const MEMORY_EVENTS_TABLE = "video_memory_events";
const MEMORY_PREFS_TABLE = "video_memory_preferences";

export type PreferenceEventType =
  | "style_profile_saved"
  | "style_profile_applied"
  | "generation_feedback"
  | "manual_feedback"
  | "prompt_optimized"
  | "workflow_path_review";

export const MemoryProviderSchema = z.enum(["unsplash", "pexels", "pixabay"]);
export type MemoryProvider = z.infer<typeof MemoryProviderSchema>;

export const WorkflowPathIdSchema = z.enum([
  "path.style_bootstrap",
  "path.storyboard_density.single",
  "path.storyboard_density.grid_2x2",
  "path.storyboard_density.grid_3x3",
  "path.image_to_video.first_frame",
  "path.image_to_video.first_last_frame",
  "path.multi_reference_video",
  "path.role_pack.character_priority",
  "path.role_pack.empty_shot_priority",
  "path.multi_clip_compose",
]);
export type WorkflowPathId = z.infer<typeof WorkflowPathIdSchema>;

export interface PreferenceFeedbackInput {
  memoryUser: string;
  projectId: string | null;
  sequenceKey: string | null;
  eventType: PreferenceEventType;
  styleTokens: string[];
  workflowPaths: WorkflowPathId[];
  rejectedWorkflowPaths: WorkflowPathId[];
  providers: MemoryProvider[];
  editingHints: string[];
  cameraHints: string[];
  modelIds: string[];
  positivePrompt: string | null;
  negativePrompt: string | null;
  query: string | null;
  strength: number;
  note: string | null;
}

export interface MemoryRecommendations {
  memoryUser: string;
  enabled: true;
  preferredStyleTokens: string[];
  preferredWorkflowPaths: WorkflowPathId[];
  rejectedWorkflowPaths: WorkflowPathId[];
  preferredProviders: MemoryProvider[];
  preferredEditingHints: string[];
  preferredCameraHints: string[];
  preferredModelIds: string[];
  positivePromptHint: string | null;
  negativePromptHint: string | null;
  queryHint: string | null;
  totalPreferenceItems: number;
}

export interface WorkflowPathRecommendation {
  pathId: WorkflowPathId;
  title: string;
  score: number;
  why: string[];
  steps: string[];
}

export interface RecommendWorkflowPathsInput {
  memoryUser: string;
  goal: string | null;
  storyboardDensity: "single" | "grid_2x2" | "grid_3x3" | null;
  hasReferenceVideo: boolean;
  hasImageReference?: boolean;
  hasFirstFrameReference?: boolean;
  hasLastFrameReference?: boolean;
  wantsMultiClip: boolean;
  prefersCharacterPriority?: boolean;
  prefersEmptyShotPriority?: boolean;
}

export interface RecommendWorkflowPathsResult {
  memoryUser: string;
  recommendations: WorkflowPathRecommendation[];
}

export type PromptOptimizeMode = "image" | "video";

export interface PromptOptimizationInput {
  memoryUser: string;
  prompt: string;
  mode: PromptOptimizeMode;
  projectId: string | null;
  sequenceKey: string | null;
  record: boolean;
}

export interface PromptOptimizationResult {
  memoryUser: string;
  mode: PromptOptimizeMode;
  originalPrompt: string;
  optimizedPrompt: string;
  negativePromptHint: string | null;
  appliedStyleTokens: string[];
  appliedHints: string[];
}

const PreferenceRowSchema = z.object({
  pref_key: z.string(),
  pref_value: z.string(),
  weight: z.union([z.number(), z.string()]),
  updated_at: z.union([z.date(), z.string()]),
});

function toNumber(value: number | string): number {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return parsed;
}

function normalizeMemoryUser(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "default";
}

function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

function dedupeList<T extends string>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const WORKFLOW_PATH_CATALOG: Record<
  WorkflowPathId,
  { title: string; steps: string[] }
> = {
  "path.style_bootstrap": {
    title: "风格初始化",
    steps: [
      "搜索公共图库参考图",
      "反推 style tokens 与正负 prompt",
      "保存并应用 style profile",
    ],
  },
  "path.storyboard_density.single": {
    title: "单张分镜",
    steps: [
      "按镜头顺序生成单张分镜",
      "逐张评审并再生",
    ],
  },
  "path.storyboard_density.grid_2x2": {
    title: "四宫格分镜",
    steps: [
      "生成 2x2 分镜网格",
      "快速筛选候选镜头",
    ],
  },
  "path.storyboard_density.grid_3x3": {
    title: "九宫格分镜",
    steps: [
      "生成 3x3 高密度分镜网格",
      "从网格中挑选关键镜头进入后续生成",
    ],
  },
  "path.image_to_video.first_frame": {
    title: "首帧图生视频",
    steps: [
      "选择首帧图",
      "注入运动与镜头提示词",
      "生成视频候选",
    ],
  },
  "path.image_to_video.first_last_frame": {
    title: "首尾帧约束图生视频",
    steps: [
      "设置首帧与尾帧",
      "保持动作时序与过渡一致",
      "生成受控视频候选",
    ],
  },
  "path.multi_reference_video": {
    title: "多参考视频生成",
    steps: [
      "合并图像与视频参考",
      "按角色权重组装参考上下文",
      "生成视频候选",
    ],
  },
  "path.role_pack.character_priority": {
    title: "角色立绘优先",
    steps: [
      "先建立 character_ref 与身份稳定锚点",
      "再补 scene_ref / motion_ref / storyboard_ref",
      "最后生成视频候选",
    ],
  },
  "path.role_pack.empty_shot_priority": {
    title: "空镜节奏优先",
    steps: [
      "先补 empty_shot_ref 与 scene_ref",
      "以 establishing / transition shot 组织节奏",
      "再加入主镜头与角色镜头",
    ],
  },
  "path.multi_clip_compose": {
    title: "多段视频拼接",
    steps: [
      "生成多条视频候选",
      "排序与裁切片段",
      "保存拼接计划",
    ],
  },
};

function hasKeyword(text: string, ...keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

async function physical(logicalName: string): Promise<string> {
  await ensureVideoSchema();
  const resolved = await resolveTable(GLOBAL_USER, logicalName);
  if (!resolved) {
    throw new Error(`Video table "${logicalName}" not found in BizTableMapping`);
  }
  return resolved.physicalName;
}

async function upsertPreference(
  prefsTable: string,
  memoryUser: string,
  key: string,
  value: string,
  delta: number,
  source: PreferenceEventType,
): Promise<void> {
  if (value.trim().length === 0) return;
  await bizPool.query(
    `INSERT INTO "${prefsTable}" (memory_user, pref_key, pref_value, weight, last_source)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (memory_user, pref_key, pref_value)
     DO UPDATE SET
       weight = GREATEST(0, "${prefsTable}".weight + EXCLUDED.weight),
       last_source = EXCLUDED.last_source,
       updated_at = NOW()`,
    [memoryUser, key, value, delta, source],
  );
}

export async function recordPreferenceFeedback(input: PreferenceFeedbackInput): Promise<void> {
  const eventsTable = await physical(MEMORY_EVENTS_TABLE);
  const prefsTable = await physical(MEMORY_PREFS_TABLE);

  const memoryUser = normalizeMemoryUser(input.memoryUser);
  const strength = clamp(input.strength, -2, 2);

  const styleTokens = dedupeList(
    input.styleTokens
      .map((token) => normalizeToken(token))
      .filter((token) => token.length > 0),
  );
  const workflowPaths = dedupeList(
    input.workflowPaths
      .filter((pathId): pathId is WorkflowPathId =>
        WorkflowPathIdSchema.safeParse(pathId).success,
      ),
  );
  const rejectedWorkflowPaths = dedupeList(
    input.rejectedWorkflowPaths
      .filter((pathId): pathId is WorkflowPathId =>
        WorkflowPathIdSchema.safeParse(pathId).success,
      ),
  );

  const providers = dedupeList(input.providers);
  const editingHints = dedupeList(
    input.editingHints
      .map((hint) => hint.trim())
      .filter((hint) => hint.length > 0),
  );
  const cameraHints = dedupeList(
    input.cameraHints
      .map((hint) => hint.trim())
      .filter((hint) => hint.length > 0),
  );
  const modelIds = dedupeList(
    input.modelIds
      .map((modelId) => modelId.trim())
      .filter((modelId) => modelId.length > 0),
  );

  const payload = {
    styleTokens,
    workflowPaths,
    rejectedWorkflowPaths,
    providers,
    editingHints,
    cameraHints,
    modelIds,
    positivePrompt: input.positivePrompt,
    negativePrompt: input.negativePrompt,
    query: input.query,
    note: input.note,
    strength,
  };

  await bizPool.query(
    `INSERT INTO "${eventsTable}" (memory_user, project_id, sequence_key, event_type, payload)
     VALUES ($1, $2, $3, $4, $5)`,
    [memoryUser, input.projectId, input.sequenceKey, input.eventType, JSON.stringify(payload)],
  );

  for (const token of styleTokens) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "style_token",
      token,
      strength,
      input.eventType,
    );
  }

  for (const pathId of workflowPaths) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "workflow_path",
      pathId,
      strength,
      input.eventType,
    );
  }

  for (const pathId of rejectedWorkflowPaths) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "rejected_workflow_path",
      pathId,
      Math.max(0.4, Math.abs(strength)),
      input.eventType,
    );
  }

  for (const provider of providers) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "provider",
      provider,
      strength * 0.8,
      input.eventType,
    );
  }

  for (const hint of editingHints) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "editing_hint",
      hint,
      strength * 0.7,
      input.eventType,
    );
  }

  for (const hint of cameraHints) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "camera_hint",
      hint,
      strength * 0.7,
      input.eventType,
    );
  }

  for (const modelId of modelIds) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "model_id",
      modelId,
      strength * 0.75,
      input.eventType,
    );
  }

  if (input.positivePrompt && input.positivePrompt.trim().length > 0) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "positive_prompt",
      input.positivePrompt.trim(),
      strength * 0.6,
      input.eventType,
    );
  }

  if (input.negativePrompt && input.negativePrompt.trim().length > 0) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "negative_prompt",
      input.negativePrompt.trim(),
      strength * 0.6,
      input.eventType,
    );
  }

  if (input.query && input.query.trim().length > 0) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "query_hint",
      input.query.trim(),
      strength * 0.5,
      input.eventType,
    );
  }

  await bizPool.query(
    `DELETE FROM "${prefsTable}"
     WHERE memory_user = $1 AND weight <= 0`,
    [memoryUser],
  );
}

export async function getMemoryRecommendations(
  memoryUserInput: string,
): Promise<MemoryRecommendations> {
  const prefsTable = await physical(MEMORY_PREFS_TABLE);
  const memoryUser = normalizeMemoryUser(memoryUserInput);

  const { rows } = await bizPool.query(
    `SELECT pref_key, pref_value, weight, updated_at
     FROM "${prefsTable}"
     WHERE memory_user = $1 AND weight > 0
     ORDER BY weight DESC, updated_at DESC
     LIMIT 300`,
    [memoryUser],
  );

  const parsedRows = rows
    .map((row) => PreferenceRowSchema.safeParse(row))
    .filter((result) => result.success)
    .map((result) => result.data);

  const styleTokenRows = parsedRows.filter((row) => row.pref_key === "style_token");
  const workflowPathRows = parsedRows.filter((row) => row.pref_key === "workflow_path");
  const rejectedWorkflowPathRows = parsedRows.filter((row) => row.pref_key === "rejected_workflow_path");
  const providerRows = parsedRows.filter((row) => row.pref_key === "provider");
  const editingHintRows = parsedRows.filter((row) => row.pref_key === "editing_hint");
  const cameraHintRows = parsedRows.filter((row) => row.pref_key === "camera_hint");
  const modelIdRows = parsedRows.filter((row) => row.pref_key === "model_id");
  const positiveRows = parsedRows.filter((row) => row.pref_key === "positive_prompt");
  const negativeRows = parsedRows.filter((row) => row.pref_key === "negative_prompt");
  const queryRows = parsedRows.filter((row) => row.pref_key === "query_hint");

  const preferredStyleTokens = dedupeList(
    styleTokenRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .slice(0, 8)
      .map((row) => row.pref_value),
  );
  const preferredWorkflowPaths = dedupeList(
    workflowPathRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .map((row) => row.pref_value)
      .filter(
        (value): value is WorkflowPathId => WorkflowPathIdSchema.safeParse(value).success,
      ),
  ).slice(0, 6);
  const rejectedWorkflowPaths = dedupeList(
    rejectedWorkflowPathRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .map((row) => row.pref_value)
      .filter(
        (value): value is WorkflowPathId => WorkflowPathIdSchema.safeParse(value).success,
      ),
  ).slice(0, 6);

  const preferredProviders = dedupeList(
    providerRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .map((row) => row.pref_value)
      .filter((value): value is MemoryProvider => MemoryProviderSchema.safeParse(value).success),
  ).slice(0, 3);
  const preferredEditingHints = dedupeList(
    editingHintRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .map((row) => row.pref_value),
  ).slice(0, 6);
  const preferredCameraHints = dedupeList(
    cameraHintRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .map((row) => row.pref_value),
  ).slice(0, 6);
  const preferredModelIds = dedupeList(
    modelIdRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .map((row) => row.pref_value),
  ).slice(0, 4);

  const bestPositive = positiveRows[0]?.pref_value ?? null;
  const bestNegative = negativeRows[0]?.pref_value ?? null;
  const bestQuery = queryRows[0]?.pref_value ?? null;

  return {
    memoryUser,
    enabled: true,
    preferredStyleTokens,
    preferredWorkflowPaths,
    rejectedWorkflowPaths,
    preferredProviders,
    preferredEditingHints,
    preferredCameraHints,
    preferredModelIds,
    positivePromptHint: bestPositive,
    negativePromptHint: bestNegative,
    queryHint: bestQuery,
    totalPreferenceItems: parsedRows.length,
  };
}

export async function optimizePromptWithMemory(
  input: PromptOptimizationInput,
): Promise<PromptOptimizationResult> {
  const memoryUser = normalizeMemoryUser(input.memoryUser);
  const originalPrompt = input.prompt.trim();
  if (originalPrompt.length === 0) {
    throw new Error("prompt is required");
  }

  const recommendations = await getMemoryRecommendations(memoryUser);
  const lines: string[] = [originalPrompt];
  const appliedHints: string[] = [];

  const styleTokens = recommendations.preferredStyleTokens.slice(0, 8);
  if (styleTokens.length > 0) {
    lines.push(`风格关键词: ${styleTokens.join(", ")}`);
    appliedHints.push("style_tokens");
  }
  if (recommendations.preferredWorkflowPaths.length > 0) {
    lines.push(`推荐流程路径: ${recommendations.preferredWorkflowPaths.slice(0, 3).join(", ")}`);
    appliedHints.push("workflow_path");
  }
  if (recommendations.preferredEditingHints.length > 0) {
    lines.push(`剪辑偏好: ${recommendations.preferredEditingHints.slice(0, 3).join(", ")}`);
    appliedHints.push("editing_hint");
  }
  if (recommendations.preferredCameraHints.length > 0) {
    lines.push(`镜头语言: ${recommendations.preferredCameraHints.slice(0, 3).join(", ")}`);
    appliedHints.push("camera_hint");
  }
  if (recommendations.preferredModelIds.length > 0) {
    lines.push(`模型偏好: ${recommendations.preferredModelIds.slice(0, 2).join(", ")}`);
    appliedHints.push("model_id");
  }

  if (hasText(recommendations.positivePromptHint)) {
    lines.push(`正向约束: ${recommendations.positivePromptHint.trim()}`);
    appliedHints.push("positive_prompt_hint");
  }

  if (hasText(recommendations.queryHint)) {
    lines.push(`历史偏好: ${recommendations.queryHint.trim()}`);
    appliedHints.push("query_hint");
  }

  if (input.mode === "video") {
    lines.push("视频约束: 镜头运动连贯，主体动作稳定，时序自然。");
    appliedHints.push("video_continuity");
  }

  const optimizedPrompt = lines.join("\n");

  if (input.record) {
    await recordPreferenceFeedback({
      memoryUser,
      projectId: input.projectId,
      sequenceKey: input.sequenceKey,
      eventType: "prompt_optimized",
      styleTokens: recommendations.preferredStyleTokens,
      workflowPaths: recommendations.preferredWorkflowPaths,
      rejectedWorkflowPaths: recommendations.rejectedWorkflowPaths,
      providers: recommendations.preferredProviders,
      editingHints: recommendations.preferredEditingHints,
      cameraHints: recommendations.preferredCameraHints,
      modelIds: recommendations.preferredModelIds,
      positivePrompt: recommendations.positivePromptHint,
      negativePrompt: recommendations.negativePromptHint,
      query: recommendations.queryHint,
      strength: 0.4,
      note: `mode=${input.mode}`,
    });
  }

  return {
    memoryUser,
    mode: input.mode,
    originalPrompt,
    optimizedPrompt,
    negativePromptHint: recommendations.negativePromptHint,
    appliedStyleTokens: styleTokens,
    appliedHints,
  };
}

export async function recommendWorkflowPaths(
  input: RecommendWorkflowPathsInput,
): Promise<RecommendWorkflowPathsResult> {
  const memoryUser = normalizeMemoryUser(input.memoryUser);
  const memory = await getMemoryRecommendations(memoryUser);
  const goal = (input.goal ?? "").toLowerCase();
  const hasImageReference = input.hasImageReference ?? false;
  const hasFirstFrameReference = input.hasFirstFrameReference ?? false;
  const hasLastFrameReference = input.hasLastFrameReference ?? false;
  const prefersCharacterPriority = input.prefersCharacterPriority ?? false;
  const prefersEmptyShotPriority = input.prefersEmptyShotPriority ?? false;

  const candidates: WorkflowPathRecommendation[] = (
    Object.keys(WORKFLOW_PATH_CATALOG) as WorkflowPathId[]
  ).map((pathId) => {
    const meta = WORKFLOW_PATH_CATALOG[pathId];
    const why: string[] = [];
    let score = 0.1;

    const memoryRank = memory.preferredWorkflowPaths.indexOf(pathId);
    if (memoryRank >= 0) {
      const memoryBoost = Math.max(0.2, 0.8 - memoryRank * 0.12);
      score += memoryBoost;
      why.push("匹配历史偏好路径");
    }
    if (memory.rejectedWorkflowPaths.includes(pathId)) {
      score -= 0.75;
      why.push("历史上曾被拒绝或降权");
    }

    if (input.storyboardDensity === "grid_2x2" && pathId === "path.storyboard_density.grid_2x2") {
      score += 1;
      why.push("用户指定四宫格分镜");
    }
    if (input.storyboardDensity === "grid_3x3" && pathId === "path.storyboard_density.grid_3x3") {
      score += 1.2;
      why.push("用户指定九宫格分镜");
    }
    if (input.storyboardDensity === "single" && pathId === "path.storyboard_density.single") {
      score += 0.8;
      why.push("用户指定单张分镜");
    }

    if (input.hasReferenceVideo && pathId === "path.multi_reference_video") {
      score += 1;
      why.push("存在视频参考素材");
    }
    if (hasImageReference && pathId === "path.image_to_video.first_frame") {
      score += 0.8;
      why.push("已有图像参考，可直接首帧驱动");
    }
    if (hasImageReference && input.hasReferenceVideo && pathId === "path.multi_reference_video") {
      score += 1.1;
      why.push("图像与视频参考可走 mixed refs");
    }
    if (hasFirstFrameReference && pathId === "path.image_to_video.first_frame") {
      score += 1;
      why.push("已有首帧参考");
    }
    if (hasFirstFrameReference && hasLastFrameReference
      && pathId === "path.image_to_video.first_last_frame") {
      score += 1.4;
      why.push("已具备首尾帧约束");
    }

    if (input.wantsMultiClip && pathId === "path.multi_clip_compose") {
      score += 1.1;
      why.push("目标包含多段拼接");
    }
    if (prefersCharacterPriority && pathId === "path.role_pack.character_priority") {
      score += 1.1;
      why.push("当前更适合先稳定角色立绘");
    }
    if (prefersEmptyShotPriority && pathId === "path.role_pack.empty_shot_priority") {
      score += 1.1;
      why.push("当前更适合先搭建空镜与节奏");
    }

    if (hasKeyword(goal, "首尾帧", "first_last", "first last")
      && pathId === "path.image_to_video.first_last_frame") {
      score += 1.2;
      why.push("目标强调首尾帧控制");
    }
    if (hasKeyword(goal, "首帧", "first frame")
      && pathId === "path.image_to_video.first_frame") {
      score += 1;
      why.push("目标强调首帧驱动");
    }
    if (hasKeyword(goal, "拼接", "剪辑", "montage", "compose")
      && pathId === "path.multi_clip_compose") {
      score += 1;
      why.push("目标强调片段拼接");
    }
    if (hasKeyword(goal, "参考视频", "视频参考", "mixed reference", "多参考")
      && pathId === "path.multi_reference_video") {
      score += 1;
      why.push("目标强调混合参考");
    }
    if (hasKeyword(goal, "角色", "立绘", "portrait", "character priority")
      && pathId === "path.role_pack.character_priority") {
      score += 1;
      why.push("目标强调角色稳定与立绘优先");
    }
    if (hasKeyword(goal, "空镜", "氛围", "establishing", "mood shot", "atmosphere")
      && pathId === "path.role_pack.empty_shot_priority") {
      score += 1;
      why.push("目标强调空镜、氛围或节奏镜头");
    }
    if (hasKeyword(goal, "风格", "style", "画风")
      && pathId === "path.style_bootstrap") {
      score += 0.9;
      why.push("目标强调风格初始化");
    }

    return {
      pathId,
      title: meta.title,
      score: Number(Math.max(0.05, score).toFixed(3)),
      why: why.length > 0 ? why : ["通用推荐路径"],
      steps: meta.steps,
    };
  });

  const recommendations = candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return {
    memoryUser,
    recommendations,
  };
}

export async function recordWorkflowPathReview(input: {
  memoryUser: string;
  projectId: string | null;
  sequenceKey: string | null;
  pathId: WorkflowPathId;
  score: number;
  note: string | null;
}): Promise<void> {
  await recordPreferenceFeedback({
    memoryUser: input.memoryUser,
    projectId: input.projectId,
    sequenceKey: input.sequenceKey,
    eventType: "workflow_path_review",
    styleTokens: [],
    workflowPaths: [input.pathId],
    rejectedWorkflowPaths: [],
    providers: [],
    editingHints: [],
    cameraHints: [],
    modelIds: [],
    positivePrompt: null,
    negativePrompt: null,
    query: null,
    strength: clamp(input.score, -2, 2),
    note: input.note,
  });
}

export async function clearMemory(memoryUserInput: string): Promise<{
  deletedEvents: number;
  deletedPreferences: number;
}> {
  const eventsTable = await physical(MEMORY_EVENTS_TABLE);
  const prefsTable = await physical(MEMORY_PREFS_TABLE);
  const memoryUser = normalizeMemoryUser(memoryUserInput);

  const eventsRes = await bizPool.query(
    `DELETE FROM "${eventsTable}" WHERE memory_user = $1`,
    [memoryUser],
  );
  const prefsRes = await bizPool.query(
    `DELETE FROM "${prefsTable}" WHERE memory_user = $1`,
    [memoryUser],
  );

  return {
    deletedEvents: eventsRes.rowCount ?? 0,
    deletedPreferences: prefsRes.rowCount ?? 0,
  };
}
