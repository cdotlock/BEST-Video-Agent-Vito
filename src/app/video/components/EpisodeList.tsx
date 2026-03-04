"use client";

import { useMemo, useState } from "react";
import { Button, Typography, Empty, Tag, Input, Select } from "antd";
import {
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { SequenceSummary, SequenceStatus } from "../types";
import type { SessionSummary } from "@/app/types";

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<SequenceStatus, { color: string; label: string }> = {
  empty: { color: "default", label: "未初始化" },
  uploaded: { color: "blue", label: "已初始化" },
  has_resources: { color: "green", label: "有素材" },
};

function SequenceStatusTag({ status }: { status: SequenceStatus }) {
  const cfg = STATUS_CONFIG[status];
  return <Tag color={cfg.color} style={{ fontSize: 11, lineHeight: "18px", margin: 0 }}>{cfg.label}</Tag>;
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface EpisodeListProps {
  projectName: string;
  sequences: SequenceSummary[];
  isLoading: boolean;
  isUploading: boolean;
  selectedSequence: SequenceSummary | null;
  onSelectSequence: (seq: SequenceSummary) => void;
  onDeleteSequence: (seq: SequenceSummary) => void;
  onRefresh: () => void;
  onUpload: (sequenceKey: string, sequenceName: string | null, content: string | null) => void;
  /** Sessions for the currently selected sequence. */
  sessions: SessionSummary[];
  currentSessionId: string | undefined;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  mode?: "full" | "sessions_only";
  embedded?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EpisodeList({
  projectName,
  sequences,
  isLoading,
  isUploading,
  selectedSequence,
  onSelectSequence,
  onDeleteSequence,
  onRefresh,
  onUpload,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  mode = "full",
  embedded = false,
}: EpisodeListProps) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SequenceStatus>("all");
  const showPlanSection = mode === "full";

  const filteredSequences = useMemo(() => {
    const needle = searchText.trim().toLowerCase();
    return sequences.filter((seq) => {
      if (statusFilter !== "all" && seq.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        seq.sequenceKey.toLowerCase().includes(needle)
        || (seq.sequenceName ?? "").toLowerCase().includes(needle)
      );
    });
  }, [searchText, sequences, statusFilter]);

  const handleCreatePlan = () => {
    const nextIndex = sequences.reduce((max, seq) => {
      const matched = seq.sequenceKey.match(/(\d+)$/);
      if (!matched) return max;
      const parsed = Number.parseInt(matched[1] ?? "0", 10);
      if (Number.isNaN(parsed)) return max;
      return parsed > max ? parsed : max;
    }, 0) + 1;

    const nextKey = `PLAN${nextIndex}`;
    const nextName = `计划 ${nextIndex}`;
    onUpload(nextKey, nextName, null);
  };

  const formatPlanCode = (sequenceKey: string): string => {
    return sequenceKey.replace(/^SQ/i, "PLAN");
  };

  return (
    <aside className={`flex h-full flex-col border-r border-slate-200 bg-white ${embedded ? "w-full" : "w-64 shrink-0"}`}>
      {/* Header */}
      <div className="border-b border-slate-200 p-3">
        <Typography.Text strong ellipsis style={{ display: "block", fontSize: 14 }}>
          {showPlanSection ? projectName : "会话历史"}
        </Typography.Text>
        {showPlanSection && (
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={handleCreatePlan}
            loading={isUploading}
            disabled={isUploading}
            block
            style={{ marginTop: 8 }}
          >
            {isUploading ? "创建中..." : "新建计划"}
          </Button>
        )}
      </div>

      {/* Plans */}
      <div className="flex-1 overflow-y-auto p-2">
        {showPlanSection && (
          <>
            <div className="mb-1 flex items-center justify-between">
              <Typography.Text type="secondary" style={{ fontSize: 11, letterSpacing: "0.04em" }}>
                计划
              </Typography.Text>
              <Button type="text" size="small" icon={<ReloadOutlined />} loading={isLoading} onClick={onRefresh} />
            </div>
            <div className="mb-2 grid grid-cols-1 gap-1.5">
              <Input
                size="small"
                placeholder="搜索计划/历史"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                allowClear
              />
              <Select<"all" | SequenceStatus>
                size="small"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "全部状态" },
                  { value: "empty", label: "未初始化" },
                  { value: "uploaded", label: "已初始化" },
                  { value: "has_resources", label: "有素材" },
                ]}
              />
            </div>

            {filteredSequences.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无计划" style={{ margin: "12px 0" }} />
            ) : (
              <div className="space-y-1">
                {filteredSequences.map((seq) => {
                  const isActive = selectedSequence?.id === seq.id;
                  return (
                    <div key={seq.id} className="group relative">
                      <button
                        type="button"
                        className={`w-full rounded border px-2.5 py-2 text-left transition ${
                          isActive
                            ? "border-blue-300 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                        onClick={() => onSelectSequence(seq)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium text-slate-900">
                            {formatPlanCode(seq.sequenceKey)}
                          </span>
                          <SequenceStatusTag status={seq.status} />
                        </div>
                        {seq.sequenceName && (
                          <div className="mt-0.5 truncate text-[11px] text-slate-500">
                            {seq.sequenceName}
                          </div>
                        )}
                        {seq.activeStyleProfileId && (
                          <div className="mt-1">
                            <Tag color="gold" style={{ fontSize: 10, lineHeight: "16px", margin: 0 }}>
                              已绑风格
                            </Tag>
                          </div>
                        )}
                      </button>
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        className="!absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); onDeleteSequence(seq); }}
                        style={{ width: 20, height: 20, minWidth: 20 }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Sessions for selected plan */}
        {(showPlanSection ? !!selectedSequence : true) && (
          <div className={showPlanSection ? "mt-4" : ""}>
            <div className="mb-1 flex items-center justify-between">
              <Typography.Text type="secondary" style={{ fontSize: 11, letterSpacing: "0.04em" }}>
                会话
              </Typography.Text>
              <Button type="text" size="small" icon={<PlusOutlined />} onClick={onNewSession} title="新建会话" />
            </div>
            {sessions.length === 0 ? (
              <div className="py-2 text-center text-[11px] text-slate-500">
                暂无会话，点击 + 新建。
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((s) => {
                  const isActive = currentSessionId === s.id;
                  return (
                    <div key={s.id} className="group relative">
                      <button
                        type="button"
                        className={`w-full rounded border px-2 py-1.5 text-left text-[11px] transition ${
                          isActive
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                        onClick={() => onSelectSession(s.id)}
                      >
                        <div className="truncate pr-5 text-slate-700">
                          {s.title?.trim() || "未命名会话"}
                        </div>
                      </button>
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        className="!absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                        style={{ width: 20, height: 20, minWidth: 20 }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
