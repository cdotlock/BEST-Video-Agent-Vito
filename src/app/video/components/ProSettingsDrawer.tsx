"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Drawer,
  Empty,
  Input,
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

export interface ProSettingsDrawerProps {
  open: boolean;
  memoryUser: string;
  config: VideoProConfig;
  capabilitySkills?: string[];
  capabilityMcps?: string[];
  onClose: () => void;
  onApply: (next: { memoryUser: string; config: VideoProConfig }) => void;
}

interface TemplatePreset {
  id: string;
  title: string;
  summary: string;
  content: string;
}

const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "storyboard_grid_first",
    title: "分镜优先",
    summary: "先四宫格/九宫格探索，再生成视频，最后多候选粗剪。",
    content: "先用四宫格或九宫格分镜探索镜头密度，再补角色立绘与空镜，随后优先首尾帧视频和 mixed refs，多候选收敛后进入粗剪。",
  },
  {
    id: "first_last_frame",
    title: "首尾帧优先",
    summary: "适合镜头清楚、运动明确的短片段。",
    content: "当镜头运动方向和起止状态明确时，优先走 first_last_frame；若镜头不稳定，先补 storyboard_ref 或 motion_ref 再生成。",
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
  };
}

export function ProSettingsDrawer({
  open,
  memoryUser,
  config,
  capabilitySkills = [],
  capabilityMcps = [],
  onClose,
  onApply,
}: ProSettingsDrawerProps) {
  const { message } = App.useApp();
  const [draftMemoryUser, setDraftMemoryUser] = useState(memoryUser);
  const [draftConfig, setDraftConfig] = useState<VideoProConfig>(config);
  const [isClearingMemory, setIsClearingMemory] = useState(false);
  const [memorySummary, setMemorySummary] = useState<MemoryRecommendations | null>(null);
  const [pathSummary, setPathSummary] = useState<WorkflowPathRecommendationsResult | null>(null);
  const [isLoadingMemory, setIsLoadingMemory] = useState(false);
  const [isLoadingPaths, setIsLoadingPaths] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraftMemoryUser(memoryUser);
    setDraftConfig(config);
  }, [config, memoryUser, open]);

  const pathSignals = useMemo(
    () => derivePathSignals(draftConfig),
    [draftConfig],
  );

  useEffect(() => {
    if (!open) return;
    const nextMemoryUser = draftMemoryUser.trim().length > 0 ? draftMemoryUser.trim() : "default";
    let cancelled = false;

    const loadMemory = async () => {
      setIsLoadingMemory(true);
      try {
        const data = await fetchJson<MemoryRecommendations>(
          `/api/video/memory/recommendations?memoryUser=${encodeURIComponent(nextMemoryUser)}`,
        );
        if (!cancelled) {
          setMemorySummary(data);
        }
      } catch {
        if (!cancelled) {
          setMemorySummary(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMemory(false);
        }
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
        if (!cancelled) {
          setPathSummary(data);
        }
      } catch {
        if (!cancelled) {
          setPathSummary(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPaths(false);
        }
      }
    };

    void loadMemory();
    void loadPaths();

    return () => {
      cancelled = true;
    };
  }, [
    draftMemoryUser,
    open,
    pathSignals.goal,
    pathSignals.hasImageReference,
    pathSignals.hasReferenceVideo,
    pathSignals.hasFirstFrameReference,
    pathSignals.hasLastFrameReference,
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
    void message.success("Pro 配置已更新");
    onClose();
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

  return (
    <Drawer
      title="Pro 配置叠层"
      size={720}
      open={open}
      onClose={onClose}
      extra={(
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleApply}>保存</Button>
        </Space>
      )}
    >
      <Tabs
        size="small"
        items={[
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
            key: "templates",
            label: "Templates",
            children: (
              <div className="space-y-3">
                <Card size="small" className="!rounded-[18px]">
                  <Typography.Text strong>默认工作流模板</Typography.Text>
                  <Input.TextArea
                    className="mt-2"
                    autoSize={{ minRows: 8, maxRows: 16 }}
                    value={draftConfig.workflowTemplate}
                    onChange={(event) => setDraftConfig((prev) => ({ ...prev, workflowTemplate: event.target.value }))}
                    placeholder="例如：先四宫格分镜，再角色立绘，再首尾帧视频，多候选后粗剪。"
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

                <Card size="small" className="!rounded-[18px]">
                  <Typography.Text strong>路径推荐</Typography.Text>
                  {isLoadingPaths ? (
                    <div className="flex items-center justify-center py-6"><Spin size="small" /></div>
                  ) : !pathSummary || pathSummary.recommendations.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无路径推荐" />
                  ) : (
                    <div className="mt-3 space-y-2">
                      {pathSummary.recommendations.slice(0, 3).map((item) => (
                        <div key={item.pathId} className="rounded-[16px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] px-3 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <Typography.Text strong>{item.title}</Typography.Text>
                            <Tag color="blue">{item.score.toFixed(2)}</Tag>
                          </div>
                          <div className="mt-1 text-[12px] text-[var(--af-muted)]">
                            {item.why.join("；")}
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
            key: "review",
            label: "Review",
            children: (
              <div className="space-y-3">
                <Card size="small" className="!rounded-[18px]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Typography.Text strong>Checkpoint 首轮对齐</Typography.Text>
                      <div className="mt-1 text-[12px] text-[var(--af-muted)]">
                        先确认画风、工作流、分镜密度和最终交付目标，再正式执行。
                      </div>
                    </div>
                    <Switch
                      checked={draftConfig.checkpointAlignmentRequired}
                      onChange={(checked) => setDraftConfig((prev) => ({ ...prev, checkpointAlignmentRequired: checked }))}
                    />
                  </div>
                </Card>
                <Card size="small" className="!rounded-[18px]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Typography.Text strong>阶段性自评审</Typography.Text>
                      <div className="mt-1 text-[12px] text-[var(--af-muted)]">
                        关键阶段后让 Agent 自查是否要换路径、补素材、补台词或提高分镜密度。
                      </div>
                    </div>
                    <Switch
                      checked={draftConfig.enableSelfReview}
                      onChange={(checked) => setDraftConfig((prev) => ({ ...prev, enableSelfReview: checked }))}
                    />
                  </div>
                </Card>
                <Alert
                  showIcon
                  type="warning"
                  title="Review 不是让 Agent 更慢，而是让它在关键节点更少返工。"
                />
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
    </Drawer>
  );
}
