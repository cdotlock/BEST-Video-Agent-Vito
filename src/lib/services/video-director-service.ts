import type { BuiltinStylePreset } from "@/lib/video/builtin-style-presets";
import { pickBuiltinStylePreset } from "@/lib/video/builtin-style-presets";
import {
  inferReferenceRole,
  type VideoReferenceRole,
  type VisualReferenceRole,
} from "@/lib/video/reference-roles";
import {
  getProjectById,
  getResources,
  getSequenceContent,
  getSequenceRuntimeContext,
  type DomainResource,
  type DomainResources,
  type VideoProjectSummary,
} from "@/lib/services/video-workflow-service";
import {
  getStyleProfileById,
  type StyleProfile,
} from "@/lib/services/style-profile-service";
import {
  compactPromptLine,
  compressDialogueContext,
  normalizePromptFragment,
  truncatePromptText,
} from "@/lib/services/video-prompt-language-service";
import type { VideoGenerationMode } from "@/lib/services/fc-video-client";

export type VideoFocusMode = "animated_short" | "general_video";

export interface DirectorRoleAnchors {
  characters: string[];
  scenes: string[];
  emptyShots: string[];
  storyboards: string[];
  motion: string[];
}

export interface VideoDirectorRuntimeContext {
  focusMode: VideoFocusMode;
  project: VideoProjectSummary | null;
  sequenceContent: string | null;
  activeStyleProfile: StyleProfile | null;
  defaultStylePreset: BuiltinStylePreset;
  styleReferenceUrls: string[];
  roleAnchors: DirectorRoleAnchors;
}

interface SharedPromptInput {
  focusMode: VideoFocusMode;
  sequenceContent: string | null;
  styleProfile: StyleProfile | null;
  defaultStylePreset: BuiltinStylePreset;
  roleAnchors: DirectorRoleAnchors;
  referenceRoles: VideoReferenceRole[];
}

export interface BuildDirectorImagePromptInput extends SharedPromptInput {
  prompt: string;
  category: string;
  title?: string | null;
  roleOverride?: VideoReferenceRole | null;
}

export interface BuildDirectorVideoPromptInput extends SharedPromptInput {
  prompt: string;
  category: string;
  title?: string | null;
  strategy: VideoGenerationMode;
  dialogueContext?: string;
}

function dedupe(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output;
}

function dedupeReferenceRoles(values: VideoReferenceRole[]): VideoReferenceRole[] {
  const seen = new Set<VideoReferenceRole>();
  const output: VideoReferenceRole[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    output.push(value);
  }
  return output;
}

function normalizeSentence(value: string): string {
  return normalizePromptFragment(value);
}

function flattenResources(resources: DomainResources): DomainResource[] {
  return resources.categories.flatMap((group) => group.items);
}

