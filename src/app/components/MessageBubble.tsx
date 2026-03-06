"use client";

import { Tag, Typography, Image } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  SettingOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import type { ChatMessage, ToolCall } from "../types";
import { parseJsonObject } from "./client-utils";
import { MarkdownContent } from "./MarkdownContent";
import { StructuredMessageContent } from "./StructuredMessageContent";

/* ---- Helpers ---- */

/** Strip internal [memory] lines from assistant content (eviction artefact). */
export function stripMemoryLines(text: string): string {
  return text
    .split("\n")
    .filter((line) => !line.startsWith("[memory] "))
    .join("\n")
    .trim();
}

function summarizeToolCalls(calls: ToolCall[]): string {
  const tools: string[] = [];
  const skills: string[] = [];
  for (const call of calls) {
    const name = call.function.name;
    if (name.startsWith("skills__")) {
      const parsed = parseJsonObject(call.function.arguments);
      const skillName = parsed && typeof parsed.name === "string" ? parsed.name : "skill";
      if (!skills.includes(skillName)) skills.push(skillName);
    } else {
      if (!tools.includes(name)) tools.push(name);
    }
  }
  const parts: string[] = [];
  if (tools.length > 0) parts.push(`调用了工具：${tools.join("、")}`);
  if (skills.length > 0) parts.push(`使用了 skill：${skills.join("、")}`);
  return parts.join(" · ");
}

const roleConfig: Record<
  ChatMessage["role"],
  { label: string; color: string; icon: React.ReactNode; tone: string }
> = {
  user: { label: "User", color: "default", icon: <UserOutlined />, tone: "border-[var(--af-border)] bg-[rgba(255,253,249,0.92)]" },
  assistant: { label: "Director Agent", color: "green", icon: <RobotOutlined />, tone: "border-[rgba(47,107,95,0.18)] bg-[rgba(255,255,255,0.72)]" },
  system: { label: "System", color: "orange", icon: <SettingOutlined />, tone: "border-[rgba(201,139,91,0.18)] bg-[rgba(255,247,240,0.9)]" },
  tool: { label: "Tool", color: "blue", icon: <ToolOutlined />, tone: "border-[rgba(141,167,194,0.28)] bg-[rgba(245,249,252,0.92)]" },
};

/* ---- Component ---- */

export interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const cfg = roleConfig[message.role];
  const content = message.content ? stripMemoryLines(message.content) : "";

  return (
    <div className={`director-bubble rounded-[26px] border px-4 py-3 shadow-[0_16px_34px_rgba(110,97,84,0.08)] ${cfg.tone}`}>
      <div className="mb-2">
        <Tag color={cfg.color} icon={cfg.icon} style={{ fontSize: 10 }}>
          {cfg.label}
        </Tag>
      </div>
      {content ? (
        message.role === "assistant" ? (
          <StructuredMessageContent content={content} />
        ) : (
          <MarkdownContent
            content={content}
            className="text-[13px] leading-7 text-[var(--af-text)]"
          />
        )
      ) : (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>No content</Typography.Text>
      )}
      {message.images && message.images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Image.PreviewGroup>
            {message.images.map((url, i) => (
              <Image
                key={i}
                src={url}
                alt={`Image ${i + 1}`}
                height={96}
                style={{ maxWidth: 160, objectFit: "cover", borderRadius: 16 }}
              />
            ))}
          </Image.PreviewGroup>
        </div>
      )}
      {message.role === "assistant" && message.tool_calls && message.tool_calls.length > 0 && (
        <div className="mt-3 rounded-[18px] border border-[var(--af-border)] bg-[rgba(255,253,249,0.8)] px-3 py-2 text-[10px] text-[var(--af-muted)]">
          {summarizeToolCalls(message.tool_calls)}
        </div>
      )}
    </div>
  );
}
