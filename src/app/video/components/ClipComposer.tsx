"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  App,
  Button,
  Card,
  Empty,
  Input,
  InputNumber,
  Select,
  Slider,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CaretRightOutlined,
  CopyOutlined,
  DownloadOutlined,
  DeleteOutlined,
  HolderOutlined,
  MinusOutlined,
  PauseCircleOutlined,
  PlusOutlined,
  RedoOutlined,
  SaveOutlined,
  ScissorOutlined,
  ThunderboltOutlined,
  UndoOutlined,
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
  audioEnabled: z.boolean().optional(),
  audioVolume: z.number().min(0).max(200).optional(),
});
const AudioTrackDraftSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  startSec: z.number().min(0),
  sourceInSec: z.number().min(0),
  sourceOutSec: z.number().min(0),
  sourceDurationSec: z.number().min(0).nullable().optional(),
  volume: z.number().min(0).max(200),
  muted: z.boolean(),
});

const ClipEditorDocumentSchema = z.object({
  planName: z.string().min(1),
  clips: z.array(ClipDraftSchema),
  audioTracks: z.array(AudioTrackDraftSchema),
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
      audioEnabled: z.boolean().optional(),
      audioVolume: z.number().min(0).max(200).nullable().optional(),
    }),
  ).default([]),
  audioTracks: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().nullable().optional(),
      url: z.string().url().nullable().optional(),
      startSec: z.number().min(0),
      sourceInSec: z.number().min(0),
      sourceOutSec: z.number().min(0),
      sourceDurationSec: z.number().min(0).nullable().optional(),
      volume: z.number().min(0).max(200).optional(),
      muted: z.boolean().optional(),
    }),
  ).optional().default([]),
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
type AudioTrackDraft = ClipEditorDocument["audioTracks"][number];

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
  overlapBeforeSec: number;
}

interface TimelineAudioSegment {
  track: AudioTrackDraft;
  index: number;
  startSec: number;
  endSec: number;
  durationSec: number;
}

interface ActivePreviewTransition {
  currentClipId: string;
  nextClipId: string;
  type: ClipTransition;
  durationSec: number;
}

interface PreviewTransitionState extends ActivePreviewTransition {
  progress: number;
}

interface TimelineTick {
  sec: number;
  label: string;
}

interface TimelinePanSession {
  startClientX: number;
  startScrollLeft: number;
}

interface TimelineOverviewDragSession {
  startClientX: number;
  startScrollLeft: number;
  overviewWidth: number;
}

