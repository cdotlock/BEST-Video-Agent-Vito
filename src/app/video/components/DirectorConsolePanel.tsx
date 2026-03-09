"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  CloseOutlined,
  DownOutlined,
  FireOutlined,
  RightOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, Progress, Spin, Tabs, Typography } from "antd";
import { fetchJson } from "@/app/components/client-utils";
import { inferReferenceRole, type VideoReferenceRole } from "@/lib/video/reference-roles";
import { ProSettingsPanel } from "./ProSettingsPanel";
import type {
  DomainResources,
  ExecutionMode,
  VideoProConfig,
  WorkflowPathRecommendationsResult,
  WorkspaceView,
} from "../types";

const REFERENCE_ROLES: VideoReferenceRole[] = [
  "style_ref",
  "scene_ref",
  "empty_shot_ref",
  "character_ref",
  "motion_ref",
  "first_frame_ref",
  "last_frame_ref",
  "storyboard_ref",
  "dialogue_ref",
];

const SEVERITY_ORDER: Record<GapSeverity, number> = {
  critical: 0,
  warn: 1,
  soft: 2,
};

interface DirectorConsolePanelProps {
  resources: DomainResources | null;
  executionMode: ExecutionMode;
  memoryUser: string;
  proConfig: VideoProConfig;
  contextMaterialCount: number;
  styleReferenceCount: number;
  workspaceView: WorkspaceView;
  sessionId?: string;
  storageKey: string;
  capabilitySkills?: string[];
  capabilityMcps?: string[];
  onInjectMessage: (text: string) => void;
  onOpenStyle: () => void;
  onApplyPro: (next: { memoryUser: string; config: VideoProConfig }) => void;
  onGenerateDialogueScript?: () => void;
  onSwitchToClip: () => void;
}

interface ResourceInsights {
  totalAssets: number;
  imageCount: number;
  videoCount: number;
  jsonCount: number;
  roleCounts: Record<VideoReferenceRole, number>;
  anchorCoverage: number;
}

interface CurrentCue {
  title: string;
  summary: string;
  routeLabel: string;
}

type GapSeverity = "critical" | "warn" | "soft";
type GapActionKind = "inject" | "style" | "pro" | "clip" | "dialogue";
type StoryboardDensity = "single" | "grid_2x2" | "grid_3x3";
type PillTone = "neutral" | "accent" | GapSeverity;

interface GapItem {
  id: string;
  shortLabel: string;
  label: string;
  detail: string;
  cue: string;
  severity: GapSeverity;
  actionLabel: string;
  actionKind: GapActionKind;
  prompt?: string;
}

interface ConsoleAction {
  key: string;
  title: string;
  description: string;
  kind: GapActionKind;
  prompt?: string;
}

interface ProgressStage {
  id: string;
  label: string;
  detail: string;
  status: "done" | "active" | "todo" | "optional";
}

interface ProgressState {
  percent: number;
  summary: string;
  currentStageLabel: string;
  stages: ProgressStage[];
}

const ISLAND_BAR_STYLE: CSSProperties = {
  border: "1px solid rgba(229, 221, 210, 0.96)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,253,249,0.86))",
  boxShadow: "0 18px 36px rgba(116, 102, 85, 0.12), inset 0 1px 0 rgba(255,255,255,0.82)",
  backdropFilter: "blur(24px)",
};

const ISLAND_PANEL_STYLE: CSSProperties = {
  border: "1px solid rgba(229, 221, 210, 0.96)",
  background:
    "radial-gradient(circle at top right, rgba(141,167,194,0.12), transparent 30%), radial-gradient(circle at bottom left, rgba(201,139,91,0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,253,249,0.9))",
  boxShadow: "0 28px 56px rgba(116, 102, 85, 0.18), inset 0 1px 0 rgba(255,255,255,0.82)",
  maxHeight: "min(38rem, calc(100dvh - 220px))",
};

const ISLAND_CARD_STYLE: CSSProperties = {
  border: "1px solid rgba(229, 221, 210, 0.92)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,253,249,0.76))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.82)",
};

