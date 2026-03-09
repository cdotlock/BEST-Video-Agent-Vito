"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Input,
  Segmented,
  Select,
  Space,
  Spin,
  Switch,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { fetchJson } from "@/app/components/client-utils";
import type {
  MemoryRecommendations,
  VideoProConfig,
  WorkflowPathRecommendationsResult,
} from "../types";

export interface ProSettingsPanelProps {
  active?: boolean;
  memoryUser: string;
  config: VideoProConfig;
  capabilitySkills?: string[];
  capabilityMcps?: string[];
  onApply: (next: { memoryUser: string; config: VideoProConfig }) => void;
  onClose?: () => void;
  layout?: "inline" | "drawer";
}

interface TemplatePreset {
  id: string;
  title: string;
  summary: string;
  content: string;
}

interface StrategyPreset {
  id: string;
  title: string;
  summary: string;
  blueprint: Partial<AtelierBlueprintState>;
}

type StoryboardDensityPreset = "single" | "grid_2x2" | "grid_3x3";
type ReferenceRoutePreset = "auto" | "first_frame" | "first_last_frame" | "mixed_refs";

interface AtelierBlueprintState {
  storyboardDensity: StoryboardDensityPreset;
  referenceRoute: ReferenceRoutePreset;
  characterPriority: boolean;
  emptyShotPriority: boolean;
  dialogueFirst: boolean;
  multiClip: boolean;
  checkpointAlignmentRequired: boolean;
  enableSelfReview: boolean;
}

const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "storyboard_grid_first",
    title: "分镜优先",
    summary: "先四宫格/九宫格探索，再生成视频，最后多候选粗剪。",
    content: "先用四宫格或九宫格分镜探索镜头密度，再补角色立绘与空镜，随后优先首帧视频验证动作，只有在结尾落点明确时才切到首尾帧，多候选收敛后进入粗剪。",
  },
  {
    id: "first_last_frame",
    title: "起止落点明确",
    summary: "只有当首尾状态都清楚时，才进入首尾帧约束。",
    content: "当镜头运动方向和起止状态都明确时，再显式走 first_last_frame；若只是想稳定起始构图，优先 first_frame；若镜头不稳定，先补 storyboard_ref 或 motion_ref。",
  },
  {
    id: "dialogue_driven",
    title: "对白驱动",
    summary: "先写对白脚本，再让镜头围绕台词组织。",
    content: "若作品依赖叙事与口播，先产出台词脚本并确认分镜承载，再生成视频，避免先做镜头后补对白导致返工。",
  },
  {
    id: "empty_shot_rhythm",
    title: "空镜节奏",
    summary: "强化场景和空镜，适合品牌片和情绪片。",
    content: "优先补 scene_ref 和 empty_shot_ref，要求 Agent 主动加入节奏过渡镜头，不要只堆主镜头和角色镜头。",
  },
];

const STRATEGY_PRESETS: StrategyPreset[] = [
  {
    id: "stable_opening",
    title: "稳起稿",
    summary: "先锁起始构图，再决定要不要补终点落位。",
    blueprint: {
      storyboardDensity: "grid_2x2",
      referenceRoute: "first_frame",
      checkpointAlignmentRequired: true,
      enableSelfReview: true,
    },
  },
  {
    id: "dialogue_story",
    title: "对白叙事",
    summary: "对白先行，镜头围绕台词节拍组织。",
    blueprint: {
      storyboardDensity: "single",
      referenceRoute: "first_frame",
      dialogueFirst: true,
      checkpointAlignmentRequired: true,
      enableSelfReview: true,
    },
  },
  {
    id: "rhythm_cutaway",
    title: "节奏空镜",
    summary: "优先空镜与过渡，适合品牌片和情绪片。",
    blueprint: {
      storyboardDensity: "grid_2x2",
      emptyShotPriority: true,
      multiClip: true,
      enableSelfReview: true,
    },
  },
  {
    id: "explore_then_cut",
    title: "探索后粗剪",
    summary: "先做更宽的探索，再保留多候选进入粗剪。",
    blueprint: {
      storyboardDensity: "grid_3x3",
      referenceRoute: "mixed_refs",
      multiClip: true,
      checkpointAlignmentRequired: true,
      enableSelfReview: true,
    },
  },
];

