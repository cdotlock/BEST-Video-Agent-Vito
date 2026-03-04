"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  App,
  Breadcrumb,
  Button,
  Card,
  Collapse,
  ConfigProvider,
  Drawer,
  Grid,
  Input,
  Progress,
  Segmented,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { fetchJson } from "@/app/components/client-utils";
import { useSessions } from "@/app/components/hooks/useSessions";
import { useVideoData } from "../hooks/useVideoData";
import { EpisodeList } from "../components/EpisodeList";
import { ResourcePanel } from "../components/ResourcePanel";
import { VideoChat } from "../components/VideoChat";
import { StyleInitPanel } from "../components/StyleInitPanel";
import type {
  VideoContext,
  ExecutionMode,
  WorkspaceView,
  VideoTimelineEvent,
  MemoryRecommendations,
  WorkflowPathRecommendation,
  WorkflowPathRecommendationsResult,
} from "../types";
import { videoWorkspaceTheme } from "../theme";

const DEFAULT_SKILLS = ["video-mgr", "style-search", "video-memory"];
const DEFAULT_MCPS = ["video_mgr", "style_search", "video_memory"];
const MEMORY_USER_STORAGE_KEY = "agentForge.user";
const DEFAULT_AUTO_SEQUENCE_KEY = "PLAN1";

type CheckpointPlanStatus = "none" | "draft" | "approved";

interface AgentPlanState {
  title: string | null;
  items: string[];
  raw: string | null;
  updatedAt: string | null;
}

const EMPTY_AGENT_PLAN: AgentPlanState = {
  title: null,
  items: [],
  raw: null,
  updatedAt: null,
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || target.isContentEditable;
}

function planStatusTag(status: CheckpointPlanStatus, mode: ExecutionMode): { color: string; text: string } {
  if (mode === "yolo") return { color: "volcano", text: "自动执行" };
  if (status === "approved") return { color: "green", text: "已确认" };
  if (status === "draft") return { color: "gold", text: "待确认" };
  return { color: "default", text: "待生成" };
}

function formatPlanKey(sequenceKey: string): string {
  return sequenceKey.replace(/^SQ/i, "PLAN");
}

function timelineEventLabel(event: VideoTimelineEvent): string {
  switch (event.type) {
    case "tool_start":
      return `开始：${event.name ?? "unknown"}`;
    case "tool_end":
      return event.error
        ? `失败：${event.name ?? "unknown"}`
        : `完成：${event.name ?? "unknown"}`;
    case "stream_end":
      return event.error === "stopped_by_user" ? "已手动停止" : "本轮执行结束";
    case "error":
      return `错误：${event.error ?? "unknown"}`;
  }
}