function pillStyle(tone: PillTone): CSSProperties {
  if (tone === "accent") {
    return {
      border: "1px solid rgba(201, 139, 91, 0.18)",
      background: "rgba(201, 139, 91, 0.16)",
      color: "#b36b26",
    };
  }

  if (tone === "critical") {
    return {
      border: "1px solid rgba(217, 119, 87, 0.18)",
      background: "rgba(248, 223, 216, 0.86)",
      color: "#cc4d3a",
    };
  }

  if (tone === "warn") {
    return {
      border: "1px solid rgba(214, 162, 77, 0.16)",
      background: "rgba(250, 235, 197, 0.82)",
      color: "#ad7a18",
    };
  }

  return {
    border: "1px solid rgba(229, 221, 210, 0.94)",
    background: "rgba(255, 253, 249, 0.92)",
    color: "var(--af-text)",
  };
}

function statusDotStyle(tone: "critical" | "warn" | "calm"): CSSProperties {
  if (tone === "critical") {
    return {
      background: "#d97757",
      boxShadow: "0 0 0 6px rgba(217, 119, 87, 0.14)",
    };
  }
  if (tone === "warn") {
    return {
      background: "#d6a24d",
      boxShadow: "0 0 0 6px rgba(214, 162, 77, 0.14)",
    };
  }
  return {
    background: "#2f6b5f",
    boxShadow: "0 0 0 6px rgba(47, 107, 95, 0.12)",
  };
}

function ConsolePill({ children, tone = "neutral" }: { children: ReactNode; tone?: PillTone }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]"
      style={pillStyle(tone)}
    >
      {children}
    </span>
  );
}

function createEmptyRoleCountMap(): Record<VideoReferenceRole, number> {
  return {
    style_ref: 0,
    scene_ref: 0,
    empty_shot_ref: 0,
    character_ref: 0,
    motion_ref: 0,
    first_frame_ref: 0,
    last_frame_ref: 0,
    storyboard_ref: 0,
    dialogue_ref: 0,
  };
}

function hasKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function buildResourceInsights(resources: DomainResources | null): ResourceInsights {
  const roleCounts = createEmptyRoleCountMap();
  let totalAssets = 0;
  let imageCount = 0;
  let videoCount = 0;
  let jsonCount = 0;

  for (const group of resources?.categories ?? []) {
    for (const item of group.items) {
      totalAssets += 1;
      if (item.mediaType === "image") imageCount += 1;
      if (item.mediaType === "video") videoCount += 1;
      if (item.mediaType === "json") jsonCount += 1;

      const role = inferReferenceRole({
        category: item.category,
        mediaType: item.mediaType,
        title: item.title,
        data: item.data,
      });
      if (role) roleCounts[role] += 1;
    }
  }

  let anchorCoverage = 0;
  for (const role of REFERENCE_ROLES) {
    if (roleCounts[role] > 0) anchorCoverage += 1;
  }

  return {
    totalAssets,
    imageCount,
    videoCount,
    jsonCount,
    roleCounts,
    anchorCoverage,
  };
}

function inferStoryboardDensity(
  roleCounts: Record<VideoReferenceRole, number>,
  configText: string,
): StoryboardDensity | undefined {
  if (roleCounts.storyboard_ref >= 5 || hasKeyword(configText, ["九宫格", "3x3"])) {
    return "grid_3x3";
  }
  if (roleCounts.storyboard_ref >= 2 || hasKeyword(configText, ["四宫格", "2x2"])) {
    return "grid_2x2";
  }
  if (roleCounts.storyboard_ref > 0 || configText.trim().length > 0) {
    return "single";
  }
  return undefined;
}

