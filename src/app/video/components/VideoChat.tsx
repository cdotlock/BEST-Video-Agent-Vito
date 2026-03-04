"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Alert, App, Button, Dropdown, Empty, Input, Select, Timeline, Tooltip, Typography, Tag } from "antd";
import {
  ClockCircleOutlined,
  CopyOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  SendOutlined,
  StopOutlined,
  LoadingOutlined,
  PictureOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { StatusBadge } from "@/app/components/StatusBadge";
import { MessageList } from "@/app/components/MessageList";
import { useImageUpload } from "@/app/components/hooks/useImageUpload";
import { useModels } from "@/app/components/hooks/useModels";
import { useVideoChat } from "../hooks/useVideoChat";
import { ClipComposer } from "./ClipComposer";
import type {
  DomainResource,
  DomainResources,
  ExecutionMode,
  VideoContext,
  VideoResourceData,
  VideoTimelineEvent,
  WorkspaceView,
} from "../types";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface VideoChatProps {
  /** undefined = new session */
  initialSessionId: string | undefined;
  videoContext: VideoContext | null;
  preloadMcps: string[];
  skills: string[];
  onSessionCreated: (sessionId: string) => void;
  /** Called when task completes — parent should refresh data. */
  onRefreshNeeded: () => void;
  /** If set, auto-send this message on mount (e.g. after EP upload). */
  autoMessage?: string;
  executionMode: ExecutionMode;
  onExecutionModeChange: (mode: ExecutionMode) => void;
  injectedMessage?: { id: string; text: string } | null;
  memoryUser: string;
  view: WorkspaceView;
  resources: DomainResources | null;
  sequenceId: string | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getResourcePrompt(resource: DomainResource): string | null {
  const data = resource.data;
  if (!data || typeof data !== "object") return null;
  const rec = data as Record<string, unknown>;
  return typeof rec.prompt === "string" ? rec.prompt : null;
}

type StoryboardAction = "copy_prompt" | "continue" | "style_ref";

function parseStoryboardAction(value: string | number): StoryboardAction | null {
  if (value === "copy_prompt") return "copy_prompt";
  if (value === "continue") return "continue";
  if (value === "style_ref") return "style_ref";
  return null;
}

function buildContinueInstruction(resource: DomainResource): string {
  const prompt = getResourcePrompt(resource);
  return [
    "请基于该素材继续推进当前序列生成。",
    `resource_id=${resource.id}`,
    `category=${resource.category}`,
    `media_type=${resource.mediaType}`,
    `resource_title=${resource.title ?? "untitled"}`,
    prompt ? `resource_prompt=${prompt}` : null,
  ].filter((line): line is string => line !== null).join("\n");
}

function buildStyleRefInstruction(resource: DomainResource): string {
  return [
    "请将该图片作为当前序列风格参考，并沿用该风格继续生成。",
    `resource_id=${resource.id}`,
    `reference_image_url=${resource.url ?? ""}`,
    `resource_title=${resource.title ?? "untitled"}`,
  ].join("\n");
}

function renderStoryboardPreview(resource: DomainResource): React.ReactNode {
  const videoData = resource.data as VideoResourceData | null;

  if (resource.mediaType === "image") {
    return resource.url ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resource.url}
        alt={resource.title ?? resource.category}
        className="h-36 w-full object-cover"
      />
    ) : (
      <div className="flex h-36 items-center justify-center bg-slate-100 text-xs text-slate-500">
        No image
      </div>
    );
  }

  if (resource.mediaType === "video") {
    return (
      <>
        {resource.url ? (
          <video src={resource.url} controls muted className="h-36 w-full object-cover" />
        ) : videoData?.sourceImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={videoData.sourceImageUrl}
            alt={resource.title ?? "source"}
            className="h-36 w-full object-cover opacity-60"
          />
        ) : (
          <div className="flex h-36 items-center justify-center bg-slate-100 text-xs text-slate-500">
            Pending video
          </div>
        )}
      </>
    );
  }

  return (
    <div className="h-36 overflow-hidden px-2 py-2">
      <Typography.Text strong style={{ fontSize: 11 }} ellipsis>
        {resource.title ?? "JSON"}
      </Typography.Text>
      <pre className="mt-1 max-h-24 overflow-hidden whitespace-pre-wrap break-all text-[10px] leading-relaxed text-slate-600">
        {typeof resource.data === "string" ? resource.data : JSON.stringify(resource.data, null, 2)}
      </pre>
    </div>
  );
}

