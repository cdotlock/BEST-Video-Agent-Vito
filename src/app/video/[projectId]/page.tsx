"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  App,
  Breadcrumb,
  Button,
  ConfigProvider,
  Drawer,
  Grid,
  Segmented,
} from "antd";
import { fetchJson, getErrorMessage } from "@/app/components/client-utils";
import type { SessionSummary } from "@/app/types";
import { inferReferenceRole } from "@/lib/video/reference-roles";
import { useVideoData } from "../hooks/useVideoData";
import { ChatSessionRail } from "../components/ChatSessionRail";
import { ResourcePanel } from "../components/ResourcePanel";
import { VideoChat } from "../components/VideoChat";
import { StyleInitPanel } from "../components/StyleInitPanel";
import { DirectorConsolePanel } from "../components/DirectorConsolePanel";
import type {
  VideoContext,
  ExecutionMode,
  WorkspaceView,
  DomainResource,
  QueuedClipResource,
  VideoProConfig,
} from "../types";
import { videoWorkspaceTheme } from "../theme";

const DEFAULT_SKILLS = [
  "video-mgr",
  "style-search",
  "video-memory",
  "subagent",
  "skill-creator",
  "dynamic-mcp-builder",
];
const DEFAULT_MCPS = ["video_mgr", "style_search", "video_memory", "mcp_manager", "subagent"];
const MEMORY_USER_STORAGE_KEY = "agentForge.user";
const PRO_CONFIG_STORAGE_KEY = "agentForge.video.proConfig";
const DEFAULT_AUTO_SEQUENCE_KEY = "MAIN";
const DEFAULT_AUTO_SEQUENCE_NAME = "主序列";
const DEFAULT_PRO_CONFIG: VideoProConfig = {
  customKnowledge: "",
  workflowTemplate: "",
  checkpointAlignmentRequired: true,
  enableSelfReview: true,
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || target.isContentEditable;
}