function buildGapItems(input: {
  insights: ResourceInsights;
  executionMode: ExecutionMode;
  workspaceView: WorkspaceView;
  contextMaterialCount: number;
  styleReferenceCount: number;
  configText: string;
}): GapItem[] {
  const { insights, executionMode, workspaceView, contextMaterialCount, styleReferenceCount, configText } = input;
  const gaps: GapItem[] = [];

  if (workspaceView === "clip" && insights.videoCount === 0) {
    gaps.push({
      id: "clip_input",
      shortLabel: "缺候选",
      label: "还没有视频候选",
      detail: "当前已切到剪辑区，但还没有可进入时间线的候选视频。",
      cue: "先补视频候选，再进入粗剪",
      severity: "critical",
      actionLabel: "回到生成",
      actionKind: "inject",
      prompt: "先补出一到两条视频候选，再进入粗剪比较节奏和镜头衔接。",
    });
  }

  if (insights.roleCounts.storyboard_ref === 0) {
    gaps.push({
      id: "storyboard",
      shortLabel: "差分镜",
      label: "缺少分镜探索",
      detail: "先做四宫格或九宫格，把镜头密度和构图范围拉开，再锁主镜头。",
      cue: "先补四宫格分镜，再锁定镜头",
      severity: "critical",
      actionLabel: "补分镜",
      actionKind: "inject",
      prompt: "请先补四宫格或九宫格分镜探索，比较镜头密度和构图方案，再决定后续视频生成路线。",
    });
  }

  if (
    insights.roleCounts.first_frame_ref === 0
    && insights.roleCounts.last_frame_ref === 0
    && insights.videoCount === 0
    && insights.imageCount > 0
  ) {
    gaps.push({
      id: "anchor_frame",
      shortLabel: "差关键帧",
      label: "缺少关键帧锚点",
      detail: "画面已有素材，但视频生成还没有关键帧约束，运动容易飘。",
      cue: "先锁起始关键帧，再决定是否需要结尾落点",
      severity: "critical",
      actionLabel: "补关键帧",
      actionKind: "inject",
      prompt: "请优先用现有素材锁定起始关键帧；只有当结尾落点也明确时才切到首尾帧路线，避免只靠 prompt 漂移。",
    });
  }

  if (insights.roleCounts.empty_shot_ref === 0 && insights.totalAssets > 0) {
    gaps.push({
      id: "rhythm",
      shortLabel: "差空镜",
      label: "可补空镜节奏",
      detail: "镜头更像素材堆叠，建议主动补空镜、过渡镜头和节奏呼吸。",
      cue: "补空镜与过渡，让节奏成立",
      severity: "warn",
      actionLabel: "补空镜",
      actionKind: "inject",
      prompt: "请补空镜和过渡节奏镜头，给这个片段留出呼吸空间，不要只堆主镜头。",
    });
  }

  if (insights.roleCounts.character_ref === 0 && insights.totalAssets > 0) {
    gaps.push({
      id: "character",
      shortLabel: "差角色锚",
      label: "角色锚点偏弱",
      detail: "当前还没有稳定的角色立绘或人物锚点，身份和服装容易跳。",
      cue: "先补角色锚点，再推主镜头",
      severity: "warn",
      actionLabel: "补角色锚点",
      actionKind: "inject",
      prompt: "请先补角色立绘或 character_ref，稳定人物身份、服装和表情后再推进主镜头。",
    });
  }

  if (insights.roleCounts.style_ref + styleReferenceCount === 0) {
    gaps.push({
      id: "style",
      shortLabel: "差风格",
      label: "风格参考仍偏少",
      detail: "当前没有稳定的 style_ref 或风格档案，画风容易漂移。",
      cue: "先补风格参考，再放大候选",
      severity: "soft",
      actionLabel: "管理风格",
      actionKind: "style",
    });
  }

  if (insights.roleCounts.dialogue_ref === 0 && hasKeyword(configText, ["对白", "台词", "dialogue", "口播", "独白"])) {
    gaps.push({
      id: "dialogue",
      shortLabel: "差台词",
      label: "缺少对白确认稿",
      detail: "故事已经带有对白信号，建议先生成对白脚本 JSON，确认后再让视频围绕台词组织。",
      cue: "先补对白脚本确认稿，再推进镜头生成",
      severity: "warn",
      actionLabel: "生成台词稿",
      actionKind: "dialogue",
    });
  }

  if (contextMaterialCount === 0 && executionMode === "checkpoint" && !hasKeyword(configText, ["目标", "剧情", "场景"])) {
    gaps.push({
      id: "context",
      shortLabel: "差目标",
      label: "当前序列目标还不够清楚",
      detail: "这轮上下文很轻，Agent 会更依赖即时对话，建议先补目标、场景和约束。",
      cue: "先补一句导演意图，再开始执行",
      severity: "soft",
      actionLabel: "整理目标",
      actionKind: "inject",
      prompt: "请先整理这一段的导演意图、角色、场景和风格约束，再开始执行具体生成。",
    });
  }

  gaps.sort((left, right) => SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity]);
  return gaps;
}

