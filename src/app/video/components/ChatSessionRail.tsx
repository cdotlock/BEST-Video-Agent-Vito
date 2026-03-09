"use client";

import { DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Empty, Select, Typography } from "antd";
import { formatTimestamp } from "@/app/components/client-utils";
import type { SessionSummary } from "@/app/types";

interface SequenceOption {
  id: string;
  sequenceKey: string;
  sequenceName: string | null;
}

export interface ChatSessionRailProps {
  sequences: SequenceOption[];
  selectedSequenceId: string | null;
  onSelectSequence: (sequenceId: string) => void;
  formatSequenceLabel: (sequenceKey: string, sequenceName: string | null) => string;
  sessions: SessionSummary[];
  currentSessionId: string | undefined;
  isLoadingSessions: boolean;
  onRefreshSessions: () => void;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatSessionRail({
  sequences,
  selectedSequenceId,
  onSelectSequence,
  formatSequenceLabel,
  sessions,
  currentSessionId,
  isLoadingSessions,
  onRefreshSessions,
  onNewSession,
  onSelectSession,
  onDeleteSession,
}: ChatSessionRailProps) {
  const showSequenceSelect = sequences.length > 1;

  return (
    <aside className="flex h-full w-[244px] shrink-0 flex-col border-r border-[rgba(229,221,210,0.92)] bg-[rgba(255,253,249,0.78)]">
      <div className="border-b border-[rgba(229,221,210,0.92)] px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <Typography.Text strong style={{ fontSize: 13 }}>
              会话
            </Typography.Text>
            <div className="mt-0.5 text-[11px] text-[var(--af-muted)]">
              当前创作线程
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="small"
              type="text"
              icon={<ReloadOutlined />}
              loading={isLoadingSessions}
              onClick={onRefreshSessions}
            />
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={onNewSession}
            >
              新会话
            </Button>
          </div>
        </div>

        {showSequenceSelect ? (
          <Select
            className="mt-3"
            size="small"
            value={selectedSequenceId ?? undefined}
            placeholder="选择序列"
            options={sequences.map((sequence) => ({
              value: sequence.id,
              label: formatSequenceLabel(sequence.sequenceKey, sequence.sequenceName),
            }))}
            onChange={onSelectSequence}
          />
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-1.5">
          {currentSessionId === undefined ? (
            <button
              type="button"
              className="w-full rounded-[16px] border border-[rgba(47,107,95,0.26)] bg-[rgba(47,107,95,0.1)] px-3 py-2 text-left transition"
              onClick={onNewSession}
            >
              <div className="truncate text-[12px] font-medium text-[var(--af-text)]">
                新的会话
              </div>
              <div className="mt-0.5 text-[10px] text-[var(--af-muted)]">
                从当前上下文继续提要求
              </div>
            </button>
          ) : null}

          {sessions.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="还没有历史会话"
              style={{ margin: "20px 0" }}
            />
          ) : (
            sessions.map((session) => {
              const isActive = currentSessionId === session.id;
              return (
                <div key={session.id} className="group relative">
                  <button
                    type="button"
                    className={`w-full rounded-[16px] border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-[rgba(47,107,95,0.26)] bg-[rgba(47,107,95,0.1)]"
                        : "border-[rgba(229,221,210,0.92)] bg-white hover:border-[rgba(47,107,95,0.2)]"
                    }`}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <div className="truncate pr-6 text-[12px] font-medium text-[var(--af-text)]">
                      {session.title?.trim() || "未命名会话"}
                    </div>
                    <div className="mt-0.5 text-[10px] text-[var(--af-muted)]">
                      {formatTimestamp(session.updatedAt)}
                    </div>
                  </button>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    className="!absolute right-1 top-1 opacity-0 group-hover:opacity-100"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