export default function VideoWorkflowPage() {
  const { message } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isDesktop = !!screens.lg;
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const projectId = params.projectId;
  const projectName = searchParams.get("name") ?? projectId;
  const initialIdeaMessage = searchParams.get("idea")?.trim();

  const data = useVideoData(projectId);
  const fallbackSequenceKey = data.selectedSequence?.sequenceKey ?? data.sequences[0]?.sequenceKey ?? "_";

  const userName = `video:${projectId}:${fallbackSequenceKey}`;

  const sessionsHook = useSessions(userName, () => {}, () => {});
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [chatKey, setChatKey] = useState(() => crypto.randomUUID());
  const [autoMessage, setAutoMessage] = useState<string | undefined>(
    initialIdeaMessage && initialIdeaMessage.length > 0 ? initialIdeaMessage : undefined,
  );
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("checkpoint");
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("chat");
  const [injectedMessage, setInjectedMessage] = useState<{ id: string; text: string } | null>(null);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [proDrawerOpen, setProDrawerOpen] = useState(false);
  const [proGoal, setProGoal] = useState("");
  const [styleInitOpenSignal, setStyleInitOpenSignal] = useState<number | undefined>(undefined);
  const [memoryUser, setMemoryUser] = useState(() => {
    if (typeof window === "undefined") return "default";
    const stored = window.localStorage.getItem(MEMORY_USER_STORAGE_KEY);
    return stored && stored.trim().length > 0 ? stored.trim() : "default";
  });
  const [memoryRecommendations, setMemoryRecommendations] = useState<MemoryRecommendations | null>(null);
  const [pathRecommendations, setPathRecommendations] = useState<WorkflowPathRecommendation[]>([]);
  const [isLoadingProData, setIsLoadingProData] = useState(false);
  const [isClearingMemory, setIsClearingMemory] = useState(false);
  const [isReviewingPath, setIsReviewingPath] = useState(false);

  const [timelineEvents, setTimelineEvents] = useState<VideoTimelineEvent[]>([]);
  const [checkpointPlanStatus, setCheckpointPlanStatus] = useState<CheckpointPlanStatus>("none");
  const [agentPlan, setAgentPlan] = useState<AgentPlanState>(EMPTY_AGENT_PLAN);

  const resetAgentPlan = useCallback(() => {
    setTimelineEvents([]);
    setCheckpointPlanStatus("none");
    setAgentPlan(EMPTY_AGENT_PLAN);
  }, []);

  const switchSession = useCallback((sessionId?: string) => {
    setCurrentSessionId(sessionId);
    setChatKey(crypto.randomUUID());
    resetAgentPlan();
  }, [resetAgentPlan]);

  const handleNewSession = useCallback(() => {
    switchSession(undefined);
  }, [switchSession]);

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      await sessionsHook.deleteSession(sessionId);
      if (currentSessionId === sessionId) switchSession(undefined);
    },
    [sessionsHook, currentSessionId, switchSession],
  );

  const videoContext: VideoContext | null = useMemo(() => {
    if (!data.selectedSequence) return null;
    return {
      projectId,
      sequenceKey: data.selectedSequence.sequenceKey,
    };
  }, [projectId, data.selectedSequence]);

  const ensureVideoContext = useCallback(async (): Promise<VideoContext | null> => {
    if (data.selectedSequence) {
      return {
        projectId,
        sequenceKey: data.selectedSequence.sequenceKey,
      };
    }

    const firstSequence = data.sequences[0];
    if (firstSequence) {
      data.selectSequence(firstSequence);
      return {
        projectId,
        sequenceKey: firstSequence.sequenceKey,
      };
    }

    await data.uploadSequence(DEFAULT_AUTO_SEQUENCE_KEY, "默认计划", null);
    const refreshed = await data.refreshSequences();
    const created = refreshed.find((seq) => seq.sequenceKey === DEFAULT_AUTO_SEQUENCE_KEY) ?? refreshed[0];
    if (!created) {
      void message.error("自动初始化计划失败，请稍后重试。");
      return null;
    }
    data.selectSequence(created);
    return {
      projectId,
      sequenceKey: created.sequenceKey,
    };
  }, [data, message, projectId]);

  const modeDescription = executionMode === "yolo"
    ? "YOLO: 先出计划再自动执行，不做中间确认"
    : "Checkpoint: 先出计划，确认后再执行";

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MEMORY_USER_STORAGE_KEY, memoryUser);
  }, [memoryUser]);

  useEffect(() => {
    if (data.selectedSequence) return;
    const firstSequence = data.sequences[0];
    if (!firstSequence) return;
    data.selectSequence(firstSequence);
  }, [data]);

  const handleExecutionModeChange = useCallback((nextMode: ExecutionMode) => {
    setExecutionMode(nextMode);
    if (nextMode === "yolo") {
      setCheckpointPlanStatus((prev) => (prev === "draft" ? "approved" : prev));
      return;
    }
    setCheckpointPlanStatus((prev) => (prev === "approved" ? prev : "none"));
  }, []);

  const handleTimelineEventsChange = useCallback((events: VideoTimelineEvent[]) => {
    setTimelineEvents(events);
    const latest = events[events.length - 1];
    if (!latest || latest.type !== "stream_end") return;
    if (checkpointPlanStatus === "approved") {
      setCheckpointPlanStatus("none");
    }
  }, [checkpointPlanStatus]);

  const openStyleInit = useCallback(async () => {
    const context = await ensureVideoContext();
    if (!context) return;
    setStyleInitOpenSignal((prev) => (prev ?? 0) + 1);
  }, [ensureVideoContext]);

  const handleSelectSequence = useCallback(
    (seq: typeof data.sequences[number]) => {
      data.selectSequence(seq);
      setCurrentSessionId(undefined);
      setAutoMessage(undefined);
      setInjectedMessage(null);
      setChatKey(crypto.randomUUID());
      setLeftDrawerOpen(false);
      resetAgentPlan();
    },
    [data, resetAgentPlan],
  );

  const handleUpload = useCallback(
    async (sequenceKey: string, sequenceName: string | null, content: string | null) => {
      await data.uploadSequence(sequenceKey, sequenceName, content);
      const refreshed = await data.refreshSequences();
      const newSeq = refreshed.find((seq) => seq.sequenceKey === sequenceKey);
      if (newSeq) {
        data.selectSequence(newSeq);
        setCurrentSessionId(undefined);
        setInjectedMessage(null);
        setAutoMessage(undefined);
        setChatKey(crypto.randomUUID());
        resetAgentPlan();
      }
    },
    [data, resetAgentPlan],
  );

  const handleSessionCreated = useCallback(
    (sessionId: string) => {
      setCurrentSessionId(sessionId);
      setAutoMessage(undefined);
      void sessionsHook.refreshSessions();
    },
    [sessionsHook],
  );

  const handleRefreshNeeded = useCallback(() => {
    void data.refreshAll();
    void sessionsHook.refreshSessions();
  }, [data, sessionsHook]);

  const loadProData = useCallback(async () => {
    setIsLoadingProData(true);
    try {
      const [memory, paths] = await Promise.all([
        fetchJson<MemoryRecommendations>(
          `/api/video/memory/recommendations?memoryUser=${encodeURIComponent(memoryUser)}`,
        ),
        fetchJson<WorkflowPathRecommendationsResult>(
          `/api/video/memory/path-recommendations?memoryUser=${encodeURIComponent(memoryUser)}&goal=${encodeURIComponent(proGoal.trim())}`,
        ),
      ]);
      setMemoryRecommendations(memory);
      setPathRecommendations(paths.recommendations);
    } catch {
      void message.error("读取 Pro 数据失败。");
    } finally {
      setIsLoadingProData(false);
    }
  }, [memoryUser, message, proGoal]);

  useEffect(() => {
    if (!proDrawerOpen) return;
    void loadProData();
  }, [loadProData, proDrawerOpen]);

  const handleClearMemory = useCallback(async () => {
    setIsClearingMemory(true);
    try {
      await fetchJson("/api/video/memory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryUser }),
      });
      void message.success("已清空该用户长期记忆。");
      await loadProData();
    } catch {
      void message.error("清空记忆失败。");
    } finally {
      setIsClearingMemory(false);
    }
  }, [loadProData, memoryUser, message]);

  const handleApplyPath = useCallback(async (path: WorkflowPathRecommendation) => {
    if (!data.selectedSequence) {
      void message.warning("请先进入一个计划再应用工作流。");
      return;
    }
    setIsReviewingPath(true);
    try {
      await fetchJson("/api/video/memory/path-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memoryUser,
          projectId,
          sequenceKey: data.selectedSequence.sequenceKey,
          pathId: path.pathId,
          score: 1,
          note: "adopted_from_pro_mode",
        }),
      });
      setInjectedMessage({
        id: crypto.randomUUID(),
        text: [
        `请采用工作流：${path.pathId}（${path.title}）`,
        "按以下步骤执行：",
        ...path.steps.map((step, index) => `${index + 1}. ${step}`),
        executionMode === "yolo" ? "请直接自动执行。" : "请先给我确认后再执行高成本步骤。",
      ].join("\n"),
      });
      setWorkspaceView("chat");
      void message.success("已应用工作流并注入对话。");
    } catch {
      void message.error("应用工作流失败。");
    } finally {
      setIsReviewingPath(false);
    }
  }, [data.selectedSequence, executionMode, memoryUser, message, projectId]);

  const handleInjectMessage = useCallback((text: string) => {
    setInjectedMessage({ id: crypto.randomUUID(), text });
    setWorkspaceView("chat");
  }, []);

  const handlePlanDetected = useCallback((plan: { title: string | null; items: string[]; raw: string }) => {
    setAgentPlan({
      title: plan.title,
      items: plan.items,
      raw: plan.raw,
      updatedAt: new Date().toISOString(),
    });
    if (executionMode === "checkpoint" && checkpointPlanStatus !== "approved") {
      setCheckpointPlanStatus("draft");
    }
  }, [checkpointPlanStatus, executionMode]);

  const confirmCheckpointPlan = useCallback(() => {
    if (executionMode !== "checkpoint") return;
    if (agentPlan.items.length === 0) {
      void message.warning("还没有可确认的计划。");
      return;
    }
    setCheckpointPlanStatus("approved");
    setInjectedMessage({
      id: crypto.randomUUID(),
      text: "计划已确认，请严格按计划从第1步开始执行；每个高成本步骤前先向我确认。",
    });
    setWorkspaceView("chat");
  }, [agentPlan.items.length, executionMode, message]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      if (event.key === "1") {
        event.preventDefault();
        setWorkspaceView("chat");
      } else if (event.key === "2") {
        event.preventDefault();
        setWorkspaceView("clip");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const episodeList = (
    <EpisodeList
      projectName={projectName}
      sequences={data.sequences}
      isLoading={data.isLoadingSequences}
      isUploading={data.isUploading}
      selectedSequence={data.selectedSequence}
      onSelectSequence={handleSelectSequence}
      onDeleteSequence={(seq) => {
        if (confirm(`Delete ${seq.sequenceKey}?`)) void data.deleteSequence(seq.id);
      }}
      onRefresh={() => void data.refreshSequences()}
      onUpload={(key, name, content) => void handleUpload(key, name, content)}
      sessions={sessionsHook.sessions}
      currentSessionId={currentSessionId}
      onSelectSession={switchSession}
      onNewSession={handleNewSession}
      onDeleteSession={(id) => void handleDeleteSession(id)}
      mode="sessions_only"
      embedded
    />
  );

  const planTag = planStatusTag(checkpointPlanStatus, executionMode);
  const latestEvent = timelineEvents[timelineEvents.length - 1] ?? null;
  const planMarkdown = useMemo(() => {
    if (agentPlan.raw && agentPlan.raw.trim().length > 0) return agentPlan.raw.trim();
    if (agentPlan.items.length === 0) return null;
    return agentPlan.items.map((item, index) => `${index + 1}. ${item}`).join("\n");
  }, [agentPlan.items, agentPlan.raw]);
  const completedSteps = useMemo(
    () => timelineEvents.filter((event) => event.type === "tool_end" && !event.error).length,
    [timelineEvents],
  );
  const totalSteps = agentPlan.items.length;
  const progressPercent = totalSteps > 0
    ? Math.round((Math.min(completedSteps, totalSteps) / totalSteps) * 100)
    : 0;

  const leftRail = (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-3">
        <Card size="small" styles={{ body: { padding: 10 } }}>
          <div className="mb-2 flex items-center justify-between">
            <Typography.Text strong style={{ fontSize: 12 }}>计划（MD）</Typography.Text>
            <Tag color={planTag.color} style={{ margin: 0 }}>{planTag.text}</Tag>
          </div>
          <Progress
            percent={progressPercent}
            size="small"
            status={checkpointPlanStatus === "draft" ? "active" : (planTag.color === "green" ? "success" : "normal")}
            format={() => `${Math.min(completedSteps, totalSteps)} / ${totalSteps || 0}`}
          />
          <Collapse
            size="small"
            className="mt-2"
            items={[
              {
                key: "plan-md",
                label: "展开查看计划",
                children: planMarkdown ? (
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed text-slate-700">
                    {planMarkdown}
                  </pre>
                ) : (
                  <div className="text-[11px] text-slate-500">输入一句话后，Agent 会先输出计划。</div>
                ),
              },
            ]}
          />
          {agentPlan.items.length > 0 && (
            <div className="mt-2 space-y-1">
              {agentPlan.items.slice(0, 8).map((item, index) => {
                const isDone = index < completedSteps;
                return (
                  <div key={`${item}-${index}`} className="flex items-start gap-1.5 text-[11px]">
                    <span className={`mt-[2px] inline-block h-2 w-2 rounded-full ${isDone ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <span className={isDone ? "text-slate-600 line-through" : "text-slate-700"}>{item}</span>
                  </div>
                );
              })}
            </div>
          )}
          {latestEvent && (
            <div className="mt-2 text-[10px] text-slate-500">
              最近进度：{latestEvent.name ?? latestEvent.type}
            </div>
          )}
          <div className="mt-2 flex items-center gap-2">
            {executionMode === "checkpoint" && checkpointPlanStatus === "draft" && (
              <Button size="small" type="primary" onClick={confirmCheckpointPlan}>确认计划</Button>
            )}
          </div>
        </Card>
      </div>

      <div className="border-b border-slate-200 p-3">
        <Card size="small" styles={{ body: { padding: 10 } }}>
          <div className="flex items-center justify-between">
            <Typography.Text strong style={{ fontSize: 12 }}>风格</Typography.Text>
            <Tag style={{ margin: 0 }} color={data.selectedSequence?.activeStyleProfileId ? "gold" : "blue"}>
              {data.selectedSequence?.activeStyleProfileId ? "自定义" : "默认"}
            </Tag>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            默认先用内置风格，不满意时再自定义。
          </div>
          <Button className="mt-2" size="small" onClick={() => void openStyleInit()}>
            打开风格面板
          </Button>
        </Card>
      </div>

      <div className="border-b border-slate-200 p-3">
        <Card size="small" styles={{ body: { padding: 10 } }}>
          <details>
            <summary className="cursor-pointer list-none text-[12px] font-semibold text-slate-700">
              执行历史（点击展开）
            </summary>
            <div className="mt-2 space-y-1.5">
              {timelineEvents.length === 0 ? (
                <div className="text-[11px] text-slate-500">暂无历史记录。</div>
              ) : (
                timelineEvents
                  .slice()
                  .reverse()
                  .slice(0, 16)
                  .map((event) => (
                    <div key={event.id} className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                      <div className="text-[11px] text-slate-700">{timelineEventLabel(event)}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(event.at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </details>
        </Card>
      </div>

      <div className="min-h-0 flex-1">{episodeList}</div>
    </aside>
  );

  const resourcePanel = (
    <ResourcePanel
      resources={data.resources}
      isLoading={data.isLoadingResources}
      sequenceId={data.selectedSequence?.id ?? null}
      onRefresh={() => void data.refreshResources()}
      onInjectMessage={handleInjectMessage}
      embedded
    />
  );

  return (
    <ConfigProvider theme={videoWorkspaceTheme}>
      <main className="flex h-screen w-full flex-col bg-[#f5f7fa] text-slate-900">
        <header className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Breadcrumb
                items={[
                  { title: <Link href="/video">项目列表</Link> },
                  { title: projectName },
                ]}
              />
              <div className="mt-1.5 flex items-center gap-2">
                <Typography.Text strong style={{ fontSize: 14 }}>
                  {projectName}
                </Typography.Text>
                <Tag color={data.selectedSequence ? "blue" : "default"} style={{ margin: 0 }}>
                  {data.selectedSequence ? formatPlanKey(data.selectedSequence.sequenceKey) : "未选择计划"}
                </Tag>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  {executionMode === "yolo" ? "YOLO 自动执行" : "检查点确认执行"}
                </Typography.Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Segmented<WorkspaceView>
                size="small"
                value={workspaceView}
                onChange={(value) => {
                  if (value === "chat" || value === "clip") {
                    setWorkspaceView(value);
                  }
                }}
                options={[
                  { label: "对话", value: "chat" },
                  { label: "剪辑", value: "clip" },
                ]}
              />
              <Tooltip title={modeDescription}>
                <Segmented<ExecutionMode>
                  size="small"
                  value={executionMode}
                  onChange={handleExecutionModeChange}
                  options={[
                    { label: "检查点", value: "checkpoint" },
                    { label: "YOLO", value: "yolo" },
                  ]}
                />
              </Tooltip>
              <Button size="small" icon={<SettingOutlined />} onClick={() => setProDrawerOpen(true)}>
                Pro
              </Button>
              <Button size="small" onClick={handleRefreshNeeded}>
                刷新
              </Button>
              {!isDesktop && (
                <>
                  <Button size="small" onClick={() => setLeftDrawerOpen(true)}>
                    计划
                  </Button>
                  <Button size="small" onClick={() => setRightDrawerOpen(true)}>
                    素材
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {isDesktop && <div className="w-80 min-w-[320px]">{leftRail}</div>}

          <section className={`flex min-w-0 flex-1 flex-col ${isDesktop ? "border-x border-slate-200 bg-white" : "bg-white"}`}>
            <StyleInitPanel
              projectId={projectId}
              sequenceId={data.selectedSequence?.id ?? null}
              sequenceKey={data.selectedSequence?.sequenceKey ?? null}
              memoryUser={memoryUser}
              onInjectMessage={handleInjectMessage}
              openSignal={styleInitOpenSignal}
              showInlineTrigger={false}
            />

            <div className="min-h-0 flex-1">
              <VideoChat
                key={chatKey}
                initialSessionId={currentSessionId}
                videoContext={videoContext}
                ensureVideoContext={ensureVideoContext}
                preloadMcps={DEFAULT_MCPS}
                skills={DEFAULT_SKILLS}
                onSessionCreated={handleSessionCreated}
                onRefreshNeeded={handleRefreshNeeded}
                autoMessage={autoMessage}
                executionMode={executionMode}
                onExecutionModeChange={handleExecutionModeChange}
                injectedMessage={injectedMessage}
                memoryUser={memoryUser}
                view={workspaceView}
                resources={data.resources}
                sequenceId={data.selectedSequence?.id ?? null}
                checkpointPlanStatus={checkpointPlanStatus}
                onCheckpointPlanStatusChange={setCheckpointPlanStatus}
                onPlanDetected={handlePlanDetected}
                onTimelineEventsChange={handleTimelineEventsChange}
              />
            </div>
          </section>

          {isDesktop && <div className="w-80 min-w-[300px]">{resourcePanel}</div>}
        </div>

        <Drawer
          title="Pro 模式"
          placement="right"
          open={proDrawerOpen}
          onClose={() => setProDrawerOpen(false)}
          width={420}
        >
          <div className="space-y-3">
            <Card size="small" title="记忆用户">
              <Input
                size="small"
                value={memoryUser}
                onChange={(event) => setMemoryUser(event.target.value)}
                placeholder="default"
              />
              <div className="mt-2 flex gap-2">
                <Button size="small" onClick={() => void loadProData()} loading={isLoadingProData}>
                  刷新推荐
                </Button>
                <Button size="small" danger onClick={() => void handleClearMemory()} loading={isClearingMemory}>
                  清空记忆
                </Button>
              </div>
            </Card>

            <Card size="small" title="工作流定制">
              <Input
                size="small"
                value={proGoal}
                onChange={(event) => setProGoal(event.target.value)}
                placeholder="可选：输入目标，刷新后获得更精准路径"
              />
              <Button className="mt-2" size="small" onClick={() => void loadProData()} loading={isLoadingProData}>
                刷新路径推荐
              </Button>
              <div className="mt-2 space-y-2">
                {pathRecommendations.length === 0 ? (
                  <div className="text-[11px] text-slate-500">暂无推荐路径。</div>
                ) : (
                  pathRecommendations.map((path) => (
                    <div key={path.pathId} className="rounded border border-slate-200 bg-slate-50 p-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-[12px] font-medium text-slate-800">{path.title}</div>
                          <div className="truncate text-[10px] text-slate-500">{path.pathId}</div>
                        </div>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => void handleApplyPath(path)}
                          loading={isReviewingPath}
                        >
                          应用
                        </Button>
                      </div>
                      <div className="mt-1 text-[10px] text-slate-600">
                        {path.steps.slice(0, 3).join(" / ")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card size="small" title="风格高级入口">
              <div className="text-[11px] text-slate-500">
                可在此进入高级风格定制：参考图检索、风格反推、风格档案覆写当前计划。
              </div>
              <Button
                className="mt-2"
                size="small"
                type="primary"
                onClick={() => {
                  setProDrawerOpen(false);
                  void openStyleInit();
                }}
              >
                打开风格高级面板
              </Button>
            </Card>

            {memoryRecommendations && (
              <Card size="small" title="当前记忆摘要">
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div>偏好风格词：{memoryRecommendations.preferredStyleTokens.slice(0, 6).join(", ") || "无"}</div>
                  <div>偏好路径：{memoryRecommendations.preferredWorkflowPaths.slice(0, 4).join(", ") || "无"}</div>
                  <div>偏好来源：{memoryRecommendations.preferredProviders.join(", ") || "无"}</div>
                </div>
              </Card>
            )}
          </div>
        </Drawer>

        {!isDesktop && (
          <>
            <Drawer
              title="计划与会话"
              placement="left"
              open={leftDrawerOpen}
              onClose={() => setLeftDrawerOpen(false)}
              width={340}
              destroyOnClose={false}
              styles={{ body: { padding: 0 } }}
            >
              <div className="h-[calc(100vh-120px)]">{leftRail}</div>
            </Drawer>
            <Drawer
              title="素材面板"
              placement="right"
              open={rightDrawerOpen}
              onClose={() => setRightDrawerOpen(false)}
              width={360}
              destroyOnClose={false}
              styles={{ body: { padding: 0 } }}
            >
              <div className="h-[calc(100vh-120px)]">{resourcePanel}</div>
            </Drawer>
          </>
        )}
      </main>
    </ConfigProvider>
  );
}