function buildCurrentCue(input: {
  insights: ResourceInsights;
  gaps: GapItem[];
  workspaceView: WorkspaceView;
  configText: string;
}): CurrentCue {
  const { insights, gaps, workspaceView, configText } = input;
  const topGap = gaps[0];

  if (workspaceView === "clip" && insights.videoCount > 0) {
    return {
      title: "粗剪阶段已经就绪",
      summary: "切到时间线，比较候选节奏、主镜头和呼吸镜头的组合。",
      routeLabel: "Clip Studio",
    };
  }

  if (topGap) {
    return {
      title: topGap.cue,
      summary: topGap.detail,
      routeLabel: topGap.label,
    };
  }

  if (insights.videoCount > 0) {
    return {
      title: "候选视频已经成型",
      summary: "现在更适合进入粗剪，比较节奏、衔接和最终主线，而不是继续堆素材。",
      routeLabel: "多候选粗剪",
    };
  }

  if (insights.roleCounts.first_frame_ref > 0 && insights.roleCounts.last_frame_ref > 0) {
    return {
      title: "起止落点路线可用",
      summary: "起止落点都已明确，适合推进受控更强的图生视频；若只想稳住起始构图，仍应优先 first_frame。",
      routeLabel: "起止落点",
    };
  }

  if (insights.roleCounts.storyboard_ref > 0) {
    return {
      title: "分镜探索已经起势",
      summary: "先用现有分镜筛一轮镜头，再决定是否补关键帧、角色锚点或空镜。",
      routeLabel: "分镜优先",
    };
  }

  if (hasKeyword(configText, ["对白", "台词", "dialogue", "口播"])) {
    return {
      title: "对白优先，镜头围绕台词组织",
      summary: "这轮更适合先清对白节拍，再让镜头为叙事服务。",
      routeLabel: "对白驱动",
    };
  }

  return {
    title: "先拉起第一轮导演蓝图",
    summary: "先做分镜探索或风格打样，不要直接 prompt-only 地硬推生成。",
    routeLabel: "等待锚点",
  };
}

function buildProgressState(input: {
  insights: ResourceInsights;
  workspaceView: WorkspaceView;
  contextMaterialCount: number;
  configText: string;
}): ProgressState {
  const wantsDialogue = hasKeyword(input.configText, ["对白", "台词", "dialogue", "口播", "独白"]);
  const stages: ProgressStage[] = [
    {
      id: "alignment",
      label: "导演对齐",
      detail: "目标、风格和交付物开始成形",
      status: input.contextMaterialCount > 0 || input.configText.trim().length > 0 || input.insights.totalAssets > 0
        ? "done"
        : "active",
    },
    {
      id: "storyboard",
      label: "分镜探索",
      detail: "先把镜头范围拉开再收敛",
      status: input.insights.roleCounts.storyboard_ref > 0 ? "done" : "todo",
    },
    {
      id: "anchors",
      label: "语义锚点",
      detail: "角色、空镜、关键帧开始稳定",
      status: (
        input.insights.roleCounts.character_ref
        + input.insights.roleCounts.empty_shot_ref
        + input.insights.roleCounts.scene_ref
        + input.insights.roleCounts.first_frame_ref
        + input.insights.roleCounts.last_frame_ref
      ) > 0
        ? "done"
        : "todo",
    },
    {
      id: "dialogue",
      label: "对白确认",
      detail: wantsDialogue ? "对白脚本需要先确认" : "当前对白需求较低",
      status: wantsDialogue
        ? (input.insights.roleCounts.dialogue_ref > 0 ? "done" : "todo")
        : "optional",
    },
    {
      id: "video",
      label: "视频候选",
      detail: "开始进入视频生成与候选比较",
      status: input.insights.videoCount > 0 ? "done" : "todo",
    },
    {
      id: "clip",
      label: "时间线收口",
      detail: "进入粗剪台组织节奏与镜头",
      status: input.workspaceView === "clip" && input.insights.videoCount > 0 ? "done" : "todo",
    },
  ];

  const visibleStages = stages.filter((stage) => stage.status !== "optional");
  const firstIncomplete = visibleStages.find((stage) => stage.status !== "done") ?? null;
  const percent = Math.round(
    (visibleStages.filter((stage) => stage.status === "done").length / Math.max(1, visibleStages.length)) * 100,
  );

  return {
    percent,
    summary: firstIncomplete
      ? `下一阶段：${firstIncomplete.label}`
      : "主流程已经成型，可以继续打磨和收口",
    currentStageLabel: firstIncomplete?.label ?? "已进入收口",
    stages: stages.map((stage, index) => {
      if (stage.status === "todo" && firstIncomplete && stage.id === firstIncomplete.id) {
        return { ...stage, status: "active" };
      }
      if (stage.status === "todo" && index === 0 && !firstIncomplete) {
        return { ...stage, status: "active" };
      }
      return stage;
    }),
  };
}

