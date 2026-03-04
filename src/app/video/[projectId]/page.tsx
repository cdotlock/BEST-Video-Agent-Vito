"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button, ConfigProvider, Drawer, Grid, Segmented, Tag, Typography } from "antd";
import { useSessions } from "@/app/components/hooks/useSessions";
import { useVideoData } from "../hooks/useVideoData";
import { EpisodeList } from "../components/EpisodeList";
import { ResourcePanel } from "../components/ResourcePanel";
import { VideoChat } from "../components/VideoChat";
import { StyleInitPanel } from "../components/StyleInitPanel";
import type { VideoContext, ExecutionMode, WorkspaceView } from "../types";

/* ------------------------------------------------------------------ */
/*  Default skills & MCPs for video workflow                           */
/* ------------------------------------------------------------------ */

const DEFAULT_SKILLS = ["video-mgr", "style-search", "video-memory"];
const DEFAULT_MCPS = ["video_mgr", "style_search", "video_memory"];
const MEMORY_USER_STORAGE_KEY = "agentForge.user";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || target.isContentEditable;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function VideoWorkflowPage() {
  const screens = Grid.useBreakpoint();
  const isDesktop = !!screens.lg;
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const projectId = params.projectId;
  const projectName = searchParams.get("name") ?? projectId;

  /* ---- Data ---- */
  const data = useVideoData(projectId);

  /* ---- Session management ---- */
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

  /* ---- Video context for chat ---- */
  const videoContext: VideoContext | null = useMemo(() => {
    if (!data.selectedSequence) return null;
    return {
      projectId,
      sequenceKey: data.selectedSequence.sequenceKey,
    };
  }, [projectId, data.selectedSequence]);

  /* ---- Handlers ---- */
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
            ? "素材已上传。请直接自动推进：先完成风格初始化，再持续生成分镜图与视频提示词，无需等待确认。"
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
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const renderEpisodeList = (
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
      embedded={!isDesktop}
    />
  );

  const renderResourcePanel = (
    <ResourcePanel
      resources={data.resources}
      isLoading={data.isLoadingResources}
      sequenceId={data.selectedSequence?.id ?? null}
      onRefresh={() => void data.refreshResources()}
      embedded={!isDesktop}
    />
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#ffffff",
          colorBorder: "#e5e7eb",
          borderRadius: 10,
        },
      }}
    >
      <main className="flex h-screen w-full flex-col bg-[#f7f8fa] text-slate-900">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="min-w-0">
            <Typography.Text strong style={{ fontSize: 14 }}>
              {projectName}
            </Typography.Text>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
              <span>Project ID: {projectId.slice(0, 8)}…</span>
              <Tag color={data.selectedSequence ? "blue" : "default"} style={{ margin: 0 }}>
                {data.selectedSequence ? data.selectedSequence.sequenceKey : "No sequence"}
              </Tag>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Segmented<WorkspaceView>
              size="small"
              value={workspaceView}
              onChange={(value) => {
                if (value === "chat" || value === "timeline" || value === "storyboard") {
                  setWorkspaceView(value);
                }
              }}
              options={[
                { label: "Chat", value: "chat" },
                { label: "Timeline", value: "timeline" },
                { label: "Storyboard", value: "storyboard" },
              ]}
            />
            <Button
              size="small"
              type={executionMode === "checkpoint" ? "primary" : "default"}
              onClick={() => setExecutionMode("checkpoint")}
              disabled={executionMode === "checkpoint"}
            >
              Checkpoint
            </Button>
            <Button
              size="small"
              type={executionMode === "yolo" ? "primary" : "default"}
              onClick={() => setExecutionMode("yolo")}
              disabled={executionMode === "yolo"}
            >
              YOLO
            </Button>
            <Button size="small" onClick={handleRefreshNeeded}>
              Refresh
            </Button>
            {!isDesktop && (
              <>
                <Button size="small" onClick={() => setLeftDrawerOpen(true)}>
                  Sequences
                </Button>
                <Button size="small" onClick={() => setRightDrawerOpen(true)}>
                  Resources
                </Button>
              </>
            )}
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {isDesktop && renderEpisodeList}

          {/* Center — Chat */}
          <section className={`flex min-w-0 flex-1 flex-col bg-white ${isDesktop ? "border-x border-slate-200" : ""}`}>
            <StyleInitPanel
              projectId={projectId}
              sequenceId={data.selectedSequence?.id ?? null}
              sequenceKey={data.selectedSequence?.sequenceKey ?? null}
              memoryUser={memoryUser}
              onInjectMessage={handleInjectMessage}
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
              />
            </div>
          </section>

          {isDesktop && renderResourcePanel}
        </div>

        {!isDesktop && (
          <>
            <Drawer
              title="Sequences"
              placement="left"
              open={leftDrawerOpen}
              onClose={() => setLeftDrawerOpen(false)}
              width={320}
              destroyOnClose={false}
              styles={{ body: { padding: 0 } }}
            >
              <div className="h-[calc(100vh-120px)]">{renderEpisodeList}</div>
            </Drawer>
            <Drawer
              title="Resources"
              placement="right"
              open={rightDrawerOpen}
              onClose={() => setRightDrawerOpen(false)}
              width={360}
              destroyOnClose={false}
              styles={{ body: { padding: 0 } }}
            >
              <div className="h-[calc(100vh-120px)]">{renderResourcePanel}</div>
            </Drawer>
          </>
        )}
      </main>
    </ConfigProvider>
  );
}