function timelineLabel(event: VideoTimelineEvent): string {
  switch (event.type) {
    case "tool_start":
      return `Tool start: ${event.name ?? "unknown"}`;
    case "tool_end":
      if (event.error) return `Tool end (error): ${event.name ?? "unknown"}`;
      return `Tool end: ${event.name ?? "unknown"}`;
    case "stream_end":
      return event.error === "stopped_by_user" ? "Stream stopped by user" : "Stream completed";
    case "error":
      return `Task error: ${event.error ?? "unknown"}`;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function VideoChat({
  initialSessionId,
  videoContext,
  preloadMcps,
  skills,
  onSessionCreated,
  onRefreshNeeded,
  autoMessage,
  executionMode,
  onExecutionModeChange,
  injectedMessage,
  memoryUser,
  view,
  resources,
  sequenceId,
}: VideoChatProps) {
  const { message } = App.useApp();
  const userName = videoContext
    ? `video:${videoContext.projectId}:${videoContext.sequenceKey}`
    : "video:unknown";

  const { models, selectedModel, setSelectedModel } = useModels();

  const chat = useVideoChat(
    initialSessionId,
    userName,
    videoContext,
    preloadMcps,
    skills,
    onSessionCreated,
    onRefreshNeeded,
    executionMode,
    autoMessage,
    selectedModel,
    memoryUser,
  );

  const {
    pendingImages,
    setPendingImages,
    isDragOver,
    setIsDragOver,
    isComposing,
    setIsComposing,
    handleImageFiles,
    fileInputRef,
  } = useImageUpload((msg) => chat.setError(msg));

  const lastInjectedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!injectedMessage) return;
    if (lastInjectedIdRef.current === injectedMessage.id) return;
    lastInjectedIdRef.current = injectedMessage.id;
    void chat.sendDirect(injectedMessage.text);
  }, [chat, injectedMessage]);

  const handleSend = useCallback(() => {
    const images = pendingImages.length > 0 ? [...pendingImages] : undefined;
    setPendingImages([]);
    void chat.sendMessage(images);
  }, [chat, pendingImages, setPendingImages]);

  const timelineItems = useMemo(
    () => chat.timelineEvents
      .slice()
      .reverse()
      .map((event) => ({
        dot: <ClockCircleOutlined style={{ fontSize: 12, color: event.error ? "#ef4444" : "#2563eb" }} />,
        children: (
          <div className="pb-2">
            <Typography.Text style={{ fontSize: 12 }}>{timelineLabel(event)}</Typography.Text>
            <div className="text-[10px] text-slate-500">
              {new Date(event.at).toLocaleTimeString()}
              {event.durationMs !== undefined ? ` · ${event.durationMs}ms` : ""}
              {event.index !== undefined && event.total !== undefined ? ` · ${event.index + 1}/${event.total}` : ""}
            </div>
          </div>
        ),
      })),
    [chat.timelineEvents],
  );

  const storyboardCategories = useMemo(
    () => resources?.categories ?? [],
    [resources],
  );

  const handleStoryboardAction = useCallback(async (resource: DomainResource, action: StoryboardAction) => {
    if (action === "copy_prompt") {
      const prompt = getResourcePrompt(resource);
      if (!prompt) {
        void message.warning("This asset has no prompt to copy.");
        return;
      }
      try {
        await navigator.clipboard.writeText(prompt);
        void message.success("Prompt copied.");
      } catch {
        void message.error("Failed to copy prompt.");
      }
      return;
    }

    if (action === "continue") {
      await chat.sendDirect(buildContinueInstruction(resource));
      void message.success("Sent to chat.");
      return;
    }

    if (action === "style_ref") {
      if (resource.mediaType !== "image" || !resource.url) {
        void message.warning("Only image assets can be used as style references.");
        return;
      }
      await chat.sendDirect(buildStyleRefInstruction(resource));
      void message.success("Style reference instruction sent.");
    }
  }, [chat, message]);

  if (!videoContext) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-slate-500">
        Select a sequence to start chatting
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      <div className="flex min-w-0 flex-1 flex-col">
        {chat.error && (
          <Alert
            type="error"
            message={chat.error}
            showIcon
            closable
            onClose={() => chat.setError(null)}
            style={{ margin: "4px 8px 0" }}
            banner
          />
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          {view === "chat" && (
            <MessageList
              messages={chat.messages}
              isLoadingSession={chat.isLoadingSession}
              error={null}
              streamingReply={chat.streamingReply}
              streamingTools={chat.streamingTools}
            />
          )}

          {view === "timeline" && (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-2 flex items-center justify-between">
                <Typography.Text strong style={{ fontSize: 12 }}>Task Timeline</Typography.Text>
                <Button size="small" onClick={chat.clearTimeline}>Clear</Button>
              </div>
              {timelineItems.length === 0 ? (
                <Empty description="No timeline events yet" />
              ) : (
                <Timeline items={timelineItems} />
              )}
            </div>
          )}

          {view === "storyboard" && (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <Typography.Text strong style={{ fontSize: 12 }}>Storyboard</Typography.Text>
              {storyboardCategories.length === 0 ? (
                <div className="mt-3">
                  <Empty description="No resources yet" />
                </div>
              ) : (
                <div className="mt-2 space-y-3">
                  {storyboardCategories.map((group) => (
                    <section key={group.category} className="rounded-xl border border-slate-200 bg-slate-50/40 p-2.5">
                      <div className="mb-2 flex items-center gap-2">
                        <Typography.Text strong style={{ fontSize: 12 }}>{group.category}</Typography.Text>
                        <Tag style={{ margin: 0 }}>{group.items.length}</Tag>
                      </div>
                      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                        {group.items.map((resource) => (
                          <div key={resource.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            {renderStoryboardPreview(resource)}
                            <div className="space-y-1 border-t border-slate-100 px-2 py-1.5">
                              <Typography.Text style={{ fontSize: 11 }} ellipsis>
                                {resource.title ?? `${resource.mediaType} asset`}
                              </Typography.Text>
                              {getResourcePrompt(resource) && (
                                <div className="line-clamp-2 text-[10px] text-slate-500">
                                  {getResourcePrompt(resource)}
                                </div>
                              )}
                              <div className="flex items-center justify-between gap-1.5 pt-1">
                                <div className="flex items-center gap-1.5">
                                  {getResourcePrompt(resource) && (
                                    <Tooltip title="Copy prompt">
                                      <Button
                                        size="small"
                                        type="text"
                                        icon={<CopyOutlined />}
                                        onClick={() => void handleStoryboardAction(resource, "copy_prompt")}
                                      />
                                    </Tooltip>
                                  )}
                                  <Tooltip title="Continue generation from this asset">
                                    <Button
                                      size="small"
                                      type="text"
                                      icon={<PlayCircleOutlined />}
                                      onClick={() => void handleStoryboardAction(resource, "continue")}
                                    />
                                  </Tooltip>
                                </div>
                                <Dropdown
                                  trigger={["click"]}
                                  menu={{
                                    items: [
                                      { key: "continue", label: "Continue in chat" },
                                      ...(resource.mediaType === "image" && resource.url
                                        ? [{ key: "style_ref", label: "Use as style reference" }]
                                        : []),
                                    ],
                                    onClick: ({ key }) => {
                                      const action = parseStoryboardAction(key);
                                      if (action) void handleStoryboardAction(resource, action);
                                    },
                                  }}
                                >
                                  <Button size="small" type="text" icon={<MoreOutlined />} />
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "clip" && (
            <ClipComposer
              sequenceId={sequenceId}
              resources={resources}
              onSaved={onRefreshNeeded}
            />
          )}
        </div>

        {chat.activeTool && (
          <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600">
            <LoadingOutlined className="text-blue-400" />
            <span className="truncate">{chat.activeTool.name}</span>
            <span className="shrink-0 text-slate-400">
              {chat.activeTool.index + 1}/{chat.activeTool.total}
            </span>
          </div>
        )}

        {view === "chat" && (
          <footer className="px-3 py-2.5">
            {pendingImages.length > 0 && (
              <div className="mb-1.5 flex flex-wrap gap-1.5">
                {pendingImages.map((url, i) => (
                  <div key={url} className="group relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Pending ${i + 1}`} className="h-12 w-12 rounded border border-slate-200 object-cover" />
                    <CloseCircleFilled
                      className="absolute -right-1 -top-1 cursor-pointer text-slate-500 opacity-0 transition group-hover:opacity-100 hover:text-rose-500"
                      style={{ fontSize: 14 }}
                      onClick={() => setPendingImages((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                  </div>
                ))}
              </div>
            )}
            <div
              className={`flex items-end gap-2 rounded-xl border bg-white px-3 py-2 transition ${
                isDragOver ? "border-emerald-400 bg-emerald-50" : "border-slate-300"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); void handleImageFiles(Array.from(e.dataTransfer.files)); }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { void handleImageFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }}
              />
              <Button
                type="text"
                size="small"
                icon={<PictureOutlined />}
                onClick={() => fileInputRef.current?.click()}
                disabled={chat.isSending}
                className="shrink-0 !text-slate-500 hover:!text-slate-700"
              />
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 4 }}
                placeholder={isDragOver ? "松开以上传图片…" : "Chat with video agent…"}
                value={chat.input}
                onChange={(e) => chat.setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (isComposing) return;
                  const native = e.nativeEvent;
                  const composing =
                    typeof native === "object" &&
                    native !== null &&
                    "isComposing" in native &&
                    (native as { isComposing?: boolean }).isComposing === true;
                  if (composing) return;
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                onPaste={(e) => {
                  const files = Array.from(e.clipboardData.files);
                  if (files.some((f) => f.type.startsWith("image/"))) {
                    e.preventDefault();
                    void handleImageFiles(files);
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                disabled={chat.isSending}
                variant="borderless"
                style={{ fontSize: 12 }}
              />
              <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
                <Select<ExecutionMode>
                  size="small"
                  value={executionMode}
                  onChange={onExecutionModeChange}
                  options={[
                    { value: "checkpoint", label: "Checkpoint" },
                    { value: "yolo", label: "YOLO" },
                  ]}
                  style={{ minWidth: 106, fontSize: 11 }}
                  disabled={chat.isSending || chat.isStreaming}
                />
                {models.length > 1 && (
                  <Select
                    size="small"
                    value={selectedModel || undefined}
                    onChange={setSelectedModel}
                    options={models.map((m) => ({ value: m.id, label: m.label }))}
                    style={{ minWidth: 80, fontSize: 11 }}
                    disabled={chat.isSending || chat.isStreaming}
                  />
                )}
                <StatusBadge status={chat.status} />
                {chat.isStreaming ? (
                  <Button
                    danger
                    type="primary"
                    size="small"
                    icon={<StopOutlined />}
                    onClick={chat.stopStreaming}
                  />
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    disabled={chat.isSending || (chat.input.trim().length === 0 && pendingImages.length === 0)}
                  />
                )}
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
