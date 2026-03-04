"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Input,
  InputNumber,
  Select,
  Slider,
  Tag,
  Typography,
} from "antd";
import {
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

interface SortableClipBlockProps {
  clip: ClipDraft;
  index: number;
  width: number;
  active: boolean;
  playing: boolean;
  onSelect: (id: string) => void;
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

function asTransition(value: unknown): ClipTransition {
  if (value === "cut" || value === "fade") return value;
  return "none";
}

function SortableClipBlock({
  clip,
  index,
  width,
  active,
  playing,
  onSelect,
}: SortableClipBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: clip.id });

  const style: React.CSSProperties = {
    width,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      className={`rounded-md border px-2 py-1.5 text-left shadow-sm transition ${
        active
          ? "border-blue-400 bg-blue-50"
          : "border-slate-300 bg-white hover:border-slate-400"
      } ${playing ? "ring-2 ring-emerald-300" : ""}`}
      onClick={() => onSelect(clip.id)}
      {...attributes}
      {...listeners}
    >
      <div className="truncate text-[11px] font-medium text-slate-800">
        {index + 1}. {clip.title}
      </div>
      <div className="mt-0.5 text-[10px] text-slate-500">
        {clip.inSec.toFixed(1)}s - {clip.outSec.toFixed(1)}s · {clip.transition}
      </div>
    </button>
  );
}

