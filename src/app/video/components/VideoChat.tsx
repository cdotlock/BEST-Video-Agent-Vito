"use client";

import { useCallback, useEffect, useRef } from "react";
import { Alert, Button, Input, Select } from "antd";
import {
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
  DomainResources,
  ExecutionMode,
  QueuedClipResource,
  VideoProConfig,
  VideoContext,
  WorkspaceView,
} from "../types";

export interface VideoChatProps {
  initialSessionId: string | undefined;
  videoContext: VideoContext | null;
  ensureVideoContext?: () => Promise<VideoContext | null>;
  preloadMcps: string[];
  skills: string[];
  onSessionCreated: (sessionId: string) => void;
  onRefreshNeeded: () => void;
  autoMessage?: string;
  executionMode: ExecutionMode;
  onExecutionModeChange: (mode: ExecutionMode) => void;
  injectedMessage?: { id: string; text: string } | null;
  memoryUser: string;
  view: WorkspaceView;
  resources: DomainResources | null;
  sequenceId: string | null;
  proConfig?: VideoProConfig;
  contextMaterials?: Array<{ id: string; title: string | null }>;
  styleReferenceMaterials?: Array<{ id: string; title: string | null }>;
  queuedClipResource?: QueuedClipResource | null;
  onRemoveContextMaterial?: (resourceId: string) => void;
  onRemoveStyleReference?: (resourceId: string) => void;
  onConsumeQueuedClipResource?: () => void;
}

function executionModeHint(mode: ExecutionMode): string {
  if (mode === "yolo") return "YOLO 偏好：默认连续执行，仅在缺输入或硬失败时停下";
  return "Checkpoint 偏好：关键动作倾向先确认，普通生成直接推进";
}

export function VideoChat({
  initialSessionId,
  videoContext,
  ensureVideoContext,
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
  proConfig,
  contextMaterials = [],
  styleReferenceMaterials = [],
  queuedClipResource,
  onRemoveContextMaterial,
  onRemoveStyleReference,
  onConsumeQueuedClipResource,
}: VideoChatProps) {
  const { models, selectedModel, setSelectedModel } = useModels();

  const chat = useVideoChat(
    initialSessionId,
    videoContext,
    ensureVideoContext,
    preloadMcps,
    skills,
    onSessionCreated,
    onRefreshNeeded,
    executionMode,
    autoMessage,
    selectedModel,
    memoryUser,
    contextMaterials.map((item) => item.id),
    styleReferenceMaterials.map((item) => item.id),
    proConfig,
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
    const text = chat.input.trim();
    const imageCount = pendingImages.length;
    if (text.length === 0 && imageCount === 0) return;

    const images = pendingImages.length > 0 ? [...pendingImages] : undefined;
    setPendingImages([]);
    void chat.sendMessage(images);
  }, [chat, pendingImages, setPendingImages]);

  return (
    <div className="ceramic-stage flex h-full">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {chat.error && (
          <Alert
            type="error"
            title={chat.error}
            showIcon
            closable
            onClose={() => chat.setError(null)}
            style={{ margin: "4px 8px 0" }}
            banner
          />
        )}
        {!videoContext && (
          <Alert
            type="info"
            title="可以直接输入一句话开始创作，系统会自动初始化工作区。"
            showIcon
            style={{ margin: "4px 8px 0" }}
            banner
          />
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          {view === "clip" ? (
            <ClipComposer
              sequenceId={sequenceId}
              resources={resources}
              memoryUser={memoryUser}
              videoContext={videoContext}
              modelId={selectedModel ?? null}
              queuedClipResource={queuedClipResource}
              onConsumeQueuedClipResource={onConsumeQueuedClipResource}
              onSaved={onRefreshNeeded}
            />
          ) : (
            <MessageList
              messages={chat.messages}
              isLoadingSession={chat.isLoadingSession}
              error={null}
              streamingReply={chat.streamingReply}
              streamingTools={chat.streamingTools}
            />
          )}
        </div>

        {chat.activeTool && (
          <div className="flex items-center gap-2 border-t border-[var(--af-border)] bg-[rgba(255,253,249,0.72)] px-3 py-1.5 text-[11px] text-[var(--af-muted)]">
            <LoadingOutlined className="text-blue-400" />
            <span className="truncate">{chat.activeTool.name}</span>
            <span className="shrink-0 text-slate-400">
              {chat.activeTool.index + 1}/{chat.activeTool.total}
            </span>
          </div>
        )}

        {view === "chat" && (
          <footer className="px-3 py-2.5">
            {(contextMaterials.length > 0 || styleReferenceMaterials.length > 0) && (
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                {contextMaterials.map((item) => (
                  <div key={`ctx-${item.id}`} className="ceramic-chip flex items-center gap-1 px-2 py-0.5 text-[11px]">
                    <span>@{item.title?.trim() || item.id.slice(0, 8)}</span>
                    <CloseCircleFilled
                      className="cursor-pointer text-slate-400 hover:text-rose-500"
                      onClick={() => onRemoveContextMaterial?.(item.id)}
                    />
                  </div>
                ))}
                {styleReferenceMaterials.map((item) => (
                  <div key={`style-${item.id}`} className="ceramic-chip flex items-center gap-1 border-[rgba(141,167,194,0.26)] bg-[rgba(141,167,194,0.12)] px-2 py-0.5 text-[11px] text-[var(--af-text)]">
                    <span>风格参考:{item.title?.trim() || item.id.slice(0, 8)}</span>
                    <CloseCircleFilled
                      className="cursor-pointer text-blue-300 hover:text-rose-500"
                      onClick={() => onRemoveStyleReference?.(item.id)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mb-1 text-[11px] text-[var(--af-muted)]">{executionModeHint(executionMode)}</div>
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
              className={`director-input-shell flex items-end gap-2 px-3 py-2 transition ${
                isDragOver ? "border-emerald-400 bg-emerald-50/70" : ""
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
                className="shrink-0 !text-[var(--af-muted)] hover:!text-[var(--af-text)]"
              />
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 4 }}
                placeholder={isDragOver ? "松开以上传图片…" : "输入一句话，直接在对话中规划并执行工作流…"}
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
                style={{ fontSize: 12, color: "var(--af-text)" }}
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
