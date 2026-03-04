"use client";

import { useMemo, useRef, useState } from "react";
import { Button, Typography, Empty, Tag, Input, Select } from "antd";
import {
  UploadOutlined,
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
  empty: { color: "default", label: "empty" },
  uploaded: { color: "blue", label: "uploaded" },
  has_resources: { color: "green", label: "active" },
};

function SequenceStatusTag({ status }: { status: SequenceStatus }) {
  const cfg = STATUS_CONFIG[status];
  return <Tag color={cfg.color} style={{ fontSize: 10, lineHeight: "16px", margin: 0 }}>{cfg.label}</Tag>;
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
  embedded = false,
}: EpisodeListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SequenceStatus>("all");

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      // Derive sequenceKey from filename: "EP3.md" → "SQ3", "第3章.md" → "SQ3"
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const epMatch = baseName.match(/(?:EP|ep|Ep)\s*(\d+)/i) ?? baseName.match(/第\s*(\d+)\s*章/);
      const sequenceKey = epMatch ? `SQ${epMatch[1]}` : baseName.toUpperCase();
      const sequenceName = baseName;

      onUpload(sequenceKey, sequenceName, content);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <aside className={`flex h-full flex-col border-r border-slate-200 bg-white ${embedded ? "w-full" : "w-60 shrink-0"}`}>
      {/* Header */}
      <div className="border-b border-slate-200 p-3">
        <Typography.Text strong ellipsis style={{ display: "block", fontSize: 13 }}>
          {projectName}
        </Typography.Text>
        <Button
          size="small"
          icon={<UploadOutlined />}
          onClick={() => fileInputRef.current?.click()}
          loading={isUploading}
          disabled={isUploading}
          block
          style={{ marginTop: 8 }}
        >
          {isUploading ? "Initializing…" : "Upload Sequence File"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>

      {/* Sequences */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-1 flex items-center justify-between">
          <Typography.Text type="secondary" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Sequences
          </Typography.Text>
          <Button type="text" size="small" icon={<ReloadOutlined />} loading={isLoading} onClick={onRefresh} />
        </div>
        <div className="mb-2 grid grid-cols-1 gap-1.5">
          <Input
            size="small"
            placeholder="Search sequence"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            allowClear
          />
          <Select<"all" | SequenceStatus>
            size="small"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All status" },
              { value: "empty", label: "Empty" },
              { value: "uploaded", label: "Uploaded" },
              { value: "has_resources", label: "Active" },
            ]}
          />
        </div>

        {filteredSequences.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No sequences" style={{ margin: "12px 0" }} />
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
                      <span className="text-xs font-medium text-slate-900">
                        {seq.sequenceKey}
                      </span>
                      <SequenceStatusTag status={seq.status} />
                    </div>
                    {seq.sequenceName && (
                      <div className="mt-0.5 truncate text-[10px] text-slate-500">
                        {seq.sequenceName}
                      </div>
                    )}
                    {seq.activeStyleProfileId && (
                      <div className="mt-1">
                        <Tag color="gold" style={{ fontSize: 9, lineHeight: "14px", margin: 0 }}>
                          style
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

        {/* Sessions for selected sequence */}
        {selectedSequence && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <Typography.Text type="secondary" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sessions
              </Typography.Text>
              <Button type="text" size="small" icon={<PlusOutlined />} onClick={onNewSession} title="New Chat" />
            </div>
            {sessions.length === 0 ? (
              <div className="py-2 text-center text-[10px] text-slate-500">
                No sessions. Click + to start.
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((s) => {
                  const isActive = currentSessionId === s.id;
                  return (
                    <div key={s.id} className="group relative">
                      <button
                        type="button"
                        className={`w-full rounded border px-2 py-1 text-left text-[10px] transition ${
                          isActive
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                        onClick={() => onSelectSession(s.id)}
                      >
                        <div className="truncate pr-5 text-slate-700">
                          {s.title?.trim() || "Untitled"}
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
