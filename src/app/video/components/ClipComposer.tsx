"use client";

import { useMemo, useState } from "react";
import { Alert, App, Button, Card, Empty, Input, InputNumber, Select, Tag, Typography } from "antd";
import type { DomainResources } from "../types";
import { fetchJson } from "@/app/components/client-utils";

type ClipTransition = "none" | "cut" | "fade";

interface ClipDraft {
  id: string;
  resourceId: string | null;
  url: string | null;
  title: string;
  inSec: number;
  outSec: number;
  transition: ClipTransition;
}

export interface ClipComposerProps {
  sequenceId: string | null;
  resources: DomainResources | null;
  onSaved: () => void;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function ClipComposer({ sequenceId, resources, onSaved }: ClipComposerProps) {
  const { message } = App.useApp();
  const [planName, setPlanName] = useState("clip_plan_v1");
  const [saving, setSaving] = useState(false);
  const [clips, setClips] = useState<ClipDraft[]>([]);

  const videoItems = useMemo(() => {
    if (!resources) return [];
    return resources.categories.flatMap((group) =>
      group.items
        .filter((item) => item.mediaType === "video")
        .map((item) => ({
          id: item.id,
          title: item.title ?? item.category,
          url: item.url,
        })),
    );
  }, [resources]);

  const totalDuration = useMemo(
    () => clips.reduce((sum, clip) => sum + Math.max(0, clip.outSec - clip.inSec), 0),
    [clips],
  );

  const addClip = (resourceId: string, title: string, url: string | null) => {
    setClips((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        resourceId,
        url,
        title,
        inSec: 0,
        outSec: 5,
        transition: "none",
      },
    ]);
  };

  const addAllVideos = () => {
    const selected = new Set(clips.map((clip) => clip.resourceId).filter((id): id is string => id !== null));
    const append = videoItems
      .filter((item) => !selected.has(item.id))
      .map((item) => ({
        id: crypto.randomUUID(),
        resourceId: item.id,
        url: item.url ?? null,
        title: item.title,
        inSec: 0,
        outSec: 5,
        transition: "none" as ClipTransition,
      }));
    if (append.length === 0) {
      void message.info("所有视频素材都已加入。");
      return;
    }
    setClips((prev) => [...prev, ...append]);
  };

  const updateClip = (id: string, patch: Partial<ClipDraft>) => {
    setClips((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;
        const next = { ...clip, ...patch };
        const inSec = clamp(next.inSec, 0, Number.MAX_SAFE_INTEGER);
        const outSec = clamp(next.outSec, inSec, Number.MAX_SAFE_INTEGER);
        return { ...next, inSec, outSec };
      }),
    );
  };

  const moveClip = (id: string, direction: -1 | 1) => {
    setClips((prev) => {
      const index = prev.findIndex((clip) => clip.id === id);
      if (index < 0) return prev;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      if (!item) return prev;
      next.splice(nextIndex, 0, item);
      return next;
    });
  };

  const removeClip = (id: string) => {
    setClips((prev) => prev.filter((clip) => clip.id !== id));
  };

  const savePlan = async () => {
    if (!sequenceId) {
      void message.warning("请先选择序列");
      return;
    }
    if (clips.length === 0) {
      void message.warning("请先添加至少一个视频片段");
      return;
    }
    const cleanKey = planName.trim();
    if (!cleanKey) {
      void message.warning("请填写计划名称");
      return;
    }

    setSaving(true);
    try {
      const result = await fetchJson<{
        resourceId: string;
        clipCount: number;
        totalDurationSec: number;
      }>(`/api/video/sequences/${encodeURIComponent(sequenceId)}/clip-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: cleanKey,
          title: cleanKey,
          clips: clips.map((clip) => ({
            resourceId: clip.resourceId,
            url: clip.url,
            inSec: clip.inSec,
            outSec: clip.outSec,
            transition: clip.transition,
            title: clip.title,
          })),
        }),
      });
      void message.success(
        `已保存拼接计划：${result.clipCount} clips / ${result.totalDurationSec.toFixed(2)}s`,
      );
      onSaved();
    } catch (err) {
      const text = err instanceof Error ? err.message : String(err);
      void message.error(`保存失败：${text}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div className="mb-2 flex items-center justify-between">
        <Typography.Text strong style={{ fontSize: 12 }}>Clip Composer（最简剪辑）</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          Total: {totalDuration.toFixed(2)}s
        </Typography.Text>
      </div>

      <Alert
        className="mb-3"
        showIcon
        type="info"
        message="在这里完成片段排序、入出点与转场设置，然后保存为 clip plan JSON。"
      />

      <Card className="mb-3" size="small" title="计划名称">
        <Input
          size="small"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="clip_plan_v1"
        />
      </Card>

      <Card
        className="mb-3"
        size="small"
        title="可用视频素材"
        extra={
          <Button size="small" onClick={addAllVideos} disabled={videoItems.length === 0}>
            一键加入全部
          </Button>
        }
      >
        {videoItems.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可用视频素材" />
        ) : (
          <div className="space-y-1.5">
            {videoItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-slate-100 px-2 py-1.5">
                <Typography.Text style={{ fontSize: 12 }} ellipsis>
                    {item.title}
                  </Typography.Text>
                <Button size="small" onClick={() => addClip(item.id, item.title, item.url ?? null)}>Add</Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        size="small"
        title="拼接片段"
        extra={<Tag style={{ margin: 0 }}>{clips.length} clips</Tag>}
      >
        {clips.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还未添加片段" />
        ) : (
          <div className="space-y-2">
            {clips.map((clip, index) => (
              <div key={clip.id} className="rounded border border-slate-100 px-2 py-2">
                <div className="mb-1.5 flex items-center justify-between">
                  <Typography.Text style={{ fontSize: 12 }}>
                    {index + 1}. {clip.title}
                  </Typography.Text>
                  <div className="flex items-center gap-1">
                    <Button size="small" onClick={() => moveClip(clip.id, -1)}>↑</Button>
                    <Button size="small" onClick={() => moveClip(clip.id, 1)}>↓</Button>
                    <Button size="small" danger onClick={() => removeClip(clip.id)}>Remove</Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <InputNumber
                    size="small"
                    min={0}
                    value={clip.inSec}
                    onChange={(value) => updateClip(clip.id, { inSec: Number(value ?? 0) })}
                    addonBefore="In"
                    style={{ width: "100%" }}
                  />
                  <InputNumber
                    size="small"
                    min={clip.inSec}
                    value={clip.outSec}
                    onChange={(value) => updateClip(clip.id, { outSec: Number(value ?? clip.inSec) })}
                    addonBefore="Out"
                    style={{ width: "100%" }}
                  />
                  <Select<ClipTransition>
                    size="small"
                    value={clip.transition}
                    onChange={(value) => updateClip(clip.id, { transition: value })}
                    options={[
                      { value: "none", label: "None" },
                      { value: "cut", label: "Cut" },
                      { value: "fade", label: "Fade" },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-3 flex justify-end">
        <Button type="primary" loading={saving} onClick={savePlan}>
          保存拼接计划
        </Button>
      </div>
    </div>
  );
}
