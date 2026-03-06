"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Select,
  Tooltip,
  Typography,
} from "antd";
import { fetchJson } from "@/app/components/client-utils";
import { useVideoData } from "../hooks/useVideoData";
import { ResourcePanel } from "../components/ResourcePanel";
import { ProSettingsDrawer } from "../components/ProSettingsDrawer";
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
const DEFAULT_AUTO_SEQUENCE_NAME = "主工作区";
const DEFAULT_PRO_CONFIG: VideoProConfig = {
  customKnowledge: "",
  workflowTemplate: "",
  checkpointAlignmentRequired: true,
  enableSelfReview: true,
};

interface SessionSummaryRow {
  id: string;
}

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
  const [chatKey, setChatKey] = useState(() => crypto.randomUUID());
  const [autoMessage, setAutoMessage] = useState<string | undefined>(
    initialIdeaMessage && initialIdeaMessage.length > 0 ? initialIdeaMessage : undefined,
  );
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("checkpoint");
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("chat");
  const [injectedMessage, setInjectedMessage] = useState<{ id: string; text: string } | null>(null);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [proOpen, setProOpen] = useState(false);
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
      void message.error("自动初始化工作区失败，请稍后重试。");
      return null;
    }
    data.selectSequence(created);
    return {
      projectId,
      sequenceKey: created.sequenceKey,
    };
  }, [data, message, projectId]);

  const modeDescription = executionMode === "yolo"
    ? "YOLO: 作为上下文偏好注入，默认自动连续推进"
    : "Checkpoint: 作为上下文偏好注入，关键步骤倾向先确认";

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

  useEffect(() => {
    if (!currentSessionUser) return;
    if (skipAutoRestoreUser === currentSessionUser) return;

    let cancelled = false;
    void (async () => {
      try {
        const rows = await fetchJson<SessionSummaryRow[]>(`/api/sessions?user=${encodeURIComponent(currentSessionUser)}`);
        if (cancelled) return;
        applySessionId(rows[0]?.id);
      } catch {
        if (!cancelled) applySessionId(undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applySessionId, currentSessionUser, skipAutoRestoreUser]);

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
    },
    [applySessionId, currentSessionUser],
  );

  const handleRefreshNeeded = useCallback(() => {
    void data.refreshAll();
  }, [data]);

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
      onOpenStyleManager={() => void openStyleInit()}
      embedded
    />
  );

  return (
    <ConfigProvider theme={videoWorkspaceTheme}>
      <main className="ceramic-page flex h-screen w-full flex-col text-[var(--af-text)]">
        <div className="px-4 pt-4">
          <header className="ceramic-topbar px-4 py-3">
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
                <Typography.Text style={{ fontSize: 11, color: "var(--af-muted)" }}>
                  {data.selectedSequence
                    ? `工作区：${formatWorkspaceLabel(data.selectedSequence.sequenceKey, data.selectedSequence.sequenceName)}`
                    : "工作区未初始化"}
                </Typography.Text>
                <Typography.Text style={{ fontSize: 11, color: "var(--af-muted)" }}>
                  {executionMode === "yolo" ? "YOLO 自动推进偏好" : "Checkpoint 审慎推进偏好"}
                </Typography.Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                size="small"
                value={data.selectedSequence?.id ?? undefined}
                placeholder="选择工作区"
                options={data.sequences.map((seq) => ({
                  value: seq.id,
                  label: formatWorkspaceLabel(seq.sequenceKey, seq.sequenceName),
                }))}
                onChange={(value) => {
                  const found = data.sequences.find((seq) => seq.id === value);
                  if (found) handleSelectSequence(found);
                }}
                style={{ minWidth: 160 }}
              />
              <Button size="small" onClick={handleNewSession}>
                新会话
              </Button>
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
                  onChange={setExecutionMode}
                  options={[
                    { label: "检查点", value: "checkpoint" },
                    { label: "YOLO", value: "yolo" },
                  ]}
                />
              </Tooltip>
              <Button size="small" onClick={handleRefreshNeeded}>
                刷新
              </Button>
              <Button size="small" onClick={() => void openStyleInit()}>
                Style
              </Button>
              <Button size="small" onClick={() => setProOpen(true)}>
                Pro
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
          <section className="ceramic-panel flex min-w-0 flex-1 flex-col overflow-hidden">
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
              resources={data.resources}
              executionMode={executionMode}
              memoryUser={memoryUser}
              proConfig={proConfig}
              contextMaterialCount={contextMaterials.length}
              styleReferenceCount={styleReferenceMaterials.length}
              capabilitySkills={DEFAULT_SKILLS}
              capabilityMcps={DEFAULT_MCPS}
              onInjectMessage={handleInjectMessage}
              onOpenStyle={() => void openStyleInit()}
              onOpenPro={() => setProOpen(true)}
              onSwitchToClip={() => setWorkspaceView("clip")}
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
          </section>

          {isDesktop && <div className="w-[360px] min-w-[320px]">{resourcePanel}</div>}
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

        <ProSettingsDrawer
          open={proOpen}
          memoryUser={memoryUser}
          config={proConfig}
          capabilitySkills={DEFAULT_SKILLS}
          capabilityMcps={DEFAULT_MCPS}
          onClose={() => setProOpen(false)}
          onApply={({ memoryUser: nextMemoryUser, config: nextConfig }) => {
            setMemoryUser(nextMemoryUser);
            setProConfig(nextConfig);
          }}
        />
      </main>
    </ConfigProvider>
  );
}
