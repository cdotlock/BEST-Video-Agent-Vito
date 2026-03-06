"use client";

import { useEffect, useRef } from "react";
import { Alert, Empty, Spin, Tag, Typography } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import type { ChatMessage } from "../types";
import { MessageBubble, stripMemoryLines } from "./MessageBubble";
import { StructuredMessageContent } from "./StructuredMessageContent";

/* ---- Helpers ---- */

export function mergeStreamingSummaries(summaries: string[]): string {
  const tools: string[] = [];
  const skills: string[] = [];
  for (const s of summaries) {
    const toolMatch = s.match(/^调用了工具：(.+)$/);
    if (toolMatch) {
      const name = toolMatch[1];
      if (name && !tools.includes(name)) tools.push(name);
      continue;
    }
    const skillMatch = s.match(/^使用了 skill[：:](.+)$/);
    if (skillMatch) {
      const name = skillMatch[1];
      if (name && !skills.includes(name)) skills.push(name);
      continue;
    }
    if (s === "使用了 skill") {
      if (!skills.includes("skill")) skills.push("skill");
    }
  }
  const parts: string[] = [];
  if (tools.length > 0) parts.push(`调用了工具：${tools.join("、")}`);
  if (skills.length > 0) parts.push(`使用了 skill：${skills.join("、")}`);
  return parts.join(" · ");
}

/** Message is a memory-only eviction artefact with no visible content. */
function isMemoryOnly(m: ChatMessage): boolean {
  if (m.role !== "assistant") return false;
  if (m.tool_calls && m.tool_calls.length > 0) return false;
  if (!m.content) return false;
  return stripMemoryLines(m.content).length === 0;
}

/* ---- Component ---- */

export interface MessageListProps {
  messages: ChatMessage[];
  isLoadingSession: boolean;
  error: string | null;
  streamingReply: string | null;
  streamingTools: string[];
}

export function MessageList({
  messages,
  isLoadingSession,
  error,
  streamingReply,
  streamingTools,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingReply, streamingTools]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 md:px-5">
      {error && (
        <Alert type="error" title={error} showIcon closable style={{ marginBottom: 12 }} />
      )}
      {isLoadingSession ? (
        <div className="flex items-center justify-center py-8">
          <Spin description="正在恢复导演台…" />
        </div>
      ) : messages.filter((m) => m.role !== "tool" && !m.hidden && !isMemoryOnly(m)).length === 0 ? (
        <Empty description="输入一句话开始创作，导演台会先规划再执行。" style={{ margin: "32px 0" }} />
      ) : (
        <div className="space-y-3">
          {messages
            .filter((m) => m.role !== "tool" && !m.hidden && !isMemoryOnly(m))
            .map((msg, idx) => (
              <MessageBubble key={`${msg.role}-${idx}`} message={msg} />
            ))}
          {streamingReply !== null && (
            <div className="director-bubble rounded-[26px] border border-[rgba(47,107,95,0.18)] bg-[rgba(255,255,255,0.72)] px-4 py-3 shadow-[0_16px_34px_rgba(110,97,84,0.08)]">
              <div className="mb-2">
                <Tag color="green" icon={<RobotOutlined />} style={{ fontSize: 10 }}>
                  Director Agent
                </Tag>
              </div>
              {streamingReply.length > 0 ? (
                <StructuredMessageContent content={stripMemoryLines(streamingReply)} />
              ) : (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  正在推演工作流…
                </Typography.Text>
              )}
              {streamingTools.length > 0 && (
                <div className="mt-3 rounded-[18px] border border-[var(--af-border)] bg-[rgba(255,253,249,0.8)] px-3 py-2 text-[10px] text-[var(--af-muted)]">
                  {mergeStreamingSummaries(streamingTools)}
                </div>
              )}
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