function derivePathSignals(input: VideoProConfig): {
  goal: string | undefined;
  storyboardDensity: "single" | "grid_2x2" | "grid_3x3" | undefined;
  hasImageReference: boolean;
  hasReferenceVideo: boolean;
  hasFirstFrameReference: boolean;
  hasLastFrameReference: boolean;
  wantsMultiClip: boolean;
  prefersCharacterPriority: boolean;
  prefersEmptyShotPriority: boolean;
  needsDialogue: boolean;
} {
  const merged = `${input.workflowTemplate}\n${input.customKnowledge}`.toLowerCase();
  let storyboardDensity: "single" | "grid_2x2" | "grid_3x3" | undefined;
  if (merged.includes("九宫格") || merged.includes("3x3")) {
    storyboardDensity = "grid_3x3";
  } else if (merged.includes("四宫格") || merged.includes("2x2")) {
    storyboardDensity = "grid_2x2";
  } else if (merged.trim().length > 0) {
    storyboardDensity = "single";
  }

  return {
    goal: input.workflowTemplate.trim() || input.customKnowledge.trim() || undefined,
    storyboardDensity,
    hasImageReference: merged.includes("参考图") || merged.includes("图生视频") || merged.includes("首帧"),
    hasReferenceVideo: merged.includes("混参") || merged.includes("视频参考"),
    hasFirstFrameReference: merged.includes("首帧"),
    hasLastFrameReference: merged.includes("尾帧"),
    wantsMultiClip: merged.includes("粗剪") || merged.includes("多候选") || merged.includes("拼接"),
    prefersCharacterPriority: merged.includes("立绘优先") || merged.includes("角色优先"),
    prefersEmptyShotPriority: merged.includes("空镜优先") || merged.includes("节奏空镜"),
    needsDialogue: merged.includes("对白") || merged.includes("台词") || merged.includes("口播") || merged.includes("dialogue"),
  };
}

function buildAtelierBlueprintFromConfig(input: VideoProConfig): AtelierBlueprintState {
  const signals = derivePathSignals(input);
  let referenceRoute: ReferenceRoutePreset = "auto";
  if (signals.hasFirstFrameReference && signals.hasLastFrameReference) {
    referenceRoute = "first_last_frame";
  } else if (signals.hasFirstFrameReference) {
    referenceRoute = "first_frame";
  } else if (signals.hasReferenceVideo) {
    referenceRoute = "mixed_refs";
  }

  return {
    storyboardDensity: signals.storyboardDensity ?? "grid_2x2",
    referenceRoute,
    characterPriority: signals.prefersCharacterPriority,
    emptyShotPriority: signals.prefersEmptyShotPriority,
    dialogueFirst: signals.needsDialogue,
    multiClip: signals.wantsMultiClip,
    checkpointAlignmentRequired: input.checkpointAlignmentRequired,
    enableSelfReview: input.enableSelfReview,
  };
}

function buildAtelierWorkflowText(input: AtelierBlueprintState): string {
  const lines = ["按 Director Strategy 路线执行："];

  if (input.storyboardDensity === "grid_3x3") {
    lines.push("先做九宫格分镜探索，扩大镜头候选范围后再收敛。");
  } else if (input.storyboardDensity === "grid_2x2") {
    lines.push("先做四宫格分镜探索，快速比较镜头组合与节奏。");
  } else {
    lines.push("先做单张分镜确认，用更克制的方式锁定镜头。");
  }

  if (input.referenceRoute === "first_last_frame") {
    lines.push("视频生成优先走首尾帧约束图生视频路线。");
  } else if (input.referenceRoute === "first_frame") {
    lines.push("视频生成优先走首帧图生视频路线。");
  } else if (input.referenceRoute === "mixed_refs") {
    lines.push("当图像与视频素材并存时，优先走 mixed refs 路线。");
  } else {
    lines.push("默认优先首帧；只有当结尾落点也明确时才切到首尾帧；若图像与视频参考并存，再考虑 mixed refs。");
  }

  if (input.characterPriority) {
    lines.push("角色优先：先补 character_ref，稳定身份后再推进。");
  }
  if (input.emptyShotPriority) {
    lines.push("空镜优先：先补 scene_ref 和 empty_shot_ref，让节奏和空间成立。");
  }
  if (input.dialogueFirst) {
    lines.push("对白优先：先整理对白脚本，再让镜头围绕台词组织。");
  }
  if (input.multiClip) {
    lines.push("保留多候选，最后进入粗剪与拼接，不要过早锁定单条成片。");
  }
  if (input.checkpointAlignmentRequired) {
    lines.push("首轮先做 checkpoint 对齐，再进入关键生成。");
  }
  if (input.enableSelfReview) {
    lines.push("关键阶段结束后必须 review，必要时切换路径或补素材。");
  }

  return lines.join("\n");
}