export function ClipComposer({ sequenceId, resources, onSaved }: ClipComposerProps) {
  const { message } = App.useApp();
  const [planName, setPlanName] = useState("clip_plan_v1");
  const [saving, setSaving] = useState(false);
  const [clips, setClips] = useState<ClipDraft[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const roughAdvancingRef = useRef(false);

  const [isRoughPlaying, setIsRoughPlaying] = useState(false);
  const [roughPlaybackIndex, setRoughPlaybackIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

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

  const selectedClip = useMemo(
    () => clips.find((clip) => clip.id === selectedClipId) ?? null,
    [clips, selectedClipId],
  );

  const previewClip = useMemo(() => {
    if (isRoughPlaying && roughPlaybackIndex !== null) {
      return clips[roughPlaybackIndex] ?? null;
    }
    return selectedClip;
  }, [clips, isRoughPlaying, roughPlaybackIndex, selectedClip]);

  const clipPlanResource = useMemo(() => {
    if (!resources) return null;
    const candidates = resources.categories
      .flatMap((group) => group.items)
      .filter((item) => {
        if (item.mediaType !== "json") return false;
        if (!item.data || typeof item.data !== "object") return false;
        const rec = item.data as Record<string, unknown>;
        return rec.type === "clip_plan";
      });
    if (candidates.length === 0) return null;
    return candidates.reduce((latest, current) => (
      current.sortOrder > latest.sortOrder ? current : latest
    ));
  }, [resources]);

  useEffect(() => {
    if (clips.length === 0) {
      setSelectedClipId(null);
      return;
    }
    if (!selectedClipId || !clips.some((clip) => clip.id === selectedClipId)) {
      setSelectedClipId(clips[0]?.id ?? null);
    }
  }, [clips, selectedClipId]);

  const stopRoughPlayback = useCallback(() => {
    setIsRoughPlaying(false);
    setRoughPlaybackIndex(null);
    roughAdvancingRef.current = false;
    const video = previewVideoRef.current;
    if (video) {
      video.pause();
    }
  }, []);

  const findNextPlayableIndex = useCallback((from: number): number | null => {
    for (let index = from; index < clips.length; index += 1) {
      const clip = clips[index];
      if (clip?.url) return index;
    }
    return null;
  }, [clips]);

  const advanceToNextRoughClip = useCallback(() => {
    if (roughPlaybackIndex === null) {
      stopRoughPlayback();
      return;
    }
    const nextIndex = findNextPlayableIndex(roughPlaybackIndex + 1);
    if (nextIndex === null) {
      stopRoughPlayback();
      return;
    }
    roughAdvancingRef.current = true;
    setRoughPlaybackIndex(nextIndex);
    setSelectedClipId(clips[nextIndex]?.id ?? null);
  }, [clips, findNextPlayableIndex, roughPlaybackIndex, stopRoughPlayback]);

  useEffect(() => {
    if (!isRoughPlaying || roughPlaybackIndex === null) return;
    const clip = clips[roughPlaybackIndex];
    if (!clip || !clip.url) {
      advanceToNextRoughClip();
      return;
    }

    const video = previewVideoRef.current;
    if (!video) return;

    roughAdvancingRef.current = false;

    const beginPlayback = () => {
      const clipIn = clamp(clip.inSec, 0, Number.MAX_SAFE_INTEGER);
      video.currentTime = clipIn;
      void video.play().catch(() => {
        // ignore autoplay rejections
      });
    };

    if (video.readyState >= 1) {
      beginPlayback();
    }

    video.addEventListener("loadedmetadata", beginPlayback);
    return () => {
      video.removeEventListener("loadedmetadata", beginPlayback);
    };
  }, [advanceToNextRoughClip, clips, isRoughPlaying, roughPlaybackIndex]);

  useEffect(() => {
    if (initializedRef.current) return;

    if (clipPlanResource && clipPlanResource.data && typeof clipPlanResource.data === "object") {
      const rec = clipPlanResource.data as Record<string, unknown>;
      const rawClips = rec.clips;
      if (Array.isArray(rawClips) && rawClips.length > 0) {
        const parsedClips: ClipDraft[] = rawClips
          .map((raw): ClipDraft | null => {
            if (!raw || typeof raw !== "object") return null;
            const row = raw as Record<string, unknown>;
            const inSecRaw = row.inSec;
            const outSecRaw = row.outSec;
            const inSec = typeof inSecRaw === "number" ? inSecRaw : 0;
            const outSec = typeof outSecRaw === "number" ? outSecRaw : inSec + 3;
            return {
              id: crypto.randomUUID(),
              resourceId: typeof row.resourceId === "string" ? row.resourceId : null,
              url: typeof row.url === "string" ? row.url : null,
              title: typeof row.title === "string" && row.title.trim().length > 0 ? row.title : "片段",
              inSec: clamp(inSec, 0, Number.MAX_SAFE_INTEGER),
              outSec: clamp(outSec, inSec, Number.MAX_SAFE_INTEGER),
              transition: asTransition(row.transition),
            };
          })
          .filter((clip): clip is ClipDraft => clip !== null);

        if (parsedClips.length > 0) {
          setClips(parsedClips);
          setSelectedClipId(parsedClips[0]?.id ?? null);
          if (typeof rec.key === "string" && rec.key.trim().length > 0) {
            setPlanName(rec.key);
          }
          initializedRef.current = true;
          void message.success("已自动加载已有粗剪。", 0.8);
          return;
        }
      }
    }

    if (videoItems.length > 0) {
      const roughClips: ClipDraft[] = videoItems.slice(0, 12).map((item) => ({
        id: crypto.randomUUID(),
        resourceId: item.id,
        url: item.url ?? null,
        title: item.title,
        inSec: 0,
        outSec: 3.5,
        transition: "cut",
      }));
      setClips(roughClips);
      setSelectedClipId(roughClips[0]?.id ?? null);
      initializedRef.current = true;
      void message.info("已按现有视频素材自动生成粗剪。", 0.8);
    }
  }, [clipPlanResource, message, videoItems]);

  const addClip = (resourceId: string, title: string, url: string | null) => {
    const clip: ClipDraft = {
      id: crypto.randomUUID(),
      resourceId,
      url,
      title,
      inSec: 0,
      outSec: 5,
      transition: "none",
    };
    setClips((prev) => [...prev, clip]);
    setSelectedClipId(clip.id);
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
      void message.info("所有视频素材都已加入。", 0.8);
      return;
    }
    setClips((prev) => [...prev, ...append]);
    setSelectedClipId((prev) => prev ?? append[0]?.id ?? null);
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

  const removeClip = (id: string) => {
    setClips((prev) => prev.filter((clip) => clip.id !== id));
    if (selectedClipId === id) {
      setSelectedClipId(null);
    }
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const oldIndex = clips.findIndex((clip) => clip.id === activeId);
    const newIndex = clips.findIndex((clip) => clip.id === overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const currentRoughClipId = roughPlaybackIndex !== null ? (clips[roughPlaybackIndex]?.id ?? null) : null;
    const nextClips = arrayMove(clips, oldIndex, newIndex);
    setClips(nextClips);

    if (currentRoughClipId) {
      const nextRoughIndex = nextClips.findIndex((clip) => clip.id === currentRoughClipId);
      setRoughPlaybackIndex(nextRoughIndex >= 0 ? nextRoughIndex : null);
    }
  }, [clips, roughPlaybackIndex]);

  const startRoughPlayback = useCallback(() => {
    if (clips.length === 0) {
      void message.warning("请先添加至少一个片段。");
      return;
    }
    const firstIndex = findNextPlayableIndex(0);
    if (firstIndex === null) {
      void message.warning("当前没有可播放的视频片段。");
      return;
    }
    setIsRoughPlaying(true);
    setRoughPlaybackIndex(firstIndex);
    setSelectedClipId(clips[firstIndex]?.id ?? null);
  }, [clips, findNextPlayableIndex, message]);

  const handlePreviewTimeUpdate = useCallback(() => {
    if (!isRoughPlaying || roughPlaybackIndex === null || roughAdvancingRef.current) return;
    const clip = clips[roughPlaybackIndex];
    const video = previewVideoRef.current;
    if (!clip || !video) return;

    if (video.currentTime >= clip.outSec - 0.03) {
      advanceToNextRoughClip();
    }
  }, [advanceToNextRoughClip, clips, isRoughPlaying, roughPlaybackIndex]);

  const savePlan = async () => {
    if (!sequenceId) {
      void message.warning("请先创建或选择计划");
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
        <Typography.Text strong style={{ fontSize: 12 }}>可视化剪辑台</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          Total: {totalDuration.toFixed(2)}s
        </Typography.Text>
      </div>

      <Alert
        className="mb-3"
        showIcon
        type="info"
        message="支持拖拽排序、拖动裁切、粗剪串播预览。"
      />

      <div className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.2fr,1fr]">
        <Card
          size="small"
          title="预览"
          extra={(
            <div className="flex items-center gap-2">
              {isRoughPlaying ? (
                <Button size="small" danger onClick={stopRoughPlayback}>停止串播</Button>
              ) : (
                <Button size="small" type="primary" onClick={startRoughPlayback}>播放粗剪</Button>
              )}
            </div>
          )}
        >
          {previewClip?.url ? (
            <video
              ref={previewVideoRef}
              src={previewClip.url}
              controls={!isRoughPlaying}
              className="h-56 w-full rounded-lg border border-slate-200 bg-black object-contain"
              onTimeUpdate={handlePreviewTimeUpdate}
              onEnded={() => {
                if (isRoughPlaying) {
                  advanceToNextRoughClip();
                }
              }}
            />
          ) : (
            <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
              选择一个片段进行预览
            </div>
          )}
          <div className="mt-2 text-[11px] text-slate-500">
            当前片段：{previewClip ? previewClip.title : "未选择"}
            {isRoughPlaying && roughPlaybackIndex !== null ? ` · 串播第 ${roughPlaybackIndex + 1} 段` : ""}
          </div>
        </Card>

        <Card size="small" title="计划名称">
          <Input
            size="small"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="clip_plan_v1"
          />
          <div className="mt-2 text-[11px] text-slate-500">
            保存后会以 JSON 计划形式写入素材库，可用于后续拼接执行。
          </div>
        </Card>
      </div>

      <Card
        className="mb-3"
        size="small"
        title="时间线（拖拽重排）"
        extra={<Tag style={{ margin: 0 }}>{clips.length} clips</Tag>}
      >
        {clips.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还未添加片段" />
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={clips.map((clip) => clip.id)} strategy={horizontalListSortingStrategy}>
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
                <div className="flex min-w-max items-center gap-2">
                  {clips.map((clip, index) => {
                    const duration = Math.max(0.5, clip.outSec - clip.inSec);
                    const width = Math.max(96, (duration / Math.max(totalDuration, 1)) * 520);
                    return (
                      <SortableClipBlock
                        key={clip.id}
                        clip={clip}
                        index={index}
                        width={width}
                        active={selectedClipId === clip.id}
                        playing={isRoughPlaying && roughPlaybackIndex === index}
                        onSelect={setSelectedClipId}
                      />
                    );
                  })}
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr,1.1fr]">
        <Card
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
                  <Button size="small" onClick={() => addClip(item.id, item.title, item.url ?? null)}>加入</Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card size="small" title="片段属性">
          {!selectedClip ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="选择时间线中的片段后可编辑" />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Typography.Text style={{ fontSize: 12 }}>{selectedClip.title}</Typography.Text>
                <Button size="small" danger onClick={() => removeClip(selectedClip.id)}>删除</Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <InputNumber
                  size="small"
                  min={0}
                  value={selectedClip.inSec}
                  onChange={(value) => updateClip(selectedClip.id, { inSec: Number(value ?? 0) })}
                  addonBefore="In"
                  style={{ width: "100%" }}
                />
                <InputNumber
                  size="small"
                  min={selectedClip.inSec}
                  value={selectedClip.outSec}
                  onChange={(value) => updateClip(selectedClip.id, { outSec: Number(value ?? selectedClip.inSec) })}
                  addonBefore="Out"
                  style={{ width: "100%" }}
                />
                <Select<ClipTransition>
                  size="small"
                  value={selectedClip.transition}
                  onChange={(value) => updateClip(selectedClip.id, { transition: value })}
                  options={[
                    { value: "none", label: "None" },
                    { value: "cut", label: "Cut" },
                    { value: "fade", label: "Fade" },
                  ]}
                />
              </div>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  拖动手柄可直接裁切片段（In/Out）
                </Typography.Text>
                <Slider
                  range
                  min={0}
                  max={Math.max(20, Math.ceil(selectedClip.outSec + 8))}
                  step={0.1}
                  value={[selectedClip.inSec, selectedClip.outSec]}
                  onChange={(value) => {
                    if (!Array.isArray(value) || value.length !== 2) return;
                    const [inSec, outSec] = value;
                    updateClip(selectedClip.id, { inSec, outSec });
                  }}
                />
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-3 flex justify-end">
        <Button type="primary" loading={saving} onClick={savePlan}>
          保存剪辑计划
        </Button>
      </div>
    </div>
  );
}