function buildActionDeck(input: {
  gaps: GapItem[];
  insights: ResourceInsights;
  workspaceView: WorkspaceView;
}): ConsoleAction[] {
  const { gaps, insights, workspaceView } = input;
  const actions: ConsoleAction[] = [];

  for (const gap of gaps.slice(0, 3)) {
    actions.push({
      key: gap.id,
      title: gap.actionLabel,
      description: gap.detail,
      kind: gap.actionKind,
      prompt: gap.prompt,
    });
  }

  if (insights.videoCount > 0 && workspaceView !== "clip") {
    actions.push({
      key: "go_clip",
      title: "进入粗剪",
      description: "候选视频已经可用，直接去时间线比较节奏与最佳组合。",
      kind: "clip",
    });
  }

  if (insights.roleCounts.style_ref === 0) {
    actions.push({
      key: "open_style",
      title: "补风格档案",
      description: "打开 Style，补 style_ref、风格词和画面基调。",
      kind: "style",
    });
  }

  actions.push({
    key: "open_pro",
    title: "打开 Pro",
    description: "长期知识、模板和记忆偏好仍在 Pro 里维护。",
    kind: "pro",
  });

  const deduped = new Map<string, ConsoleAction>();
  for (const item of actions) {
    if (!deduped.has(item.key)) deduped.set(item.key, item);
  }
  return [...deduped.values()].slice(0, 4);
}

function buildStatusTone(gaps: GapItem[]): "critical" | "warn" | "calm" {
  if (gaps.some((item) => item.severity === "critical")) return "critical";
  if (gaps.some((item) => item.severity === "warn")) return "warn";
  return "calm";
}