function buildAtelierKnowledgeText(input: AtelierBlueprintState): string {
  const hints: string[] = [];
  hints.push("把分镜密度当成探索杠杆，而不是固定流程。");
  if (input.characterPriority) {
    hints.push("当身份一致性比新鲜感更重要时，优先角色锚点。");
  }
  if (input.emptyShotPriority) {
    hints.push("给作品预留空镜和呼吸镜头，不要只堆主体动作。");
  }
  if (input.dialogueFirst) {
    hints.push("对白场景优先从台词节拍组织镜头。");
  }
  if (input.multiClip) {
    hints.push("鼓励保留多个候选片段，交给剪辑阶段判断最优组合。");
  }
  if (input.referenceRoute === "mixed_refs") {
    hints.push("灵活组合图片和视频参考，不要退回 prompt-only。");
  }
  return hints.join("\n");
}

function workflowSnippetForPath(pathId: string): string {
  switch (pathId) {
    case "path.storyboard_density.grid_3x3":
      return "先用九宫格分镜做高密度探索，再挑出候选镜头进入后续生成。";
    case "path.storyboard_density.grid_2x2":
      return "先用四宫格分镜快速比较镜头方案，再决定后续方向。";
    case "path.image_to_video.first_last_frame":
      return "生成视频时优先使用首尾帧约束，稳定动作起止与结尾落点。";
    case "path.image_to_video.first_frame":
      return "生成视频时优先用首帧参考推进，必要时再补尾帧或 mixed refs。";
    case "path.multi_reference_video":
      return "当图像和视频参考并存时，优先 mixed refs 路线。";
    case "path.role_pack.character_priority":
      return "角色优先：先建立 character_ref，再补场景和动作。";
    case "path.role_pack.empty_shot_priority":
      return "空镜优先：先补 empty_shot_ref 和 scene_ref，让节奏和呼吸成立。";
    case "path.multi_clip_compose":
      return "保留多候选视频，最后进入粗剪与拼接。";
    default:
      return "先做风格和路径对齐，再进入具体生成。";
  }
}

function storyboardDensityLabel(value: StoryboardDensityPreset): string {
  if (value === "grid_3x3") return "九宫格探索";
  if (value === "grid_2x2") return "四宫格探索";
  return "单张确认";
}

function referenceRouteLabel(value: ReferenceRoutePreset): string {
  if (value === "first_last_frame") return "首尾帧";
  if (value === "first_frame") return "首帧";
  if (value === "mixed_refs") return "Mixed Refs";
  return "自动路线";
}

