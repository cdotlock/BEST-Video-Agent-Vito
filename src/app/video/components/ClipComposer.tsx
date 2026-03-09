"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CaretRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  LeftOutlined,
  MinusOutlined,
  PauseCircleOutlined,
  PlusOutlined,
  RedoOutlined,
  RightOutlined,
  SaveOutlined,
  ScissorOutlined,
  ThunderboltOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
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
import { z } from "zod";
import type { DomainResources, QueuedClipResource, VideoContext } from "../types";
import { inferReferenceRole } from "@/lib/video/reference-roles";
import { fetchJson } from "@/app/components/client-utils";
import { CLIP_ATLAS_DRAG_MIME, parseClipAtlasDragPayload } from "@/lib/video/clip-drag";

const ClipTransitionSchema = z.enum([
  "none",
  "cut",
  "fade",
  "dissolve",
  "wipe_left",
  "fade_black",
]);
const MonitorModeSchema = z.enum(["source", "program"]);

const ClipDraftSchema = z.object({
  id: z.string().min(1),
  resourceId: z.string().min(1).nullable(),
  url: z.string().nullable(),
  title: z.string().min(1),
  inSec: z.number().min(0),
  outSec: z.number().min(0),
  transition: ClipTransitionSchema,
  sourceDurationSec: z.number().min(0).nullable().optional(),
});

const ClipEditorDocumentSchema = z.object({
  planName: z.string().min(1),
  clips: z.array(ClipDraftSchema),
  selectedClipId: z.string().min(1).nullable(),
  selectedSourceResourceId: z.string().min(1).nullable(),
  sourceInSec: z.number().min(0),
  sourceOutSec: z.number().min(0),
  sourceDurationSec: z.number().min(0).nullable().optional(),
  previewMode: MonitorModeSchema,
  timelineZoom: z.number().min(8).max(120),
  snapEnabled: z.boolean(),
  snapStepSec: z.number().min(0.05).max(5),
});

const ClipPlanResourceSchema = z.object({
  key: z.string().optional(),
  type: z.literal("clip_plan"),
  clips: z.array(
    z.object({
      id: z.string().optional(),
      resourceId: z.string().min(1).nullable().optional(),
      url: z.string().nullable().optional(),
      title: z.string().nullable().optional(),
      inSec: z.number().min(0),
      outSec: z.number().min(0),
      transition: ClipTransitionSchema.optional(),
      sourceDurationSec: z.number().min(0).nullable().optional(),
    }),
  ).default([]),
  editorState: z.object({
    selectedClipId: z.string().min(1).nullable().optional(),
    selectedSourceResourceId: z.string().min(1).nullable().optional(),
    sourceInSec: z.number().min(0).optional(),
    sourceOutSec: z.number().min(0).optional(),
    sourceDurationSec: z.number().min(0).nullable().optional(),
    previewMode: MonitorModeSchema.optional(),
    timelineZoom: z.number().min(8).max(120).optional(),
    snapEnabled: z.boolean().optional(),
    snapStepSec: z.number().min(0.05).max(5).optional(),
  }).nullable().optional(),
}).passthrough();

type ClipTransition = z.infer<typeof ClipTransitionSchema>;
type ClipEditorDocument = z.infer<typeof ClipEditorDocumentSchema>;
type ClipDraft = ClipEditorDocument["clips"][number];

interface SourceVideoItem {
  id: string;
  title: string;
  url: string | null;
  category: string;
}

interface EditorStateContainer {
  present: ClipEditorDocument;
  history: ClipEditorDocument[];
  historyIndex: number;
  bootstrapped: boolean;
}

interface TimelineClipSegment {
  clip: ClipDraft;
  index: number;
  startSec: number;
  endSec: number;
  durationSec: number;
}

