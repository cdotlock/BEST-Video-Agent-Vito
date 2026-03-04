"use client";

import { useCallback, useEffect, useRef } from "react";
import { Alert, App, Button, Input, Select } from "antd";
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
  VideoContext,
  VideoTimelineEvent,
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
  checkpointPlanStatus?: "none" | "draft" | "approved";
  onCheckpointPlanStatusChange?: (status: "none" | "draft" | "approved") => void;
  onPlanDetected?: (plan: { title: string | null; items: string[]; raw: string }) => void;
  onTimelineEventsChange?: (events: VideoTimelineEvent[]) => void;
}

function parseAgentPlanFromText(text: string): { title: string | null; items: string[] } | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const itemRegex = /^(?:[-*]\s*)?(?:\d+[\.、\)]|[一二三四五六七八九十]+[、\.])\s*(.+)$/;
  const items: string[] = [];
  for (const line of lines) {
    const match = line.match(itemRegex);
    if (!match) continue;
    const content = match[1]?.trim();
    if (!content) continue;
    items.push(content);
  }

  if (items.length < 3) return null;

  let title: string | null = null;
  for (const line of lines) {
    const normalized = line.replace(/^#+\s*/, "").trim();
    if (normalized.includes("计划") && normalized.length <= 40) {
      title = normalized;
      break;
    }
  }

  return { title, items: items.slice(0, 10) };
}

function buildCheckpointPlanningPrompt(userPrompt: string, imageCount: number): string {
  return [
    "你现在处于 checkpoint 模式。",
    "请先只输出执行计划，不要调用任何工具，不要开始生成素材。",
    "计划要求：",
    "1. 4-8 步，每步一句。",
    "2. 第一部分必须说明将采用的默认风格（优先内置风格）。",
    "3. 标出高成本步骤（需要确认）。",
    `用户需求：${userPrompt}`,
    imageCount > 0 ? `附带参考图片数量：${imageCount}` : null,
  ].filter((line): line is string => line !== null).join("\n");
}

function buildYoloPlannedPrompt(userPrompt: string, imageCount: number): string {
  return [
    "你现在处于 YOLO 模式。",
    "请先给出简短执行计划（3-6 步），随后立刻按计划自动执行，不等待确认。",
    `用户需求：${userPrompt}`,
    imageCount > 0 ? `附带参考图片数量：${imageCount}` : null,
  ].filter((line): line is string => line !== null).join("\n");
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
  checkpointPlanStatus = "none",
  onCheckpointPlanStatusChange,
  onPlanDetected,
  onTimelineEventsChange,
}: VideoChatProps) {
  const { message } = App.useApp();
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
  const lastPlanSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    onTimelineEventsChange?.(chat.timelineEvents);
  }, [chat.timelineEvents, onTimelineEventsChange]);

  useEffect(() => {
    if (!injectedMessage) return;
    if (lastInjectedIdRef.current === injectedMessage.id) return;
    lastInjectedIdRef.current = injectedMessage.id;
    void chat.sendDirect(injectedMessage.text);
  }, [chat, injectedMessage]);

  useEffect(() => {
    const candidate = chat.streamingReply ?? [...chat.messages].reverse().find((item) => item.role === "assistant")?.content;
    if (typeof candidate !== "string" || candidate.trim().length === 0) return;

    const parsed = parseAgentPlanFromText(candidate);
    if (!parsed) return;

    const signature = `${parsed.title ?? ""}|${parsed.items.join("|")}`;
    if (signature === lastPlanSignatureRef.current) return;
    lastPlanSignatureRef.current = signature;

    onPlanDetected?.({ title: parsed.title, items: parsed.items, raw: candidate });
  }, [chat.messages, chat.streamingReply, onPlanDetected]);

  const handleSend = useCallback(() => {
    const text = chat.input.trim();
    const imageCount = pendingImages.length;
    if (text.length === 0 && imageCount === 0) return;

    if (executionMode === "checkpoint") {
      if (checkpointPlanStatus === "none") {
        const plannerPrompt = buildCheckpointPlanningPrompt(text || "(仅图片输入)", imageCount);
        setPendingImages([]);
        onCheckpointPlanStatusChange?.("draft");
        void chat.sendDirect(plannerPrompt);
        return;
      }
      if (checkpointPlanStatus === "draft") {
        void message.info("请先在左侧确认计划，再继续执行。");
        return;
      }
    }

    if (executionMode === "yolo" && checkpointPlanStatus === "none") {
      const yoloPrompt = buildYoloPlannedPrompt(text || "(仅图片输入)", imageCount);
      setPendingImages([]);
      onCheckpointPlanStatusChange?.("approved");
      void chat.sendDirect(yoloPrompt);
      return;
    }

    const images = pendingImages.length > 0 ? [...pendingImages] : undefined;
    setPendingImages([]);
    void chat.sendMessage(images);
  }, [
    chat,
    checkpointPlanStatus,
    executionMode,
    message,
    onCheckpointPlanStatusChange,
    pendingImages,
    setPendingImages,
  ]);

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
        {!videoContext && (
          <Alert
            type="info"
            message="可以直接输入一句话开始创作，系统会自动初始化计划。"
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
                placeholder={isDragOver ? "松开以上传图片…" : "输入一句话，Agent 先给计划再执行…"}
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