export function ProSettingsPanel({
  active = true,
  memoryUser,
  config,
  capabilitySkills = [],
  capabilityMcps = [],
  onApply,
  onClose,
  layout = "inline",
}: ProSettingsPanelProps) {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState("atelier");
  const [draftMemoryUser, setDraftMemoryUser] = useState(memoryUser);
  const [draftConfig, setDraftConfig] = useState<VideoProConfig>(config);
  const [atelier, setAtelier] = useState<AtelierBlueprintState>(() => buildAtelierBlueprintFromConfig(config));
  const [isClearingMemory, setIsClearingMemory] = useState(false);
  const [memorySummary, setMemorySummary] = useState<MemoryRecommendations | null>(null);
  const [pathSummary, setPathSummary] = useState<WorkflowPathRecommendationsResult | null>(null);
  const [isLoadingMemory, setIsLoadingMemory] = useState(false);
  const [isLoadingPaths, setIsLoadingPaths] = useState(false);

  useEffect(() => {
    if (!active) return;
    setActiveTab("atelier");
    setDraftMemoryUser(memoryUser);
    setDraftConfig(config);
    setAtelier(buildAtelierBlueprintFromConfig(config));
  }, [active, config, memoryUser]);

  const pathSignals = useMemo(
    () => derivePathSignals(draftConfig),
    [draftConfig],
  );

  useEffect(() => {
    if (!active) return;
    const nextMemoryUser = draftMemoryUser.trim().length > 0 ? draftMemoryUser.trim() : "default";
    let cancelled = false;

    const loadMemory = async () => {
      setIsLoadingMemory(true);
      try {
        const data = await fetchJson<MemoryRecommendations>(
          `/api/video/memory/recommendations?memoryUser=${encodeURIComponent(nextMemoryUser)}`,
        );
        if (!cancelled) setMemorySummary(data);
      } catch {
        if (!cancelled) setMemorySummary(null);
      } finally {
        if (!cancelled) setIsLoadingMemory(false);
      }
    };

    const loadPaths = async () => {
      setIsLoadingPaths(true);
      try {
        const params = new URLSearchParams({ memoryUser: nextMemoryUser });
        if (pathSignals.goal) params.set("goal", pathSignals.goal);
        if (pathSignals.storyboardDensity) params.set("storyboardDensity", pathSignals.storyboardDensity);
        if (pathSignals.hasImageReference) params.set("hasImageReference", "true");
        if (pathSignals.hasReferenceVideo) params.set("hasReferenceVideo", "true");
        if (pathSignals.hasFirstFrameReference) params.set("hasFirstFrameReference", "true");
        if (pathSignals.hasLastFrameReference) params.set("hasLastFrameReference", "true");
        if (pathSignals.wantsMultiClip) params.set("wantsMultiClip", "true");
        if (pathSignals.prefersCharacterPriority) params.set("prefersCharacterPriority", "true");
        if (pathSignals.prefersEmptyShotPriority) params.set("prefersEmptyShotPriority", "true");
        const data = await fetchJson<WorkflowPathRecommendationsResult>(
          `/api/video/memory/path-recommendations?${params.toString()}`,
        );
        if (!cancelled) setPathSummary(data);
      } catch {
        if (!cancelled) setPathSummary(null);
      } finally {
        if (!cancelled) setIsLoadingPaths(false);
      }
    };

    void loadMemory();
    void loadPaths();

    return () => {
      cancelled = true;
    };
  }, [
    active,
    draftMemoryUser,
    pathSignals.goal,
    pathSignals.hasFirstFrameReference,
    pathSignals.hasImageReference,
    pathSignals.hasLastFrameReference,
    pathSignals.hasReferenceVideo,
    pathSignals.prefersCharacterPriority,
    pathSignals.prefersEmptyShotPriority,
    pathSignals.storyboardDensity,
    pathSignals.wantsMultiClip,
  ]);

  const handleApply = () => {
    const nextMemoryUser = draftMemoryUser.trim().length > 0 ? draftMemoryUser.trim() : "default";
    onApply({
      memoryUser: nextMemoryUser,
      config: {
        ...draftConfig,
        customKnowledge: draftConfig.customKnowledge.trim(),
        workflowTemplate: draftConfig.workflowTemplate.trim(),
      },
    });
    void message.success("专业模式配置已更新");
    onClose?.();
  };

  const handleClearMemory = async () => {
    const target = draftMemoryUser.trim().length > 0 ? draftMemoryUser.trim() : "default";
    setIsClearingMemory(true);
    try {
      await fetchJson("/api/video/memory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryUser: target }),
      });
      setMemorySummary(null);
      setPathSummary(null);
      void message.success(`已清理记忆：${target}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "清理失败";
      void message.error(msg);
    } finally {
      setIsClearingMemory(false);
    }
  };

  const applyTemplatePreset = (preset: TemplatePreset) => {
    setDraftConfig((prev) => ({
      ...prev,
      workflowTemplate: prev.workflowTemplate.trim().length > 0
        ? `${prev.workflowTemplate.trim()}\n${preset.content}`
        : preset.content,
    }));
  };

  const applyStrategyPreset = (preset: StrategyPreset) => {
    setAtelier((prev) => ({
      ...prev,
      ...preset.blueprint,
    }));
    setDraftConfig((prev) => ({
      ...prev,
      checkpointAlignmentRequired: preset.blueprint.checkpointAlignmentRequired ?? prev.checkpointAlignmentRequired,
      enableSelfReview: preset.blueprint.enableSelfReview ?? prev.enableSelfReview,
    }));
    void message.success(`已切到策略：${preset.title}`);
  };

  const applyAtelierTemplate = (mode: "replace" | "append") => {
    const workflowText = buildAtelierWorkflowText(atelier);
    setDraftConfig((prev) => ({
      ...prev,
      workflowTemplate: mode === "replace"
        ? workflowText
        : [prev.workflowTemplate.trim(), workflowText].filter((item) => item.length > 0).join("\n"),
      checkpointAlignmentRequired: atelier.checkpointAlignmentRequired,
      enableSelfReview: atelier.enableSelfReview,
    }));
    void message.success(mode === "replace" ? "策略蓝图已写入模板" : "策略蓝图已叠加到模板");
  };

  const applyAtelierKnowledge = () => {
    const knowledgeText = buildAtelierKnowledgeText(atelier);
    setDraftConfig((prev) => ({
      ...prev,
      customKnowledge: [prev.customKnowledge.trim(), knowledgeText].filter((item) => item.length > 0).join("\n"),
      checkpointAlignmentRequired: atelier.checkpointAlignmentRequired,
      enableSelfReview: atelier.enableSelfReview,
    }));
    void message.success("策略偏好已叠加到长期知识层");
  };

  const applyRecommendedPathSnippet = (pathId: string) => {
    const snippet = workflowSnippetForPath(pathId);
    setDraftConfig((prev) => ({
      ...prev,
      workflowTemplate: [prev.workflowTemplate.trim(), snippet].filter((item) => item.length > 0).join("\n"),
    }));
    void message.success("推荐路径已叠加到模板");
  };

  const strategySummary = (
    <div className="flex flex-wrap gap-2">
      <Tag color="blue">{storyboardDensityLabel(atelier.storyboardDensity)}</Tag>
      <Tag color="gold">{referenceRouteLabel(atelier.referenceRoute)}</Tag>
      {atelier.characterPriority ? <Tag>角色优先</Tag> : null}
      {atelier.emptyShotPriority ? <Tag>空镜优先</Tag> : null}
      {atelier.dialogueFirst ? <Tag>对白优先</Tag> : null}
      {atelier.multiClip ? <Tag>多候选粗剪</Tag> : null}
      {atelier.checkpointAlignmentRequired ? <Tag color="green">Checkpoint</Tag> : <Tag>直接推进</Tag>}
      {atelier.enableSelfReview ? <Tag color="purple">阶段性评审</Tag> : null}
    </div>
  );

  const tabs = (
    <Tabs
      size="small"
      activeKey={activeTab}
      onChange={setActiveTab}
      items={[
        {
          key: "atelier",
          label: "Strategy",
          children: (
            <div className="space-y-3">
              <div className="rounded-[18px] border border-[rgba(229,221,210,0.92)] bg-[rgba(255,253,249,0.74)] px-4 py-3 text-[12px] text-[var(--af-muted)]">
                先把这一轮策略定清：探索密度、参考路线和 review gate 在这里一次收口。
              </div>
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>Quick Setups</Typography.Text>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {STRATEGY_PRESETS.map((preset) => (
                    <div key={preset.id} className="rounded-[16px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] px-3 py-3">
                      <Typography.Text strong>{preset.title}</Typography.Text>
                      <Typography.Paragraph style={{ margin: "8px 0 12px", fontSize: 12, color: "var(--af-muted)" }}>
                        {preset.summary}
                      </Typography.Paragraph>
                      <Button size="small" onClick={() => applyStrategyPreset(preset)}>
                        应用策略
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>Storyboard Density</Typography.Text>
                <div className="mt-2">
                  <Segmented<StoryboardDensityPreset>
                    block
                    value={atelier.storyboardDensity}
                    onChange={(value) => setAtelier((prev) => ({ ...prev, storyboardDensity: value }))}
                    options={[
                      { label: "单张", value: "single" },
                      { label: "四宫格", value: "grid_2x2" },
                      { label: "九宫格", value: "grid_3x3" },
                    ]}
                  />
                </div>
              </Card>

              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>Reference Route</Typography.Text>
                <Select<ReferenceRoutePreset>
                  className="mt-2"
                  value={atelier.referenceRoute}
                  onChange={(value) => setAtelier((prev) => ({ ...prev, referenceRoute: value }))}
                  options={[
                    { value: "auto", label: "自动决策" },
                    { value: "first_frame", label: "首帧图生视频" },
                    { value: "first_last_frame", label: "首尾帧（起止都明确）" },
                    { value: "mixed_refs", label: "mixed refs" },
                  ]}
                />
                <Typography.Paragraph style={{ marginTop: 10, marginBottom: 0, fontSize: 12, color: "var(--af-muted)" }}>
                  这里定义的是默认倾向，不是死规则。真正执行时仍允许 Agent 根据素材缺口做 review 和切路。
                </Typography.Paragraph>
              </Card>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Card size="small" className="!rounded-[18px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Typography.Text strong>角色优先</Typography.Text>
                      <Switch
                        checked={atelier.characterPriority}
                        onChange={(checked) => setAtelier((prev) => ({ ...prev, characterPriority: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Typography.Text strong>空镜优先</Typography.Text>
                      <Switch
                        checked={atelier.emptyShotPriority}
                        onChange={(checked) => setAtelier((prev) => ({ ...prev, emptyShotPriority: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Typography.Text strong>先对白</Typography.Text>
                      <Switch
                        checked={atelier.dialogueFirst}
                        onChange={(checked) => setAtelier((prev) => ({ ...prev, dialogueFirst: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Typography.Text strong>多候选粗剪</Typography.Text>
                      <Switch
                        checked={atelier.multiClip}
                        onChange={(checked) => setAtelier((prev) => ({ ...prev, multiClip: checked }))}
                      />
                    </div>
                  </div>
                </Card>

                <Card size="small" className="!rounded-[18px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Typography.Text strong>Checkpoint 首轮对齐</Typography.Text>
                        <div className="mt-1 text-[12px] text-[var(--af-muted)]">
                          先确认画风、目标和工作流，再进入关键生成。
                        </div>
                      </div>
                      <Switch
                        checked={atelier.checkpointAlignmentRequired}
                        onChange={(checked) => setAtelier((prev) => ({ ...prev, checkpointAlignmentRequired: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Typography.Text strong>阶段性自评审</Typography.Text>
                        <div className="mt-1 text-[12px] text-[var(--af-muted)]">
                          关键阶段后判断是否要换路径、补素材或补对白。
                        </div>
                      </div>
                      <Switch
                        checked={atelier.enableSelfReview}
                        onChange={(checked) => setAtelier((prev) => ({ ...prev, enableSelfReview: checked }))}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <Card size="small" className="!rounded-[18px]">
                <div className="flex items-center justify-between gap-3">
                  <Typography.Text strong>Strategy Preview</Typography.Text>
                  <Tag color="processing" style={{ margin: 0 }}>Prompt-ready</Tag>
                </div>
                <pre className="mt-3 overflow-auto rounded-[16px] border border-[rgba(229,221,210,0.92)] bg-[rgba(255,253,249,0.78)] px-3 py-3 text-[11px] leading-relaxed text-[var(--af-text)]">
                  {buildAtelierWorkflowText(atelier)}
                </pre>
              </Card>

              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>根据当前信号推荐的路径</Typography.Text>
                {isLoadingPaths ? (
                  <div className="flex items-center justify-center py-6"><Spin size="small" /></div>
                ) : !pathSummary || pathSummary.recommendations.length === 0 ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无推荐路径" />
                ) : (
                  <div className="mt-3 space-y-2">
                    {pathSummary.recommendations.slice(0, 4).map((item) => (
                      <div key={item.pathId} className="rounded-[16px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <Typography.Text strong>{item.title}</Typography.Text>
                            <div className="mt-1 text-[12px] text-[var(--af-muted)]">{item.why.join("；")}</div>
                          </div>
                          <Button size="small" onClick={() => applyRecommendedPathSnippet(item.pathId)}>
                            写入模板
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ),
        },
        {
          key: "templates",
          label: "Workflow",
          children: (
            <div className="space-y-3">
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>默认工作流模板</Typography.Text>
                <Input.TextArea
                  className="mt-2"
                  autoSize={{ minRows: 8, maxRows: 16 }}
                  value={draftConfig.workflowTemplate}
                  onChange={(event) => setDraftConfig((prev) => ({ ...prev, workflowTemplate: event.target.value }))}
                  placeholder="例如：先四宫格分镜，再角色立绘，再首帧视频验证动作，稳定后进入多候选粗剪。"
                />
              </Card>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {TEMPLATE_PRESETS.map((preset) => (
                  <Card key={preset.id} size="small" className="!rounded-[18px]">
                    <Typography.Text strong>{preset.title}</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 8, marginBottom: 12, fontSize: 12, color: "var(--af-muted)" }}>
                      {preset.summary}
                    </Typography.Paragraph>
                    <Button size="small" onClick={() => applyTemplatePreset(preset)}>
                      叠加到模板
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ),
        },
        {
          key: "knowledge",
          label: "Knowledge",
          children: (
            <div className="space-y-3">
              <Alert
                showIcon
                type="info"
                title="这里定义的是长期知识叠层，不是单轮 prompt。适合写审美边界、禁忌和习惯。"
              />
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>长期知识补充</Typography.Text>
                <Input.TextArea
                  className="mt-2"
                  autoSize={{ minRows: 8, maxRows: 16 }}
                  value={draftConfig.customKnowledge}
                  onChange={(event) => setDraftConfig((prev) => ({ ...prev, customKnowledge: event.target.value }))}
                  placeholder="例如：更偏奶油暖调，不要廉价广告感；遇到叙事镜头时优先补空镜和呼吸镜头；角色镜头不要过多机位抖动。"
                />
              </Card>
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>知识写法建议</Typography.Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Tag>写偏好，而不是写命令口号</Tag>
                  <Tag>写禁忌，例如不要过曝、不要廉价字幕感</Tag>
                  <Tag>写镜头语言，例如先空镜再角色</Tag>
                  <Tag>写素材策略，例如不足时先补分镜</Tag>
                </div>
              </Card>
            </div>
          ),
        },
        {
          key: "memory",
          label: "Memory",
          children: (
            <div className="space-y-3">
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>Memory User</Typography.Text>
                <Input
                  className="mt-2"
                  value={draftMemoryUser}
                  onChange={(event) => setDraftMemoryUser(event.target.value)}
                  placeholder="default"
                />
                <div className="mt-3 flex items-center gap-2">
                  <Button danger loading={isClearingMemory} onClick={() => void handleClearMemory()}>
                    清理该记忆用户
                  </Button>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    用不同 memory user 隔离不同审美或项目流派。
                  </Typography.Text>
                </div>
              </Card>
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>偏好摘要</Typography.Text>
                {isLoadingMemory ? (
                  <div className="flex items-center justify-center py-6"><Spin size="small" /></div>
                ) : !memorySummary ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无记忆摘要" />
                ) : (
                  <div className="mt-3 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Tag color="green">偏好条目 {memorySummary.totalPreferenceItems}</Tag>
                      {memorySummary.preferredProviders.map((provider) => (
                        <Tag key={provider}>{provider}</Tag>
                      ))}
                      {memorySummary.preferredModelIds.map((modelId) => (
                        <Tag key={modelId} color="blue">{modelId}</Tag>
                      ))}
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>Style Tokens</Typography.Text>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {memorySummary.preferredStyleTokens.length > 0 ? (
                          memorySummary.preferredStyleTokens.map((token) => <Tag key={token}>{token}</Tag>)
                        ) : (
                          <Tag>暂无</Tag>
                        )}
                      </div>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>Workflow Paths</Typography.Text>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {memorySummary.preferredWorkflowPaths.length > 0 ? (
                          memorySummary.preferredWorkflowPaths.map((pathId) => <Tag key={pathId}>{pathId}</Tag>)
                        ) : (
                          <Tag>暂无</Tag>
                        )}
                        {memorySummary.rejectedWorkflowPaths.map((pathId) => (
                          <Tag key={`reject-${pathId}`} color="red">{pathId}</Tag>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>Editing / Camera</Typography.Text>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {memorySummary.preferredEditingHints.map((hint) => (
                          <Tag key={`edit-${hint}`} color="geekblue">{hint}</Tag>
                        ))}
                        {memorySummary.preferredCameraHints.map((hint) => (
                          <Tag key={`camera-${hint}`} color="gold">{hint}</Tag>
                        ))}
                        {memorySummary.preferredEditingHints.length === 0 && memorySummary.preferredCameraHints.length === 0 && (
                          <Tag>暂无</Tag>
                        )}
                      </div>
                    </div>
                    {memorySummary.positivePromptHint && (
                      <div className="rounded-[16px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] px-3 py-2 text-[12px] text-[var(--af-text)]">
                        正向偏好：{memorySummary.positivePromptHint}
                      </div>
                    )}
                    {memorySummary.negativePromptHint && (
                      <div className="rounded-[16px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] px-3 py-2 text-[12px] text-[var(--af-text)]">
                        负向禁忌：{memorySummary.negativePromptHint}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          ),
        },
        {
          key: "capabilities",
          label: "Capabilities",
          children: (
            <div className="space-y-3">
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>已绑定 MCP 叠层</Typography.Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  {capabilityMcps.length > 0 ? (
                    capabilityMcps.map((name) => <Tag key={name} color="blue">{name}</Tag>)
                  ) : (
                    <Tag>暂无</Tag>
                  )}
                </div>
              </Card>
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>已绑定 Skills 叠层</Typography.Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  {capabilitySkills.length > 0 ? (
                    capabilitySkills.map((name) => <Tag key={name} color="green">{name}</Tag>)
                  ) : (
                    <Tag>暂无</Tag>
                  )}
                </div>
              </Card>
              <Card size="small" className="!rounded-[18px]">
                <Typography.Text strong>运行时上下文层</Typography.Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["model_pack", "domain_pack", "project_canon", "asset_roles", "user_memory", "workflow_graph", "hidden_ops"].map((layer) => (
                    <Tag key={layer}>{layer}</Tag>
                  ))}
                </div>
                <Typography.Paragraph style={{ marginTop: 12, marginBottom: 0, fontSize: 12, color: "var(--af-muted)" }}>
                  这里展示的是系统能力叠层，不允许直接改源码，但会随着知识、模板和记忆配置动态参与 Prompt Compiler。
                </Typography.Paragraph>
              </Card>
            </div>
          ),
        },
      ]}
    />
  );

  const topBar = (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-[20px] border border-[rgba(229,221,210,0.92)] bg-[rgba(255,253,249,0.78)] px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--af-muted)]">当前策略</div>
        <div className="mt-2">{strategySummary}</div>
      </div>
      <Space size={8}>
        <Button size="small" onClick={() => applyAtelierTemplate("append")}>
          叠加到模板
        </Button>
        <Button size="small" onClick={applyAtelierKnowledge}>
          写入知识
        </Button>
        {onClose ? <Button size="small" onClick={onClose}>收起</Button> : null}
        <Button size="small" type="primary" onClick={handleApply}>保存专业模式</Button>
      </Space>
    </div>
  );

  if (layout === "drawer") {
    return (
      <div className="space-y-4">
        {topBar}
        {tabs}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topBar}
      {tabs}
    </div>
  );
}