interface SortableClipBlockProps {
  clip: ClipDraft;
  index: number;
  timelineStartSec: number;
  timelineEndSec: number;
  width: number;
  active: boolean;
  playing: boolean;
  compact: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onTrimMouseDown: (
    clipId: string,
    edge: "start" | "end",
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => void;
}

interface ClipFramePreviewProps {
  url: string | null;
  inSec: number;
  title: string;
}

export interface ClipComposerProps {
  sequenceId: string | null;
  resources: DomainResources | null;
  memoryUser?: string;
  videoContext?: VideoContext | null;
  modelId?: string | null;
  queuedClipResource?: QueuedClipResource | null;
  onConsumeQueuedClipResource?: () => void;
  onSaved: () => void;
}

const DEFAULT_PLAN_NAME = "clip_plan_current";
const DEFAULT_TIMELINE_ZOOM = 16;
const DEFAULT_SNAP_STEP = 0.25;
const MAX_HISTORY = 40;
const AUTOSAVE_DELAY_MS = 1200;
const LOCAL_DRAFT_PREFIX = "agentForge.video.clipStudio";
const ROUGH_CUT_TRANSITION_PRESETS: ClipTransition[] = [
  "cut",
  "dissolve",
  "wipe_left",
  "fade",
  "fade_black",
  "cut",
];

function clipDurationSec(clip: ClipDraft): number {
  return Math.max(0, clip.outSec - clip.inSec);
}

function buildTimelineSegments(clips: ClipDraft[]): TimelineClipSegment[] {
  let cursor = 0;
  return clips.map((clip, index) => {
    const durationSec = clipDurationSec(clip);
    const segment: TimelineClipSegment = {
      clip,
      index,
      startSec: cursor,
      endSec: cursor + durationSec,
      durationSec,
    };
    cursor += durationSec;
    return segment;
  });
}

function findTimelineSegmentAt(
  segments: TimelineClipSegment[],
  playheadSec: number,
): TimelineClipSegment | null {
  if (segments.length === 0) return null;
  for (const segment of segments) {
    if (playheadSec < segment.endSec) return segment;
  }
  return segments[segments.length - 1] ?? null;
}

function findInsertIndexAtPlayhead(
  segments: TimelineClipSegment[],
  playheadSec: number,
): number {
  const segment = findTimelineSegmentAt(segments, playheadSec);
  if (!segment) return 0;
  const mid = segment.startSec + segment.durationSec / 2;
  return playheadSec < mid ? segment.index : segment.index + 1;
}

function timelineStartAtIndex(clips: ClipDraft[], index: number): number {
  let total = 0;
  for (let i = 0; i < index; i += 1) {
    const clip = clips[i];
    if (!clip) continue;
    total += clipDurationSec(clip);
  }
  return total;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function dedupeHints(items: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const item of items) {
    const trimmed = item.trim();
    if (trimmed.length === 0 || seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output;
}

function readPromptText(data: unknown): string {
  if (!isRecord(data)) return "";
  const prompt = data.prompt;
  if (typeof prompt === "string") return prompt;
  const userPrompt = data.userPrompt;
  if (typeof userPrompt === "string") return userPrompt;
  return "";
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function quantize(value: number, step: number, enabled: boolean): number {
  if (!enabled) return Number(value.toFixed(3));
  return Number((Math.round(value / step) * step).toFixed(3));
}

function cloneDocument(doc: ClipEditorDocument): ClipEditorDocument {
  return {
    ...doc,
    clips: doc.clips.map((clip) => ({ ...clip })),
  };
}

function serializeDocument(doc: ClipEditorDocument): string {
  return JSON.stringify(doc);
}

function buildDefaultRange(durationSec: number | null): { inSec: number; outSec: number } {
  if (durationSec === null) {
    return { inSec: 0, outSec: 4 };
  }
  return {
    inSec: 0,
    outSec: clamp(Math.min(durationSec, 4.5), 0.5, durationSec),
  };
}

function buildStarterDocument(videoItems: SourceVideoItem[]): ClipEditorDocument {
  const initialClips: ClipDraft[] = videoItems
    .slice(0, 8)
    .map((item, index) => createClipFromSource(item, index));
  const initialSource = videoItems[0] ?? null;
  const initialRange = buildDefaultRange(null);

  return {
    planName: DEFAULT_PLAN_NAME,
    clips: initialClips,
    selectedClipId: initialClips[0]?.id ?? null,
    selectedSourceResourceId: initialSource?.id ?? initialClips[0]?.resourceId ?? null,
    sourceInSec: initialRange.inSec,
    sourceOutSec: initialRange.outSec,
    sourceDurationSec: null,
    previewMode: "program",
    timelineZoom: DEFAULT_TIMELINE_ZOOM,
    snapEnabled: true,
    snapStepSec: DEFAULT_SNAP_STEP,
  };
}

function transitionLabel(transition: ClipTransition): string {
  switch (transition) {
    case "none":
      return "None";
    case "cut":
      return "Cut";
    case "fade":
      return "Fade";
    case "dissolve":
      return "Dissolve";
    case "wipe_left":
      return "Wipe Left";
    case "fade_black":
      return "Fade Black";
    default:
      return transition;
  }
}

function inferAutoRoughCutDurationSec(source: SourceVideoItem, index: number): number {
  const text = `${source.title} ${source.category}`.toLowerCase();
  if (text.includes("close") || text.includes("特写")) return 2.2;
  if (
    text.includes("empty") ||
    text.includes("establish") ||
    text.includes("wide") ||
    text.includes("空镜") ||
    text.includes("全景")
  ) {
    return 4.2;
  }
  if (
    text.includes("motion") ||
    text.includes("action") ||
    text.includes("追") ||
    text.includes("运动")
  ) {
    return 1.8;
  }
  const defaults = [3.8, 3.2, 2.8, 2.4, 2.2, 2.6];
  return defaults[index % defaults.length] ?? 2.8;
}

function createClipFromSource(
  source: SourceVideoItem,
  index: number,
  range?: { inSec: number; outSec: number; sourceDurationSec?: number | null },
): ClipDraft {
  return {
    id: crypto.randomUUID(),
    resourceId: source.id,
    url: source.url,
    title: source.title,
    inSec: range?.inSec ?? 0,
    outSec: range?.outSec ?? 4,
    transition: index === 0 ? "none" : "cut",
    sourceDurationSec: range?.sourceDurationSec ?? null,
  };
}

function autoScrollTimelineViewport(viewport: HTMLDivElement, clientX: number): void {
  const bounds = viewport.getBoundingClientRect();
  const edgePadding = 72;

  if (clientX > bounds.right - edgePadding) {
    const speed = clamp((clientX - (bounds.right - edgePadding)) * 0.45, 12, 32);
    viewport.scrollLeft += speed;
    return;
  }

  if (clientX < bounds.left + edgePadding) {
    const speed = clamp(((bounds.left + edgePadding) - clientX) * 0.45, 12, 32);
    viewport.scrollLeft = Math.max(0, viewport.scrollLeft - speed);
  }
}

function deriveEditingHints(document: ClipEditorDocument): string[] {
  if (document.clips.length === 0) return [];
  const durations = document.clips.map((clip) => Math.max(0, clip.outSec - clip.inSec));
  const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  const softTransitionCount = document.clips.filter((clip) => (
    clip.transition === "fade" || clip.transition === "dissolve" || clip.transition === "fade_black"
  )).length;
  const cutCount = document.clips.filter((clip) => clip.transition === "cut").length;
  const hints: string[] = [];

  if (averageDuration <= 2.4) hints.push("快切节奏");
  if (averageDuration >= 4.8) hints.push("长镜停留");
  if (softTransitionCount >= 2) hints.push("偏爱柔和转场");
  if (cutCount >= Math.max(2, Math.ceil(document.clips.length * 0.6))) hints.push("偏爱硬切推进");
  if (document.clips.length >= 4) hints.push("多候选粗剪");

  return dedupeHints(hints).slice(0, 4);
}

function deriveCameraHints(
  document: ClipEditorDocument,
  resources: DomainResources | null,
): string[] {
  if (!resources) return [];
  const resourceMap = new Map(
    resources.categories.flatMap((group) => group.items.map((item) => [item.id, item] as const)),
  );
  const searchText = document.clips
    .map((clip) => {
      const source = clip.resourceId ? (resourceMap.get(clip.resourceId) ?? null) : null;
      const prompt = source ? readPromptText(source.data) : "";
      return `${clip.title} ${source?.category ?? ""} ${prompt}`;
    })
    .join(" ")
    .toLowerCase();

  const hints: string[] = [];
  if (searchText.includes("推镜") || searchText.includes("push in") || searchText.includes("slow push")) {
    hints.push("偏好慢推镜");
  }
  if (searchText.includes("摇镜") || searchText.includes("pan")) {
    hints.push("偏好平移摇镜");
  }
  if (searchText.includes("环绕") || searchText.includes("orbit")) {
    hints.push("偏好环绕镜头");
  }
  if (searchText.includes("手持") || searchText.includes("handheld")) {
    hints.push("偏好手持质感");
  }
  if (searchText.includes("特写") || searchText.includes("close up")) {
    hints.push("偏好特写推进");
  }

  return dedupeHints(hints).slice(0, 4);
}

function buildMemoryNote(document: ClipEditorDocument, resources: DomainResources | null): string {
  const resourceMap = new Map(
    (resources?.categories ?? []).flatMap((group) => group.items.map((item) => [item.id, item] as const)),
  );
  const duration = document.clips.reduce((sum, clip) => sum + Math.max(0, clip.outSec - clip.inSec), 0);
  const roleHints = document.clips
    .map((clip) => clip.resourceId ? resourceMap.get(clip.resourceId) ?? null : null)
    .filter((resource): resource is NonNullable<typeof resource> => resource !== null)
    .map((resource) => inferReferenceRole({
      category: resource.category,
      mediaType: resource.mediaType,
      title: resource.title,
      data: resource.data,
    }))
    .filter((role): role is NonNullable<typeof role> => role !== null);

  return [
    `clips=${document.clips.length}`,
    `duration=${duration.toFixed(2)}s`,
    `soft_transition=${document.clips.filter((clip) => (
      clip.transition === "fade" || clip.transition === "dissolve" || clip.transition === "fade_black"
    )).length}`,
    `cut=${document.clips.filter((clip) => clip.transition === "cut").length}`,
    `roles=${dedupeHints(roleHints).join(",") || "none"}`,
  ].join(" | ");
}

function buildDocumentFromClipPlan(
  data: unknown,
  fallbackPlanName: string,
): ClipEditorDocument | null {
  const parsed = ClipPlanResourceSchema.safeParse(data);
  if (!parsed.success) return null;

  const editorState = parsed.data.editorState ?? null;
  const initialRange = buildDefaultRange(editorState?.sourceDurationSec ?? null);
  const clips: ClipDraft[] = parsed.data.clips.map((clip, index) => ({
    id: clip.id?.trim() || crypto.randomUUID(),
    resourceId: clip.resourceId ?? null,
    url: clip.url ?? null,
    title: clip.title?.trim() || `片段 ${index + 1}`,
    inSec: clip.inSec,
    outSec: clip.outSec,
    transition: clip.transition ?? "none",
    sourceDurationSec: clip.sourceDurationSec ?? null,
  }));

  return {
    planName: parsed.data.key?.trim() || fallbackPlanName,
    clips,
    selectedClipId: editorState?.selectedClipId ?? clips[0]?.id ?? null,
    selectedSourceResourceId: editorState?.selectedSourceResourceId ?? clips[0]?.resourceId ?? null,
    sourceInSec: editorState?.sourceInSec ?? initialRange.inSec,
    sourceOutSec: editorState?.sourceOutSec ?? initialRange.outSec,
    sourceDurationSec: editorState?.sourceDurationSec ?? null,
    previewMode: editorState?.previewMode ?? "program",
    timelineZoom: editorState?.timelineZoom ?? DEFAULT_TIMELINE_ZOOM,
    snapEnabled: editorState?.snapEnabled ?? true,
    snapStepSec: editorState?.snapStepSec ?? DEFAULT_SNAP_STEP,
  };
}

function ClipFramePreview({
  url,
  inSec,
  title,
}: ClipFramePreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    const pauseVideo = () => {
      video.pause();
    };

    const seekPreviewFrame = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const desired = Math.max(inSec, 0.02);
      const upperBound = duration > 0 ? Math.max(0, duration - 0.04) : desired;
      const target = clamp(desired, 0, upperBound);
      if (Math.abs(video.currentTime - target) > 0.03) {
        try {
          video.currentTime = target;
        } catch {
          // ignore seek rejections from unsupported streams
        }
      }
    };

    video.addEventListener("loadedmetadata", seekPreviewFrame);
    video.addEventListener("loadeddata", pauseVideo);
    video.addEventListener("seeked", pauseVideo);

    if (video.readyState >= 1) {
      seekPreviewFrame();
    }

    return () => {
      video.removeEventListener("loadedmetadata", seekPreviewFrame);
      video.removeEventListener("loadeddata", pauseVideo);
      video.removeEventListener("seeked", pauseVideo);
    };
  }, [inSec, url]);

  if (!url) {
    return (
      <div
        className="flex h-12 w-full items-center justify-center rounded-[10px] border border-dashed border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] text-[10px] text-[var(--af-muted)]"
      >
        无预览
      </div>
    );
  }

  return (
    <div className="h-12 overflow-hidden rounded-[10px] border border-[rgba(229,221,210,0.9)]">
      <video
        ref={videoRef}
        src={url}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        className="h-full w-full bg-black object-cover"
        aria-label={`${title} 首帧预览`}
      />
    </div>
  );
}

function SortableClipBlock({
  clip,
  index,
  timelineStartSec,
  timelineEndSec,
  width,
  active,
  playing,
  compact,
  onSelect,
  onDelete,
  onTrimMouseDown,
}: SortableClipBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: clip.id });

  const style: CSSProperties = {
    width,
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.82 : 1,
    touchAction: "none",
    willChange: isDragging ? "transform" : undefined,
    zIndex: isDragging ? 3 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex h-[118px] flex-col overflow-hidden rounded-[14px] border px-2 py-2 shadow-sm transition ${
        active
          ? "border-[var(--af-brand)] bg-[rgba(255,253,249,0.98)]"
          : "border-[rgba(229,221,210,0.9)] bg-[rgba(255,255,255,0.9)]"
      } ${playing ? "ring-2 ring-[rgba(76,139,106,0.35)]" : ""} cursor-grab select-none active:cursor-grabbing`}
      onClick={() => onSelect(clip.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(clip.id);
        }
      }}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        aria-label={`${clip.title} 左侧裁切手柄`}
        className="absolute inset-y-1 left-0 z-10 w-2 rounded-l-[14px] bg-[rgba(47,107,95,0.12)] opacity-0 transition group-hover:opacity-100 hover:opacity-100 cursor-ew-resize"
        onMouseDown={(event) => onTrimMouseDown(clip.id, "start", event)}
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        aria-label={`${clip.title} 右侧裁切手柄`}
        className="absolute inset-y-1 right-0 z-10 w-2 rounded-r-[14px] bg-[rgba(47,107,95,0.12)] opacity-0 transition group-hover:opacity-100 hover:opacity-100 cursor-ew-resize"
        onMouseDown={(event) => onTrimMouseDown(clip.id, "end", event)}
        onClick={(event) => event.stopPropagation()}
      />
      <div className="mb-2 shrink-0">
        <ClipFramePreview
          url={clip.url}
          inSec={clip.inSec}
          title={clip.title}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[11px] font-medium text-[var(--af-text)]">
              {index + 1}. {clip.title}
            </div>
            <div className="truncate text-[10px] text-[var(--af-muted)]">
              {transitionLabel(clip.transition)} · {(clip.outSec - clip.inSec).toFixed(2)}s
            </div>
            <div className="truncate text-[9px] text-[var(--af-muted)]">
              TL {timelineStartSec.toFixed(2)}s - {timelineEndSec.toFixed(2)}s
            </div>
          </div>
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(clip.id);
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[9px] text-[var(--af-muted)]">
          <span>{clip.inSec.toFixed(2)}s</span>
          <span className="truncate rounded-full border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.9)] px-2 py-0.5 text-[9px] text-[var(--af-muted)]">
            {compact ? "拖动" : "拖动排序"}
          </span>
          <span>{clip.outSec.toFixed(2)}s</span>
        </div>
      </div>
    </div>
  );
}

export function ClipComposer({
  sequenceId,
  resources,
  memoryUser,
  videoContext,
  modelId,
  queuedClipResource,
  onConsumeQueuedClipResource,
  onSaved,
}: ClipComposerProps) {
  const { message } = App.useApp();
  const programVideoRef = useRef<HTMLVideoElement | null>(null);
  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programAdvancingRef = useRef(false);
  const lastPersistedSnapshotRef = useRef("");
  const lastQueuedTokenRef = useRef<string | null>(null);
  const trimAnimationFrameRef = useRef<number | null>(null);
  const trimPendingClientXRef = useRef<number | null>(null);
  const scrubAnimationFrameRef = useRef<number | null>(null);
  const scrubPendingClientXRef = useRef<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [autosaveState, setAutosaveState] = useState<"idle" | "pending" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isProgramPlaying, setIsProgramPlaying] = useState(false);
  const [programPlaybackIndex, setProgramPlaybackIndex] = useState<number | null>(null);
  const [timelinePlayheadSec, setTimelinePlayheadSec] = useState(0);
  const [isTimelineDragOver, setIsTimelineDragOver] = useState(false);
  const [inspectorExpanded, setInspectorExpanded] = useState(false);
  const [timelineViewportWidth, setTimelineViewportWidth] = useState(0);
  const [fitTimelineToView, setFitTimelineToView] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
  );

  const videoItems = useMemo<SourceVideoItem[]>(() => {
    if (!resources) return [];
    return resources.categories.flatMap((group) =>
      group.items
        .filter((item) => item.mediaType === "video")
        .map((item) => ({
          id: item.id,
          title: item.title?.trim() || group.category,
          url: item.url,
          category: group.category,
        })),
    );
  }, [resources]);

  const videoRoleMap = useMemo(() => {
    if (!resources) return new Map<string, string | null>();
    const entries = resources.categories
      .flatMap((group) => group.items)
      .filter((item) => item.mediaType === "video")
      .map((item) => [
        item.id,
        inferReferenceRole({
          category: item.category,
          mediaType: item.mediaType,
          title: item.title,
          data: item.data,
        }),
      ] as const);
    return new Map(entries);
  }, [resources]);

  const videoItemMap = useMemo(
    () => new Map(videoItems.map((item) => [item.id, item])),
    [videoItems],
  );

  const normalizeDocument = useCallback((doc: ClipEditorDocument): ClipEditorDocument => {
    const normalizedClips = doc.clips.map((clip, index) => {
      const source = clip.resourceId ? (videoItemMap.get(clip.resourceId) ?? null) : null;
      const sourceDuration = clip.sourceDurationSec ?? null;
      const inSec = clamp(clip.inSec, 0, Number.MAX_SAFE_INTEGER);
      const outSec = clamp(clip.outSec, inSec, sourceDuration ?? Number.MAX_SAFE_INTEGER);
      return {
        id: clip.id,
        resourceId: clip.resourceId,
        url: clip.url ?? source?.url ?? null,
        title: clip.title.trim() || source?.title || `片段 ${index + 1}`,
        inSec,
        outSec,
        transition: clip.transition,
        sourceDurationSec: sourceDuration,
      };
    });

    const selectedClipId = normalizedClips.some((clip) => clip.id === doc.selectedClipId)
      ? doc.selectedClipId
      : normalizedClips[0]?.id ?? null;

    const selectedClip = normalizedClips.find((clip) => clip.id === selectedClipId) ?? null;
    const fallbackSourceId = selectedClip?.resourceId ?? videoItems[0]?.id ?? null;
    const selectedSourceResourceId = doc.selectedSourceResourceId && videoItemMap.has(doc.selectedSourceResourceId)
      ? doc.selectedSourceResourceId
      : fallbackSourceId;

    const relatedClip = normalizedClips.find((clip) => clip.resourceId === selectedSourceResourceId) ?? null;
    const sourceDurationSec = doc.sourceDurationSec ?? relatedClip?.sourceDurationSec ?? null;
    const sourceInSec = clamp(doc.sourceInSec, 0, sourceDurationSec ?? Number.MAX_SAFE_INTEGER);
    const sourceOutSec = clamp(doc.sourceOutSec, sourceInSec, sourceDurationSec ?? Number.MAX_SAFE_INTEGER);

    return {
      planName: doc.planName.trim() || DEFAULT_PLAN_NAME,
      clips: normalizedClips,
      selectedClipId,
      selectedSourceResourceId,
      sourceInSec,
      sourceOutSec,
      sourceDurationSec,
      previewMode: doc.previewMode,
      timelineZoom: clamp(doc.timelineZoom, 8, 120),
      snapEnabled: doc.snapEnabled,
      snapStepSec: clamp(doc.snapStepSec, 0.05, 5),
    };
  }, [videoItemMap, videoItems]);

  const [editor, setEditor] = useState<EditorStateContainer>(() => {
    const initial = buildStarterDocument([]);
    return {
      present: initial,
      history: [cloneDocument(initial)],
      historyIndex: 0,
      bootstrapped: false,
    };
  });

  const currentDocument = editor.present;
  const serializedDocument = useMemo(
    () => serializeDocument(currentDocument),
    [currentDocument],
  );

  const clipPlanResource = useMemo(() => {
    if (!resources) return null;
    const candidates = resources.categories
      .flatMap((group) => group.items)
      .filter((item) => {
        if (item.mediaType !== "json") return false;
        return ClipPlanResourceSchema.safeParse(item.data).success;
      });
    if (candidates.length === 0) return null;
    return candidates.reduce((latest, current) => (
      current.sortOrder > latest.sortOrder ? current : latest
    ));
  }, [resources]);

  const localDraftKey = useMemo(
    () => (sequenceId ? `${LOCAL_DRAFT_PREFIX}.${sequenceId}` : null),
    [sequenceId],
  );

  const commitDocument = useCallback((
    updater: ClipEditorDocument | ((current: ClipEditorDocument) => ClipEditorDocument),
    options?: { recordHistory?: boolean },
  ) => {
    setEditor((prev) => {
      const base = cloneDocument(prev.present);
      const candidate = normalizeDocument(
        typeof updater === "function" ? updater(base) : updater,
      );
      const previousSerialized = serializeDocument(prev.present);
      const nextSerialized = serializeDocument(candidate);

      if (previousSerialized === nextSerialized && prev.bootstrapped) {
        return prev;
      }

      if (options?.recordHistory === false) {
        return {
          present: candidate,
          history: prev.bootstrapped ? prev.history : [cloneDocument(candidate)],
          historyIndex: prev.bootstrapped ? prev.historyIndex : 0,
          bootstrapped: true,
        };
      }

      const historyHead = prev.history.slice(0, prev.historyIndex + 1);
      const nextHistory = [...historyHead, cloneDocument(candidate)].slice(-MAX_HISTORY);

      return {
        present: candidate,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
        bootstrapped: true,
      };
    });
  }, [normalizeDocument]);

  useEffect(() => {
    return () => {
      if (trimAnimationFrameRef.current !== null) {
        cancelAnimationFrame(trimAnimationFrameRef.current);
      }
      if (scrubAnimationFrameRef.current !== null) {
        cancelAnimationFrame(scrubAnimationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (editor.bootstrapped) return;

    let nextDocument: ClipEditorDocument | null = null;
    let source: "server" | "local" | "generated" | "empty" = "empty";

    if (clipPlanResource) {
      nextDocument = buildDocumentFromClipPlan(
        clipPlanResource.data,
        DEFAULT_PLAN_NAME,
      );
      if (nextDocument) source = "server";
    }

    if (!nextDocument && localDraftKey && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(localDraftKey);
        if (raw) {
          const parsed = ClipEditorDocumentSchema.safeParse(JSON.parse(raw));
          if (parsed.success) {
            nextDocument = parsed.data;
            source = "local";
          }
        }
      } catch {
        // ignore damaged local draft
      }
    }

    if (!nextDocument) {
      nextDocument = buildStarterDocument(videoItems);
      source = videoItems.length > 0 ? "generated" : "empty";
    }

    const normalized = normalizeDocument(nextDocument);
    lastPersistedSnapshotRef.current = source === "server" ? serializeDocument(normalized) : "";
    setEditor({
      present: normalized,
      history: [cloneDocument(normalized)],
      historyIndex: 0,
      bootstrapped: true,
    });

    if (source === "server") {
      void message.success("已恢复上次剪辑状态。", 0.8);
    } else if (source === "local") {
      void message.info("已恢复本地剪辑草稿。", 0.8);
    } else if (source === "generated" && videoItems.length > 0) {
      void message.info("已按现有视频候选生成时间线起稿。", 0.8);
    }
  }, [clipPlanResource, editor.bootstrapped, localDraftKey, message, normalizeDocument, videoItems]);

  useEffect(() => {
    if (!editor.bootstrapped) return;
    const normalized = normalizeDocument(editor.present);
    if (serializeDocument(editor.present) === serializeDocument(normalized)) return;
    setEditor((prev) => ({
      ...prev,
      present: normalized,
    }));
  }, [editor.bootstrapped, editor.present, normalizeDocument]);

  useEffect(() => {
    if (!localDraftKey || !editor.bootstrapped || typeof window === "undefined") return;
    window.localStorage.setItem(localDraftKey, serializedDocument);
  }, [editor.bootstrapped, localDraftKey, serializedDocument]);

  useEffect(() => {
    if (!editor.bootstrapped || !queuedClipResource) return;
    if (lastQueuedTokenRef.current === queuedClipResource.token) return;
    lastQueuedTokenRef.current = queuedClipResource.token;

    const queuedResource = queuedClipResource.resource;
    if (queuedResource.mediaType !== "video" || !queuedResource.url) {
      void message.warning("仅已生成的视频素材可以加入时间线。");
      onConsumeQueuedClipResource?.();
      return;
    }

    const range = buildDefaultRange(null);
    const sourceItem: SourceVideoItem = {
      id: queuedResource.id,
      title: queuedResource.title?.trim() || queuedResource.category,
      url: queuedResource.url,
      category: queuedResource.category,
    };
    const nextClip = createClipFromSource(sourceItem, currentDocument.clips.length, {
      inSec: range.inSec,
      outSec: range.outSec,
      sourceDurationSec: null,
    });

    const insertAt = currentDocument.selectedClipId
      ? currentDocument.clips.findIndex((clip) => clip.id === currentDocument.selectedClipId) + 1
      : currentDocument.clips.length;
    const playheadStart = timelineStartAtIndex(currentDocument.clips, clamp(insertAt, 0, currentDocument.clips.length));

    commitDocument((current) => {
      const nextInsertAt = current.selectedClipId
        ? current.clips.findIndex((clip) => clip.id === current.selectedClipId) + 1
        : current.clips.length;
      const nextClips = [...current.clips];
      nextClips.splice(clamp(nextInsertAt, 0, nextClips.length), 0, nextClip);
      return {
        ...current,
        clips: nextClips,
        selectedClipId: nextClip.id,
        selectedSourceResourceId: queuedResource.id,
        sourceInSec: range.inSec,
        sourceOutSec: range.outSec,
        sourceDurationSec: null,
        previewMode: "program",
      };
    });
    setTimelinePlayheadSec(playheadStart);
    void message.success(`已加入时间线：${sourceItem.title}`, 0.8);
    onConsumeQueuedClipResource?.();
  }, [
    commitDocument,
    currentDocument.clips,
    currentDocument.selectedClipId,
    editor.bootstrapped,
    message,
    onConsumeQueuedClipResource,
    queuedClipResource,
  ]);

  const selectedClip = useMemo(
    () => currentDocument.clips.find((clip) => clip.id === currentDocument.selectedClipId) ?? null,
    [currentDocument.clips, currentDocument.selectedClipId],
  );

  const selectedClipIndex = useMemo(
    () => currentDocument.clips.findIndex((clip) => clip.id === currentDocument.selectedClipId),
    [currentDocument.clips, currentDocument.selectedClipId],
  );

  const timelineSegments = useMemo(
    () => buildTimelineSegments(currentDocument.clips),
    [currentDocument.clips],
  );

  const totalDuration = useMemo(() => {
    const tail = timelineSegments[timelineSegments.length - 1];
    return tail?.endSec ?? 0;
  }, [timelineSegments]);

  const playheadSegment = useMemo(
    () => findTimelineSegmentAt(timelineSegments, timelinePlayheadSec),
    [timelinePlayheadSec, timelineSegments],
  );

  const previewClip = useMemo(() => {
    if (isProgramPlaying && programPlaybackIndex !== null) {
      return currentDocument.clips[programPlaybackIndex] ?? null;
    }
    return playheadSegment?.clip ?? selectedClip;
  }, [
    currentDocument.clips,
    isProgramPlaying,
    playheadSegment,
    programPlaybackIndex,
    selectedClip,
  ]);

  useEffect(() => {
    setTimelinePlayheadSec((current) => clamp(current, 0, totalDuration));
  }, [totalDuration]);

  useEffect(() => {
    if (isProgramPlaying) return;
    const segment = playheadSegment;
    if (!segment) return;
    if (currentDocument.selectedClipId === segment.clip.id) return;
    commitDocument((current) => ({
      ...current,
      selectedClipId: segment.clip.id,
      selectedSourceResourceId: segment.clip.resourceId ?? current.selectedSourceResourceId,
      sourceInSec: segment.clip.inSec,
      sourceOutSec: segment.clip.outSec,
      sourceDurationSec: segment.clip.sourceDurationSec,
      previewMode: "program",
    }), { recordHistory: false });
  }, [commitDocument, currentDocument.selectedClipId, isProgramPlaying, playheadSegment]);

  const stopProgramPlayback = useCallback(() => {
    setIsProgramPlaying(false);
    setProgramPlaybackIndex(null);
    programAdvancingRef.current = false;
    const video = programVideoRef.current;
    if (video) {
      video.pause();
    }
  }, []);

  const findNextPlayableIndex = useCallback((from: number): number | null => {
    for (let index = from; index < currentDocument.clips.length; index += 1) {
      const clip = currentDocument.clips[index];
      if (clip?.url) return index;
    }
    return null;
  }, [currentDocument.clips]);

  const advanceToNextClip = useCallback(() => {
    if (programPlaybackIndex === null) {
      stopProgramPlayback();
      return;
    }
    const nextIndex = findNextPlayableIndex(programPlaybackIndex + 1);
    if (nextIndex === null) {
      setTimelinePlayheadSec(totalDuration);
      stopProgramPlayback();
      return;
    }
    const nextSegment = timelineSegments[nextIndex];
    programAdvancingRef.current = true;
    setProgramPlaybackIndex(nextIndex);
    if (nextSegment) {
      setTimelinePlayheadSec(nextSegment.startSec);
    }
    commitDocument((current) => ({
      ...current,
      selectedClipId: current.clips[nextIndex]?.id ?? null,
      previewMode: "program",
    }), { recordHistory: false });
  }, [
    commitDocument,
    findNextPlayableIndex,
    programPlaybackIndex,
    stopProgramPlayback,
    timelineSegments,
    totalDuration,
  ]);

  useEffect(() => {
    if (!isProgramPlaying || programPlaybackIndex === null) return;
    const clip = currentDocument.clips[programPlaybackIndex];
    if (!clip?.url) {
      advanceToNextClip();
      return;
    }

    const video = programVideoRef.current;
    if (!video) return;
    programAdvancingRef.current = false;

    const begin = () => {
      video.currentTime = clip.inSec;
      void video.play().catch(() => {
        // ignore autoplay rejections
      });
    };

    if (video.readyState >= 1) {
      begin();
    }

    video.addEventListener("loadedmetadata", begin);
    return () => {
      video.removeEventListener("loadedmetadata", begin);
    };
  }, [advanceToNextClip, currentDocument.clips, isProgramPlaying, programPlaybackIndex]);

  const persistPlan = useCallback(async (saveMode: "manual" | "autosave") => {
    if (!sequenceId) {
      if (saveMode === "manual") {
        void message.warning("请先创建或选择序列。");
      }
      return false;
    }

    if (currentDocument.clips.length === 0) {
      if (saveMode === "manual") {
        void message.warning("请先至少加入一个片段。");
      }
      return false;
    }

    const cleanKey = currentDocument.planName.trim() || DEFAULT_PLAN_NAME;

    if (saveMode === "manual") {
      setSaving(true);
    } else {
      setAutosaveState("saving");
    }

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
          saveMode,
          clips: currentDocument.clips.map((clip) => ({
            id: clip.id,
            resourceId: clip.resourceId,
            url: clip.url,
            inSec: clip.inSec,
            outSec: clip.outSec,
            transition: clip.transition,
            title: clip.title,
            sourceDurationSec: clip.sourceDurationSec,
          })),
          editorState: {
            selectedClipId: currentDocument.selectedClipId,
            selectedSourceResourceId: currentDocument.selectedSourceResourceId,
            sourceInSec: currentDocument.sourceInSec,
            sourceOutSec: currentDocument.sourceOutSec,
            sourceDurationSec: currentDocument.sourceDurationSec,
            previewMode: currentDocument.previewMode,
            timelineZoom: currentDocument.timelineZoom,
            snapEnabled: currentDocument.snapEnabled,
            snapStepSec: currentDocument.snapStepSec,
          },
        }),
      });

      lastPersistedSnapshotRef.current = serializedDocument;
      setLastSavedAt(new Date().toISOString());
      setAutosaveState("saved");

      if (saveMode === "manual" && memoryUser && videoContext) {
        const editingHints = deriveEditingHints(currentDocument);
        const cameraHints = deriveCameraHints(currentDocument, resources);
        const note = buildMemoryNote(currentDocument, resources);
        void Promise.all([
          fetchJson("/api/video/memory/path-review", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              memoryUser,
              projectId: videoContext.projectId,
              sequenceKey: videoContext.sequenceKey,
              pathId: "path.multi_clip_compose",
              score: 1,
              note,
            }),
          }),
          fetchJson("/api/video/memory/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              memoryUser,
              projectId: videoContext.projectId,
              sequenceKey: videoContext.sequenceKey,
              eventType: "manual_feedback",
              styleTokens: [],
              workflowPaths: ["path.multi_clip_compose"],
              rejectedWorkflowPaths: [],
              providers: [],
              editingHints,
              cameraHints,
              modelIds: modelId ? [modelId] : [],
              positivePrompt: null,
              negativePrompt: null,
              query: null,
              strength: 0.9,
              note,
            }),
          }),
        ]).catch(() => {
          // best effort: clip plan has already been saved
        });
      }

      if (saveMode === "manual") {
        void message.success(
          `已保存剪辑计划：${result.clipCount} clips / ${result.totalDurationSec.toFixed(2)}s`,
        );
        onSaved();
      }

      return true;
    } catch (err) {
      const text = err instanceof Error ? err.message : String(err);
      setAutosaveState("error");
      if (saveMode === "manual") {
        void message.error(`保存失败：${text}`);
      }
      return false;
    } finally {
      if (saveMode === "manual") {
        setSaving(false);
      }
    }
  }, [currentDocument, memoryUser, message, modelId, onSaved, resources, sequenceId, serializedDocument, videoContext]);

  useEffect(() => {
    if (!editor.bootstrapped || !sequenceId) return;
    if (currentDocument.clips.length === 0) {
      setAutosaveState("idle");
      return;
    }
    if (serializedDocument === lastPersistedSnapshotRef.current) {
      return;
    }

    setAutosaveState("pending");
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      void persistPlan("autosave");
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [currentDocument.clips.length, editor.bootstrapped, persistPlan, sequenceId, serializedDocument]);

  const handleProgramTimeUpdate = useCallback(() => {
    const video = programVideoRef.current;
    if (!video || programAdvancingRef.current) return;

    if (isProgramPlaying && programPlaybackIndex !== null) {
      const clip = currentDocument.clips[programPlaybackIndex];
      const segment = timelineSegments[programPlaybackIndex];
      if (!clip || !segment) return;
      const offset = clamp(video.currentTime - clip.inSec, 0, clipDurationSec(clip));
      setTimelinePlayheadSec(clamp(segment.startSec + offset, segment.startSec, segment.endSec));
      if (video.currentTime >= clip.outSec - 0.03) {
        advanceToNextClip();
      }
      return;
    }

    const segment = playheadSegment;
    if (!segment) return;
    const offset = clamp(video.currentTime - segment.clip.inSec, 0, segment.durationSec);
    const nextSec = clamp(segment.startSec + offset, segment.startSec, segment.endSec);
    setTimelinePlayheadSec((current) => {
      if (Math.abs(current - nextSec) <= 0.02) return current;
      return nextSec;
    });
    if (video.currentTime >= segment.clip.outSec - 0.03) {
      video.pause();
    }
  }, [
    advanceToNextClip,
    currentDocument.clips,
    isProgramPlaying,
    playheadSegment,
    programPlaybackIndex,
    timelineSegments,
  ]);

  useEffect(() => {
    if (isProgramPlaying) return;
    const segment = playheadSegment;
    const video = programVideoRef.current;
    if (!segment || !segment.clip.url || !video) return;

    const localOffset = clamp(timelinePlayheadSec - segment.startSec, 0, segment.durationSec);
    const targetTime = clamp(
      segment.clip.inSec + localOffset,
      segment.clip.inSec,
      segment.clip.outSec,
    );
    const syncFrame = () => {
      if (Math.abs(video.currentTime - targetTime) > 0.03) {
        video.currentTime = targetTime;
      }
    };

    if (video.readyState >= 1) {
      syncFrame();
      return;
    }
    video.addEventListener("loadedmetadata", syncFrame);
    return () => {
      video.removeEventListener("loadedmetadata", syncFrame);
    };
  }, [isProgramPlaying, playheadSegment, timelinePlayheadSec]);

  const selectClip = useCallback((clipId: string) => {
    const segment = timelineSegments.find((item) => item.clip.id === clipId) ?? null;
    if (segment) {
      setTimelinePlayheadSec(segment.startSec);
    }
    commitDocument((current) => {
      const clip = current.clips.find((item) => item.id === clipId) ?? null;
      return {
        ...current,
        selectedClipId: clipId,
        selectedSourceResourceId: clip?.resourceId ?? current.selectedSourceResourceId,
        sourceInSec: clip?.inSec ?? current.sourceInSec,
        sourceOutSec: clip?.outSec ?? current.sourceOutSec,
        sourceDurationSec: clip?.sourceDurationSec ?? current.sourceDurationSec,
      };
    }, { recordHistory: false });
  }, [commitDocument, timelineSegments]);

  const removeClip = useCallback((clipId: string) => {
    if (isProgramPlaying) {
      stopProgramPlayback();
    }
    const removeIndex = currentDocument.clips.findIndex((clip) => clip.id === clipId);
    if (removeIndex < 0) return;

    const nextClips = currentDocument.clips.filter((clip) => clip.id !== clipId);
    const nextSelected = nextClips[removeIndex] ?? nextClips[removeIndex - 1] ?? null;
    if (nextSelected) {
      const nextIndex = nextClips.findIndex((clip) => clip.id === nextSelected.id);
      if (nextIndex >= 0) {
        setTimelinePlayheadSec(timelineStartAtIndex(nextClips, nextIndex));
      }
    } else {
      setTimelinePlayheadSec(0);
    }

    commitDocument((current) => {
      const currentRemoveIndex = current.clips.findIndex((clip) => clip.id === clipId);
      if (currentRemoveIndex < 0) return current;
      const clipped = current.clips.filter((clip) => clip.id !== clipId);
      const fallback = clipped[currentRemoveIndex] ?? clipped[currentRemoveIndex - 1] ?? null;
      const retarget = current.selectedClipId === clipId;
      return {
        ...current,
        clips: clipped,
        selectedClipId: retarget ? fallback?.id ?? null : current.selectedClipId,
        selectedSourceResourceId: retarget
          ? (fallback?.resourceId ?? current.selectedSourceResourceId)
          : current.selectedSourceResourceId,
        sourceInSec: retarget ? (fallback?.inSec ?? current.sourceInSec) : current.sourceInSec,
        sourceOutSec: retarget ? (fallback?.outSec ?? current.sourceOutSec) : current.sourceOutSec,
        sourceDurationSec: retarget
          ? (fallback?.sourceDurationSec ?? current.sourceDurationSec)
          : current.sourceDurationSec,
      };
    });
  }, [commitDocument, currentDocument.clips, isProgramPlaying, stopProgramPlayback]);

  const splitClipAtPlayhead = useCallback(() => {
    const segment = playheadSegment;
    if (!segment) {
      void message.warning("请先把播放头移动到要切割的位置。");
      return;
    }

    const clip = segment.clip;
    const localOffset = clamp(timelinePlayheadSec - segment.startSec, 0, segment.durationSec);
    const rawCutSec = clip.inSec + localOffset;
    const quantizedCutSec = quantize(rawCutSec, currentDocument.snapStepSec, currentDocument.snapEnabled);
    const cutSec = clamp(quantizedCutSec, clip.inSec, clip.outSec);
    const edgePadding = Math.max(
      0.05,
      currentDocument.snapEnabled ? currentDocument.snapStepSec * 0.5 : 0.05,
    );

    if (cutSec <= clip.inSec + edgePadding || cutSec >= clip.outSec - edgePadding) {
      void message.warning("播放头太靠近片段边界，无法切割。");
      return;
    }

    const nextClipId = crypto.randomUUID();
    commitDocument((current) => {
      const index = current.clips.findIndex((item) => item.id === clip.id);
      const source = current.clips[index];
      if (index < 0 || !source) return current;
      const boundedCut = clamp(cutSec, source.inSec + 0.01, source.outSec - 0.01);
      const first: ClipDraft = {
        ...source,
        outSec: boundedCut,
      };
      const second: ClipDraft = {
        ...source,
        id: nextClipId,
        inSec: boundedCut,
        transition: "cut",
      };
      const nextClips = [...current.clips];
      nextClips.splice(index, 1, first, second);
      return {
        ...current,
        clips: nextClips,
        selectedClipId: second.id,
        selectedSourceResourceId: second.resourceId ?? current.selectedSourceResourceId,
        sourceInSec: second.inSec,
        sourceOutSec: second.outSec,
        sourceDurationSec: second.sourceDurationSec ?? current.sourceDurationSec,
        previewMode: "program",
      };
    });
    setTimelinePlayheadSec(segment.startSec + (cutSec - clip.inSec));
    void message.success("已在播放头切割片段。", 0.8);
  }, [
    commitDocument,
    currentDocument.snapEnabled,
    currentDocument.snapStepSec,
    message,
    playheadSegment,
    timelinePlayheadSec,
  ]);

  const handleRippleDelete = useCallback(() => {
    if (!selectedClip) {
      void message.warning("请先选择一个片段。");
      return;
    }
    removeClip(selectedClip.id);
    void message.success("已波纹删除当前片段。", 0.8);
  }, [message, removeClip, selectedClip]);

  const applyAutoRoughCut = useCallback(() => {
    if (videoItems.length === 0) {
      void message.warning("当前没有可用视频素材，无法自动生成粗剪。");
      return;
    }
    if (isProgramPlaying) {
      stopProgramPlayback();
    }

    const rolePriority: Record<string, number> = {
      first_frame_ref: 0,
      scene_ref: 1,
      empty_shot_ref: 2,
      motion_ref: 3,
      character_ref: 4,
      last_frame_ref: 5,
      storyboard_ref: 6,
      style_ref: 7,
      dialogue_ref: 8,
    };

    const sortedCandidates = [...videoItems].sort((a, b) => {
      const roleA = videoRoleMap.get(a.id);
      const roleB = videoRoleMap.get(b.id);
      const rankA = roleA ? (rolePriority[roleA] ?? 99) : 99;
      const rankB = roleB ? (rolePriority[roleB] ?? 99) : 99;
      if (rankA !== rankB) return rankA - rankB;
      return a.title.localeCompare(b.title, "zh-Hans-CN");
    });

    const nextClips = sortedCandidates
      .slice(0, 8)
      .map((source, index) => {
        const presetDuration = inferAutoRoughCutDurationSec(source, index);
        const nextClip = createClipFromSource(source, index, {
          inSec: 0,
          outSec: Number(clamp(presetDuration, 0.8, 6.5).toFixed(2)),
          sourceDurationSec: null,
        });
        return {
          ...nextClip,
          transition: index === 0
            ? "none"
            : ROUGH_CUT_TRANSITION_PRESETS[(index - 1) % ROUGH_CUT_TRANSITION_PRESETS.length] ?? "cut",
        };
      });

    commitDocument((current) => ({
      ...current,
      clips: nextClips,
      selectedClipId: nextClips[0]?.id ?? null,
      selectedSourceResourceId: nextClips[0]?.resourceId ?? current.selectedSourceResourceId,
      sourceInSec: nextClips[0]?.inSec ?? current.sourceInSec,
      sourceOutSec: nextClips[0]?.outSec ?? current.sourceOutSec,
      sourceDurationSec: nextClips[0]?.sourceDurationSec ?? current.sourceDurationSec,
      previewMode: "program",
    }));
    setTimelinePlayheadSec(0);
    void message.success(`AI 粗剪已生成：${nextClips.length} 段并自动应用转场预设。`, 1.2);
  }, [
    commitDocument,
    isProgramPlaying,
    message,
    stopProgramPlayback,
    videoItems,
    videoRoleMap,
  ]);

  const duplicateSelectedClip = useCallback(() => {
    if (!selectedClip) {
      void message.warning("请先选择一个片段。");
      return;
    }
    const duplicate: ClipDraft = {
      ...selectedClip,
      id: crypto.randomUUID(),
      title: `${selectedClip.title} copy`,
    };
    commitDocument((current) => {
      const index = current.clips.findIndex((clip) => clip.id === selectedClip.id);
      const nextClips = [...current.clips];
      nextClips.splice(index + 1, 0, duplicate);
      return {
        ...current,
        clips: nextClips,
        selectedClipId: duplicate.id,
      };
    });
  }, [commitDocument, message, selectedClip]);

  const updateSelectedClip = useCallback((patch: Partial<ClipDraft>) => {
    if (!selectedClip) return;
    commitDocument((current) => ({
      ...current,
      clips: current.clips.map((clip) => {
        if (clip.id !== selectedClip.id) return clip;
        const nextClip = { ...clip, ...patch };
        const inSec = clamp(nextClip.inSec, 0, Number.MAX_SAFE_INTEGER);
        const outSec = clamp(nextClip.outSec, inSec, nextClip.sourceDurationSec ?? Number.MAX_SAFE_INTEGER);
        return {
          ...nextClip,
          inSec,
          outSec,
        };
      }),
    }));
  }, [commitDocument, selectedClip]);

  const handleTrimMouseDown = useCallback((
    clipId: string,
    edge: "start" | "end",
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (isProgramPlaying) {
      stopProgramPlayback();
    }

    const baseClip = currentDocument.clips.find((clip) => clip.id === clipId);
    if (!baseClip) return;

    selectClip(clipId);

    const initialClientX = event.clientX;
    const initialInSec = baseClip.inSec;
    const initialOutSec = baseClip.outSec;
    const sourceDurationSec = baseClip.sourceDurationSec ?? Number.MAX_SAFE_INTEGER;
    const minDuration = Math.max(
      0.12,
      currentDocument.snapEnabled ? currentDocument.snapStepSec : 0.12,
    );
    const pixelsPerSecond = fitTimelineToView && totalDuration > 0 && timelineViewportWidth > 0
      ? Math.max(1.2, (timelineViewportWidth - 24) / Math.max(totalDuration, 0.1))
      : Math.max(12, currentDocument.timelineZoom * 1.05);

    const applyTrimAtClientX = (clientX: number) => {
      const deltaSec = (clientX - initialClientX) / Math.max(pixelsPerSecond, 0.001);
      commitDocument((current) => ({
        ...current,
        clips: current.clips.map((clip) => {
          if (clip.id !== clipId) return clip;
          if (edge === "start") {
            const nextInSec = clamp(
              quantize(initialInSec + deltaSec, currentDocument.snapStepSec, currentDocument.snapEnabled),
              0,
              Math.min(initialOutSec - minDuration, sourceDurationSec),
            );
            return {
              ...clip,
              inSec: nextInSec,
            };
          }
          const nextOutSec = clamp(
            quantize(initialOutSec + deltaSec, currentDocument.snapStepSec, currentDocument.snapEnabled),
            initialInSec + minDuration,
            sourceDurationSec,
          );
          return {
            ...clip,
            outSec: nextOutSec,
          };
        }),
        selectedClipId: clipId,
        previewMode: "program",
      }), { recordHistory: false });
    };

    const onMove = (moveEvent: MouseEvent) => {
      const viewport = timelineViewportRef.current;
      if (viewport) {
        autoScrollTimelineViewport(viewport, moveEvent.clientX);
      }
      trimPendingClientXRef.current = moveEvent.clientX;
      if (trimAnimationFrameRef.current !== null) return;
      trimAnimationFrameRef.current = window.requestAnimationFrame(() => {
        trimAnimationFrameRef.current = null;
        const nextClientX = trimPendingClientXRef.current;
        trimPendingClientXRef.current = null;
        if (nextClientX === null) return;
        applyTrimAtClientX(nextClientX);
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (trimAnimationFrameRef.current !== null) {
        cancelAnimationFrame(trimAnimationFrameRef.current);
        trimAnimationFrameRef.current = null;
      }
      if (trimPendingClientXRef.current !== null) {
        applyTrimAtClientX(trimPendingClientXRef.current);
        trimPendingClientXRef.current = null;
      }
      setEditor((prev) => {
        const currentSerialized = serializeDocument(prev.present);
        const historySerialized = serializeDocument(prev.history[prev.historyIndex] ?? prev.present);
        if (currentSerialized === historySerialized) {
          return prev;
        }
        const historyHead = prev.history.slice(0, prev.historyIndex + 1);
        const nextHistory = [...historyHead, cloneDocument(prev.present)].slice(-MAX_HISTORY);
        return {
          ...prev,
          history: nextHistory,
          historyIndex: nextHistory.length - 1,
        };
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [
    commitDocument,
    currentDocument.clips,
    currentDocument.snapEnabled,
    currentDocument.snapStepSec,
    currentDocument.timelineZoom,
    fitTimelineToView,
    isProgramPlaying,
    selectClip,
    stopProgramPlayback,
    timelineViewportWidth,
    totalDuration,
  ]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    commitDocument((current) => {
      const oldIndex = current.clips.findIndex((clip) => clip.id === activeId);
      const newIndex = current.clips.findIndex((clip) => clip.id === overId);
      if (oldIndex < 0 || newIndex < 0) {
        return current;
      }
      return {
        ...current,
        clips: arrayMove(current.clips, oldIndex, newIndex),
      };
    });
  }, [commitDocument]);

  const startProgramPlayback = useCallback(() => {
    if (currentDocument.clips.length === 0) {
      void message.warning("请先至少加入一个片段。");
      return;
    }
    const playheadIndex = playheadSegment?.index ?? 0;
    const firstPlayable = findNextPlayableIndex(Math.max(playheadIndex, 0));
    if (firstPlayable === null) {
      void message.warning("当前没有可播放的视频片段。");
      return;
    }
    const startSegment = timelineSegments[firstPlayable];
    setIsProgramPlaying(true);
    setProgramPlaybackIndex(firstPlayable);
    if (startSegment) {
      setTimelinePlayheadSec(startSegment.startSec);
    }
    commitDocument((current) => ({
      ...current,
      selectedClipId: current.clips[firstPlayable]?.id ?? null,
      previewMode: "program",
    }), { recordHistory: false });
  }, [
    commitDocument,
    currentDocument.clips.length,
    findNextPlayableIndex,
    message,
    playheadSegment?.index,
    timelineSegments,
  ]);

  const handleUndo = useCallback(() => {
    if (isProgramPlaying) {
      stopProgramPlayback();
    }
    setEditor((prev) => {
      if (prev.historyIndex === 0) return prev;
      const nextIndex = prev.historyIndex - 1;
      return {
        ...prev,
        historyIndex: nextIndex,
        present: cloneDocument(prev.history[nextIndex]!),
      };
    });
  }, [isProgramPlaying, stopProgramPlayback]);

  const handleRedo = useCallback(() => {
    if (isProgramPlaying) {
      stopProgramPlayback();
    }
    setEditor((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      const nextIndex = prev.historyIndex + 1;
      return {
        ...prev,
        historyIndex: nextIndex,
        present: cloneDocument(prev.history[nextIndex]!),
      };
    });
  }, [isProgramPlaying, stopProgramPlayback]);

  const autosaveLabel = useMemo(() => {
    if (autosaveState === "saving") return "自动保存中";
    if (autosaveState === "saved" && lastSavedAt) {
      return `已保存 ${new Date(lastSavedAt).toLocaleTimeString()}`;
    }
    if (autosaveState === "pending") return "待自动保存";
    if (autosaveState === "error") return "自动保存失败";
    return "未开始";
  }, [autosaveState, lastSavedAt]);

  const adjustTimelineZoom = useCallback((delta: number) => {
    setFitTimelineToView(false);
    commitDocument((current) => ({
      ...current,
      timelineZoom: clamp(current.timelineZoom + delta, 8, 120),
    }), { recordHistory: false });
  }, [commitDocument]);

  useEffect(() => {
    const viewport = timelineViewportRef.current;
    if (!viewport) return;

    const updateWidth = () => {
      setTimelineViewportWidth(viewport.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const timelinePixelsPerSecond = useMemo(
    () => {
      if (fitTimelineToView && totalDuration > 0 && timelineViewportWidth > 0) {
        return Math.max(1.2, (timelineViewportWidth - 24) / Math.max(totalDuration, 0.1));
      }
      return Math.max(12, currentDocument.timelineZoom * 1.05);
    },
    [currentDocument.timelineZoom, fitTimelineToView, timelineViewportWidth, totalDuration],
  );

  const timelineTrackWidth = useMemo(
    () => Math.max(
      Math.max(540, timelineViewportWidth > 0 ? timelineViewportWidth - 8 : 0),
      totalDuration * timelinePixelsPerSecond,
    ),
    [timelinePixelsPerSecond, timelineViewportWidth, totalDuration],
  );
  const timelineZoomLabel = fitTimelineToView
    ? "适配"
    : `${Math.round((currentDocument.timelineZoom / DEFAULT_TIMELINE_ZOOM) * 100)}%`;

  const seekPlayhead = useCallback((nextSec: number) => {
    const clampedSec = clamp(nextSec, 0, totalDuration);
    setTimelinePlayheadSec(clampedSec);
    const segment = findTimelineSegmentAt(timelineSegments, clampedSec);
    if (!segment) return;
    commitDocument((current) => ({
      ...current,
      selectedClipId: segment.clip.id,
      selectedSourceResourceId: segment.clip.resourceId ?? current.selectedSourceResourceId,
      sourceInSec: segment.clip.inSec,
      sourceOutSec: segment.clip.outSec,
      sourceDurationSec: segment.clip.sourceDurationSec,
      previewMode: "program",
    }), { recordHistory: false });
  }, [commitDocument, timelineSegments, totalDuration]);

  const scrubTimelineAtClientX = useCallback((clientX: number) => {
    scrubPendingClientXRef.current = clientX;
    if (scrubAnimationFrameRef.current !== null) return;
    scrubAnimationFrameRef.current = window.requestAnimationFrame(() => {
      scrubAnimationFrameRef.current = null;
      const nextClientX = scrubPendingClientXRef.current;
      scrubPendingClientXRef.current = null;
      if (nextClientX === null) return;
      const viewport = timelineViewportRef.current;
      if (!viewport) return;
      const bounds = viewport.getBoundingClientRect();
      autoScrollTimelineViewport(viewport, nextClientX);
      const localX = nextClientX - bounds.left + viewport.scrollLeft;
      const nextSec = clamp(localX / timelinePixelsPerSecond, 0, totalDuration);
      seekPlayhead(nextSec);
    });
  }, [seekPlayhead, timelinePixelsPerSecond, totalDuration]);

  const handleTimelineWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    if (!event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    adjustTimelineZoom(event.deltaY > 0 ? -4 : 4);
  }, [adjustTimelineZoom]);

  const handleTimelineRulerMouseDown = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    scrubTimelineAtClientX(event.clientX);

    const onMove = (moveEvent: MouseEvent) => {
      scrubTimelineAtClientX(moveEvent.clientX);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [scrubTimelineAtClientX]);

  const handleTimelineDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    const types = Array.from(event.dataTransfer.types);
    if (!types.includes(CLIP_ATLAS_DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsTimelineDragOver(true);
  }, []);

  const handleTimelineDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsTimelineDragOver(false);
    const raw = event.dataTransfer.getData(CLIP_ATLAS_DRAG_MIME);
    const payload = parseClipAtlasDragPayload(raw);
    if (!payload) {
      void message.warning("仅支持从右侧素材栏拖入已生成视频。");
      return;
    }
    const insertIndex = findInsertIndexAtPlayhead(timelineSegments, timelinePlayheadSec);
    const insertAt = clamp(insertIndex, 0, currentDocument.clips.length);
    const nextSource: SourceVideoItem = {
      id: payload.id,
      title: payload.title,
      url: payload.url,
      category: payload.category,
    };
    const nextRange = buildDefaultRange(null);
    const nextClip = createClipFromSource(nextSource, insertAt, {
      inSec: nextRange.inSec,
      outSec: nextRange.outSec,
      sourceDurationSec: null,
    });
    const startSec = timelineStartAtIndex(currentDocument.clips, insertAt);
    commitDocument((current) => {
      const nextClips = [...current.clips];
      nextClips.splice(insertAt, 0, nextClip);
      return {
        ...current,
        clips: nextClips,
        selectedClipId: nextClip.id,
        selectedSourceResourceId: nextSource.id,
        sourceInSec: nextClip.inSec,
        sourceOutSec: nextClip.outSec,
        sourceDurationSec: null,
        previewMode: "program",
      };
    });
    setTimelinePlayheadSec(startSec);
    void message.success(`已拖入时间线：${nextSource.title}`, 0.8);
  }, [commitDocument, currentDocument.clips, message, timelinePlayheadSec, timelineSegments]);

  const handleTimelineDragLeave = useCallback(() => {
    setIsTimelineDragOver(false);
  }, []);

  useEffect(() => {
    const viewport = timelineViewportRef.current;
    if (!viewport) return;
    const targetX = timelinePlayheadSec * timelinePixelsPerSecond;
    const visibleStart = viewport.scrollLeft;
    const visibleEnd = visibleStart + viewport.clientWidth;
    const padding = 72;

    if (targetX < visibleStart + padding) {
      viewport.scrollLeft = Math.max(0, targetX - padding);
      return;
    }
    if (targetX > visibleEnd - padding) {
      viewport.scrollLeft = Math.max(0, targetX - viewport.clientWidth + padding);
    }
  }, [timelinePixelsPerSecond, timelinePlayheadSec]);

  if (!resources) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="等待素材生成后再进入剪辑台。" />
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Typography.Text strong style={{ fontSize: 13 }}>
            Clip Studio
          </Typography.Text>
          <div className="mt-1 text-[11px] text-[var(--af-muted)]">
            左侧小 Inspector · 右侧 Preview（上）+ Timeline（下），布局固定
          </div>
        </div>
        <Space size={8}>
          <Button
            size="small"
            icon={<ThunderboltOutlined />}
            disabled={videoItems.length === 0}
            onClick={applyAutoRoughCut}
          >
            AI 自动粗剪
          </Button>
          <Tag color={autosaveState === "error" ? "error" : autosaveState === "saved" ? "success" : "default"}>
            {autosaveLabel}
          </Tag>
          <Tag style={{ margin: 0 }}>Total {totalDuration.toFixed(2)}s</Tag>
        </Space>
      </div>

      <Alert
        className="mb-4"
        showIcon
        type="info"
        title="从右侧素材栏拖入视频到时间线；拖动时间尺可 scrub 并联动 Preview 与当前片段。可一键 AI 自动粗剪并应用转场预设。"
      />

      <div className="overflow-x-auto pb-1">
        <div
          className="grid min-w-[860px] gap-3"
          style={{ gridTemplateColumns: `${inspectorExpanded ? 220 : 88}px minmax(0, 1fr)` }}
        >
        <Card
          className="ceramic-panel !border-transparent"
          styles={{ body: { padding: inspectorExpanded ? 16 : 12 } }}
        >
          <div className={`flex h-full flex-col ${inspectorExpanded ? "gap-4" : "gap-3"}`}>
            <div className={`flex items-center ${inspectorExpanded ? "justify-between" : "justify-between"}`}>
              {inspectorExpanded ? (
                <div className="min-w-0">
                  <Typography.Text strong style={{ fontSize: 13 }}>
                    Inspector
                  </Typography.Text>
                  <div className="mt-0.5 text-[11px] text-[var(--af-muted)]">
                    {selectedClip ? `片段 #${selectedClipIndex + 1}` : "选择片段后精修"}
                  </div>
                </div>
              ) : (
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--af-muted)]">
                  Edit
                </div>
              )}
              <Tooltip title={inspectorExpanded ? "收起 Inspector" : "展开 Inspector"}>
                <Button
                  size="small"
                  type="text"
                  icon={inspectorExpanded ? <LeftOutlined /> : <RightOutlined />}
                  onClick={() => setInspectorExpanded((prev) => !prev)}
                />
              </Tooltip>
            </div>

            {!inspectorExpanded ? (
              <button
                type="button"
                className="flex flex-1 flex-col justify-between rounded-[18px] border border-[rgba(229,221,210,0.92)] bg-[rgba(255,253,249,0.74)] p-2 text-left transition hover:border-[rgba(47,107,95,0.28)] hover:bg-[rgba(255,253,249,0.92)]"
                onClick={() => setInspectorExpanded(true)}
              >
                <div className="space-y-2">
                  <div className="rounded-[14px] border border-[rgba(229,221,210,0.9)] bg-white/70 px-2 py-2">
                    <div className="text-[9px] uppercase tracking-[0.12em] text-[var(--af-muted)]">Clip</div>
                    <div className="mt-1 text-[13px] font-medium text-[var(--af-text)]">
                      {selectedClip ? `#${selectedClipIndex + 1}` : "--"}
                    </div>
                  </div>
                  <div className="rounded-[14px] border border-[rgba(229,221,210,0.9)] bg-white/70 px-2 py-2">
                    <div className="text-[9px] uppercase tracking-[0.12em] text-[var(--af-muted)]">Len</div>
                    <div className="mt-1 text-[12px] font-medium text-[var(--af-text)]">
                      {selectedClip ? `${(selectedClip.outSec - selectedClip.inSec).toFixed(2)}s` : "--"}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center text-[10px] text-[var(--af-muted)]">
                  点按展开
                </div>
              </button>
            ) : !selectedClip ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="选择时间线中的片段后可在这里精修。" />
            ) : (
              <>
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    片段标题
                  </Typography.Text>
                  <Input
                    className="mt-1"
                    value={selectedClip.title}
                    onChange={(event) => updateSelectedClip({ title: event.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      In
                    </Typography.Text>
                    <InputNumber
                      className="mt-1"
                      min={0}
                      value={selectedClip.inSec}
                      onChange={(value) => updateSelectedClip({ inSec: Number(value ?? 0) })}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      Out
                    </Typography.Text>
                    <InputNumber
                      className="mt-1"
                      min={selectedClip.inSec}
                      value={selectedClip.outSec}
                      onChange={(value) => updateSelectedClip({ outSec: Number(value ?? selectedClip.inSec) })}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    转场
                  </Typography.Text>
                  <Select<ClipTransition>
                    className="mt-1"
                    value={selectedClip.transition}
                    onChange={(value) => updateSelectedClip({ transition: value })}
                    style={{ width: "100%" }}
                    options={[
                      { value: "none", label: transitionLabel("none") },
                      { value: "cut", label: transitionLabel("cut") },
                      { value: "fade", label: transitionLabel("fade") },
                      { value: "dissolve", label: transitionLabel("dissolve") },
                      { value: "wipe_left", label: transitionLabel("wipe_left") },
                      { value: "fade_black", label: transitionLabel("fade_black") },
                    ]}
                  />
                </div>

                <div className="rounded-[18px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)] p-3">
                  <div className="text-[11px] text-[var(--af-muted)]">片段信息</div>
                  <div className="mt-2 space-y-1 text-[12px] text-[var(--af-text)]">
                    <div>时长：{(selectedClip.outSec - selectedClip.inSec).toFixed(2)}s</div>
                    <div>源素材：{selectedClip.resourceId ? (videoItemMap.get(selectedClip.resourceId)?.title ?? selectedClip.resourceId) : "未绑定"}</div>
                    <div>源时长：{selectedClip.sourceDurationSec ? `${selectedClip.sourceDurationSec.toFixed(2)}s` : "未检测"}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="flex min-h-0 flex-col gap-2">
          <Card
            className="ceramic-panel !border-transparent"
            title="Preview"
            extra={(
              isProgramPlaying ? (
                <Button size="small" danger icon={<PauseCircleOutlined />} onClick={stopProgramPlayback}>
                  停止
                </Button>
              ) : (
                <Button size="small" type="primary" icon={<CaretRightOutlined />} onClick={startProgramPlayback}>
                  播放
                </Button>
              )
            )}
          >
          {previewClip?.url ? (
            <video
              ref={programVideoRef}
              src={previewClip.url}
              controls={!isProgramPlaying}
              className="h-60 w-full rounded-[18px] border border-[rgba(229,221,210,0.9)] bg-black object-contain"
              onTimeUpdate={handleProgramTimeUpdate}
              onEnded={() => {
                if (isProgramPlaying) {
                  advanceToNextClip();
                }
              }}
            />
          ) : (
            <div className="flex h-60 items-center justify-center rounded-[18px] border border-dashed border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] text-[12px] text-[var(--af-muted)]">
              右侧素材栏拖入视频，或先在时间线选中片段。
            </div>
          )}

          <div className="mt-2 border-t border-[rgba(229,221,210,0.85)] pt-2">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <Typography.Text strong style={{ fontSize: 13 }}>
                Timeline
              </Typography.Text>
              <Typography.Text style={{ fontSize: 11, color: "var(--af-muted)" }}>
                拖入视频即可拼接，整块片段可拖动排序，边缘可直接裁切。
              </Typography.Text>
            </div>
            <div className="rounded-[16px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)] px-2.5 py-1.5">
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1">
                <Tooltip title="撤销">
                  <Button size="small" icon={<UndoOutlined />} disabled={editor.historyIndex === 0} onClick={handleUndo} />
                </Tooltip>
                <Tooltip title="重做">
                  <Button
                    size="small"
                    icon={<RedoOutlined />}
                    disabled={editor.historyIndex >= editor.history.length - 1}
                    onClick={handleRedo}
                  />
                </Tooltip>
                <Tooltip title="复制片段">
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    disabled={!selectedClip}
                    onClick={duplicateSelectedClip}
                  />
                </Tooltip>
                <Tooltip title="播放头切割">
                  <Button size="small" icon={<ScissorOutlined />} disabled={!playheadSegment} onClick={splitClipAtPlayhead} />
                </Tooltip>
                <Tooltip title="波纹删除">
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={!selectedClip}
                    onClick={handleRippleDelete}
                  />
                </Tooltip>
                <span className="mx-1 h-5 w-px shrink-0 bg-[rgba(229,221,210,0.92)]" />
                <Button
                  size="small"
                  type={fitTimelineToView ? "primary" : "default"}
                  onClick={() => setFitTimelineToView((prev) => !prev)}
                >
                  全局
                </Button>
                <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(229,221,210,0.9)] bg-white px-2 py-1">
                  <span className="pr-1 text-[10px] uppercase tracking-[0.12em] text-[var(--af-muted)]">
                    Zoom
                  </span>
                  <ZoomOutOutlined className="text-[11px] text-[var(--af-muted)]" />
                  <Tooltip title="缩小">
                    <Button size="small" type="text" icon={<MinusOutlined />} onClick={() => adjustTimelineZoom(-8)} />
                  </Tooltip>
                  <span className="min-w-[54px] text-center text-[11px] text-[var(--af-text)]">
                    {timelineZoomLabel}
                  </span>
                  <Tooltip title="放大">
                    <Button size="small" type="text" icon={<PlusOutlined />} onClick={() => adjustTimelineZoom(8)} />
                  </Tooltip>
                  <ZoomInOutlined className="text-[11px] text-[var(--af-muted)]" />
                </div>
                <span className="text-[11px] text-[var(--af-muted)]">Ctrl/Command + 滚轮</span>
                <span className="mx-1 h-5 w-px shrink-0 bg-[rgba(229,221,210,0.92)]" />
                <span className="text-[11px] text-[var(--af-muted)]">吸附</span>
                <Switch
                  size="small"
                  checked={currentDocument.snapEnabled}
                  onChange={(checked) => {
                    commitDocument((current) => ({
                      ...current,
                      snapEnabled: checked,
                    }), { recordHistory: false });
                  }}
                />
                <Select<number>
                  size="small"
                  value={currentDocument.snapStepSec}
                  style={{ width: 88 }}
                  onChange={(value) => {
                    commitDocument((current) => ({
                      ...current,
                      snapStepSec: value,
                    }), { recordHistory: false });
                  }}
                  options={[
                    { value: 0.1, label: "0.1s" },
                    { value: 0.25, label: "0.25s" },
                    { value: 0.5, label: "0.5s" },
                    { value: 1, label: "1.0s" },
                  ]}
                />
              </div>
            </div>

            <div
              ref={timelineViewportRef}
              onWheel={handleTimelineWheel}
              onDragOver={handleTimelineDragOver}
              onDragLeave={handleTimelineDragLeave}
              onDrop={handleTimelineDrop}
              className={`mt-2 overflow-x-auto rounded-[18px] border px-2 py-2 transition ${
                isTimelineDragOver
                  ? "border-emerald-400 bg-emerald-50/65"
                  : "border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)]"
              }`}
            >
              <div className="relative" style={{ minWidth: timelineTrackWidth }}>
                <div
                  className="mb-1.5 h-5 cursor-pointer overflow-hidden rounded-[10px] border border-[rgba(229,221,210,0.8)] bg-[rgba(255,255,255,0.7)]"
                  onMouseDown={handleTimelineRulerMouseDown}
                >
                  {Array.from({ length: Math.max(2, Math.ceil(totalDuration) + 1) }, (_, tick) => (
                    <div
                      key={`tick-${tick}`}
                      className="absolute top-0 h-6 border-l border-[rgba(124,114,102,0.18)] text-[9px] text-[var(--af-muted)]"
                      style={{ left: tick * timelinePixelsPerSecond }}
                    >
                      {tick % 2 === 0 ? <span className="ml-1">{tick}s</span> : null}
                    </div>
                  ))}
                  <div
                    className="pointer-events-none absolute bottom-0 top-0 w-[2px] bg-[var(--af-accent)]"
                    style={{ left: timelinePlayheadSec * timelinePixelsPerSecond }}
                  />
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <Tag color="geekblue" style={{ margin: 0 }}>
                    V1
                  </Tag>
                  <Typography.Text style={{ fontSize: 11, color: "var(--af-muted)" }}>
                    主视频轨
                  </Typography.Text>
                </div>

                {currentDocument.clips.length === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-[16px] border border-dashed border-[rgba(229,221,210,0.9)] text-[12px] text-[var(--af-muted)]">
                    时间线为空：从右侧素材栏拖拽视频到这里即可加入。
                  </div>
                ) : (
                  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <SortableContext items={currentDocument.clips.map((clip) => clip.id)} strategy={horizontalListSortingStrategy}>
                      <div className="flex min-w-max items-start gap-0">
                        {timelineSegments.map((segment) => {
                          const clip = segment.clip;
                          const duration = Math.max(0, clip.outSec - clip.inSec);
                          const width = Math.max(80, duration * timelinePixelsPerSecond);
                          const compact = width < 220;
                          return (
                            <SortableClipBlock
                              key={clip.id}
                              clip={clip}
                              index={segment.index}
                              timelineStartSec={segment.startSec}
                              timelineEndSec={segment.endSec}
                              width={width}
                              compact={compact}
                              active={clip.id === currentDocument.selectedClipId}
                            playing={isProgramPlaying
                              ? programPlaybackIndex === segment.index
                              : playheadSegment?.index === segment.index}
                              onSelect={selectClip}
                              onDelete={removeClip}
                              onTrimMouseDown={handleTrimMouseDown}
                            />
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </div>
          </Card>
        </div>
      </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] px-4 py-3">
        <div className="flex min-w-[280px] items-center gap-3">
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            计划名称
          </Typography.Text>
          <Input
            value={currentDocument.planName}
            onChange={(event) => {
              commitDocument((current) => ({
                ...current,
                planName: event.target.value,
              }), { recordHistory: false });
            }}
            placeholder={DEFAULT_PLAN_NAME}
          />
        </div>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => void persistPlan("manual")}>
          保存剪辑计划
        </Button>
      </div>
    </div>
  );
}
