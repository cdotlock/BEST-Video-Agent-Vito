"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Alert,
  App,
  Breadcrumb,
  Button,
  Card,
  ConfigProvider,
  Drawer,
  Grid,
  Menu,
  Segmented,
  Steps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import { useSessions } from "@/app/components/hooks/useSessions";
import { useVideoData } from "../hooks/useVideoData";
import { EpisodeList } from "../components/EpisodeList";
import { ResourcePanel } from "../components/ResourcePanel";
import { VideoChat } from "../components/VideoChat";
import { StyleInitPanel } from "../components/StyleInitPanel";
import type { VideoContext, ExecutionMode, WorkspaceView } from "../types";

const DEFAULT_SKILLS = ["video-mgr", "style-search", "video-memory"];
const DEFAULT_MCPS = ["video_mgr", "style_search", "video_memory"];
const MEMORY_USER_STORAGE_KEY = "agentForge.user";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || target.isContentEditable;
}

function buildMenuItems(): MenuProps["items"] {
  return [
    {
      key: "create",
      label: "创作",
      children: [
        { key: "chat", label: "对话工作台" },
        { key: "timeline", label: "任务时间线" },
        { key: "storyboard", label: "分镜看板" },
        { key: "clip", label: "剪辑计划" },
      ],
    },
    {
      key: "style",
      label: "风格",
      children: [{ key: "style_init", label: "风格初始化" }],
    },
    {
      key: "assets",
      label: "素材",
      children: [{ key: "resources", label: "素材面板" }],
    },
    {
      key: "history",
      label: "历史",
      children: [{ key: "sessions", label: "会话记录" }],
    },
  ];
}