export function DirectorConsolePanel({
  resources,
  executionMode,
  memoryUser,
  proConfig,
  contextMaterialCount,
  styleReferenceCount,
  workspaceView,
  sessionId,
  storageKey,
  capabilitySkills = [],
  capabilityMcps = [],
  onInjectMessage,
  onOpenStyle,
  onApplyPro,
  onGenerateDialogueScript,
  onSwitchToClip,
}: DirectorConsolePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"monitor" | "pro">("monitor");
  const [isLoadingIntel, setIsLoadingIntel] = useState(false);
  const [pathSummary, setPathSummary] = useState<WorkflowPathRecommendationsResult | null>(null);

  const configText = useMemo(
    () => `${proConfig.workflowTemplate}\n${proConfig.customKnowledge}`.toLowerCase(),
    [proConfig.customKnowledge, proConfig.workflowTemplate],
  );

  const insights = useMemo(() => buildResourceInsights(resources), [resources]);
  const gaps = useMemo(
    () => buildGapItems({
      insights,
      executionMode,
      workspaceView,
      contextMaterialCount,
      styleReferenceCount,
      configText,
    }),
    [configText, contextMaterialCount, executionMode, insights, styleReferenceCount, workspaceView],
  );
  const currentCue = useMemo(
    () => buildCurrentCue({ insights, gaps, workspaceView, configText }),
    [configText, gaps, insights, workspaceView],
  );
  const actionDeck = useMemo(
    () => buildActionDeck({ gaps, insights, workspaceView }),
    [gaps, insights, workspaceView],
  );
  const progress = useMemo(
    () => buildProgressState({ insights, workspaceView, contextMaterialCount, configText }),
    [configText, contextMaterialCount, insights, workspaceView],
  );
  const tone = useMemo(() => buildStatusTone(gaps), [gaps]);

  const topGap = gaps[0];
  const compactHint = topGap?.shortLabel ?? (insights.videoCount > 0 ? "可进粗剪" : "可继续推进");
  const compactStatus = sessionId ? "在线" : "待起步";
  const panelId = useMemo(
    () => `director-island-${storageKey.replace(/[^a-zA-Z0-9_-]+/g, "-")}`,
    [storageKey],
  );

  useEffect(() => {
    setIsOpen(false);
    setActiveTab("monitor");
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen || activeTab !== "monitor") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTab, isOpen]);

  useEffect(() => {
    if (!isOpen || activeTab !== "monitor") return;
    let cancelled = false;
    const params = new URLSearchParams({ memoryUser });
    const goal = proConfig.workflowTemplate.trim() || proConfig.customKnowledge.trim();
    if (goal.length > 0) params.set("goal", goal);

    const storyboardDensity = inferStoryboardDensity(insights.roleCounts, configText);
    if (storyboardDensity) params.set("storyboardDensity", storyboardDensity);
    if (insights.imageCount > 0) params.set("hasImageReference", "true");
    if (insights.videoCount > 0) params.set("hasReferenceVideo", "true");
    if (insights.roleCounts.first_frame_ref > 0) params.set("hasFirstFrameReference", "true");
    if (insights.roleCounts.last_frame_ref > 0) params.set("hasLastFrameReference", "true");
    if (insights.videoCount > 1 || hasKeyword(configText, ["粗剪", "多候选", "拼接"])) {
      params.set("wantsMultiClip", "true");
    }
    if (
      insights.roleCounts.character_ref > insights.roleCounts.empty_shot_ref
      || hasKeyword(configText, ["角色优先", "立绘优先"])
    ) {
      params.set("prefersCharacterPriority", "true");
    }
    if (
      insights.roleCounts.empty_shot_ref > 0
      || hasKeyword(configText, ["空镜优先", "节奏空镜"])
    ) {
      params.set("prefersEmptyShotPriority", "true");
    }

    const loadIntel = async () => {
      setIsLoadingIntel(true);
      try {
        const pathResult = await fetchJson<WorkflowPathRecommendationsResult>(
          `/api/video/memory/path-recommendations?${params.toString()}`,
        );

        if (cancelled) return;
        setPathSummary(pathResult);
      } catch {
        if (!cancelled) {
          setPathSummary(null);
        }
      } finally {
        if (!cancelled) setIsLoadingIntel(false);
      }
    };

    void loadIntel();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    configText,
    insights.imageCount,
    insights.roleCounts,
    insights.videoCount,
    isOpen,
    memoryUser,
    proConfig.customKnowledge,
    proConfig.workflowTemplate,
  ]);

  const runAction = (action: ConsoleAction) => {
    if (action.kind === "style") {
      setIsOpen(false);
      onOpenStyle();
      return;
    }
    if (action.kind === "pro") {
      setActiveTab("pro");
      setIsOpen(true);
      return;
    }
    if (action.kind === "dialogue") {
      onGenerateDialogueScript?.();
      return;
    }
    if (action.kind === "clip") {
      setIsOpen(false);
      onSwitchToClip();
      return;
    }
    if (action.prompt) {
      setIsOpen(false);
      onInjectMessage(action.prompt);
    }
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center px-3">
      <div className="pointer-events-auto relative w-full max-w-[860px]" data-console-key={storageKey}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-full px-3.5 py-2 text-left transition duration-200 hover:-translate-y-0.5"
          style={ISLAND_BAR_STYLE}
        >
          <div className="min-w-0 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-[10px] w-[10px] shrink-0 rounded-full"
              style={statusDotStyle(tone)}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--af-muted)]">
                <span>灵动岛</span>
                <span className="hidden md:inline">{compactStatus}</span>
              </div>
              <div className="truncate text-sm font-semibold text-[var(--af-text)]">{currentCue.title}</div>
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex">
            <ConsolePill>{progress.currentStageLabel}</ConsolePill>
            <ConsolePill tone={topGap ? topGap.severity : "accent"}>{compactHint}</ConsolePill>
            {actionDeck[0] ? <ConsolePill>{actionDeck[0].title}</ConsolePill> : null}
          </div>

          <div className="flex items-center gap-2 text-[var(--af-brand)]">
            <span className="hidden text-xs font-medium sm:inline">展开浮层</span>
            <DownOutlined className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        <section
          id={panelId}
          role="dialog"
          aria-label="灵动岛"
          aria-hidden={!isOpen}
          className={`absolute left-1/2 top-[62px] z-20 w-[min(calc(100vw-48px),860px)] -translate-x-1/2 overflow-hidden rounded-[30px] transition duration-200 md:w-[min(calc(100%-24px),860px)] ${
            isOpen
              ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
              : "pointer-events-none -translate-y-3 opacity-0 scale-[0.98]"
          }`}
          style={ISLAND_PANEL_STYLE}
        >
          <header className="border-b border-[rgba(229,221,210,0.92)] px-4 py-3 md:px-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Typography.Text strong style={{ fontSize: 18, color: "var(--af-text)" }}>
                    导演台
                  </Typography.Text>
                  <ConsolePill tone="accent">
                    {executionMode === "yolo" ? "YOLO 自动推进" : "Checkpoint 对齐优先"}
                  </ConsolePill>
                  <ConsolePill>{progress.currentStageLabel}</ConsolePill>
                  <ConsolePill>{progress.percent}%</ConsolePill>
                </div>
                <Typography.Paragraph style={{ margin: "6px 0 0", color: "var(--af-muted)", fontSize: 12 }}>
                  收起时只保留最重要状态；展开后只看当前阶段、关键阻塞和下一动作。
                </Typography.Paragraph>
              </div>

              <Button type="text" size="small" icon={<CloseOutlined />} onClick={() => setIsOpen(false)}>
                收起
              </Button>
            </div>
          </header>

          <div
            className="overflow-y-auto px-4 py-4 md:px-5"
            style={{ maxHeight: "calc(min(38rem, calc(100dvh - 220px)) - 74px)" }}
          >
            <Tabs
              size="small"
              activeKey={activeTab}
              onChange={(value) => {
                if (value === "monitor" || value === "pro") {
                  setActiveTab(value);
                }
              }}
              items={[
                {
                  key: "monitor",
                  label: "Monitor",
                  children: (
                    <div className="space-y-3">
                      <section className="rounded-[26px] p-4" style={ISLAND_CARD_STYLE}>
                        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--af-muted)]">
                          <FireOutlined />
                          <span>Now</span>
                        </div>
                        <Typography.Text strong style={{ display: "block", marginTop: 10, fontSize: 20 }}>
                          {currentCue.title}
                        </Typography.Text>
                        <Typography.Paragraph style={{ margin: "10px 0 0", color: "var(--af-muted)", fontSize: 13 }}>
                          {currentCue.summary}
                        </Typography.Paragraph>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <ConsolePill>{workspaceView === "clip" ? "剪辑台" : "对话主舞台"}</ConsolePill>
                          <ConsolePill>{sessionId ? "会话在线" : "待首条指令"}</ConsolePill>
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-4">
                          <div className="rounded-[16px] border p-3" style={pillStyle("neutral")}>
                            <span className="block text-[11px] text-[var(--af-muted)]">阶段</span>
                            <strong className="mt-1 block text-sm text-[var(--af-text)]">{progress.currentStageLabel}</strong>
                          </div>
                          <div className="rounded-[16px] border p-3" style={pillStyle("neutral")}>
                            <span className="block text-[11px] text-[var(--af-muted)]">素材</span>
                            <strong className="mt-1 block text-sm text-[var(--af-text)]">{insights.totalAssets}</strong>
                          </div>
                          <div className="rounded-[16px] border p-3" style={pillStyle("neutral")}>
                            <span className="block text-[11px] text-[var(--af-muted)]">锚点覆盖</span>
                            <strong className="mt-1 block text-sm text-[var(--af-text)]">
                              {insights.anchorCoverage}/{REFERENCE_ROLES.length}
                            </strong>
                          </div>
                          <div className="rounded-[16px] border p-3" style={pillStyle("neutral")}>
                            <span className="block text-[11px] text-[var(--af-muted)]">候选视频</span>
                            <strong className="mt-1 block text-sm text-[var(--af-text)]">{insights.videoCount}</strong>
                          </div>
                        </div>
                        <Progress
                          percent={progress.percent}
                          showInfo={false}
                          strokeColor="#2f6b5f"
                          railColor="rgba(229,221,210,0.92)"
                          className="mt-4"
                        />
                        <div className="mt-2 text-[12px] text-[var(--af-muted)]">{progress.summary}</div>
                      </section>

                      <div className="grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
                        <section className="rounded-[24px] p-4" style={ISLAND_CARD_STYLE}>
                          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--af-muted)]">
                            <ThunderboltOutlined />
                            <span>Blocking Gaps</span>
                          </div>
                          {gaps.length === 0 ? (
                            <div className="mt-3 rounded-[18px] border p-4" style={pillStyle("accent")}>
                              <Typography.Text strong style={{ fontSize: 13 }}>当前没有关键阻塞</Typography.Text>
                              <Typography.Paragraph style={{ margin: "8px 0 0", color: "var(--af-muted)", fontSize: 12 }}>
                                信息已经足够，可以继续推进生成，或直接转去时间线收口。
                              </Typography.Paragraph>
                            </div>
                          ) : (
                            <div className="mt-3 space-y-3">
                              {gaps.slice(0, 3).map((gap) => (
                                <div
                                  key={gap.id}
                                  className="rounded-[18px] border px-3 py-3"
                                  style={gap.severity === "critical"
                                    ? pillStyle("critical")
                                    : gap.severity === "warn"
                                      ? pillStyle("warn")
                                      : pillStyle("neutral")}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <ConsolePill tone={gap.severity}>{gap.label}</ConsolePill>
                                      <Typography.Paragraph style={{ margin: "8px 0 0", fontSize: 12, color: "var(--af-muted)" }}>
                                        {gap.detail}
                                      </Typography.Paragraph>
                                    </div>
                                    <Button size="small" onClick={() => runAction({
                                      key: gap.id,
                                      title: gap.actionLabel,
                                      description: gap.detail,
                                      kind: gap.actionKind,
                                      prompt: gap.prompt,
                                    })}>
                                      {gap.actionLabel}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>

                        <section className="rounded-[24px] p-4" style={ISLAND_CARD_STYLE}>
                          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--af-muted)]">
                            <RightOutlined />
                            <span>Next Actions</span>
                          </div>
                          <div className="mt-3 grid gap-2 md:grid-cols-2">
                            {actionDeck.map((action) => (
                              <button
                                key={action.key}
                                type="button"
                                className="director-action-button"
                                onClick={() => runAction(action)}
                              >
                                <span className="text-[14px] font-semibold">{action.title}</span>
                                <span className="text-[12px] text-[var(--af-muted)]">{action.description}</span>
                              </button>
                            ))}
                          </div>
                          <div className="mt-3 space-y-3">
                            {isLoadingIntel ? (
                              <div className="flex min-h-[72px] items-center justify-center">
                                <Spin size="small" />
                              </div>
                            ) : pathSummary?.recommendations[0] ? (
                              <div className="rounded-[18px] border p-3" style={pillStyle("neutral")}>
                                <Typography.Text strong style={{ fontSize: 13 }}>
                                  当前更优路径：{pathSummary.recommendations[0].title}
                                </Typography.Text>
                                {pathSummary.recommendations[0].why[0] ? (
                                  <p className="mt-2 text-[12px] text-[var(--af-muted)]">
                                    {pathSummary.recommendations[0].why[0]}
                                  </p>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </section>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "pro",
                  label: "Pro",
                  children: (
                    <ProSettingsPanel
                      active={isOpen && activeTab === "pro"}
                      memoryUser={memoryUser}
                      config={proConfig}
                      capabilitySkills={capabilitySkills}
                      capabilityMcps={capabilityMcps}
                      onApply={onApplyPro}
                    />
                  ),
                },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