interface SortableClipBlockProps {
  clip: ClipDraft;
  index: number;
  timelineStartSec: number;
  timelineEndSec: number;
  transitionOverlapSec: number;
  width: number;
  style?: CSSProperties;
  active: boolean;
  playing: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onTrimMouseDown: (
    clipId: string,
    edge: "start" | "end",
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => void;
}

interface ClipFrameThumbnailProps {
  url: string | null;
  inSec: number;
  title: string;
  compact: boolean;
  active: boolean;
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
const MIN_TIMELINE_ZOOM = 8;
const MAX_TIMELINE_ZOOM = 120;
const TIMELINE_ZOOM_STEP = 4;
const TIMELINE_END_PADDING = 80;
const MAX_HISTORY = 40;
const AUTOSAVE_DELAY_MS = 1200;
const MIN_CLIP_TRIM_DURATION_SEC = 0.12;
const MIN_AUDIO_TRIM_DURATION_SEC = 0.15;
const LOCAL_DRAFT_PREFIX = "agentForge.video.clipStudio";
const TIMELINE_RULER_STEPS = [0.25, 0.5, 1, 2, 5, 10, 15, 30, 60] as const;
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

function audioTrackDurationSec(track: AudioTrackDraft): number {
  return Math.max(0, track.sourceOutSec - track.sourceInSec);
}

function boundedTransitionDuration(
  transition: ClipTransition,
  previousClipDurationSec: number,
  nextClipDurationSec: number,
): number {
  const preferredDuration = transitionPreviewDurationSec(transition);
  if (preferredDuration <= 0) return 0;
  const maxDuration = Math.min(previousClipDurationSec * 0.45, nextClipDurationSec * 0.45);
  if (maxDuration <= 0.04) return 0;
  return Number(clamp(preferredDuration, 0.04, maxDuration).toFixed(3));
}

function buildTimelineSegments(clips: ClipDraft[]): TimelineClipSegment[] {
  let cursor = 0;
  return clips.map((clip, index) => {
    const durationSec = clipDurationSec(clip);
    const previousClip = index > 0 ? (clips[index - 1] ?? null) : null;
    const overlapBeforeSec = previousClip
      ? boundedTransitionDuration(
        clip.transition,
        clipDurationSec(previousClip),
        durationSec,
      )
      : 0;
    const startSec = Math.max(0, cursor - overlapBeforeSec);
    const endSec = Number((startSec + durationSec).toFixed(3));
    const segment: TimelineClipSegment = {
      clip,
      index,
      startSec,
      endSec,
      durationSec,
      overlapBeforeSec,
    };
    cursor = endSec;
    return segment;
  });
}

function buildAudioTrackSegments(tracks: AudioTrackDraft[]): TimelineAudioSegment[] {
  return tracks.map((track, index) => {
    const durationSec = audioTrackDurationSec(track);
    return {
      track,
      index,
      startSec: track.startSec,
      endSec: track.startSec + durationSec,
      durationSec,
    };
  });
}

function findTimelineSegmentAt(
  segments: TimelineClipSegment[],
  playheadSec: number,
): TimelineClipSegment | null {
  if (segments.length === 0) return null;
  let candidate: TimelineClipSegment | null = null;
  for (const segment of segments) {
    if (playheadSec < segment.startSec) break;
    if (playheadSec < segment.endSec) {
      candidate = segment;
    }
  }
  return candidate ?? segments[segments.length - 1] ?? null;
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
  if (index <= 0) return 0;
  const segments = buildTimelineSegments(clips);
  const segmentAtIndex = segments[index];
  if (segmentAtIndex) {
    return segmentAtIndex.startSec;
  }
  return segments[segments.length - 1]?.endSec ?? 0;
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

function resolveTimelinePixelsPerSecond(
  timelineZoom: number,
  fitTimelineToView: boolean,
  timelineViewportWidth: number,
  totalDuration: number,
): number {
  if (fitTimelineToView && totalDuration > 0 && timelineViewportWidth > 0) {
    return Math.max(1.2, (timelineViewportWidth - 24) / Math.max(totalDuration, 0.1));
  }
  return Math.max(12, timelineZoom * 1.05);
}

function formatTimelineTime(valueSec: number): string {
  const bounded = Math.max(0, valueSec);
  const totalWholeSeconds = Math.floor(bounded);
  const minutes = Math.floor(totalWholeSeconds / 60);
  const seconds = totalWholeSeconds % 60;
  const centiseconds = Math.floor((bounded - totalWholeSeconds) * 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function buildTimelineTicks(totalDuration: number, pixelsPerSecond: number): TimelineTick[] {
  const desiredStep = 88 / Math.max(pixelsPerSecond, 0.001);
  const tickStep = TIMELINE_RULER_STEPS.find((step) => step >= desiredStep) ?? TIMELINE_RULER_STEPS.at(-1) ?? 60;
  const tickCount = Math.max(2, Math.ceil(totalDuration / tickStep) + 1);
  return Array.from({ length: tickCount }, (_, index) => {
    const sec = Number((index * tickStep).toFixed(3));
    return {
      sec,
      label: formatTimelineTime(sec),
    };
  });
}

function cloneDocument(doc: ClipEditorDocument): ClipEditorDocument {
  return {
    ...doc,
    clips: doc.clips.map((clip) => ({ ...clip })),
    audioTracks: doc.audioTracks.map((track) => ({ ...track })),
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
    audioTracks: [],
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

function timelineClipToneClass(transition: ClipTransition): string {
  switch (transition) {
    case "fade":
    case "dissolve":
      return "bg-[rgba(47,107,95,0.26)]";
    case "wipe_left":
    case "fade_black":
      return "bg-[rgba(201,139,91,0.24)]";
    case "cut":
    case "none":
    default:
      return "bg-[rgba(124,114,102,0.18)]";
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
    audioEnabled: true,
    audioVolume: 100,
  };
}

function autoScrollTimelineViewport(viewport: HTMLDivElement, clientX: number): void {
  const bounds = viewport.getBoundingClientRect();
  const edgePadding = 64;

  if (clientX > bounds.right - edgePadding) {
    const ratio = clamp((clientX - (bounds.right - edgePadding)) / edgePadding, 0, 1);
    const speed = 8 + (ratio * ratio * 52);
    viewport.scrollLeft += speed;
    return;
  }

  if (clientX < bounds.left + edgePadding) {
    const ratio = clamp(((bounds.left + edgePadding) - clientX) / edgePadding, 0, 1);
    const speed = 8 + (ratio * ratio * 52);
    viewport.scrollLeft = Math.max(0, viewport.scrollLeft - speed);
  }
}

function normalizeTimelineWheelDelta(event: WheelEvent): number {
  const rawDelta = Math.abs(event.deltaX) > 0.1 ? event.deltaX : event.deltaY;
  const modeScale = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? 120 : 1;
  const fallbackScale = Math.abs(event.deltaX) > 0.1 ? 1 : 1.28;
  return rawDelta * modeScale * fallbackScale;
}

function clipFrameThumbnailKey(url: string, inSec: number): string {
  return `${url}|${inSec.toFixed(3)}`;
}

function transitionPreviewDurationSec(transition: ClipTransition): number {
  switch (transition) {
    case "fade":
      return 0.42;
    case "dissolve":
      return 0.5;
    case "wipe_left":
      return 0.48;
    case "fade_black":
      return 0.55;
    case "cut":
    case "none":
    default:
      return 0;
  }
}

function deriveTrackTitleFromUrl(url: string, fallbackIndex: number): string {
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split("/").filter((item) => item.length > 0).pop();
    if (last) return decodeURIComponent(last);
  } catch {
    // ignore invalid urls here; validation happens before save/export
  }
  return `音频轨 ${fallbackIndex + 1}`;
}

function probeMediaDuration(
  url: string,
  mediaType: "video" | "audio",
): Promise<number | null> {
  return new Promise((resolve) => {
    const element = mediaType === "video"
      ? document.createElement("video")
      : document.createElement("audio");

    const finalize = (value: number | null) => {
      element.removeEventListener("loadedmetadata", handleLoaded);
      element.removeEventListener("error", handleError);
      element.src = "";
      resolve(value);
    };

    const handleLoaded = () => {
      const duration = Number.isFinite(element.duration) ? element.duration : null;
      finalize(duration !== null && duration > 0 ? Number(duration.toFixed(3)) : null);
    };
    const handleError = () => finalize(null);

    element.preload = "metadata";
    element.addEventListener("loadedmetadata", handleLoaded);
    element.addEventListener("error", handleError);
    element.src = url;
  });
}

function buildPreviewTransitionStyles(
  transition: ClipTransition,
  progressValue: number,
): {
  blackout: CSSProperties;
  incoming: CSSProperties;
  primary: CSSProperties;
} {
  const progress = clamp(progressValue, 0, 1);
  const outgoingOpacity = Number((1 - progress).toFixed(3));
  const incomingOpacity = Number(progress.toFixed(3));
  if (transition === "wipe_left") {
    return {
      primary: {
        opacity: 1,
      },
      incoming: {
        opacity: 1,
        clipPath: `inset(0 ${Math.round((1 - progress) * 100)}% 0 0)`,
      },
      blackout: { opacity: 0 },
    };
  }
  if (transition === "fade_black") {
    const blackoutOpacity = progress <= 0.5
      ? progress * 1.56
      : (1 - progress) * 1.56;
    return {
      primary: {
        opacity: outgoingOpacity,
      },
      incoming: {
        opacity: incomingOpacity,
      },
      blackout: {
        opacity: Number(clamp(blackoutOpacity, 0, 0.78).toFixed(3)),
      },
    };
  }
  return {
    primary: {
      opacity: outgoingOpacity,
    },
    incoming: {
      opacity: incomingOpacity,
    },
    blackout: { opacity: 0 },
  };
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
    audioEnabled: clip.audioEnabled ?? true,
    audioVolume: clip.audioVolume ?? 100,
  }));
  const audioTracks: AudioTrackDraft[] = (parsed.data.audioTracks ?? [])
    .filter((track): track is NonNullable<typeof track> => track.url != null)
    .map((track, index) => ({
      id: track.id?.trim() || crypto.randomUUID(),
      title: track.title?.trim() || deriveTrackTitleFromUrl(track.url!, index),
      url: track.url!,
      startSec: track.startSec,
      sourceInSec: track.sourceInSec,
      sourceOutSec: track.sourceOutSec,
      sourceDurationSec: track.sourceDurationSec ?? null,
      volume: track.volume ?? 100,
      muted: track.muted ?? false,
    }));

  return {
    planName: parsed.data.key?.trim() || fallbackPlanName,
    clips,
    audioTracks,
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

function ClipFrameThumbnail({
  url,
  inSec,
  title,
  compact,
  active,
}: ClipFrameThumbnailProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(active || typeof IntersectionObserver === "undefined");
  const canLoad = Boolean(url) && (active || isVisible);

  useEffect(() => {
    if (canLoad) return;
    const node = frameRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.01,
    });

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [canLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canLoad || !url) return;

    const pauseVideo = () => {
      video.pause();
    };

    const syncFrame = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const desired = Math.max(inSec, 0.04);
      const upperBound = duration > 0 ? Math.max(0, duration - 0.05) : desired;
      const target = clamp(desired, 0, upperBound);
      if (Math.abs(video.currentTime - target) > 0.03) {
        try {
          video.currentTime = target;
        } catch {
          // ignore seek failures from unsupported streams
        }
      }
    };

    video.addEventListener("loadedmetadata", syncFrame);
    video.addEventListener("loadeddata", pauseVideo);
    video.addEventListener("seeked", pauseVideo);

    if (video.readyState >= 1) {
      syncFrame();
    }

    return () => {
      video.removeEventListener("loadedmetadata", syncFrame);
      video.removeEventListener("loadeddata", pauseVideo);
      video.removeEventListener("seeked", pauseVideo);
    };
  }, [canLoad, inSec, url]);

  return (
    <div
      ref={frameRef}
      className={`relative shrink-0 overflow-hidden rounded-[9px] border border-[rgba(180,170,158,0.24)] bg-[rgba(244,239,232,0.82)] ${
        compact ? "h-8 w-10" : "h-10 w-14"
      }`}
    >
      {canLoad && url ? (
        <video
          ref={videoRef}
          src={url}
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          className="h-full w-full bg-black object-cover"
          aria-label={`${title} 首帧预览`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(214,222,226,0.52),rgba(244,239,232,0.82))] text-[10px] font-medium text-[var(--af-muted)]">
          {title.trim().slice(0, 1) || "#"}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/18 to-transparent" />
    </div>
  );
}

function SortableClipBlockBase({
  clip,
  index,
  timelineStartSec,
  timelineEndSec,
  transitionOverlapSec,
  width,
  style: blockStyle,
  active,
  playing,
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
    willChange: isDragging ? "transform" : undefined,
    zIndex: isDragging ? 3 : undefined,
    contentVisibility: "auto",
    containIntrinsicSize: "72px 132px",
    ...blockStyle,
  };
  const clipDuration = clipDurationSec(clip);
  const ultraTiny = width < 64;
  const compact = width < 152;
  const tiny = width < 96;
  const showFrameThumbnail = width >= 168;
  const transitionLeadWidth = transitionOverlapSec > 0
    ? Math.max(
      0,
      Math.min(
        Math.max(width - 12, 0),
        width * (transitionOverlapSec / Math.max(clipDuration, 0.001)),
      ),
    )
    : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      tabIndex={0}
      className="group relative h-[72px] select-none"
      onClick={() => onSelect(clip.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(clip.id);
        }
      }}
    >
      {transitionLeadWidth > 0 ? (
        <div
          className="pointer-events-none absolute inset-y-1 left-0 z-[1]"
          style={{
            width: transitionLeadWidth,
          }}
        >
          <div className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-[rgba(47,107,95,0.22)]" />
          <div className="absolute inset-x-1 right-2 top-1/2 h-px -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(47,107,95,0.26),rgba(47,107,95,0.08))]" />
          {transitionLeadWidth >= 44 && !ultraTiny ? (
            <div className="absolute left-1 top-1/2 max-w-[calc(100%-10px)] -translate-y-1/2 truncate rounded-full border border-[rgba(47,107,95,0.14)] bg-[rgba(255,255,255,0.88)] px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-[var(--af-muted)]">
              {transitionLabel(clip.transition)}
            </div>
          ) : null}
        </div>
      ) : null}
      <button
        type="button"
        aria-label={`${clip.title} 左侧裁切手柄`}
        className={`absolute inset-y-1 left-0 z-10 w-2 rounded-l-[14px] bg-[rgba(47,107,95,0.12)] transition cursor-ew-resize ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100 hover:opacity-100"
        }`}
        onMouseDown={(event) => onTrimMouseDown(clip.id, "start", event)}
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        aria-label={`${clip.title} 右侧裁切手柄`}
        className={`absolute inset-y-1 right-0 z-10 w-2 rounded-r-[14px] bg-[rgba(47,107,95,0.12)] transition cursor-ew-resize ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100 hover:opacity-100"
        }`}
        onMouseDown={(event) => onTrimMouseDown(clip.id, "end", event)}
        onClick={(event) => event.stopPropagation()}
      />
      <div
        className={`absolute inset-y-0 right-0 z-[2] flex overflow-hidden rounded-[12px] border ${
          active
            ? "border-[rgba(47,107,95,0.36)] bg-[rgba(255,255,255,0.98)] shadow-[inset_0_0_0_1px_rgba(47,107,95,0.08)]"
            : "border-[rgba(180,170,158,0.28)] bg-[rgba(255,253,249,0.96)]"
        } ${playing ? "shadow-[inset_0_0_0_1px_rgba(47,107,95,0.22)]" : ""}`}
        style={{ left: transitionLeadWidth }}
      >
        <div className={`w-1.5 shrink-0 ${active ? "bg-[var(--af-brand)]" : timelineClipToneClass(clip.transition)}`} />
        <div className={`relative flex min-w-0 flex-1 flex-col ${ultraTiny ? "px-1.5 py-1.5" : "px-2.5 py-2"}`}>
          <div className={`flex min-w-0 items-center ${ultraTiny ? "gap-1" : "gap-1.5"}`}>
            <button
              type="button"
              aria-label={`${clip.title} 拖拽排序`}
              className={`flex shrink-0 items-center justify-center rounded-full border text-[var(--af-muted)] touch-none ${
                ultraTiny ? "h-4 w-4" : "h-5 w-5"
              } ${
                active
                  ? "border-[rgba(47,107,95,0.2)] bg-[rgba(47,107,95,0.08)]"
                  : "border-[rgba(180,170,158,0.24)] bg-white/82"
              } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              onMouseDown={(event) => {
                event.stopPropagation();
                onSelect(clip.id);
              }}
              onClick={(event) => event.stopPropagation()}
              {...attributes}
              {...listeners}
            >
              <HolderOutlined className="text-[10px]" />
            </button>
            {showFrameThumbnail ? (
              <ClipFrameThumbnail
                key={clip.url ? clipFrameThumbnailKey(clip.url, clip.inSec) : `${clip.id}-thumb`}
                url={clip.url}
                inSec={clip.inSec}
                title={clip.title}
                compact={compact}
                active={active}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className={`truncate font-medium text-[var(--af-text)] ${ultraTiny ? "text-[9px]" : "text-[11px]"}`}>
                {tiny ? `${index + 1}. ${clipDuration.toFixed(1)}s` : `${index + 1}. ${clip.title}`}
              </div>
            </div>
            {!tiny && !ultraTiny ? (
              <div className="shrink-0 text-[10px] text-[var(--af-muted)]">
                {clipDuration.toFixed(2)}s
              </div>
            ) : null}
            {!ultraTiny ? (
              <Button
                size="small"
                type="text"
                danger
                icon={<DeleteOutlined />}
                className={`${active ? "" : "opacity-0 group-hover:opacity-100"} !h-6 !w-6 !min-w-6`}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(clip.id);
                }}
              />
            ) : null}
          </div>
          {ultraTiny ? null : tiny ? (
            <div className="mt-auto flex items-center gap-1.5 text-[9px] text-[var(--af-muted)]">
              <span>{transitionLabel(clip.transition)}</span>
              {transitionOverlapSec > 0 ? <span>-{transitionOverlapSec.toFixed(2)}s</span> : null}
            </div>
          ) : (
            <>
              <div className="mt-1 flex items-center gap-1.5 text-[9px] text-[var(--af-muted)]">
                <span>{transitionLabel(clip.transition)}</span>
                {transitionOverlapSec > 0 ? <span>Overlap {transitionOverlapSec.toFixed(2)}s</span> : null}
                {!compact ? (
                  <span className="truncate">
                    TL {formatTimelineTime(timelineStartSec)} - {formatTimelineTime(timelineEndSec)}
                  </span>
                ) : null}
              </div>
              {clip.sourceDurationSec && !compact ? (
                <div className="mt-auto">
                  <div className="h-1 rounded-full bg-[rgba(214,222,226,0.44)]">
                    <div
                      className="h-full rounded-full bg-[rgba(47,107,95,0.56)]"
                      style={{
                        marginLeft: `${(clip.inSec / clip.sourceDurationSec) * 100}%`,
                        width: `${Math.max((clipDuration / clip.sourceDurationSec) * 100, 6)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-[var(--af-muted)]">
                    <span>{clip.inSec.toFixed(2)}s</span>
                    <span>{clip.audioEnabled ? `${clip.audioVolume}%` : "静音"}</span>
                    <span>{clip.outSec.toFixed(2)}s</span>
                  </div>
                </div>
              ) : (
                <div className="mt-auto text-[9px] text-[var(--af-muted)]">
                  {clip.sourceDurationSec
                    ? `TL ${formatTimelineTime(timelineStartSec)} - ${formatTimelineTime(timelineEndSec)}`
                    : "源时长读取中…"}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const SortableClipBlock = memo(SortableClipBlockBase, (prev, next) => (
  prev.clip.id === next.clip.id
  && prev.clip.title === next.clip.title
  && prev.clip.inSec === next.clip.inSec
  && prev.clip.outSec === next.clip.outSec
  && prev.clip.transition === next.clip.transition
  && prev.clip.url === next.clip.url
  && prev.clip.sourceDurationSec === next.clip.sourceDurationSec
  && prev.clip.audioEnabled === next.clip.audioEnabled
  && prev.clip.audioVolume === next.clip.audioVolume
  && prev.index === next.index
  && prev.timelineStartSec === next.timelineStartSec
  && prev.timelineEndSec === next.timelineEndSec
  && prev.transitionOverlapSec === next.transitionOverlapSec
  && prev.width === next.width
  && prev.active === next.active
  && prev.playing === next.playing
  && prev.style?.marginLeft === next.style?.marginLeft
));

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
  const programTransitionVideoRef = useRef<HTMLVideoElement | null>(null);
  const programPreloadVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioPreviewRefs = useRef(new Map<string, HTMLAudioElement>());
  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const timelineContentRef = useRef<HTMLDivElement | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programAdvancingRef = useRef(false);
  const lastPersistedSnapshotRef = useRef("");
  const lastQueuedTokenRef = useRef<string | null>(null);
  const trimAnimationFrameRef = useRef<number | null>(null);
  const trimPendingClientXRef = useRef<number | null>(null);
  const audioMoveAnimationFrameRef = useRef<number | null>(null);
  const audioMovePendingClientXRef = useRef<number | null>(null);
  const audioTrimAnimationFrameRef = useRef<number | null>(null);
  const audioTrimPendingClientXRef = useRef<number | null>(null);
  const scrubAnimationFrameRef = useRef<number | null>(null);
  const scrubPendingClientXRef = useRef<number | null>(null);
  const pendingVideoProbeUrlsRef = useRef(new Set<string>());
  const pendingAudioProbeUrlsRef = useRef(new Set<string>());
  const mediaDurationCacheRef = useRef(new Map<string, number>());
  const programCarryoverOffsetRef = useRef(0);
  const timelinePanSessionRef = useRef<TimelinePanSession | null>(null);
  const timelineOverviewDragSessionRef = useRef<TimelineOverviewDragSession | null>(null);
  const timelinePanAnimationFrameRef = useRef<number | null>(null);
  const timelinePanPendingClientXRef = useRef<number | null>(null);
  const timelineOverviewAnimationFrameRef = useRef<number | null>(null);
  const timelineOverviewPendingClientXRef = useRef<number | null>(null);
  const timelineScrollLeftRef = useRef(0);
  const overviewWindowRef = useRef<HTMLButtonElement | null>(null);

  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [autosaveState, setAutosaveState] = useState<"idle" | "pending" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isProgramPlaying, setIsProgramPlaying] = useState(false);
  const [programPlaybackIndex, setProgramPlaybackIndex] = useState<number | null>(null);
  const [timelinePlayheadSec, setTimelinePlayheadSec] = useState(0);
  const [timelineDropTarget, setTimelineDropTarget] = useState<"video" | "audio" | null>(null);
  const [timelineViewportWidth, setTimelineViewportWidth] = useState(0);
  const [timelineScrollWidth, setTimelineScrollWidth] = useState(0);
  const [fitTimelineToView, setFitTimelineToView] = useState(false);
  const [selectedAudioTrackId, setSelectedAudioTrackId] = useState<string | null>(null);
  const [activePreviewTransition, setActivePreviewTransition] = useState<ActivePreviewTransition | null>(null);
  const [isTimelinePanning, setIsTimelinePanning] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
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
        audioEnabled: clip.audioEnabled ?? true,
        audioVolume: clamp(clip.audioVolume ?? 100, 0, 200),
      };
    });
    const normalizedAudioTracks = doc.audioTracks.map((track, index) => {
      const sourceDuration = track.sourceDurationSec ?? null;
      const sourceInSec = clamp(track.sourceInSec, 0, sourceDuration ?? Number.MAX_SAFE_INTEGER);
      const sourceOutSec = clamp(track.sourceOutSec, sourceInSec, sourceDuration ?? Number.MAX_SAFE_INTEGER);
      return {
        id: track.id,
        title: track.title.trim() || deriveTrackTitleFromUrl(track.url, index),
        url: track.url,
        startSec: clamp(track.startSec, 0, Number.MAX_SAFE_INTEGER),
        sourceInSec,
        sourceOutSec,
        sourceDurationSec: sourceDuration,
        volume: clamp(track.volume, 0, 200),
        muted: track.muted,
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
      audioTracks: normalizedAudioTracks,
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
      if (audioMoveAnimationFrameRef.current !== null) {
        cancelAnimationFrame(audioMoveAnimationFrameRef.current);
      }
      if (audioTrimAnimationFrameRef.current !== null) {
        cancelAnimationFrame(audioTrimAnimationFrameRef.current);
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
    if (!editor.bootstrapped || typeof window === "undefined") return;
    const targets = currentDocument.clips
      .filter((clip) => clip.url && clip.sourceDurationSec == null)
      .map((clip) => clip.url)
      .filter((url): url is string => typeof url === "string");

    for (const url of targets) {
      if (mediaDurationCacheRef.current.has(url) || pendingVideoProbeUrlsRef.current.has(url)) continue;
      pendingVideoProbeUrlsRef.current.add(url);
      void probeMediaDuration(url, "video")
        .then((durationSec) => {
          if (durationSec === null) return;
          mediaDurationCacheRef.current.set(url, durationSec);
          commitDocument((current) => ({
            ...current,
            clips: current.clips.map((clip) => {
              if (clip.url !== url) return clip;
              return {
                ...clip,
                sourceDurationSec: durationSec,
                outSec: clamp(clip.outSec, clip.inSec, durationSec),
              };
            }),
          }), { recordHistory: false });
        })
        .finally(() => {
          pendingVideoProbeUrlsRef.current.delete(url);
        });
    }
  }, [commitDocument, currentDocument.clips, editor.bootstrapped]);

  useEffect(() => {
    if (!editor.bootstrapped || typeof window === "undefined") return;
    const targets = currentDocument.audioTracks
      .filter((track) => track.sourceDurationSec == null)
      .map((track) => track.url);

    for (const url of targets) {
      if (mediaDurationCacheRef.current.has(url) || pendingAudioProbeUrlsRef.current.has(url)) continue;
      pendingAudioProbeUrlsRef.current.add(url);
      void probeMediaDuration(url, "audio")
        .then((durationSec) => {
          if (durationSec === null) return;
          mediaDurationCacheRef.current.set(url, durationSec);
          commitDocument((current) => ({
            ...current,
            audioTracks: current.audioTracks.map((track, index) => {
              if (track.url !== url) return track;
              return {
                ...track,
                title: track.title || deriveTrackTitleFromUrl(url, index),
                sourceDurationSec: durationSec,
                sourceOutSec: clamp(track.sourceOutSec, track.sourceInSec, durationSec),
              };
            }),
          }), { recordHistory: false });
        })
        .finally(() => {
          pendingAudioProbeUrlsRef.current.delete(url);
      });
    }
  }, [commitDocument, currentDocument.audioTracks, editor.bootstrapped]);

  useEffect(() => {
    if (!selectedAudioTrackId) return;
    if (currentDocument.audioTracks.some((track) => track.id === selectedAudioTrackId)) return;
    setSelectedAudioTrackId(null);
  }, [currentDocument.audioTracks, selectedAudioTrackId]);

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
  const selectedAudioTrack = useMemo(
    () => currentDocument.audioTracks.find((track) => track.id === selectedAudioTrackId) ?? null,
    [currentDocument.audioTracks, selectedAudioTrackId],
  );

  const timelineSegments = useMemo(
    () => buildTimelineSegments(currentDocument.clips),
    [currentDocument.clips],
  );
  const audioTimelineSegments = useMemo(
    () => buildAudioTrackSegments(currentDocument.audioTracks),
    [currentDocument.audioTracks],
  );

  const totalDuration = useMemo(() => {
    const videoTail = timelineSegments.reduce((max, segment) => Math.max(max, segment.endSec), 0);
    const audioTail = audioTimelineSegments.reduce((max, segment) => Math.max(max, segment.endSec), 0);
    return Math.max(videoTail, audioTail);
  }, [audioTimelineSegments, timelineSegments]);
  const videoProgramDuration = useMemo(() => {
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

  const previewTransitionState = useMemo<PreviewTransitionState | null>(() => {
    if (isProgramPlaying && programPlaybackIndex !== null) {
      const currentSegment = timelineSegments[programPlaybackIndex] ?? null;
      const currentClip = currentDocument.clips[programPlaybackIndex] ?? null;
      const nextClip = currentDocument.clips[programPlaybackIndex + 1] ?? null;
      if (!currentSegment || !currentClip || !nextClip || !nextClip.url) return null;
      const durationSec = boundedTransitionDuration(
        nextClip.transition,
        currentSegment.durationSec,
        clipDurationSec(nextClip),
      );
      if (durationSec <= 0.04) return null;
      const startSec = currentSegment.endSec - durationSec;
      if (timelinePlayheadSec < startSec || timelinePlayheadSec > currentSegment.endSec) return null;
      return {
        currentClipId: currentClip.id,
        nextClipId: nextClip.id,
        type: nextClip.transition,
        durationSec,
        progress: Number(clamp((timelinePlayheadSec - startSec) / durationSec, 0, 1).toFixed(3)),
      };
    }

    const segment = playheadSegment;
    if (!segment || segment.index === 0 || segment.overlapBeforeSec <= 0) return null;
    if (timelinePlayheadSec > segment.startSec + segment.overlapBeforeSec) return null;
    const previousSegment = timelineSegments[segment.index - 1] ?? null;
    if (!previousSegment || !segment.clip.url || !previousSegment.clip.url) return null;
    return {
      currentClipId: previousSegment.clip.id,
      nextClipId: segment.clip.id,
      type: segment.clip.transition,
      durationSec: segment.overlapBeforeSec,
      progress: Number(
        clamp(
          (timelinePlayheadSec - segment.startSec) / Math.max(segment.overlapBeforeSec, 0.001),
          0,
          1,
        ).toFixed(3),
      ),
    };
  }, [
    currentDocument.clips,
    isProgramPlaying,
    playheadSegment,
    programPlaybackIndex,
    timelinePlayheadSec,
    timelineSegments,
  ]);

  const resetPreviewTransition = useCallback(() => {
    setActivePreviewTransition(null);
    const transitionVideo = programTransitionVideoRef.current;
    if (transitionVideo) {
      transitionVideo.pause();
      transitionVideo.removeAttribute("src");
      transitionVideo.load();
    }
  }, []);

  const beginPreviewTransition = useCallback((currentIndex: number) => {
    const currentClip = currentDocument.clips[currentIndex];
    const nextClip = currentDocument.clips[currentIndex + 1];
    if (!currentClip || !nextClip?.url) return;
    if (nextClip.transition === "none" || nextClip.transition === "cut") return;

    const durationSec = boundedTransitionDuration(
      nextClip.transition,
      clipDurationSec(currentClip),
      clipDurationSec(nextClip),
    );
    if (durationSec <= 0.04) return;
    if (
      activePreviewTransition
      && activePreviewTransition.currentClipId === currentClip.id
      && activePreviewTransition.nextClipId === nextClip.id
    ) {
      return;
    }

    setActivePreviewTransition({
      currentClipId: currentClip.id,
      nextClipId: nextClip.id,
      type: nextClip.transition,
      durationSec,
    });
  }, [activePreviewTransition, currentDocument.clips]);

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
    programCarryoverOffsetRef.current = 0;
    resetPreviewTransition();
    const video = programVideoRef.current;
    if (video) {
      video.pause();
    }
  }, [resetPreviewTransition]);

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
    const currentClip = currentDocument.clips[programPlaybackIndex] ?? null;
    const nextIndex = findNextPlayableIndex(programPlaybackIndex + 1);
    if (nextIndex === null) {
      programCarryoverOffsetRef.current = 0;
      setTimelinePlayheadSec(videoProgramDuration);
      stopProgramPlayback();
      return;
    }
    const nextSegment = timelineSegments[nextIndex];
    const nextClip = currentDocument.clips[nextIndex] ?? null;
    const shouldCarryTransition = nextIndex === programPlaybackIndex + 1 && currentClip && nextClip;
    const carryoverSec = shouldCarryTransition
      ? boundedTransitionDuration(
        nextClip.transition,
        clipDurationSec(currentClip),
        clipDurationSec(nextClip),
      )
      : 0;
    programCarryoverOffsetRef.current = carryoverSec;
    programAdvancingRef.current = true;
    setProgramPlaybackIndex(nextIndex);
    if (nextSegment) {
      setTimelinePlayheadSec(Number((nextSegment.startSec + carryoverSec).toFixed(3)));
    }
    commitDocument((current) => ({
      ...current,
      selectedClipId: current.clips[nextIndex]?.id ?? null,
      previewMode: "program",
    }), { recordHistory: false });
  }, [
    commitDocument,
    currentDocument.clips,
    findNextPlayableIndex,
    programPlaybackIndex,
    stopProgramPlayback,
    timelineSegments,
    videoProgramDuration,
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
    const carryoverSec = programCarryoverOffsetRef.current;
    programCarryoverOffsetRef.current = 0;

    const begin = () => {
      video.currentTime = clamp(clip.inSec + carryoverSec, clip.inSec, clip.outSec);
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

  useEffect(() => {
    const currentClip = programPlaybackIndex !== null ? currentDocument.clips[programPlaybackIndex] ?? null : null;
    if (!isProgramPlaying || !currentClip || !activePreviewTransition) {
      if (!isProgramPlaying && activePreviewTransition) {
        resetPreviewTransition();
      }
      return;
    }
    if (activePreviewTransition.currentClipId !== currentClip.id) {
      resetPreviewTransition();
    }
  }, [activePreviewTransition, currentDocument.clips, isProgramPlaying, programPlaybackIndex, resetPreviewTransition]);

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
            audioEnabled: clip.audioEnabled,
            audioVolume: clip.audioVolume,
          })),
          audioTracks: currentDocument.audioTracks.map((track) => ({
            id: track.id,
            title: track.title,
            url: track.url,
            startSec: track.startSec,
            sourceInSec: track.sourceInSec,
            sourceOutSec: track.sourceOutSec,
            sourceDurationSec: track.sourceDurationSec,
            volume: track.volume,
            muted: track.muted,
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
      const nextPlayheadSec = clamp(segment.startSec + offset, segment.startSec, segment.endSec);
      setTimelinePlayheadSec((current) => (
        Math.abs(current - nextPlayheadSec) <= 0.04 ? current : nextPlayheadSec
      ));
      const nextClip = currentDocument.clips[programPlaybackIndex + 1] ?? null;
      if (nextClip) {
        const transitionDuration = Math.min(
          transitionPreviewDurationSec(nextClip.transition),
          clipDurationSec(clip) * 0.45,
          clipDurationSec(nextClip) * 0.45,
        );
        if (transitionDuration > 0.04 && video.currentTime >= clip.outSec - transitionDuration) {
          beginPreviewTransition(programPlaybackIndex);
        } else if (activePreviewTransition?.currentClipId === clip.id) {
          resetPreviewTransition();
        }
      } else if (activePreviewTransition) {
        resetPreviewTransition();
      }
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
    activePreviewTransition,
    beginPreviewTransition,
    currentDocument.clips,
    isProgramPlaying,
    playheadSegment,
    programPlaybackIndex,
    resetPreviewTransition,
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

  useEffect(() => {
    const video = programVideoRef.current;
    if (!video) return;
    const enabled = previewClip?.audioEnabled ?? true;
    video.muted = !enabled;
    video.volume = clamp((previewClip?.audioVolume ?? 100) / 100, 0, 1);
  }, [previewClip]);

  useEffect(() => {
    const transitionVideo = programTransitionVideoRef.current;
    if (!transitionVideo) return;
    transitionVideo.muted = true;
    transitionVideo.volume = 0;
  }, [previewTransitionState]);

  useEffect(() => {
    const transitionVideo = programTransitionVideoRef.current;
    if (!transitionVideo || !previewTransitionState) return;
    const nextClip = currentDocument.clips.find((clip) => clip.id === previewTransitionState.nextClipId) ?? null;
    if (!nextClip?.url) return;

    const syncFrame = () => {
      const targetTime = clamp(
        nextClip.inSec + previewTransitionState.progress * previewTransitionState.durationSec,
        nextClip.inSec,
        nextClip.outSec,
      );
      if (Math.abs(transitionVideo.currentTime - targetTime) > 0.04) {
        transitionVideo.currentTime = targetTime;
      }
      transitionVideo.pause();
    };

    if (transitionVideo.src !== nextClip.url) {
      transitionVideo.src = nextClip.url;
    }
    if (transitionVideo.readyState >= 1) {
      syncFrame();
      return;
    }
    transitionVideo.addEventListener("loadedmetadata", syncFrame, { once: true });
    return () => {
      transitionVideo.removeEventListener("loadedmetadata", syncFrame);
    };
  }, [currentDocument.clips, previewTransitionState]);

  useEffect(() => {
    const preloadVideo = programPreloadVideoRef.current;
    if (!preloadVideo) return;
    const nextIndex = isProgramPlaying
      ? ((programPlaybackIndex ?? -1) + 1)
      : ((playheadSegment?.index ?? -1) + 1);
    const nextClip = currentDocument.clips[nextIndex] ?? null;
    if (!nextClip?.url) {
      preloadVideo.pause();
      preloadVideo.removeAttribute("src");
      preloadVideo.load();
      return;
    }
    if (preloadVideo.getAttribute("src") === nextClip.url) return;
    preloadVideo.src = nextClip.url;
    preloadVideo.load();
  }, [currentDocument.clips, isProgramPlaying, playheadSegment?.index, programPlaybackIndex]);

  useEffect(() => {
    const entries = [...audioPreviewRefs.current.entries()];
    for (const [trackId, element] of entries) {
      const track = currentDocument.audioTracks.find((item) => item.id === trackId) ?? null;
      if (!track) {
        element.pause();
        continue;
      }

      const durationSec = audioTrackDurationSec(track);
      const localOffset = timelinePlayheadSec - track.startSec;
      const shouldPlay = !track.muted && durationSec > 0 && localOffset >= 0 && localOffset < durationSec;
      element.volume = clamp(track.volume / 100, 0, 1);
      element.muted = track.muted;

      if (!shouldPlay) {
        element.pause();
        continue;
      }

      const targetTime = clamp(track.sourceInSec + localOffset, track.sourceInSec, track.sourceOutSec);
      if (Math.abs(element.currentTime - targetTime) > 0.2) {
        element.currentTime = targetTime;
      }

      if (isProgramPlaying) {
        void element.play().catch(() => {
          // ignore autoplay rejections for background audio preview
        });
      } else {
        element.pause();
      }
    }
  }, [currentDocument.audioTracks, isProgramPlaying, timelinePlayheadSec]);

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

  const updateAudioTrack = useCallback((trackId: string, patch: Partial<AudioTrackDraft>) => {
    commitDocument((current) => ({
      ...current,
      audioTracks: current.audioTracks.map((track, index) => {
        if (track.id !== trackId) return track;
        const nextTrack = {
          ...track,
          ...patch,
        };
        const sourceDurationSec = nextTrack.sourceDurationSec ?? null;
        const sourceInSec = clamp(nextTrack.sourceInSec, 0, sourceDurationSec ?? Number.MAX_SAFE_INTEGER);
        const sourceOutSec = clamp(
          nextTrack.sourceOutSec,
          sourceInSec,
          sourceDurationSec ?? Number.MAX_SAFE_INTEGER,
        );
        return {
          ...nextTrack,
          title: nextTrack.title.trim() || deriveTrackTitleFromUrl(nextTrack.url, index),
          startSec: clamp(nextTrack.startSec, 0, Number.MAX_SAFE_INTEGER),
          sourceInSec,
          sourceOutSec,
          volume: clamp(nextTrack.volume, 0, 200),
        };
      }),
    }));
  }, [commitDocument]);

  const removeAudioTrack = useCallback((trackId: string) => {
    commitDocument((current) => ({
      ...current,
      audioTracks: current.audioTracks.filter((track) => track.id !== trackId),
    }));
  }, [commitDocument]);

  const appendAudioTrackFromPayload = useCallback((
    payload: {
      id: string;
      title: string;
      url: string;
    },
    startSec: number,
  ) => {
    const cachedDurationSec = mediaDurationCacheRef.current.get(payload.url) ?? null;
    const defaultDurationSec = cachedDurationSec ?? Math.max(8, Math.min(20, totalDuration || 12));
    const nextTrack: AudioTrackDraft = {
      id: crypto.randomUUID(),
      title: payload.title,
      url: payload.url,
      startSec: clamp(startSec, 0, Number.MAX_SAFE_INTEGER),
      sourceInSec: 0,
      sourceOutSec: Number(clamp(defaultDurationSec, 1, Number.MAX_SAFE_INTEGER).toFixed(3)),
      sourceDurationSec: cachedDurationSec,
      volume: 100,
      muted: false,
    };
    commitDocument((current) => ({
      ...current,
      audioTracks: [...current.audioTracks, nextTrack],
    }));
    setSelectedAudioTrackId(nextTrack.id);
    void message.success(`已加入音频轨：${payload.title}`, 0.8);
  }, [commitDocument, message, totalDuration]);

  const handleAudioTrackMoveMouseDown = useCallback((
    trackId: string,
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (isProgramPlaying) {
      stopProgramPlayback();
    }

    const baseTrack = currentDocument.audioTracks.find((track) => track.id === trackId) ?? null;
    if (!baseTrack) return;

    const initialClientX = event.clientX;
    const initialStartSec = baseTrack.startSec;
    const pixelsPerSecond = resolveTimelinePixelsPerSecond(
      currentDocument.timelineZoom,
      fitTimelineToView,
      timelineViewportWidth,
      totalDuration,
    );

    const applyAtClientX = (clientX: number) => {
      const deltaSec = (clientX - initialClientX) / pixelsPerSecond;
      const nextStartSec = clamp(
        quantize(initialStartSec + deltaSec, currentDocument.snapStepSec, currentDocument.snapEnabled),
        0,
        Number.MAX_SAFE_INTEGER,
      );
      updateAudioTrack(trackId, { startSec: nextStartSec });
    };

    const onMove = (moveEvent: MouseEvent) => {
      const viewport = timelineViewportRef.current;
      if (viewport) {
        autoScrollTimelineViewport(viewport, moveEvent.clientX);
      }
      audioMovePendingClientXRef.current = moveEvent.clientX;
      if (audioMoveAnimationFrameRef.current !== null) return;
      audioMoveAnimationFrameRef.current = window.requestAnimationFrame(() => {
        audioMoveAnimationFrameRef.current = null;
        const nextClientX = audioMovePendingClientXRef.current;
        audioMovePendingClientXRef.current = null;
        if (nextClientX === null) return;
        applyAtClientX(nextClientX);
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (audioMoveAnimationFrameRef.current !== null) {
        cancelAnimationFrame(audioMoveAnimationFrameRef.current);
        audioMoveAnimationFrameRef.current = null;
      }
      if (audioMovePendingClientXRef.current !== null) {
        applyAtClientX(audioMovePendingClientXRef.current);
        audioMovePendingClientXRef.current = null;
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
    currentDocument.audioTracks,
    currentDocument.snapEnabled,
    currentDocument.snapStepSec,
    currentDocument.timelineZoom,
    fitTimelineToView,
    isProgramPlaying,
    stopProgramPlayback,
    timelineViewportWidth,
    totalDuration,
    updateAudioTrack,
  ]);

  const handleAudioTrimMouseDown = useCallback((
    trackId: string,
    edge: "start" | "end",
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (isProgramPlaying) {
      stopProgramPlayback();
    }

    const baseTrack = currentDocument.audioTracks.find((track) => track.id === trackId) ?? null;
    if (!baseTrack) return;

    const initialClientX = event.clientX;
    const initialStartSec = baseTrack.startSec;
    const initialSourceInSec = baseTrack.sourceInSec;
    const initialSourceOutSec = baseTrack.sourceOutSec;
    const sourceDurationSec = baseTrack.sourceDurationSec ?? Number.MAX_SAFE_INTEGER;
    const minDuration = MIN_AUDIO_TRIM_DURATION_SEC;
    const pixelsPerSecond = resolveTimelinePixelsPerSecond(
      currentDocument.timelineZoom,
      fitTimelineToView,
      timelineViewportWidth,
      totalDuration,
    );

    const applyAtClientX = (clientX: number) => {
      const deltaSec = (clientX - initialClientX) / pixelsPerSecond;
      if (edge === "start") {
        const nextSourceInSec = clamp(
          Number((initialSourceInSec + deltaSec).toFixed(3)),
          0,
          initialSourceOutSec - minDuration,
        );
        const actualDelta = nextSourceInSec - initialSourceInSec;
        updateAudioTrack(trackId, {
          startSec: clamp(initialStartSec + actualDelta, 0, Number.MAX_SAFE_INTEGER),
          sourceInSec: nextSourceInSec,
        });
        return;
      }
      const nextSourceOutSec = clamp(
        Number((initialSourceOutSec + deltaSec).toFixed(3)),
        initialSourceInSec + minDuration,
        sourceDurationSec,
      );
      updateAudioTrack(trackId, { sourceOutSec: nextSourceOutSec });
    };

    const onMove = (moveEvent: MouseEvent) => {
      const viewport = timelineViewportRef.current;
      if (viewport) {
        autoScrollTimelineViewport(viewport, moveEvent.clientX);
      }
      audioTrimPendingClientXRef.current = moveEvent.clientX;
      if (audioTrimAnimationFrameRef.current !== null) return;
      audioTrimAnimationFrameRef.current = window.requestAnimationFrame(() => {
        audioTrimAnimationFrameRef.current = null;
        const nextClientX = audioTrimPendingClientXRef.current;
        audioTrimPendingClientXRef.current = null;
        if (nextClientX === null) return;
        applyAtClientX(nextClientX);
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (audioTrimAnimationFrameRef.current !== null) {
        cancelAnimationFrame(audioTrimAnimationFrameRef.current);
        audioTrimAnimationFrameRef.current = null;
      }
      if (audioTrimPendingClientXRef.current !== null) {
        applyAtClientX(audioTrimPendingClientXRef.current);
        audioTrimPendingClientXRef.current = null;
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
    currentDocument.audioTracks,
    currentDocument.timelineZoom,
    fitTimelineToView,
    isProgramPlaying,
    stopProgramPlayback,
    timelineViewportWidth,
    totalDuration,
    updateAudioTrack,
  ]);

  const setAudioPreviewRef = useCallback((trackId: string, element: HTMLAudioElement | null) => {
    if (element) {
      audioPreviewRefs.current.set(trackId, element);
      return;
    }
    audioPreviewRefs.current.delete(trackId);
  }, []);

  const handleExportVideo = useCallback(async () => {
    if (!sequenceId) {
      void message.warning("请先创建或选择序列。");
      return;
    }
    const persisted = await persistPlan("manual");
    if (!persisted) return;

    setExporting(true);
    try {
      const response = await fetch(`/api/video/sequences/${encodeURIComponent(sequenceId)}/clip-plan/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: currentDocument.planName.trim() || DEFAULT_PLAN_NAME,
          clips: currentDocument.clips.map((clip) => ({
            id: clip.id,
            resourceId: clip.resourceId,
            url: clip.url,
            inSec: clip.inSec,
            outSec: clip.outSec,
            transition: clip.transition,
            title: clip.title,
            sourceDurationSec: clip.sourceDurationSec,
            audioEnabled: clip.audioEnabled,
            audioVolume: clip.audioVolume,
          })),
          audioTracks: currentDocument.audioTracks.map((track) => ({
            id: track.id,
            title: track.title,
            url: track.url,
            startSec: track.startSec,
            sourceInSec: track.sourceInSec,
            sourceOutSec: track.sourceOutSec,
            sourceDurationSec: track.sourceDurationSec,
            volume: track.volume,
            muted: track.muted,
          })),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "导出失败" }));
        const errorText = typeof payload.error === "string" ? payload.error : "导出失败";
        throw new Error(errorText);
      }

      const blob = await response.blob();
      const header = response.headers.get("Content-Disposition");
      const match = header?.match(/filename=\"?([^"]+)\"?/);
      const fileName = match?.[1] ? decodeURIComponent(match[1]) : `${DEFAULT_PLAN_NAME}.mp4`;
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(objectUrl);
      void message.success("导出完成，已开始下载。");
    } catch (error) {
      const text = error instanceof Error ? error.message : "导出失败";
      void message.error(text);
    } finally {
      setExporting(false);
    }
  }, [currentDocument.audioTracks, currentDocument.clips, currentDocument.planName, message, persistPlan, sequenceId]);

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
    const minDuration = MIN_CLIP_TRIM_DURATION_SEC;
    const pixelsPerSecond = resolveTimelinePixelsPerSecond(
      currentDocument.timelineZoom,
      fitTimelineToView,
      timelineViewportWidth,
      totalDuration,
    );

    const applyTrimAtClientX = (clientX: number) => {
      const deltaSec = (clientX - initialClientX) / Math.max(pixelsPerSecond, 0.001);
      commitDocument((current) => ({
        ...current,
        clips: current.clips.map((clip) => {
          if (clip.id !== clipId) return clip;
          if (edge === "start") {
            const nextInSec = clamp(
              Number((initialInSec + deltaSec).toFixed(3)),
              0,
              Math.min(initialOutSec - minDuration, sourceDurationSec),
            );
            return {
              ...clip,
              inSec: nextInSec,
            };
          }
          const nextOutSec = clamp(
            Number((initialOutSec + deltaSec).toFixed(3)),
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
    programCarryoverOffsetRef.current = 0;
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

  const timelinePixelsPerSecond = useMemo(
    () => resolveTimelinePixelsPerSecond(
      currentDocument.timelineZoom,
      fitTimelineToView,
      timelineViewportWidth,
      totalDuration,
    ),
    [currentDocument.timelineZoom, fitTimelineToView, timelineViewportWidth, totalDuration],
  );

  const timelineTrackWidth = useMemo(
    () => Math.max(
      Math.max(540, timelineViewportWidth > 0 ? timelineViewportWidth - 8 : 0),
      totalDuration * timelinePixelsPerSecond,
    ),
    [timelinePixelsPerSecond, timelineViewportWidth, totalDuration],
  );
  const timelineEndPadding = timelineViewportWidth > 0 && timelineTrackWidth <= timelineViewportWidth - 8
    ? 0
    : TIMELINE_END_PADDING;
  const timelineScrollableWidth = timelineTrackWidth + timelineEndPadding;
  const effectiveTimelineScrollableWidth = timelineScrollWidth > 0
    ? timelineScrollWidth
    : timelineScrollableWidth;
  const timelineTicks = useMemo(
    () => buildTimelineTicks(totalDuration, timelinePixelsPerSecond),
    [timelinePixelsPerSecond, totalDuration],
  );
  const displayedTimelineZoom = fitTimelineToView
    ? Math.round(clamp(timelinePixelsPerSecond / 1.05, MIN_TIMELINE_ZOOM, MAX_TIMELINE_ZOOM))
    : currentDocument.timelineZoom;
  const overviewPlayheadPercent = effectiveTimelineScrollableWidth > 0
    ? clamp(((timelinePlayheadSec * timelinePixelsPerSecond) / effectiveTimelineScrollableWidth) * 100, 0, 100)
    : 0;
  const timelineZoomLabel = fitTimelineToView
    ? "适配"
    : `${Math.round((currentDocument.timelineZoom / DEFAULT_TIMELINE_ZOOM) * 100)}%`;

  const syncTimelineOverviewWindow = useCallback(() => {
    const overviewWindow = overviewWindowRef.current;
    const viewport = timelineViewportRef.current;
    if (!overviewWindow || !viewport) return;

    const scrollableWidth = Math.max(viewport.scrollWidth, timelineScrollableWidth, 1);
    const leftPercent = scrollableWidth > 0
      ? clamp((viewport.scrollLeft / scrollableWidth) * 100, 0, 100)
      : 0;
    const widthPercent = scrollableWidth > 0
      ? clamp((viewport.clientWidth / scrollableWidth) * 100, 0, 100)
      : 100;

    overviewWindow.style.left = `${leftPercent}%`;
    overviewWindow.style.width = `${widthPercent}%`;
  }, [timelineScrollableWidth]);

  const syncTimelineViewport = useCallback(() => {
    const viewport = timelineViewportRef.current;
    if (!viewport) return;
    setTimelineViewportWidth((current) => (current === viewport.clientWidth ? current : viewport.clientWidth));
    setTimelineScrollWidth((current) => (current === viewport.scrollWidth ? current : viewport.scrollWidth));
    timelineScrollLeftRef.current = viewport.scrollLeft;
    syncTimelineOverviewWindow();
  }, [syncTimelineOverviewWindow]);

  useEffect(() => {
    const viewport = timelineViewportRef.current;
    if (!viewport) return;

    syncTimelineViewport();
    const handleScroll = () => {
      syncTimelineViewport();
    };
    const observer = new ResizeObserver(() => {
      syncTimelineViewport();
    });
    const content = timelineContentRef.current;

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(viewport);
    if (content) {
      observer.observe(content);
    }
    const rafId = window.requestAnimationFrame(() => {
      syncTimelineViewport();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      viewport.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [syncTimelineViewport, timelineScrollableWidth]);

  useEffect(() => {
    if (!fitTimelineToView) return;
    const viewport = timelineViewportRef.current;
    if (!viewport) return;
    viewport.scrollLeft = 0;
    window.requestAnimationFrame(() => {
      syncTimelineViewport();
    });
  }, [fitTimelineToView, syncTimelineViewport, timelineTrackWidth]);

  useEffect(() => {
    syncTimelineOverviewWindow();
  }, [syncTimelineOverviewWindow, timelineViewportWidth]);

  const scrollTimelineViewportTo = useCallback((nextScrollLeft: number) => {
    const viewport = timelineViewportRef.current;
    if (!viewport) return;
    const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    viewport.scrollLeft = clamp(nextScrollLeft, 0, maxScrollLeft);
  }, []);

  const setTimelineZoomLevel = useCallback((
    nextZoom: number,
    options?: {
      anchorClientX?: number;
      anchorSec?: number;
    },
  ) => {
    const boundedZoom = clamp(nextZoom, MIN_TIMELINE_ZOOM, MAX_TIMELINE_ZOOM);
    const viewport = timelineViewportRef.current;
    let anchorOffsetX = 0;
    let anchorSec = options?.anchorSec ?? null;

    if (viewport) {
      const bounds = viewport.getBoundingClientRect();
      anchorOffsetX = options?.anchorClientX != null
        ? clamp(options.anchorClientX - bounds.left, 0, viewport.clientWidth)
        : viewport.clientWidth / 2;
      anchorSec ??= clamp(
        (viewport.scrollLeft + anchorOffsetX) / Math.max(timelinePixelsPerSecond, 0.001),
        0,
        totalDuration,
      );
    }

    setFitTimelineToView(false);
    commitDocument((current) => ({
      ...current,
      timelineZoom: boundedZoom,
    }), { recordHistory: false });

    if (!viewport || anchorSec === null) return;
    window.requestAnimationFrame(() => {
      const nextPixelsPerSecond = resolveTimelinePixelsPerSecond(
        boundedZoom,
        false,
        viewport.clientWidth,
        totalDuration,
      );
      const nextScrollLeft = (anchorSec * nextPixelsPerSecond) - anchorOffsetX;
      scrollTimelineViewportTo(nextScrollLeft);
    });
  }, [commitDocument, scrollTimelineViewportTo, timelinePixelsPerSecond, totalDuration]);

  const adjustTimelineZoom = useCallback((
    delta: number,
    options?: {
      anchorClientX?: number;
      anchorSec?: number;
    },
  ) => {
    const baseZoom = fitTimelineToView
      ? clamp(timelinePixelsPerSecond / 1.05, MIN_TIMELINE_ZOOM, MAX_TIMELINE_ZOOM)
      : currentDocument.timelineZoom;
    setTimelineZoomLevel(baseZoom + delta, options);
  }, [currentDocument.timelineZoom, fitTimelineToView, setTimelineZoomLevel, timelinePixelsPerSecond]);

  const beginTimelinePan = useCallback((clientX: number) => {
    const viewport = timelineViewportRef.current;
    if (!viewport) return;

    timelinePanSessionRef.current = {
      startClientX: clientX,
      startScrollLeft: viewport.scrollLeft,
    };
    setIsTimelinePanning(true);

    const onMove = (moveEvent: MouseEvent) => {
      timelinePanPendingClientXRef.current = moveEvent.clientX;
      if (timelinePanAnimationFrameRef.current !== null) return;
      timelinePanAnimationFrameRef.current = window.requestAnimationFrame(() => {
        timelinePanAnimationFrameRef.current = null;
        const session = timelinePanSessionRef.current;
        const nextClientX = timelinePanPendingClientXRef.current;
        if (!session || nextClientX === null) return;
        timelinePanPendingClientXRef.current = null;
        const deltaX = nextClientX - session.startClientX;
        const nextScrollLeft = session.startScrollLeft - deltaX;
        scrollTimelineViewportTo(nextScrollLeft);
      });
    };

    const onUp = () => {
      if (timelinePanAnimationFrameRef.current !== null) {
        cancelAnimationFrame(timelinePanAnimationFrameRef.current);
        timelinePanAnimationFrameRef.current = null;
      }
      if (timelinePanPendingClientXRef.current !== null) {
        const session = timelinePanSessionRef.current;
        const nextClientX = timelinePanPendingClientXRef.current;
        timelinePanPendingClientXRef.current = null;
        if (session) {
          const deltaX = nextClientX - session.startClientX;
          scrollTimelineViewportTo(session.startScrollLeft - deltaX);
        }
      }
      timelinePanSessionRef.current = null;
      setIsTimelinePanning(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [scrollTimelineViewportTo]);

  const handleTimelineOverviewMouseDown = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = clamp((event.clientX - bounds.left) / Math.max(bounds.width, 1), 0, 1);
    const targetScrollLeft = (ratio * effectiveTimelineScrollableWidth) - (timelineViewportWidth / 2);
    scrollTimelineViewportTo(targetScrollLeft);
  }, [effectiveTimelineScrollableWidth, scrollTimelineViewportTo, timelineViewportWidth]);

  const handleTimelineOverviewWindowMouseDown = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) return;

    timelineOverviewDragSessionRef.current = {
      startClientX: event.clientX,
      startScrollLeft: timelineScrollLeftRef.current,
      overviewWidth: bounds.width,
    };

    const onMove = (moveEvent: MouseEvent) => {
      timelineOverviewPendingClientXRef.current = moveEvent.clientX;
      if (timelineOverviewAnimationFrameRef.current !== null) return;
      timelineOverviewAnimationFrameRef.current = window.requestAnimationFrame(() => {
        timelineOverviewAnimationFrameRef.current = null;
        const session = timelineOverviewDragSessionRef.current;
        const nextClientX = timelineOverviewPendingClientXRef.current;
        if (!session || nextClientX === null) return;
        timelineOverviewPendingClientXRef.current = null;
        const deltaRatio = (nextClientX - session.startClientX) / Math.max(session.overviewWidth, 1);
        scrollTimelineViewportTo(session.startScrollLeft + (deltaRatio * effectiveTimelineScrollableWidth));
      });
    };
    const onUp = () => {
      if (timelineOverviewAnimationFrameRef.current !== null) {
        cancelAnimationFrame(timelineOverviewAnimationFrameRef.current);
        timelineOverviewAnimationFrameRef.current = null;
      }
      if (timelineOverviewPendingClientXRef.current !== null) {
        const session = timelineOverviewDragSessionRef.current;
        const nextClientX = timelineOverviewPendingClientXRef.current;
        timelineOverviewPendingClientXRef.current = null;
        if (session) {
          const deltaRatio = (nextClientX - session.startClientX) / Math.max(session.overviewWidth, 1);
          scrollTimelineViewportTo(session.startScrollLeft + (deltaRatio * effectiveTimelineScrollableWidth));
        }
      }
      timelineOverviewDragSessionRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [effectiveTimelineScrollableWidth, scrollTimelineViewportTo]);

  const handleTimelineViewportMouseDownCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 1) return;
    event.preventDefault();
    beginTimelinePan(event.clientX);
  }, [beginTimelinePan]);

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

  const beginTimelineScrub = useCallback((clientX: number) => {
    scrubTimelineAtClientX(clientX);

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

  const handleTimelineWheel = useCallback((event: WheelEvent) => {
    const viewport = timelineViewportRef.current;
    if (!viewport) return;

    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();
      adjustTimelineZoom(event.deltaY > 0 ? -TIMELINE_ZOOM_STEP : TIMELINE_ZOOM_STEP, {
        anchorClientX: event.clientX,
      });
      return;
    }

    const delta = normalizeTimelineWheelDelta(event);
    if (Math.abs(delta) <= 0.1) return;
    if (viewport.scrollWidth <= viewport.clientWidth + 1) return;

    event.preventDefault();
    scrollTimelineViewportTo(viewport.scrollLeft + delta);
  }, [adjustTimelineZoom, scrollTimelineViewportTo]);

  useEffect(() => {
    const viewport = timelineViewportRef.current;
    if (!viewport) return;

    const listener = (event: WheelEvent) => {
      handleTimelineWheel(event);
    };

    viewport.addEventListener("wheel", listener, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", listener);
    };
  }, [handleTimelineWheel]);

  const handleTimelineSurfaceMouseDown = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button === 1) {
      event.preventDefault();
      beginTimelinePan(event.clientX);
      return;
    }
    if (event.button !== 0 || event.target !== event.currentTarget) return;
    event.preventDefault();
    beginTimelineScrub(event.clientX);
  }, [beginTimelinePan, beginTimelineScrub]);

  const handleTimelineZoomSliderChange = useCallback((value: number) => {
    setTimelineZoomLevel(value, { anchorSec: timelinePlayheadSec });
  }, [setTimelineZoomLevel, timelinePlayheadSec]);

  const toggleFitTimelineToView = useCallback(() => {
    setFitTimelineToView((current) => !current);
  }, []);

  const handleTimelineRulerMouseDown = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button === 1) {
      event.preventDefault();
      beginTimelinePan(event.clientX);
      return;
    }
    if (event.button !== 0) return;
    event.preventDefault();
    beginTimelineScrub(event.clientX);
  }, [beginTimelinePan, beginTimelineScrub]);

  const handleTimelineDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    const types = Array.from(event.dataTransfer.types);
    if (!types.includes(CLIP_ATLAS_DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setTimelineDropTarget("video");
  }, []);

  const handleTimelineDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setTimelineDropTarget(null);
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
    setTimelineDropTarget((current) => (current === "video" ? null : current));
  }, []);

  const handleAudioTrackDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    const types = Array.from(event.dataTransfer.types);
    if (!types.includes(CLIP_ATLAS_DRAG_MIME)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    setTimelineDropTarget("audio");
  }, []);

  const handleAudioTrackDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setTimelineDropTarget(null);
    const raw = event.dataTransfer.getData(CLIP_ATLAS_DRAG_MIME);
    const payload = parseClipAtlasDragPayload(raw);
    if (!payload) {
      void message.warning("仅支持从右侧素材栏拖入已生成视频。");
      return;
    }
    const viewport = timelineViewportRef.current;
    const bounds = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - bounds.left + (viewport?.scrollLeft ?? 0);
    const startSec = clamp(localX / timelinePixelsPerSecond, 0, Number.MAX_SAFE_INTEGER);
    appendAudioTrackFromPayload(payload, startSec);
  }, [appendAudioTrackFromPayload, message, timelinePixelsPerSecond]);

  const handleAudioTrackDragLeave = useCallback(() => {
    setTimelineDropTarget((current) => (current === "audio" ? null : current));
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

  const previewTransitionStyle = buildPreviewTransitionStyles(
    previewTransitionState?.type ?? "none",
    previewTransitionState?.progress ?? 0,
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Typography.Text strong style={{ fontSize: 12 }}>
          剪辑台
        </Typography.Text>
        <Space size={6}>
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

      <div className="overflow-x-auto pb-1">
        <div
          className="grid min-w-[840px] gap-2.5"
          style={{ gridTemplateColumns: "256px minmax(0, 1fr)" }}
        >
          <Card
            className="ceramic-panel !border-transparent"
            styles={{ body: { padding: 16 } }}
          >
            <div className="flex h-full flex-col gap-4">
              <div className="min-w-0">
                <Typography.Text strong style={{ fontSize: 13 }}>
                  Inspector
                </Typography.Text>
                <div className="mt-0.5 text-[11px] text-[var(--af-muted)]">
                  默认展开，只保留当前片段的精修参数。
                </div>
              </div>

              {!selectedClip ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="选择时间线中的片段后可在这里精修。" />
              ) : (
                <>
                  <div className="rounded-[18px] border border-[rgba(229,221,210,0.92)] bg-[rgba(255,253,249,0.76)] p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Typography.Text strong>片段 #{selectedClipIndex + 1}</Typography.Text>
                      <Tag style={{ margin: 0 }}>{(selectedClip.outSec - selectedClip.inSec).toFixed(2)}s</Tag>
                    </div>

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

                    <div className="mt-3 grid grid-cols-2 gap-3">
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

                    <div className="mt-3">
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

                    <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
                      <div>
                        <Typography.Text strong style={{ fontSize: 12 }}>
                          片段原声
                        </Typography.Text>
                        <div className="mt-1 text-[11px] text-[var(--af-muted)]">
                          控制当前片段自带音频的预览与导出音量。
                        </div>
                      </div>
                      <Switch
                        checked={selectedClip.audioEnabled}
                        onChange={(checked) => updateSelectedClip({ audioEnabled: checked })}
                      />
                    </div>
                    <div className="mt-2">
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                        原声音量
                      </Typography.Text>
                      <Space.Compact className="mt-1 flex w-full">
                        <InputNumber
                          min={0}
                          max={200}
                          value={selectedClip.audioVolume}
                          onChange={(value) => updateSelectedClip({ audioVolume: Number(value ?? 100) })}
                          style={{ width: "100%" }}
                        />
                        <Button disabled className="!cursor-default !text-[var(--af-muted)]">%</Button>
                      </Space.Compact>
                    </div>

                    <div className="mt-3 rounded-[16px] border border-[rgba(229,221,210,0.9)] bg-white/70 p-3 text-[12px] text-[var(--af-text)]">
                      <div>源素材：{selectedClip.resourceId ? (videoItemMap.get(selectedClip.resourceId)?.title ?? selectedClip.resourceId) : "未绑定"}</div>
                      <div className="mt-1">源时长：{selectedClip.sourceDurationSec ? `${selectedClip.sourceDurationSec.toFixed(2)}s` : "读取中"}</div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </Card>

        <div className="flex min-h-0 flex-col gap-2">
          <Card
            className="ceramic-panel !border-transparent"
            styles={{ body: { padding: 12 } }}
          >
          {previewClip?.url ? (
            <div className="relative h-52 overflow-hidden rounded-[16px] border border-[rgba(229,221,210,0.9)] bg-black">
              <video
                ref={programVideoRef}
                src={previewClip.url}
                controls={!isProgramPlaying}
                preload="auto"
                playsInline
                className="absolute inset-0 h-full w-full object-contain"
                style={previewTransitionStyle.primary}
                onTimeUpdate={handleProgramTimeUpdate}
                onEnded={() => {
                  if (isProgramPlaying && !programAdvancingRef.current) {
                    advanceToNextClip();
                  }
                }}
              />
              {previewTransitionState ? (
                <>
                  <video
                    ref={programTransitionVideoRef}
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    style={previewTransitionStyle.incoming}
                    playsInline
                    preload="auto"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-black"
                    style={previewTransitionStyle.blackout}
                  />
                </>
              ) : null}
            </div>
          ) : (
            <div className="flex h-52 items-center justify-center rounded-[16px] border border-dashed border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] text-[12px] text-[var(--af-muted)]">
              右侧素材栏拖入视频，或先在时间线选中片段。
            </div>
          )}

          <div className="mt-2 pt-1.5">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Typography.Text strong style={{ fontSize: 12 }}>
                  时间线
                </Typography.Text>
                <Typography.Text style={{ fontSize: 11, color: "var(--af-muted)" }}>
                  {formatTimelineTime(timelinePlayheadSec)} / {formatTimelineTime(totalDuration)}
                </Typography.Text>
              </div>
              <div className="flex items-center gap-1.5">
                {isProgramPlaying ? (
                  <Button size="small" danger icon={<PauseCircleOutlined />} onClick={stopProgramPlayback}>
                    停止
                  </Button>
                ) : (
                  <Button size="small" type="primary" icon={<CaretRightOutlined />} onClick={startProgramPlayback}>
                    播放
                  </Button>
                )}
              </div>
            </div>
            <div className="rounded-[14px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.82)] px-2 py-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
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
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
                  <div className="hidden items-center gap-2 whitespace-nowrap text-[10px] text-[var(--af-muted)] md:flex">
                    <span>{currentDocument.clips.length} clips / {currentDocument.audioTracks.length} audio</span>
                    <span className="h-3.5 w-px bg-[rgba(229,221,210,0.92)]" />
                    <span>{fitTimelineToView ? "适配视图" : `1s = ${timelinePixelsPerSecond.toFixed(1)}px`}</span>
                  </div>
                  <div className="inline-flex min-w-[220px] flex-1 items-center gap-1 rounded-full border border-[rgba(229,221,210,0.88)] bg-white px-2 py-0.5 sm:max-w-[420px] sm:flex-none">
                    <Button
                      size="small"
                      type={fitTimelineToView ? "primary" : "default"}
                      onClick={toggleFitTimelineToView}
                    >
                      适配
                    </Button>
                    <span className="h-4 w-px shrink-0 bg-[rgba(229,221,210,0.92)]" />
                    <Tooltip title="缩小">
                      <Button
                        size="small"
                        type="text"
                        icon={<MinusOutlined />}
                        onClick={() => adjustTimelineZoom(-TIMELINE_ZOOM_STEP, { anchorSec: timelinePlayheadSec })}
                      />
                    </Tooltip>
                    <Slider
                      min={MIN_TIMELINE_ZOOM}
                      max={MAX_TIMELINE_ZOOM}
                      step={TIMELINE_ZOOM_STEP}
                      value={displayedTimelineZoom}
                      tooltip={{ open: false }}
                      className="min-w-[72px] flex-1"
                      onChange={(value) => {
                        if (Array.isArray(value)) return;
                        handleTimelineZoomSliderChange(value);
                      }}
                    />
                    <span className="min-w-[42px] text-center text-[10px] text-[var(--af-text)]">
                      {timelineZoomLabel}
                    </span>
                    <Tooltip title="放大">
                      <Button
                        size="small"
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => adjustTimelineZoom(TIMELINE_ZOOM_STEP, { anchorSec: timelinePlayheadSec })}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-1.5 rounded-[16px] border border-[rgba(229,221,210,0.92)] bg-[rgba(248,244,238,0.84)] p-1.5">
              <div className="mb-1.5 cursor-pointer rounded-[10px] border border-[rgba(124,114,102,0.12)] bg-[rgba(255,255,255,0.72)] px-1.5 py-1" onMouseDown={handleTimelineOverviewMouseDown}>
                <div className="relative h-6">
                  <div className="absolute inset-x-1 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[rgba(214,222,226,0.42)]">
                    {timelineSegments.map((segment) => {
                      const left = effectiveTimelineScrollableWidth > 0
                        ? (segment.startSec * timelinePixelsPerSecond / effectiveTimelineScrollableWidth) * 100
                        : 0;
                      const width = effectiveTimelineScrollableWidth > 0
                        ? Math.max((segment.durationSec * timelinePixelsPerSecond / effectiveTimelineScrollableWidth) * 100, 0.8)
                        : 100;
                      return (
                        <div
                          key={`overview-video-${segment.clip.id}`}
                          className="absolute inset-y-0 rounded-full bg-[rgba(124,114,102,0.4)]"
                          style={{ left: `${left}%`, width: `${width}%` }}
                        />
                      );
                    })}
                  </div>
                  {audioTimelineSegments.length > 0 ? (
                    <div className="absolute inset-x-1 bottom-[3px] h-px bg-[rgba(47,107,95,0.12)]">
                      {audioTimelineSegments.map((segment) => {
                        const left = effectiveTimelineScrollableWidth > 0
                          ? (segment.startSec * timelinePixelsPerSecond / effectiveTimelineScrollableWidth) * 100
                          : 0;
                        const width = effectiveTimelineScrollableWidth > 0
                          ? Math.max((segment.durationSec * timelinePixelsPerSecond / effectiveTimelineScrollableWidth) * 100, 1)
                          : 100;
                        return (
                          <div
                            key={`overview-audio-${segment.track.id}`}
                            className="absolute inset-y-0 bg-[rgba(47,107,95,0.54)]"
                            style={{ left: `${left}%`, width: `${width}%` }}
                          />
                        );
                      })}
                    </div>
                  ) : null}
                  <div className="pointer-events-none absolute inset-x-1 inset-y-0 z-[2]">
                    <div
                      className="absolute inset-y-0 w-[2px] rounded-full bg-[var(--af-brand)]"
                      style={{ left: `${overviewPlayheadPercent}%` }}
                    />
                  </div>
                  <div className="absolute inset-x-1 inset-y-0 z-[3]">
                    <button
                      type="button"
                      aria-label="拖动可见窗口"
                      ref={overviewWindowRef}
                      className="absolute inset-y-0 rounded-[10px] border border-[rgba(47,107,95,0.18)] bg-[rgba(255,255,255,0.74)]"
                      style={{ minWidth: 28 }}
                      onMouseDown={handleTimelineOverviewWindowMouseDown}
                    >
                      <span className="mx-auto block h-full w-6 rounded-full border-x border-[rgba(47,107,95,0.12)]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-1.5">
                <div className="grid min-w-0 grid-cols-[34px_minmax(0,1fr)] gap-1.5">
                  <div className="flex items-start justify-center rounded-[10px] border border-[rgba(124,114,102,0.12)] bg-[rgba(255,255,255,0.76)] px-1 py-1.5 text-[10px] font-medium tracking-[0.12em] text-[var(--af-muted)]">
                    V1
                  </div>
                  <div
                    ref={timelineViewportRef}
                    onMouseDownCapture={handleTimelineViewportMouseDownCapture}
                    onDragOver={handleTimelineDragOver}
                    onDragLeave={handleTimelineDragLeave}
                    onDrop={handleTimelineDrop}
                    className={`timeline-scrollbar overflow-x-auto rounded-[12px] border px-1 py-1 ${
                      timelineDropTarget === "video"
                        ? "border-emerald-300 bg-emerald-50/70"
                        : "border-[rgba(124,114,102,0.14)] bg-[rgba(255,255,255,0.72)]"
                    } ${isTimelinePanning ? "cursor-grabbing" : "cursor-default"}`}
                  >
                    <div ref={timelineContentRef} className="relative pb-0.5" style={{ minWidth: timelineScrollableWidth, paddingRight: timelineEndPadding }}>
                      {timelineTicks.map((tick) => (
                        <div
                          key={`grid-${tick.sec}`}
                          className="pointer-events-none absolute bottom-0 top-0 border-l border-[rgba(124,114,102,0.06)]"
                          style={{ left: tick.sec * timelinePixelsPerSecond }}
                        />
                      ))}
                      <div
                        className="pointer-events-none absolute bottom-0 top-0 z-[1] w-px bg-[rgba(47,107,95,0.58)]"
                        style={{ left: timelinePlayheadSec * timelinePixelsPerSecond }}
                      />
                      <div
                        className="relative mb-1 h-6 cursor-pointer overflow-hidden rounded-[8px] border border-[rgba(124,114,102,0.1)] bg-[rgba(244,239,232,0.66)]"
                        onMouseDown={handleTimelineRulerMouseDown}
                      >
                        {timelineTicks.map((tick) => (
                          <div
                            key={`tick-${tick.sec}`}
                            className="absolute bottom-0 top-0 border-l border-[rgba(124,114,102,0.1)] text-[10px] text-[var(--af-muted)]"
                            style={{ left: tick.sec * timelinePixelsPerSecond }}
                          >
                            <span className="ml-2 inline-block pt-1">{tick.label}</span>
                          </div>
                        ))}
                        <div
                          className="pointer-events-none absolute top-1 z-[2] h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/80 bg-[var(--af-brand)]"
                          style={{ left: timelinePlayheadSec * timelinePixelsPerSecond }}
                        />
                      </div>

                      <div
                        className={`relative min-h-[84px] rounded-[12px] border border-[rgba(124,114,102,0.12)] px-1 py-1 ${
                          timelineDropTarget === "video" ? "bg-emerald-50/65" : "bg-[rgba(255,253,249,0.72)]"
                        }`}
                        onMouseDown={handleTimelineSurfaceMouseDown}
                      >
                        {currentDocument.clips.length === 0 ? (
                          <div className="pointer-events-none flex h-[64px] items-center justify-center rounded-[12px] border border-dashed border-[rgba(124,114,102,0.16)] text-[12px] text-[var(--af-muted)]">
                            时间线为空：从右侧素材栏拖拽视频到这里即可加入。
                          </div>
                        ) : (
                          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                            <SortableContext items={currentDocument.clips.map((clip) => clip.id)} strategy={horizontalListSortingStrategy}>
                              <div className="flex min-w-max items-start gap-0">
                                {timelineSegments.map((segment) => {
                                  const clip = segment.clip;
                                  const duration = Math.max(0, clip.outSec - clip.inSec);
                                  const width = duration * timelinePixelsPerSecond;
                                  return (
                                    <SortableClipBlock
                                      key={clip.id}
                                      clip={clip}
                                      index={segment.index}
                                      timelineStartSec={segment.startSec}
                                      timelineEndSec={segment.endSec}
                                      transitionOverlapSec={segment.overlapBeforeSec}
                                      width={width}
                                      active={clip.id === currentDocument.selectedClipId}
                                      playing={isProgramPlaying
                                        ? programPlaybackIndex === segment.index
                                        : playheadSegment?.index === segment.index}
                                      onSelect={selectClip}
                                      onDelete={removeClip}
                                      onTrimMouseDown={handleTrimMouseDown}
                                      style={{
                                        marginLeft: segment.index === 0
                                          ? 0
                                          : -segment.overlapBeforeSec * timelinePixelsPerSecond,
                                      }}
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
                </div>

                <div className="grid min-w-0 grid-cols-[34px_minmax(0,1fr)] gap-1.5">
                  <div className="flex items-start justify-center rounded-[10px] border border-[rgba(124,114,102,0.12)] bg-[rgba(255,255,255,0.76)] px-1 py-1.5 text-[10px] font-medium tracking-[0.12em] text-[var(--af-muted)]">
                    A1
                  </div>
                  <div
                    className={`rounded-[12px] border px-1.5 py-1 ${
                      timelineDropTarget === "audio"
                        ? "border-emerald-300 bg-emerald-50/70"
                        : "border-[rgba(124,114,102,0.12)] bg-[rgba(255,255,255,0.7)]"
                    }`}
                    onDragOver={handleAudioTrackDragOver}
                    onDragLeave={handleAudioTrackDragLeave}
                    onDrop={handleAudioTrackDrop}
                  >
                    <div className="relative min-h-[42px]" style={{ minWidth: timelineScrollableWidth, paddingRight: timelineEndPadding }} onMouseDown={handleTimelineSurfaceMouseDown}>
                      {audioTimelineSegments.length === 0 ? (
                        <div className="pointer-events-none flex min-h-[30px] items-center justify-center rounded-[10px] border border-dashed border-[rgba(124,114,102,0.16)] text-[11px] text-[var(--af-muted)]">
                          将视频素材拖到音频轨，可快速做底噪、BGM 或对白占位。
                        </div>
                      ) : null}
                      {audioTimelineSegments.map((segment) => (
                        <div
                          key={segment.track.id}
                          className={`group absolute top-1 h-8 overflow-hidden rounded-[10px] border px-2 text-[10px] ${
                            selectedAudioTrack?.id === segment.track.id
                              ? "border-[rgba(47,107,95,0.36)] bg-[rgba(47,107,95,0.12)]"
                              : "border-[rgba(124,114,102,0.18)] bg-[rgba(255,255,255,0.88)]"
                          }`}
                          style={{
                            left: segment.startSec * timelinePixelsPerSecond,
                            width: Math.max(76, segment.durationSec * timelinePixelsPerSecond),
                            opacity: segment.track.muted ? 0.52 : 1,
                          }}
                          onMouseDown={(event) => handleAudioTrackMoveMouseDown(segment.track.id, event)}
                          onClick={() => setSelectedAudioTrackId(segment.track.id)}
                        >
                          <button
                            type="button"
                            aria-label={`${segment.track.title} 左侧裁切手柄`}
                            className="absolute inset-y-0 left-0 z-10 w-2 rounded-l-[10px] bg-[rgba(47,107,95,0.1)] opacity-0 transition group-hover:opacity-100 hover:opacity-100 cursor-ew-resize"
                            onMouseDown={(event) => handleAudioTrimMouseDown(segment.track.id, "start", event)}
                            onClick={(event) => event.stopPropagation()}
                          />
                          <button
                            type="button"
                            aria-label={`${segment.track.title} 右侧裁切手柄`}
                            className="absolute inset-y-0 right-0 z-10 w-2 rounded-r-[10px] bg-[rgba(47,107,95,0.1)] opacity-0 transition group-hover:opacity-100 hover:opacity-100 cursor-ew-resize"
                            onMouseDown={(event) => handleAudioTrimMouseDown(segment.track.id, "end", event)}
                            onClick={(event) => event.stopPropagation()}
                          />
                          <div className="flex h-full items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-[10px] font-medium text-[var(--af-text)]">
                                {segment.track.title}
                              </div>
                              {selectedAudioTrack?.id === segment.track.id ? (
                                <div className="truncate text-[9px] text-[var(--af-muted)]">
                                  {formatTimelineTime(segment.startSec)} - {formatTimelineTime(segment.endSec)}
                                  {segment.track.muted ? " · 静音" : ` · ${segment.track.volume}%`}
                                </div>
                              ) : null}
                            </div>
                            <div
                              className={`flex shrink-0 items-center gap-1 ${
                                selectedAudioTrack?.id === segment.track.id ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              <button
                                type="button"
                                className="rounded-full bg-white/88 px-1.5 text-[9px] text-[var(--af-muted)]"
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateAudioTrack(segment.track.id, {
                                    volume: clamp(segment.track.volume - 10, 0, 200),
                                  });
                                }}
                              >
                                -
                              </button>
                              <span className="rounded-full bg-white/88 px-1.5 text-[9px] text-[var(--af-muted)]">
                                {segment.track.muted ? "静音" : `${segment.track.volume}%`}
                              </span>
                              <button
                                type="button"
                                className="rounded-full bg-white/88 px-1.5 text-[9px] text-[var(--af-muted)]"
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateAudioTrack(segment.track.id, {
                                    volume: clamp(segment.track.volume + 10, 0, 200),
                                  });
                                }}
                              >
                                +
                              </button>
                              <button
                                type="button"
                                className="rounded-full bg-white/88 px-1.5 text-[9px] text-[var(--af-muted)]"
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateAudioTrack(segment.track.id, { muted: !segment.track.muted });
                                }}
                              >
                                {segment.track.muted ? "开" : "静"}
                              </button>
                              <button
                                type="button"
                                className="rounded-full bg-white/88 px-1.5 text-[9px] text-[var(--af-muted)]"
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeAudioTrack(segment.track.id);
                                }}
                              >
                                删
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
        <Space size={8}>
          <Button icon={<DownloadOutlined />} loading={exporting} onClick={() => void handleExportVideo()}>
            导出视频
          </Button>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => void persistPlan("manual")}>
            保存剪辑计划
          </Button>
        </Space>
      </div>
      <div className="hidden">
        <video
          ref={programPreloadVideoRef}
          muted
          playsInline
          preload="auto"
        />
        {currentDocument.audioTracks.map((track) => (
          <audio
            key={track.id}
            ref={(element) => setAudioPreviewRef(track.id, element)}
            src={track.url}
            preload="auto"
          />
        ))}
      </div>
    </div>
  );
}