export default function VideoWorkflowPage() {
  const { message } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isDesktop = !!screens.lg;
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const projectId = params.projectId;
  const projectName = searchParams.get("name") ?? projectId;

  const data = useVideoData(projectId);

  const userName = data.selectedSequence
    ? `video:${projectId}:${data.selectedSequence.sequenceKey}`
    : `video:${projectId}:_`;

  const sessionsHook = useSessions(userName, () => {}, () => {});
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [chatKey, setChatKey] = useState(() => crypto.randomUUID());
  const [autoMessage, setAutoMessage] = useState<string | undefined>();
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("checkpoint");
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("chat");
  const [injectedMessage, setInjectedMessage] = useState<{ id: string; text: string } | null>(null);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [styleInitOpenSignal, setStyleInitOpenSignal] = useState(0);
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>(["create"]);
  const [memoryUser] = useState(() => {
    if (typeof window === "undefined") return "default";
    const stored = window.localStorage.getItem(MEMORY_USER_STORAGE_KEY);
    return stored && stored.trim().length > 0 ? stored.trim() : "default";
  });

  const switchSession = useCallback((sessionId?: string) => {
    setCurrentSessionId(sessionId);
    setChatKey(crypto.randomUUID());
  }, []);

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

  const hasGeneratedAssets = useMemo(() => {
    if (!data.resources) return false;
    return data.resources.categories.some((group) => group.items.length > 0);
  }, [data.resources]);

  const quickStepCurrent = useMemo(() => {
    if (!data.selectedSequence || data.selectedSequence.status === "empty") return 0;
    if (!data.selectedSequence.activeStyleProfileId) return 1;
    if (!hasGeneratedAssets) return 2;
    return 3;
  }, [data.selectedSequence, hasGeneratedAssets]);

  const modeDescription = executionMode === "yolo"
    ? "YOLO: 自动推进，不做中间确认"
    : "Checkpoint: 关键动作先确认";

  const selectedMenuKey = useMemo(() => {
    if (workspaceView === "chat") return "chat";
    if (workspaceView === "timeline") return "timeline";
    if (workspaceView === "storyboard") return "storyboard";
    return "clip";
  }, [workspaceView]);

  const openStyleInit = useCallback(() => {
    if (!data.selectedSequence) {
      void message.warning("请先上传或选择一个序列。");
      return;
    }
    setStyleInitOpenSignal((prev) => prev + 1);
  }, [data.selectedSequence, message]);

  const openSequencePanel = useCallback(() => {
    if (isDesktop) {
      void message.info("请在左侧面板上传或选择序列。");
      return;
    }
    setLeftDrawerOpen(true);
  }, [isDesktop, message]);

  const sendStarterInstruction = useCallback(() => {
    if (!data.selectedSequence) {
      void message.warning("请先上传或选择一个序列。");
      return;
    }
    const starter = executionMode === "yolo"
      ? "请直接自动推进：根据当前序列完成风格初始化、分镜生成、视频候选生成与可拼接方案，无需等待确认。"
      : "请按 checkpoint 模式推进：先风格初始化，再分镜与视频候选；每个高成本动作前先确认一次。";
    setInjectedMessage({ id: crypto.randomUUID(), text: starter });
    setWorkspaceView("chat");
  }, [data.selectedSequence, executionMode, message]);

  const handleSelectSequence = useCallback(
    (seq: typeof data.sequences[number]) => {
      data.selectSequence(seq);
      setCurrentSessionId(undefined);
      setAutoMessage(undefined);
      setInjectedMessage(null);
      setChatKey(crypto.randomUUID());
      setLeftDrawerOpen(false);
    },
    [data],
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
        setAutoMessage(
          executionMode === "yolo"
            ? "素材已上传。请直接自动推进：先风格初始化，再持续生成分镜图与视频提示词，无需等待确认。"
            : "素材已上传。请先完成风格初始化，然后按阶段推进分镜图与视频提示词生成；关键节点请先确认。",
        );
        setChatKey(crypto.randomUUID());
      }
    },
    [data, executionMode],
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

  const handleInjectMessage = useCallback((text: string) => {
    setInjectedMessage({ id: crypto.randomUUID(), text });
    setWorkspaceView("chat");
  }, []);

  const handleMenuClick = useCallback((info: { key: string }) => {
    if (info.key === "chat" || info.key === "timeline" || info.key === "storyboard" || info.key === "clip") {
      setWorkspaceView(info.key);
      return;
    }
    if (info.key === "style_init") {
      openStyleInit();
      return;
    }
    if (info.key === "resources") {
      if (isDesktop) {
        setWorkspaceView("storyboard");
      } else {
        setRightDrawerOpen(true);
      }
      return;
    }
    if (info.key === "sessions" && !isDesktop) {
      setLeftDrawerOpen(true);
    }
  }, [isDesktop, openStyleInit]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      if (event.key === "1") {
        event.preventDefault();
        setWorkspaceView("chat");
      } else if (event.key === "2") {
        event.preventDefault();
        setWorkspaceView("timeline");
      } else if (event.key === "3") {
        event.preventDefault();
        setWorkspaceView("storyboard");
      } else if (event.key === "4") {
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
      embedded
    />
  );

  const navigationSider = (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-3 py-2.5">
        <Typography.Text strong style={{ fontSize: 12 }}>
          工作台导航
        </Typography.Text>
        <Menu
          mode="inline"
          className="mt-2"
          selectedKeys={[selectedMenuKey]}
          openKeys={openMenuKeys}
          onOpenChange={(keys) => {
            const latest = keys[keys.length - 1];
            setOpenMenuKeys(latest ? [latest] : []);
          }}
          onClick={handleMenuClick}
          items={buildMenuItems()}
        />
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
      embedded
    />
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f5f7fa",
          colorBorder: "#e5e7eb",
          borderRadius: 12,
          fontFamily: "\"IBM Plex Sans\", \"Noto Sans SC\", \"PingFang SC\", sans-serif",
        },
      }}
    >
      <main className="flex h-screen w-full flex-col bg-[#f5f7fa] text-slate-900">
        <header className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Breadcrumb
                items={[
                  { title: <Link href="/video">Projects</Link> },
                  { title: projectName },
                ]}
              />
              <div className="mt-1.5 flex items-center gap-2">
                <Typography.Text strong style={{ fontSize: 14 }}>
                  {projectName}
                </Typography.Text>
                <Tag color={data.selectedSequence ? "blue" : "default"} style={{ margin: 0 }}>
                  {data.selectedSequence ? data.selectedSequence.sequenceKey : "未选择序列"}
                </Tag>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  Project ID: {projectId.slice(0, 8)}...
                </Typography.Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Segmented<WorkspaceView>
                size="small"
                value={workspaceView}
                onChange={(value) => {
                  if (value === "chat" || value === "timeline" || value === "storyboard" || value === "clip") {
                    setWorkspaceView(value);
                  }
                }}
                options={[
                  { label: "Chat", value: "chat" },
                  { label: "Timeline", value: "timeline" },
                  { label: "Storyboard", value: "storyboard" },
                  { label: "Clip", value: "clip" },
                ]}
              />
              <Tooltip title={modeDescription}>
                <Segmented<ExecutionMode>
                  size="small"
                  value={executionMode}
                  onChange={setExecutionMode}
                  options={[
                    { label: "Checkpoint", value: "checkpoint" },
                    { label: "YOLO", value: "yolo" },
                  ]}
                />
              </Tooltip>
              <Button size="small" onClick={handleRefreshNeeded}>
                Refresh
              </Button>
              {!isDesktop && (
                <>
                  <Button size="small" onClick={() => setLeftDrawerOpen(true)}>
                    导航
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
          {isDesktop && <div className="w-72 min-w-[260px]">{navigationSider}</div>}

          <section className={`flex min-w-0 flex-1 flex-col ${isDesktop ? "border-x border-slate-200 bg-white" : "bg-white"}`}>
            <Card size="small" className="m-3 mb-2" styles={{ body: { padding: 12 } }}>
              <div className="mb-2 flex items-center justify-between">
                <Typography.Text strong style={{ fontSize: 12 }}>
                  新手引导（4 步）
                </Typography.Text>
                <Tag color={executionMode === "yolo" ? "volcano" : "blue"} style={{ margin: 0 }}>
                  {executionMode === "yolo" ? "YOLO 自动推进" : "Checkpoint 确认模式"}
                </Tag>
              </div>
              <Steps
                size="small"
                current={quickStepCurrent}
                items={[
                  {
                    title: "上传序列",
                    description:
                      data.selectedSequence && data.selectedSequence.status !== "empty" ? "已完成" : "需要上传内容文件",
                  },
                  {
                    title: "风格确认",
                    description: data.selectedSequence?.activeStyleProfileId ? "已绑定风格档案" : "先做搜图与反推",
                  },
                  {
                    title: "开始生成",
                    description: hasGeneratedAssets ? "已有素材输出" : "发送第一条生成指令",
                  },
                  {
                    title: "保存拼接",
                    description: "在 Clip 视图保存 clip plan",
                  },
                ]}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="small" onClick={openSequencePanel}>
                  1. 上传/选择序列
                </Button>
                <Button size="small" onClick={openStyleInit} disabled={!data.selectedSequence}>
                  2. 打开风格初始化
                </Button>
                <Button size="small" onClick={sendStarterInstruction} disabled={!data.selectedSequence}>
                  3. 发送首条生成指令
                </Button>
                <Button size="small" onClick={() => setWorkspaceView("clip")} disabled={!data.selectedSequence}>
                  4. 打开剪辑计划
                </Button>
              </div>
            </Card>

            {!data.selectedSequence && (
              <div className="px-3 pb-2">
                <Alert
                  showIcon
                  type="info"
                  message="还没有可用序列"
                  description="请先上传一个 .md/.txt 序列文件，再开始风格初始化与生成。"
                  action={<Button size="small" onClick={openSequencePanel}>去上传</Button>}
                />
              </div>
            )}

            {data.selectedSequence && !data.selectedSequence.activeStyleProfileId && (
              <div className="px-3 pb-2">
                <Alert
                  showIcon
                  type="warning"
                  message="尚未完成风格确认"
                  description="建议先在 Style Init 中搜图并反推，再进入大批量生成，效果更稳定。"
                  action={<Button size="small" type="primary" onClick={openStyleInit}>去初始化</Button>}
                />
              </div>
            )}

            <StyleInitPanel
              projectId={projectId}
              sequenceId={data.selectedSequence?.id ?? null}
              sequenceKey={data.selectedSequence?.sequenceKey ?? null}
              memoryUser={memoryUser}
              onInjectMessage={handleInjectMessage}
              openSignal={styleInitOpenSignal}
            />

            <div className="min-h-0 flex-1">
              <VideoChat
                key={chatKey}
                initialSessionId={currentSessionId}
                videoContext={videoContext}
                preloadMcps={DEFAULT_MCPS}
                skills={DEFAULT_SKILLS}
                onSessionCreated={handleSessionCreated}
                onRefreshNeeded={handleRefreshNeeded}
                autoMessage={autoMessage}
                executionMode={executionMode}
                onExecutionModeChange={setExecutionMode}
                injectedMessage={injectedMessage}
                memoryUser={memoryUser}
                view={workspaceView}
                resources={data.resources}
                sequenceId={data.selectedSequence?.id ?? null}
              />
            </div>
          </section>

          {isDesktop && <div className="w-80 min-w-[300px]">{resourcePanel}</div>}
        </div>

        {!isDesktop && (
          <>
            <Drawer
              title="导航与序列"
              placement="left"
              open={leftDrawerOpen}
              onClose={() => setLeftDrawerOpen(false)}
              width={330}
              destroyOnClose={false}
              styles={{ body: { padding: 0 } }}
            >
              <div className="h-[calc(100vh-120px)]">{navigationSider}</div>
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