function hasKeyword(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function collectRoleAnchors(
  resources: DomainResources,
  role: VideoReferenceRole,
): string[] {
  const titles = flattenResources(resources)
    .filter((resource) => inferReferenceRole({
      category: resource.category,
      mediaType: resource.mediaType,
      title: resource.title,
      data: resource.data,
    }) === role)
    .map((resource) => resource.title?.trim() ?? "")
    .filter((title) => title.length > 0);
  return dedupe(titles).slice(0, 4);
}

function collectStyleReferenceUrls(resources: DomainResources): string[] {
  const urls = flattenResources(resources)
    .filter((resource) => resource.mediaType === "image")
    .filter((resource) => inferReferenceRole({
      category: resource.category,
      mediaType: resource.mediaType,
      title: resource.title,
      data: resource.data,
    }) === "style_ref")
    .map((resource) => resource.url?.trim() ?? "")
    .filter((url) => url.length > 0);
  return dedupe(urls);
}

function styleTokensLine(
  styleProfile: StyleProfile | null,
  defaultStylePreset: BuiltinStylePreset,
): string {
  const tokens = styleProfile?.styleTokens.length
    ? styleProfile.styleTokens
    : defaultStylePreset.styleTokens;
  return compactPromptLine({
    label: "风格锚点",
    values: [tokens.slice(0, 5).join(", ")],
    maxLength: 140,
  });
}

function styleDirectionLine(
  styleProfile: StyleProfile | null,
  defaultStylePreset: BuiltinStylePreset,
): string {
  const positive = styleProfile?.positivePrompt?.trim() || defaultStylePreset.positivePrompt.trim();
  return compactPromptLine({
    label: "风格质感",
    values: [truncatePromptText(positive, 160)],
    maxLength: 180,
  });
}

function stabilityGuardLine(
  styleProfile: StyleProfile | null,
  defaultStylePreset: BuiltinStylePreset,
  focusMode: VideoFocusMode,
): string {
  const base = styleProfile?.negativePrompt?.trim() || defaultStylePreset.negativePrompt.trim();
  const driftGuard = focusMode === "animated_short"
    ? "角色脸型/服装/比例稳定；透视与光源一致；背景不过载；不新增额外肢体"
    : "主体形体稳定；光源一致；背景干净；空间关系不跳变";
  return compactPromptLine({
    label: "稳定约束",
    values: [
      driftGuard,
      base.length > 0 ? `边界=${truncatePromptText(base, 120)}` : "",
    ],
    maxLength: 220,
  });
}

function canonAnchorValue(sequenceContent: string | null): string {
  const trimmed = sequenceContent?.trim();
  if (!trimmed) return "";
  return `剧情=${truncatePromptText(trimmed, 90)}`;
}

function anchorValue(
  roleAnchors: DirectorRoleAnchors,
): string[] {
  const segments: string[] = [];
  if (roleAnchors.characters.length > 0) {
    segments.push(`角色=${roleAnchors.characters.join(" / ")}`);
  }
  if (roleAnchors.scenes.length > 0) {
    segments.push(`场景=${roleAnchors.scenes.join(" / ")}`);
  }
  if (roleAnchors.emptyShots.length > 0) {
    segments.push(`空镜=${roleAnchors.emptyShots.join(" / ")}`);
  }
  if (roleAnchors.storyboards.length > 0) {
    segments.push(`分镜=${roleAnchors.storyboards.join(" / ")}`);
  }
  if (roleAnchors.motion.length > 0) {
    segments.push(`动作=${roleAnchors.motion.join(" / ")}`);
  }
  return segments;
}

function continuityLine(
  sequenceContent: string | null,
  roleAnchors: DirectorRoleAnchors,
): string {
  return compactPromptLine({
    label: "连续性",
    values: [canonAnchorValue(sequenceContent), ...anchorValue(roleAnchors)],
    maxLength: 220,
  });
}

function referenceResponsibilityLine(referenceRoles: VideoReferenceRole[]): string {
  const responsibilities: string[] = [];
  if (referenceRoles.includes("style_ref")) {
    responsibilities.push("style_ref=笔触/材质/配色/光线");
  }
  if (referenceRoles.includes("scene_ref")) {
    responsibilities.push("scene_ref=空间/布景");
  }
  if (referenceRoles.includes("empty_shot_ref")) {
    responsibilities.push("empty_shot_ref=气氛/空镜节奏/转场余量");
  }
  if (referenceRoles.includes("character_ref")) {
    responsibilities.push("character_ref=脸型/服装/比例稳定");
  }
  if (referenceRoles.includes("motion_ref")) {
    responsibilities.push("motion_ref=动作节奏/运镜语言");
  }
  if (referenceRoles.includes("first_frame_ref")) {
    responsibilities.push("first_frame_ref=起始构图/初始姿态");
  }
  if (referenceRoles.includes("last_frame_ref")) {
    responsibilities.push("last_frame_ref=动作落点/收尾姿态");
  }
  return compactPromptLine({
    label: "参考分工",
    values: responsibilities,
    maxLength: 240,
  });
}

function inferPromptRole(
  category: string,
  title: string | null | undefined,
  mediaType: "image" | "video",
  override: VideoReferenceRole | null | undefined,
): VideoReferenceRole | null {
  if (override) return override;
  return inferReferenceRole({
    category,
    mediaType,
    title,
  });
}

function buildImageRoleLine(
  role: VideoReferenceRole | null,
  focusMode: VideoFocusMode,
): string {
  if (focusMode !== "animated_short") {
    return "主次明确；单帧目标清晰；光源和透视一致";
  }

  switch (role) {
    case "character_ref":
      return "角色设定图；单角色；轮廓清晰；脸型与服装结构稳定；姿态可复用；背景克制";
    case "scene_ref":
      return "场景主镜头；空间地理明确；前中后景分层；光源方向清晰；便于角色入镜";
    case "empty_shot_ref":
      return "空镜；不要人物；优先气氛/节奏/环境叙事；为转场和呼吸留空间";
    case "storyboard_ref":
      return "分镜帧；强调镜头设计和动作峰值；一眼读懂；不要过度渲染";
    case "first_frame_ref":
      return "首帧设计；构图稳定；起势明确；角色姿态可自然启动后续动作";
    case "last_frame_ref":
      return "尾帧设计；动作落点干净；情绪收束明确；适合作为镜头结尾";
    case "style_ref":
      return "风格板；重在笔触/配色/材质/光线语言；不承担复杂叙事";
    case "motion_ref":
      return "动作设计帧；动势方向清晰；受力明确；为后续镜头运动提供单一主弧线";
    default:
      return "动画短片关键帧；一个画面只承载一个主情绪或主动作；主体轮廓可读；背景不要抢戏";
  }
}

type MotionEnergy = "low" | "dramatic" | "action";
type ShotPurpose = "establishing" | "performance" | "reaction" | "reveal" | "transition" | "action";

function inferMotionEnergy(text: string): MotionEnergy {
  const normalized = text.toLowerCase();
  if (hasKeyword(normalized, [
    "fight",
    "battle",
    "chase",
    "explosion",
    "追逐",
    "打斗",
    "爆炸",
    "冲刺",
    "坠落",
    "奔跑",
    "激战",
    "法术",
  ])) {
    return "action";
  }
  if (hasKeyword(normalized, [
    "loop",
    "live2d",
    "breathing",
    "微动",
    "静止",
    "沉思",
    "对视",
    "凝视",
    "空镜",
    "氛围",
    "呼吸",
  ])) {
    return "low";
  }
  return "dramatic";
}

function isMotionFirstStrategy(strategy: VideoGenerationMode): boolean {
  return strategy !== "prompt_only";
}

function inferExplicitCameraDirective(text: string): string | null {
  const normalized = text.toLowerCase();

  if (hasKeyword(normalized, [
    "static shot",
    "static camera",
    "fixed camera",
    "fixed shot",
    "lock-off",
    "locked shot",
    "no camera movement",
    "固定镜头",
    "静止镜头",
    "静态镜头",
    "镜头不动",
  ])) {
    return "镜头完全锁定";
  }

  if (hasKeyword(normalized, [
    "orbit",
    "arc shot",
    "camera orbit",
    "环绕",
    "弧线环绕",
  ])) {
    return "镜头轻弧线环绕";
  }

  if (hasKeyword(normalized, [
    "tracking shot",
    "follow shot",
    "follow camera",
    "truck",
    "跟拍",
    "跟移",
    "跟随镜头",
  ])) {
    return "镜头平稳跟移";
  }

  if (hasKeyword(normalized, [
    "slow zoom in",
    "zoom in",
    "push in",
    "dolly in",
    "slow push",
    "推近",
    "慢推",
    "推进",
  ])) {
    return "镜头缓慢推近";
  }

  if (hasKeyword(normalized, [
    "zoom out",
    "pull back",
    "dolly out",
    "拉远",
    "后拉",
    "拉开",
  ])) {
    return "镜头缓慢拉远";
  }

  if (hasKeyword(normalized, [
    "pan left",
    "pan right",
    "slow pan",
    "横摇",
    "摇镜",
    "平移",
  ])) {
    return "镜头平稳横移或横摇";
  }

  if (hasKeyword(normalized, [
    "tilt up",
    "tilt down",
    "俯仰",
    "上摇",
    "下摇",
  ])) {
    return "镜头平稳俯仰";
  }

  if (hasKeyword(normalized, [
    "handheld",
    "shaky cam",
    "手持",
  ])) {
    return "镜头轻微手持";
  }

  return null;
}

function inferShotPurpose(input: {
  prompt: string;
  category: string;
  title?: string | null;
  focusMode: VideoFocusMode;
}): ShotPurpose {
  const text = [
    input.prompt,
    input.category,
    input.title ?? "",
  ].join(" ").toLowerCase();

  if (hasKeyword(text, [
    "fight",
    "battle",
    "chase",
    "attack",
    "accelerate",
    "rush",
    "close in",
    "追逐",
    "打斗",
    "加速",
    "逼近",
    "追近",
    "拐过",
    "冲刺",
    "激战",
    "奔跑",
  ])) {
    return "action";
  }

  if (hasKeyword(text, [
    "hold",
    "holds",
    "freeze",
    "reaction",
    "react",
    "glance",
    "realize",
    "pause",
    "反应",
    "停住",
    "站住",
    "停下",
    "短暂停住",
    "愣住",
    "停顿",
    "看向",
    "意识到",
  ])) {
    return "reaction";
  }

  if (hasKeyword(text, [
    "establishing",
    "establishing shot",
    "wide shot",
    "opening shot",
    "geography",
    "establish",
    "场景",
    "地理",
    "开场",
    "入镜留出空间",
    "留出空间",
    "建立空间",
  ])) {
    return "establishing";
  }

  if (hasKeyword(text, [
    "notice",
    "notices",
    "spot",
    "sees",
    "reveal",
    "unveil",
    "discover",
    "appears",
    "出现",
    "揭示",
    "发现",
    "注意到",
    "看见",
    "目光落到",
    "目光被吸住",
    "露出",
    "显现",
  ])) {
    return "reveal";
  }

  if (hasKeyword(text, [
    "transition",
    "cutaway",
    "passing",
    "过渡",
    "转场",
    "空镜",
    "breathing room",
  ])) {
    return "transition";
  }

  if (input.focusMode === "animated_short" && input.category.includes("空镜")) {
    return "transition";
  }

  return "performance";
}

function buildShotPurposeLine(
  purpose: ShotPurpose,
  focusMode: VideoFocusMode,
): string {
  const label = focusMode === "animated_short" ? "镜头意图" : "镜头目的";
  const value = purpose === "establishing"
    ? "先建立空间与气氛，再让主体进入阅读中心"
    : purpose === "reaction"
      ? "抓住停顿后的细微反应，不把情绪打散"
      : purpose === "reveal"
        ? "控制信息揭示，把落点停在关键发现上"
        : purpose === "transition"
          ? "提供呼吸与转场余量，为前后镜头搭桥"
          : purpose === "action"
            ? "让受力方向和动作落点一眼可读"
            : "围绕单一表演选择推进情绪";

  return compactPromptLine({
    label,
    values: [value],
    maxLength: 120,
  });
}

function buildTemporalProgressionLine(input: {
  purpose: ShotPurpose;
  energy: MotionEnergy;
  strategy: VideoGenerationMode;
  dialogueContext: string | undefined;
}): string {
  const rhythm = input.purpose === "establishing"
    ? "先定空间，再显主体，结尾留剪辑余量"
    : input.purpose === "reaction"
      ? "先停住，再给细微反应，最后稳定收住"
      : input.purpose === "reveal"
        ? "先压住信息，再缓慢揭示，最后停在揭示点"
        : input.purpose === "transition"
          ? "动作克制，节奏平顺，结尾便于接下一镜"
          : input.purpose === "action"
            ? "起势明确，推进干净，收势利落"
            : input.energy === "low"
              ? "起势克制，中段微表演清晰，结尾留呼吸"
              : "起势明确，中段表演推进，结尾干净收束";
  const frameControl = isMotionFirstStrategy(input.strategy)
    ? "保持连续单镜头"
    : "避免事件过载";
  const dialogue = input.dialogueContext?.trim().length
    ? "口型与停顿服从台词节奏"
    : "";

  return compactPromptLine({
    label: "节奏推进",
    values: [rhythm, frameControl, dialogue],
    maxLength: 150,
  });
}

function buildVideoStrategyLine(
  strategy: VideoGenerationMode,
  focusMode: VideoFocusMode,
): string {
  if (focusMode !== "animated_short") {
    return strategy === "first_last_frame"
      ? "从首帧自然过渡到尾帧；动作和空间逻辑闭合"
      : "保持单镜头表达；动作和运镜清晰单一";
  }

  switch (strategy) {
    case "first_frame":
      return "首帧驱动；严格尊重首帧构图和角色设计；从当前姿态自然启动；只发展一条主动作弧线";
    case "first_last_frame":
      return "首尾帧驱动；从首帧平滑推进到尾帧；动作/视线/空间关系自然落点";
    case "mixed_refs":
      return "混合参考；图像参考负责造型与空间；视频参考负责动作节奏与运镜气质；信息不要互相污染";
    case "prompt_only":
    default:
      return "弱参考生成；动作保守；镜头最多一条主运镜；避免短时长堆叠多个事件";
  }
}

function buildVideoEnergyLine(
  energy: MotionEnergy,
  purpose: ShotPurpose,
  strategy: VideoGenerationMode,
  prompt: string,
  dialogueContext: string | undefined,
  focusMode: VideoFocusMode,
): string {
  const dialogueDriven = dialogueContext?.trim().length ? "对白存在时给台词留节奏" : "";
  const explicitCamera = inferExplicitCameraDirective(prompt);
  const motionFirst = isMotionFirstStrategy(strategy);
  const cameraBias = explicitCamera ?? (purpose === "establishing"
    ? "镜头以平稳横移或极慢推进建立空间"
    : purpose === "reaction"
      ? "镜头以锁定或极轻慢推贴住反应"
      : purpose === "reveal"
        ? "镜头以缓慢推进或轻侧移完成揭示"
        : purpose === "transition"
          ? "镜头以锁定或平稳横移承接转场"
          : energy === "action"
            ? "镜头以一次跟移或轻弧线跟随为主"
            : energy === "low"
              ? "镜头以锁定或极轻慢推为主"
              : "镜头以缓慢推近或轻微跟移为主");
  const controlGuard = motionFirst
    ? "视觉信息由参考帧承担，文字重点放在动作与运镜"
    : "";

  if (focusMode !== "animated_short") {
    return [
      energy === "action"
        ? "只保留一个清晰主动作和一个明确受力方向；避免连续动作串烧"
        : energy === "low"
          ? "优先细微表演/环境微动/轻微镜头呼吸"
          : "用一次主表演动作完成情绪推进；不要拆成多段杂乱行为",
      cameraBias,
      controlGuard,
      dialogueDriven,
    ].filter((line) => line.length > 0).join("；");
  }

  if (energy === "action") {
    return [
      "保留一次明确起势/一次核心受力/一次干净收势；不要写成长串不可控连招",
      cameraBias,
      controlGuard,
      dialogueDriven,
    ].filter((line) => line.length > 0).join("；");
  }
  if (energy === "low") {
    return [
      "优先呼吸/眼神/手指/发丝/衣摆/光影/粒子的细微循环运动；适合短片和 live2d 感镜头",
      cameraBias,
      controlGuard,
      dialogueDriven,
    ].filter((line) => line.length > 0).join("；");
  }
  return [
    "保持单镜头单戏剧动作；表演重心明确；镜头运动最多一条主轨迹",
    cameraBias,
    controlGuard,
    dialogueDriven,
  ].filter((line) => line.length > 0).join("；");
}

function animationImageCraftLine(focusMode: VideoFocusMode): string {
  return focusMode === "animated_short"
    ? "staging 清晰；主体轮廓可读；前中后景层次明确；细碎装饰不要压过表演"
    : "主体清晰；层次明确；风格统一";
}

function animationVideoCraftLine(focusMode: VideoFocusMode): string {
  return focusMode === "animated_short"
    ? "角色模型/服装/比例/场景透视保持稳定；不新增无关角色或关键道具；不切机位"
    : "主体与空间保持稳定；不出现无因果跳变";
}

function dialogueLine(dialogueContext: string | undefined): string {
  const compressed = compressDialogueContext(dialogueContext);
  return compactPromptLine({
    label: "对白节奏",
    values: compressed ? [compressed] : [],
    maxLength: 260,
  });
}

function buildVideoContinuityLine(input: {
  sequenceContent: string | null;
  roleAnchors: DirectorRoleAnchors;
  strategy: VideoGenerationMode;
}): string {
  if (!isMotionFirstStrategy(input.strategy)) {
    return continuityLine(input.sequenceContent, input.roleAnchors);
  }

  return compactPromptLine({
    label: "连续性",
    values: [
      canonAnchorValue(input.sequenceContent),
      input.roleAnchors.characters[0] ? `角色=${input.roleAnchors.characters[0]}` : "",
      input.roleAnchors.scenes[0] ? `场景=${input.roleAnchors.scenes[0]}` : "",
      input.roleAnchors.motion[0] ? `动作=${input.roleAnchors.motion[0]}` : "",
    ],
    maxLength: 150,
  });
}

function buildVideoStyleDirectionLine(input: {
  styleProfile: StyleProfile | null;
  defaultStylePreset: BuiltinStylePreset;
  strategy: VideoGenerationMode;
}): string {
  const positive = input.styleProfile?.positivePrompt?.trim() || input.defaultStylePreset.positivePrompt.trim();
  const budget = isMotionFirstStrategy(input.strategy) ? 110 : 160;
  return compactPromptLine({
    label: "风格质感",
    values: [truncatePromptText(positive, budget)],
    maxLength: budget + 20,
  });
}

export function mergeDirectorStyleReferenceUrls(
  existingUrls: string[],
  directorStyleReferenceUrls: string[],
): string[] {
  return dedupe([...existingUrls, ...directorStyleReferenceUrls]).slice(0, 8);
}

export function inferVideoFocusMode(input: {
  projectDescription?: string | null;
  sequenceContent?: string | null;
  customKnowledge?: string | null;
  workflowTemplate?: string | null;
}): VideoFocusMode {
  const searchText = [
    input.projectDescription ?? "",
    input.sequenceContent ?? "",
    input.customKnowledge ?? "",
    input.workflowTemplate ?? "",
  ].join(" ").toLowerCase();

  if (hasKeyword(searchText, [
    "live action",
    "真人",
    "实拍",
    "纪录片",
    "采访",
    "product demo",
    "访谈",
  ])) {
    return "general_video";
  }

  return "animated_short";
}

export async function loadVideoDirectorRuntimeContext(input: {
  projectId: string;
  sequenceKey: string;
  sequenceId: string;
}): Promise<VideoDirectorRuntimeContext> {
  const [project, runtimeContext, fallbackSequenceContent, resources] = await Promise.all([
    getProjectById(input.projectId),
    getSequenceRuntimeContext(input.projectId, input.sequenceKey),
    getSequenceContent(input.sequenceId),
    getResources(input.sequenceId, input.projectId),
  ]);

  const sequenceContent = runtimeContext?.sequenceContent ?? fallbackSequenceContent ?? null;
  const defaultStylePreset = pickBuiltinStylePreset(sequenceContent ?? project?.description ?? null);
  const activeStyleProfile = runtimeContext?.activeStyleProfileId
    ? await getStyleProfileById(runtimeContext.activeStyleProfileId)
    : null;

  const profileStyleUrls = activeStyleProfile?.references.map((reference) => reference.imageUrl) ?? [];
  const focusMode = inferVideoFocusMode({
    projectDescription: project?.description ?? null,
    sequenceContent,
  });

  return {
    focusMode,
    project,
    sequenceContent,
    activeStyleProfile,
    defaultStylePreset,
    styleReferenceUrls: mergeDirectorStyleReferenceUrls(
      collectStyleReferenceUrls(resources),
      profileStyleUrls,
    ),
    roleAnchors: {
      characters: collectRoleAnchors(resources, "character_ref"),
      scenes: collectRoleAnchors(resources, "scene_ref"),
      emptyShots: collectRoleAnchors(resources, "empty_shot_ref"),
      storyboards: collectRoleAnchors(resources, "storyboard_ref"),
      motion: collectRoleAnchors(resources, "motion_ref"),
    },
  };
}

export function buildDirectorImagePrompt(input: BuildDirectorImagePromptInput): string {
  const role = inferPromptRole(input.category, input.title, "image", input.roleOverride);
  const lines = [
    input.focusMode === "animated_short" ? "动画短片关键帧。" : "电影镜头关键帧。",
    `核心画面：${normalizeSentence(input.prompt)}。`,
    compactPromptLine({
      label: "任务",
      values: [buildImageRoleLine(role, input.focusMode)],
      maxLength: 240,
    }),
    referenceResponsibilityLine(input.referenceRoles),
    continuityLine(input.sequenceContent, input.roleAnchors),
    styleTokensLine(input.styleProfile, input.defaultStylePreset),
    styleDirectionLine(input.styleProfile, input.defaultStylePreset),
    compactPromptLine({
      label: "工艺",
      values: [animationImageCraftLine(input.focusMode)],
      maxLength: 220,
    }),
    stabilityGuardLine(input.styleProfile, input.defaultStylePreset, input.focusMode),
  ].filter((line) => line.length > 0);

  return lines.join("\n");
}

export function buildDirectorVideoPrompt(input: BuildDirectorVideoPromptInput): string {
  const energy = inferMotionEnergy([
    input.prompt,
    input.dialogueContext ?? "",
    input.category,
    input.title ?? "",
  ].join(" "));
  const purpose = inferShotPurpose({
    prompt: input.prompt,
    category: input.category,
    title: input.title,
    focusMode: input.focusMode,
  });

  const lines = [
    input.focusMode === "animated_short" ? "动画短片单镜头。" : "电影化单镜头。",
    `核心镜头：${normalizeSentence(input.prompt)}。`,
    buildShotPurposeLine(purpose, input.focusMode),
    compactPromptLine({
      label: "策略",
      values: [buildVideoStrategyLine(input.strategy, input.focusMode)],
      maxLength: 240,
    }),
    compactPromptLine({
      label: "表演与运镜",
      values: [
        buildVideoEnergyLine(
          energy,
          purpose,
          input.strategy,
          input.prompt,
          input.dialogueContext,
          input.focusMode,
        ),
      ],
      maxLength: 260,
    }),
    buildTemporalProgressionLine({
      purpose,
      energy,
      strategy: input.strategy,
      dialogueContext: input.dialogueContext,
    }),
    dialogueLine(input.dialogueContext),
    referenceResponsibilityLine(input.referenceRoles),
    buildVideoContinuityLine({
      sequenceContent: input.sequenceContent,
      roleAnchors: input.roleAnchors,
      strategy: input.strategy,
    }),
    styleTokensLine(input.styleProfile, input.defaultStylePreset),
    buildVideoStyleDirectionLine({
      styleProfile: input.styleProfile,
      defaultStylePreset: input.defaultStylePreset,
      strategy: input.strategy,
    }),
    compactPromptLine({
      label: "成片工艺",
      values: [animationVideoCraftLine(input.focusMode)],
      maxLength: 220,
    }),
    stabilityGuardLine(input.styleProfile, input.defaultStylePreset, input.focusMode),
  ].filter((line) => line.length > 0);

  return lines.join("\n");
}

export function inferReferenceRolesFromVisualRefs(
  refs: Array<{ role: VisualReferenceRole }>,
): VideoReferenceRole[] {
  return dedupeReferenceRoles(refs.map((ref) => ref.role));
}