function formatWorkspaceLabel(sequenceKey: string, sequenceName: string | null): string {
  const trimmedName = sequenceName?.trim();
  if (trimmedName && trimmedName.length > 0) return trimmedName;
  return sequenceKey;
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

  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [chatKey, setChatKey] = useState(() => crypto.randomUUID());
  const [autoMessage, setAutoMessage] = useState<string | undefined>(
    initialIdeaMessage && initialIdeaMessage.length > 0 ? initialIdeaMessage : undefined,
  );
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("checkpoint");
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("chat");
  const [injectedMessage, setInjectedMessage] = useState<{ id: string; text: string } | null>(null);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [styleInitOpenSignal, setStyleInitOpenSignal] = useState<number | undefined>(undefined);
  const [memoryUser, setMemoryUser] = useState(() => {
    if (typeof window === "undefined") return "default";
    const stored = window.localStorage.getItem(MEMORY_USER_STORAGE_KEY);
    return stored && stored.trim().length > 0 ? stored.trim() : "default";
  });
  const [proConfig, setProConfig] = useState<VideoProConfig>(() => {
    if (typeof window === "undefined") return DEFAULT_PRO_CONFIG;
    const raw = window.localStorage.getItem(PRO_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_PRO_CONFIG;
    try {
      const parsed = JSON.parse(raw) as Partial<VideoProConfig>;
      return {
        customKnowledge: typeof parsed.customKnowledge === "string" ? parsed.customKnowledge : "",
        workflowTemplate: typeof parsed.workflowTemplate === "string" ? parsed.workflowTemplate : "",
        checkpointAlignmentRequired: parsed.checkpointAlignmentRequired !== false,
        enableSelfReview: parsed.enableSelfReview !== false,
      };
    } catch {
      return DEFAULT_PRO_CONFIG;
    }
  });
  const [contextMaterials, setContextMaterials] = useState<Array<{ id: string; title: string | null }>>([]);
  const [styleReferenceMaterials, setStyleReferenceMaterials] = useState<Array<{ id: string; title: string | null }>>([]);
  const [queuedClipResource, setQueuedClipResource] = useState<QueuedClipResource | null>(null);
  const [skipAutoRestoreUser, setSkipAutoRestoreUser] = useState<string | null>(null);
  const dialogueBootstrapRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MEMORY_USER_STORAGE_KEY, memoryUser);
  }, [memoryUser]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PRO_CONFIG_STORAGE_KEY, JSON.stringify(proConfig));
  }, [proConfig]);

  const resetTransientContext = useCallback(() => {
    setContextMaterials([]);
    setStyleReferenceMaterials([]);
    setInjectedMessage(null);
  }, []);

  const applySessionId = useCallback((nextSessionId: string | undefined) => {
    setCurrentSessionId((prev) => {
      if (prev === nextSessionId) return prev;
      setChatKey(crypto.randomUUID());
      return nextSessionId;
    });
  }, []);

  const switchSession = useCallback((sessionId?: string) => {
    applySessionId(sessionId);
    resetTransientContext();
  }, [applySessionId, resetTransientContext]);

  const handleNewSession = useCallback(() => {
    const selected = data.selectedSequence;
    if (selected) {
      setSkipAutoRestoreUser(`video:${projectId}:${selected.sequenceKey}`);
    }
    setAutoMessage(undefined);
    switchSession(undefined);
  }, [data.selectedSequence, projectId, switchSession]);

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

    await data.uploadSequence(DEFAULT_AUTO_SEQUENCE_KEY, DEFAULT_AUTO_SEQUENCE_NAME, null);
    const refreshed = await data.refreshSequences();
    const created = refreshed.find((seq) => seq.sequenceKey === DEFAULT_AUTO_SEQUENCE_KEY) ?? refreshed[0];
    if (!created) {
      void message.error("自动初始化序列失败，请稍后重试。");
      return null;
    }
    data.selectSequence(created);
    return {
      projectId,
      sequenceKey: created.sequenceKey,
    };
  }, [data, message, projectId]);

  useEffect(() => {
    if (data.selectedSequence) return;
    const firstSequence = data.sequences[0];
    if (!firstSequence) return;
    data.selectSequence(firstSequence);
  }, [data]);

  const currentSessionUser = useMemo(() => {
    if (!data.selectedSequence) return null;
    return `video:${projectId}:${data.selectedSequence.sequenceKey}`;
  }, [data.selectedSequence, projectId]);

  const refreshSessions = useCallback(async (options?: { autoSelect?: boolean }) => {
    if (!currentSessionUser) {
      setSessions([]);
      if (options?.autoSelect) {
        applySessionId(undefined);
      }
      return;
    }

    setIsLoadingSessions(true);
    try {
      const rows = await fetchJson<SessionSummary[]>(`/api/sessions?user=${encodeURIComponent(currentSessionUser)}`);
      setSessions(rows);
      if (options?.autoSelect && skipAutoRestoreUser !== currentSessionUser) {
        applySessionId(rows[0]?.id);
      }
    } catch {
      setSessions([]);
      if (options?.autoSelect) {
        applySessionId(undefined);
      }
    } finally {
      setIsLoadingSessions(false);
    }
  }, [applySessionId, currentSessionUser, skipAutoRestoreUser]);

  useEffect(() => {
    void refreshSessions({ autoSelect: true });
  }, [refreshSessions]);

  const openStyleInit = useCallback(async () => {
    const context = await ensureVideoContext();
    if (!context) return;
    setStyleInitOpenSignal((prev) => (prev ?? 0) + 1);
  }, [ensureVideoContext]);

  const handleSelectSequence = useCallback(
    (seq: typeof data.sequences[number]) => {
      data.selectSequence(seq);
      setAutoMessage(undefined);
      setSkipAutoRestoreUser(null);
      switchSession(undefined);
    },
    [data, switchSession],
  );

  const handleSessionCreated = useCallback(
    (sessionId: string) => {
      applySessionId(sessionId);
      if (currentSessionUser) {
        setSkipAutoRestoreUser(currentSessionUser);
      }
      setAutoMessage(undefined);
      void refreshSessions();
    },
    [applySessionId, currentSessionUser, refreshSessions],
  );

  const handleRefreshNeeded = useCallback(() => {
    void Promise.all([
      data.refreshAll(),
      refreshSessions(),
    ]);
  }, [data, refreshSessions]);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    if (!window.confirm("确定永久删除此会话？")) return;
    try {
      await fetchJson(`/api/sessions/${encodeURIComponent(sessionId)}`, { method: "DELETE" });
      if (currentSessionId === sessionId) {
        applySessionId(undefined);
      }
      setSkipAutoRestoreUser(null);
      await refreshSessions({ autoSelect: true });
      void message.success("已删除会话。");
    } catch (error) {
      void message.error(getErrorMessage(error, "删除会话失败。"));
    }
  }, [applySessionId, currentSessionId, message, refreshSessions]);

  const handleAttachContextResource = useCallback((resource: DomainResource) => {
    setContextMaterials((prev) => {
      if (prev.some((item) => item.id === resource.id)) return prev;
      return [...prev, { id: resource.id, title: resource.title }];
    });
  }, []);

  const handleAttachStyleReference = useCallback((resource: DomainResource) => {
    setStyleReferenceMaterials((prev) => {
      if (prev.some((item) => item.id === resource.id)) return prev;
      return [...prev, { id: resource.id, title: resource.title }];
    });
  }, []);

  const handleRemoveContextMaterial = useCallback((resourceId: string) => {
    setContextMaterials((prev) => prev.filter((item) => item.id !== resourceId));
  }, []);

  const handleRemoveStyleReference = useCallback((resourceId: string) => {
    setStyleReferenceMaterials((prev) => prev.filter((item) => item.id !== resourceId));
  }, []);

  const handleInjectMessage = useCallback((text: string) => {
    setInjectedMessage({ id: crypto.randomUUID(), text });
    setWorkspaceView("chat");
  }, []);

  const handleQueueClipResource = useCallback((resource: DomainResource) => {
    setQueuedClipResource({
      token: crypto.randomUUID(),
      resource,
    });
    setWorkspaceView("clip");
    setRightDrawerOpen(false);
  }, []);

  const dialogueScriptExists = useMemo(() => {
    return data.resources?.categories.some((group) =>
      group.items.some((item) => inferReferenceRole({
        category: item.category,
        mediaType: item.mediaType,
        title: item.title,
        data: item.data,
      }) === "dialogue_ref"),
    ) ?? false;
  }, [data.resources]);

  const requestDialogueScript = useCallback(async (force: boolean) => {
    const selectedSequence = data.selectedSequence;
    if (!selectedSequence) return;
    try {
      const result = await fetchJson<{ reused?: boolean }>(
        `/api/video/sequences/${encodeURIComponent(selectedSequence.id)}/dialogue-script`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            sequenceKey: selectedSequence.sequenceKey,
            title: `${formatWorkspaceLabel(selectedSequence.sequenceKey, selectedSequence.sequenceName)} 对白脚本`,
            force,
          }),
        },
      );
      await data.refreshResources();
      if (force) {
        void message.success(result.reused ? "已恢复现有对白脚本。" : "已生成新的对白脚本确认稿。");
      }
    } catch {
      if (force) {
        void message.error("自动生成对白脚本失败，请稍后重试。");
      }
    }
  }, [data, message, projectId]);

  useEffect(() => {
    const selectedSequence = data.selectedSequence;
    if (!selectedSequence || dialogueScriptExists) return;
    if (dialogueBootstrapRef.current.has(selectedSequence.id)) return;
    dialogueBootstrapRef.current.add(selectedSequence.id);
    void requestDialogueScript(false);
  }, [data.selectedSequence, dialogueScriptExists, requestDialogueScript]);

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

  const resourcePanel = (
    <ResourcePanel
      resources={data.resources}
      isLoading={data.isLoadingResources}
      sequenceId={data.selectedSequence?.id ?? null}
      onRefresh={() => void data.refreshResources()}
      onInjectMessage={handleInjectMessage}
      onAttachContextResource={handleAttachContextResource}
      onAttachStyleReference={handleAttachStyleReference}
      onQueueClipResource={handleQueueClipResource}
      embedded
    />
  );

  const directorConsoleStorageKey = `${projectId}:${data.selectedSequence?.sequenceKey ?? "default"}`;

  return (
    <ConfigProvider theme={videoWorkspaceTheme}>
      <main className="ceramic-page flex h-screen w-full flex-col text-[var(--af-text)]">
        <div className="px-4 pt-4">
          <header className="ceramic-topbar px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Breadcrumb
                items={[
                  { title: <Link href="/video">项目列表</Link> },
                  { title: projectName },
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              {!isDesktop && (
                <Button size="small" onClick={handleNewSession}>
                  新会话
                </Button>
              )}
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
              <Button size="small" onClick={handleRefreshNeeded}>
                刷新
              </Button>
              {!isDesktop && (
                <Button size="small" onClick={() => setRightDrawerOpen(true)}>
                  素材
                </Button>
              )}
            </div>
          </div>
          </header>
        </div>

        <div className="flex min-h-0 flex-1 gap-4 px-4 pb-4 pt-4">
          <section className="ceramic-panel flex min-w-0 flex-1 overflow-hidden">
            {isDesktop && workspaceView === "chat" ? (
              <ChatSessionRail
                sequences={data.sequences}
                selectedSequenceId={data.selectedSequence?.id ?? null}
                onSelectSequence={(sequenceId) => {
                  const found = data.sequences.find((sequence) => sequence.id === sequenceId);
                  if (found) handleSelectSequence(found);
                }}
                formatSequenceLabel={formatWorkspaceLabel}
                sessions={sessions}
                currentSessionId={currentSessionId}
                isLoadingSessions={isLoadingSessions}
                onRefreshSessions={() => { void refreshSessions(); }}
                onNewSession={handleNewSession}
                onSelectSession={(sessionId) => switchSession(sessionId)}
                onDeleteSession={(sessionId) => { void handleDeleteSession(sessionId); }}
              />
            ) : null}

            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <StyleInitPanel
                projectId={projectId}
                sequenceId={data.selectedSequence?.id ?? null}
                sequenceKey={data.selectedSequence?.sequenceKey ?? null}
                memoryUser={memoryUser}
                onInjectMessage={handleInjectMessage}
                openSignal={styleInitOpenSignal}
                showInlineTrigger={false}
              />

              <DirectorConsolePanel
                key={directorConsoleStorageKey}
                resources={data.resources}
                executionMode={executionMode}
                memoryUser={memoryUser}
                proConfig={proConfig}
                contextMaterialCount={contextMaterials.length}
                styleReferenceCount={styleReferenceMaterials.length}
                workspaceView={workspaceView}
                sessionId={currentSessionId}
                storageKey={directorConsoleStorageKey}
                capabilitySkills={DEFAULT_SKILLS}
                capabilityMcps={DEFAULT_MCPS}
                onInjectMessage={handleInjectMessage}
                onOpenStyle={() => void openStyleInit()}
                onApplyPro={({ memoryUser: nextMemoryUser, config: nextConfig }) => {
                  setMemoryUser(nextMemoryUser);
                  setProConfig(nextConfig);
                }}
                onGenerateDialogueScript={() => { void requestDialogueScript(true); }}
                onSwitchToClip={() => setWorkspaceView("clip")}
              />

              <div className="min-h-0 flex-1 pt-16 md:pt-[4.5rem]">
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
                  onExecutionModeChange={setExecutionMode}
                  injectedMessage={injectedMessage}
                  memoryUser={memoryUser}
                  view={workspaceView}
                  resources={data.resources}
                  sequenceId={data.selectedSequence?.id ?? null}
                  proConfig={proConfig}
                  contextMaterials={contextMaterials}
                  styleReferenceMaterials={styleReferenceMaterials}
                  queuedClipResource={queuedClipResource}
                  onRemoveContextMaterial={handleRemoveContextMaterial}
                  onRemoveStyleReference={handleRemoveStyleReference}
                  onConsumeQueuedClipResource={() => setQueuedClipResource(null)}
                />
              </div>
            </div>
          </section>

          {isDesktop && <div className="min-h-0 w-[360px] min-w-[320px]">{resourcePanel}</div>}
        </div>

        {!isDesktop && (
          <Drawer
            title="Asset Atlas"
            placement="right"
            open={rightDrawerOpen}
            onClose={() => setRightDrawerOpen(false)}
            size={360}
            destroyOnClose={false}
            styles={{ body: { padding: 0 } }}
          >
            <div className="h-[calc(100vh-120px)]">{resourcePanel}</div>
          </Drawer>
        )}
      </main>
    </ConfigProvider>
  );
}
