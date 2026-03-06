"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Input,
  InputNumber,
  Segmented,
  Select,
  Slider,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import {
  CaretRightOutlined,
  DeleteOutlined,
  PauseCircleOutlined,
  RedoOutlined,
  SaveOutlined,
  ScissorOutlined,
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

const ClipTransitionSchema = z.enum(["none", "cut", "fade"]);
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
type MonitorMode = z.infer<typeof MonitorModeSchema>;
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

interface SortableClipBlockProps {
  clip: ClipDraft;
  index: number;
  width: number;
  active: boolean;
  playing: boolean;
  snapEnabled: boolean;
  snapStepSec: number;
  onSelect: (id: string) => void;
  onTrim: (id: string, range: [number, number]) => void;
  onDelete: (id: string) => void;
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
const DEFAULT_TIMELINE_ZOOM = 20;
const DEFAULT_SNAP_STEP = 0.25;
const MAX_HISTORY = 40;
const AUTOSAVE_DELAY_MS = 1200;
const LOCAL_DRAFT_PREFIX = "agentForge.video.clipStudio";

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

function deriveEditingHints(document: ClipEditorDocument): string[] {
  if (document.clips.length === 0) return [];
  const durations = document.clips.map((clip) => Math.max(0, clip.outSec - clip.inSec));
  const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  const fadeCount = document.clips.filter((clip) => clip.transition === "fade").length;
  const cutCount = document.clips.filter((clip) => clip.transition === "cut").length;
  const hints: string[] = [];

  if (averageDuration <= 2.4) hints.push("快切节奏");
  if (averageDuration >= 4.8) hints.push("长镜停留");
  if (fadeCount >= 2) hints.push("偏爱溶解转场");
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
    `fade=${document.clips.filter((clip) => clip.transition === "fade").length}`,
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

function SortableClipBlock({
  clip,
  index,
  width,
  active,
  playing,
  snapEnabled,
  snapStepSec,
  onSelect,
  onTrim,
  onDelete,
}: SortableClipBlockProps) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: clip.id });

  const style: CSSProperties = {
    width,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.82 : 1,
  };
  const maxDuration = Math.max(
    clip.sourceDurationSec ?? 0,
    clip.outSec + 4,
    6,
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-[20px] border p-3 shadow-sm transition ${
        active
          ? "border-[var(--af-brand)] bg-[rgba(255,253,249,0.98)]"
          : "border-[rgba(229,221,210,0.9)] bg-[rgba(255,255,255,0.9)]"
      } ${playing ? "ring-2 ring-[rgba(76,139,106,0.35)]" : ""}`}
      onClick={() => onSelect(clip.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(clip.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[12px] font-medium text-[var(--af-text)]">
            {index + 1}. {clip.title}
          </div>
          <div className="mt-1 text-[10px] text-[var(--af-muted)]">
            {clip.transition} · {(clip.outSec - clip.inSec).toFixed(2)}s
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="cursor-grab rounded-full border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.9)] px-2 py-1 text-[10px] text-[var(--af-muted)] active:cursor-grabbing"
            onClick={(event) => event.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            拖拽
          </button>
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(clip.id);
            }}
          />
        </div>
      </div>
      <div className="mt-3">
        <Slider
          range
          min={0}
          max={Number(maxDuration.toFixed(3))}
          step={snapEnabled ? snapStepSec : 0.1}
          value={[clip.inSec, clip.outSec]}
          onChange={(value) => {
            if (!Array.isArray(value) || value.length !== 2) return;
            const [nextIn, nextOut] = value;
            if (typeof nextIn !== "number" || typeof nextOut !== "number") return;
            onTrim(clip.id, [nextIn, nextOut]);
          }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--af-muted)]">
        <span>{clip.inSec.toFixed(2)}s</span>
        <span>{clip.outSec.toFixed(2)}s</span>
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
  const sourceVideoRef = useRef<HTMLVideoElement | null>(null);
  const programVideoRef = useRef<HTMLVideoElement | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programAdvancingRef = useRef(false);
  const lastPersistedSnapshotRef = useRef("");
  const lastQueuedTokenRef = useRef<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [autosaveState, setAutosaveState] = useState<"idle" | "pending" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isProgramPlaying, setIsProgramPlaying] = useState(false);
  const [programPlaybackIndex, setProgramPlaybackIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
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
      void message.warning("仅已生成的视频素材可以加入粗剪。");
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

    commitDocument((current) => {
      const insertAt = current.selectedClipId
        ? current.clips.findIndex((clip) => clip.id === current.selectedClipId) + 1
        : current.clips.length;
      const nextClips = [...current.clips];
      nextClips.splice(clamp(insertAt, 0, nextClips.length), 0, nextClip);
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
    void message.success(`已加入时间线：${sourceItem.title}`, 0.8);
    onConsumeQueuedClipResource?.();
  }, [
    commitDocument,
    currentDocument.clips.length,
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

  const selectedSource = useMemo(
    () => (
      currentDocument.selectedSourceResourceId
        ? (videoItemMap.get(currentDocument.selectedSourceResourceId) ?? null)
        : null
    ),
    [currentDocument.selectedSourceResourceId, videoItemMap],
  );

  const totalDuration = useMemo(
    () => currentDocument.clips.reduce((sum, clip) => sum + Math.max(0, clip.outSec - clip.inSec), 0),
    [currentDocument.clips],
  );

  const previewClip = useMemo(() => {
    if (isProgramPlaying && programPlaybackIndex !== null) {
      return currentDocument.clips[programPlaybackIndex] ?? null;
    }
    return selectedClip;
  }, [currentDocument.clips, isProgramPlaying, programPlaybackIndex, selectedClip]);

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
      stopProgramPlayback();
      return;
    }
    programAdvancingRef.current = true;
    setProgramPlaybackIndex(nextIndex);
    commitDocument((current) => ({
      ...current,
      selectedClipId: current.clips[nextIndex]?.id ?? null,
      previewMode: "program",
    }), { recordHistory: false });
  }, [commitDocument, findNextPlayableIndex, programPlaybackIndex, stopProgramPlayback]);

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

  useEffect(() => {
    if (!selectedSource || currentDocument.previewMode !== "source") return;
    const video = sourceVideoRef.current;
    if (!video) return;

    const seekToInPoint = () => {
      video.currentTime = currentDocument.sourceInSec;
    };

    if (video.readyState >= 1) {
      seekToInPoint();
    }

    video.addEventListener("loadedmetadata", seekToInPoint);
    return () => {
      video.removeEventListener("loadedmetadata", seekToInPoint);
    };
  }, [currentDocument.previewMode, currentDocument.sourceInSec, selectedSource]);

  const persistPlan = useCallback(async (saveMode: "manual" | "autosave") => {
    if (!sequenceId) {
      if (saveMode === "manual") {
        void message.warning("请先创建或选择工作区。");
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
    if (!isProgramPlaying || programPlaybackIndex === null || programAdvancingRef.current) return;
    const clip = currentDocument.clips[programPlaybackIndex];
    const video = programVideoRef.current;
    if (!clip || !video) return;
    if (video.currentTime >= clip.outSec - 0.03) {
      advanceToNextClip();
    }
  }, [advanceToNextClip, currentDocument.clips, isProgramPlaying, programPlaybackIndex]);

  const selectClip = useCallback((clipId: string) => {
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
  }, [commitDocument]);

  const selectSource = useCallback((resourceId: string) => {
    commitDocument((current) => {
      const relatedClip = current.clips.find((clip) => clip.resourceId === resourceId) ?? null;
      const defaultRange = buildDefaultRange(relatedClip?.sourceDurationSec ?? null);
      return {
        ...current,
        selectedSourceResourceId: resourceId,
        sourceInSec: relatedClip?.inSec ?? defaultRange.inSec,
        sourceOutSec: relatedClip?.outSec ?? defaultRange.outSec,
        sourceDurationSec: relatedClip?.sourceDurationSec ?? null,
        previewMode: "source",
      };
    }, { recordHistory: false });
  }, [commitDocument]);

  const updateSourceRange = useCallback((nextRange: [number, number]) => {
    commitDocument((current) => {
      const min = quantize(nextRange[0], current.snapStepSec, current.snapEnabled);
      const max = quantize(nextRange[1], current.snapStepSec, current.snapEnabled);
      return {
        ...current,
        sourceInSec: min,
        sourceOutSec: clamp(max, min, current.sourceDurationSec ?? Number.MAX_SAFE_INTEGER),
      };
    }, { recordHistory: false });
  }, [commitDocument]);

  const insertCurrentSource = useCallback(() => {
    if (!selectedSource) {
      void message.warning("请先选择一个源素材。");
      return;
    }

    const nextClip: ClipDraft = {
      id: crypto.randomUUID(),
      resourceId: selectedSource.id,
      url: selectedSource.url,
      title: selectedSource.title,
      inSec: currentDocument.sourceInSec,
      outSec: currentDocument.sourceOutSec,
      transition: currentDocument.clips.length === 0 ? "none" : "cut",
      sourceDurationSec: currentDocument.sourceDurationSec,
    };

    commitDocument((current) => {
      const insertAt = current.selectedClipId
        ? current.clips.findIndex((clip) => clip.id === current.selectedClipId) + 1
        : current.clips.length;
      const nextClips = [...current.clips];
      nextClips.splice(clamp(insertAt, 0, nextClips.length), 0, nextClip);
      return {
        ...current,
        clips: nextClips,
        selectedClipId: nextClip.id,
        previewMode: "program",
      };
    });
  }, [commitDocument, currentDocument, message, selectedSource]);

  const replaceSelectedClipFromSource = useCallback(() => {
    if (!selectedClip || !selectedSource) {
      void message.warning("请先选择要替换的片段和源素材。");
      return;
    }

    commitDocument((current) => ({
      ...current,
      clips: current.clips.map((clip) => {
        if (clip.id !== selectedClip.id) return clip;
        return {
          ...clip,
          resourceId: selectedSource.id,
          url: selectedSource.url,
          title: selectedSource.title,
          inSec: current.sourceInSec,
          outSec: current.sourceOutSec,
          sourceDurationSec: current.sourceDurationSec,
        };
      }),
    }));
  }, [commitDocument, message, selectedClip, selectedSource]);

  const addAllVideos = useCallback(() => {
    if (videoItems.length === 0) {
      void message.warning("当前没有可用视频素材。");
      return;
    }

    const selectedIds = new Set(
      currentDocument.clips
        .map((clip) => clip.resourceId)
        .filter((id): id is string => id !== null),
    );
    const append: ClipDraft[] = videoItems
      .filter((item) => !selectedIds.has(item.id))
      .map((item, index) => ({
        id: crypto.randomUUID(),
        resourceId: item.id,
        url: item.url,
        title: item.title,
        inSec: 0,
        outSec: 4,
        transition: currentDocument.clips.length === 0 && index === 0 ? "none" : "cut",
        sourceDurationSec: null,
      }));

    if (append.length === 0) {
      void message.info("所有视频候选都已在时间线中。", 0.8);
      return;
    }

    commitDocument((current) => ({
      ...current,
      clips: [...current.clips, ...append],
      selectedClipId: current.selectedClipId ?? append[0]?.id ?? null,
    }));
  }, [commitDocument, currentDocument.clips, message, videoItems]);

  const removeClip = useCallback((clipId: string) => {
    if (isProgramPlaying) {
      stopProgramPlayback();
    }
    commitDocument((current) => ({
      ...current,
      clips: current.clips.filter((clip) => clip.id !== clipId),
      selectedClipId: current.selectedClipId === clipId ? null : current.selectedClipId,
    }));
  }, [commitDocument, isProgramPlaying, stopProgramPlayback]);

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

  const updateClipRange = useCallback((clipId: string, nextRange: [number, number]) => {
    commitDocument((current) => ({
      ...current,
      clips: current.clips.map((clip) => {
        if (clip.id !== clipId) return clip;
        const min = quantize(nextRange[0], current.snapStepSec, current.snapEnabled);
        const max = quantize(nextRange[1], current.snapStepSec, current.snapEnabled);
        return {
          ...clip,
          inSec: min,
          outSec: clamp(max, min, clip.sourceDurationSec ?? Number.MAX_SAFE_INTEGER),
        };
      }),
    }));
  }, [commitDocument]);

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
    const startIndex = currentDocument.selectedClipId
      ? currentDocument.clips.findIndex((clip) => clip.id === currentDocument.selectedClipId)
      : 0;
    const firstPlayable = findNextPlayableIndex(Math.max(startIndex, 0));
    if (firstPlayable === null) {
      void message.warning("当前没有可播放的视频片段。");
      return;
    }
    setIsProgramPlaying(true);
    setProgramPlaybackIndex(firstPlayable);
    commitDocument((current) => ({
      ...current,
      selectedClipId: current.clips[firstPlayable]?.id ?? null,
      previewMode: "program",
    }), { recordHistory: false });
  }, [commitDocument, currentDocument.clips, currentDocument.selectedClipId, findNextPlayableIndex, message]);

  const handleUndo = useCallback(() => {
    setEditor((prev) => {
      if (prev.historyIndex === 0) return prev;
      const nextIndex = prev.historyIndex - 1;
      return {
        ...prev,
        historyIndex: nextIndex,
        present: cloneDocument(prev.history[nextIndex]!),
      };
    });
  }, []);

  const handleRedo = useCallback(() => {
    setEditor((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      const nextIndex = prev.historyIndex + 1;
      return {
        ...prev,
        historyIndex: nextIndex,
        present: cloneDocument(prev.history[nextIndex]!),
      };
    });
  }, []);

  const sourceMonitorDuration = currentDocument.sourceDurationSec ?? Math.max(currentDocument.sourceOutSec + 2, 8);

  const sourceUsageCount = useMemo(
    () => currentDocument.clips.filter((clip) => clip.resourceId === selectedSource?.id).length,
    [currentDocument.clips, selectedSource],
  );

  const autosaveLabel = useMemo(() => {
    if (autosaveState === "saving") return "自动保存中";
    if (autosaveState === "saved" && lastSavedAt) {
      return `已保存 ${new Date(lastSavedAt).toLocaleTimeString()}`;
    }
    if (autosaveState === "pending") return "待自动保存";
    if (autosaveState === "error") return "自动保存失败";
    return "未开始";
  }, [autosaveState, lastSavedAt]);

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
            Source Monitor / Program Monitor / Timeline / Inspector
          </div>
        </div>
        <Space size={8}>
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
        title="当前剪辑台支持：拖拽重排、拖拽裁切、串播预览、自动保存、撤销/重做与跨会话恢复。"
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr,1fr]">
        <Card
          className="ceramic-panel !border-transparent"
          title="Source Monitor"
          extra={(
            <Space size={8}>
              <Button size="small" onClick={addAllVideos}>
                加入全部候选
              </Button>
              <Button size="small" type="primary" onClick={insertCurrentSource} disabled={!selectedSource}>
                插入时间线
              </Button>
            </Space>
          )}
        >
          {selectedSource?.url ? (
            <video
              ref={sourceVideoRef}
              src={selectedSource.url}
              controls
              className="h-72 w-full rounded-[20px] border border-[rgba(229,221,210,0.9)] bg-black object-contain"
              onLoadedMetadata={() => {
                const video = sourceVideoRef.current;
                if (!video || !Number.isFinite(video.duration)) return;
                const durationSec = Number(video.duration.toFixed(3));
                commitDocument((current) => ({
                  ...current,
                  sourceDurationSec: durationSec,
                  sourceOutSec: clamp(current.sourceOutSec, current.sourceInSec, durationSec),
                  clips: current.clips.map((clip) => (
                    clip.id === current.selectedClipId && clip.resourceId === current.selectedSourceResourceId
                      ? { ...clip, sourceDurationSec: durationSec }
                      : clip
                  )),
                }), { recordHistory: false });
              }}
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-[20px] border border-dashed border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] text-[12px] text-[var(--af-muted)]">
              从右侧候选中选择一个视频作为源素材。
            </div>
          )}

          <div className="mt-3 rounded-[18px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[12px] font-medium text-[var(--af-text)]">
                  {selectedSource?.title ?? "未选择源素材"}
                </div>
                <div className="mt-1 text-[11px] text-[var(--af-muted)]">
                  使用中 {sourceUsageCount} 次 · 范围 {currentDocument.sourceInSec.toFixed(2)}s - {currentDocument.sourceOutSec.toFixed(2)}s
                </div>
              </div>
              <Segmented<MonitorMode>
                size="small"
                value={currentDocument.previewMode}
                onChange={(value) => {
                  commitDocument((current) => ({
                    ...current,
                    previewMode: value,
                  }), { recordHistory: false });
                }}
                options={[
                  { label: "Source", value: "source" },
                  { label: "Program", value: "program" },
                ]}
              />
            </div>

            <div className="mt-4">
              <Slider
                range
                min={0}
                max={Number(sourceMonitorDuration.toFixed(3))}
              step={currentDocument.snapEnabled ? currentDocument.snapStepSec : 0.1}
              value={[currentDocument.sourceInSec, currentDocument.sourceOutSec]}
              onChange={(value) => {
                if (!Array.isArray(value) || value.length !== 2) return;
                const [nextIn, nextOut] = value;
                if (typeof nextIn !== "number" || typeof nextOut !== "number") return;
                updateSourceRange([nextIn, nextOut]);
              }}
            />
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-1">
                <div className="text-[11px] text-[var(--af-muted)]">In</div>
                <InputNumber
                  min={0}
                  value={currentDocument.sourceInSec}
                  onChange={(value) => updateSourceRange([Number(value ?? 0), currentDocument.sourceOutSec])}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-[var(--af-muted)]">Out</div>
                <InputNumber
                  min={currentDocument.sourceInSec}
                  value={currentDocument.sourceOutSec}
                  onChange={(value) => updateSourceRange([currentDocument.sourceInSec, Number(value ?? currentDocument.sourceInSec)])}
                  style={{ width: "100%" }}
                />
              </div>
              <Button onClick={replaceSelectedClipFromSource} disabled={!selectedClip || !selectedSource}>
                替换当前片段
              </Button>
              <Button onClick={insertCurrentSource} type="primary" disabled={!selectedSource}>
                以当前范围插入
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <Typography.Text strong style={{ fontSize: 12 }}>
                Source Bin
              </Typography.Text>
              <Typography.Text style={{ fontSize: 11, color: "var(--af-muted)" }}>
                {videoItems.length} 个视频候选
              </Typography.Text>
            </div>
            {videoItems.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无视频候选" />
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {videoItems.map((item) => {
                  const usage = currentDocument.clips.filter((clip) => clip.resourceId === item.id).length;
                  const active = item.id === selectedSource?.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`rounded-[18px] border px-3 py-2 text-left transition ${
                        active
                          ? "border-[var(--af-brand)] bg-[rgba(255,253,249,0.96)]"
                          : "border-[rgba(229,221,210,0.9)] bg-[rgba(255,255,255,0.9)]"
                      }`}
                      onClick={() => selectSource(item.id)}
                    >
                      <div className="truncate text-[12px] font-medium text-[var(--af-text)]">
                        {item.title}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--af-muted)]">
                        <span>{item.category}</span>
                        <span>timeline x{usage}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        <Card
          className="ceramic-panel !border-transparent"
          title="Program Monitor"
          extra={(
            isProgramPlaying ? (
              <Button size="small" danger icon={<PauseCircleOutlined />} onClick={stopProgramPlayback}>
                停止
              </Button>
            ) : (
              <Button size="small" type="primary" icon={<CaretRightOutlined />} onClick={startProgramPlayback}>
                串播预览
              </Button>
            )
          )}
        >
          {previewClip?.url ? (
            <video
              ref={programVideoRef}
              src={previewClip.url}
              controls={!isProgramPlaying}
              className="h-72 w-full rounded-[20px] border border-[rgba(229,221,210,0.9)] bg-black object-contain"
              onTimeUpdate={handleProgramTimeUpdate}
              onEnded={() => {
                if (isProgramPlaying) {
                  advanceToNextClip();
                }
              }}
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-[20px] border border-dashed border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.72)] text-[12px] text-[var(--af-muted)]">
              选择时间线片段后在这里检查节奏与转场。
            </div>
          )}

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-[18px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)] p-3">
              <div className="text-[11px] text-[var(--af-muted)]">当前片段</div>
              <div className="mt-1 text-[12px] font-medium text-[var(--af-text)]">
                {previewClip?.title ?? "未选择"}
              </div>
            </div>
            <div className="rounded-[18px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)] p-3">
              <div className="text-[11px] text-[var(--af-muted)]">播放状态</div>
              <div className="mt-1 text-[12px] font-medium text-[var(--af-text)]">
                {isProgramPlaying && programPlaybackIndex !== null
                  ? `串播第 ${programPlaybackIndex + 1} 段`
                  : "单片段检查"}
              </div>
            </div>
            <div className="rounded-[18px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)] p-3">
              <div className="text-[11px] text-[var(--af-muted)]">时间线总长</div>
              <div className="mt-1 text-[12px] font-medium text-[var(--af-text)]">
                {totalDuration.toFixed(2)}s
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr,0.9fr]">
        <Card
          className="ceramic-panel !border-transparent"
          title="Timeline"
          extra={(
            <Space size={8}>
              <Button size="small" icon={<UndoOutlined />} disabled={editor.historyIndex === 0} onClick={handleUndo}>
                撤销
              </Button>
              <Button
                size="small"
                icon={<RedoOutlined />}
                disabled={editor.historyIndex >= editor.history.length - 1}
                onClick={handleRedo}
              >
                重做
              </Button>
            </Space>
          )}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)] px-3 py-2">
            <Space size={12} wrap>
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
              <span className="text-[11px] text-[var(--af-muted)]">Step</span>
              <Select<number>
                size="small"
                value={currentDocument.snapStepSec}
                style={{ width: 110 }}
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
            </Space>
            <div className="flex min-w-[220px] items-center gap-3">
              <span className="text-[11px] text-[var(--af-muted)]">Zoom</span>
              <Slider
                min={8}
                max={120}
                value={currentDocument.timelineZoom}
                onChange={(value) => {
                  if (typeof value !== "number") return;
                  commitDocument((current) => ({
                    ...current,
                    timelineZoom: value,
                  }), { recordHistory: false });
                }}
              />
            </div>
          </div>

          {currentDocument.clips.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有片段，先从 Source Monitor 插入一段。" />
          ) : (
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={currentDocument.clips.map((clip) => clip.id)} strategy={horizontalListSortingStrategy}>
                <div className="overflow-x-auto rounded-[22px] border border-[rgba(229,221,210,0.9)] bg-[rgba(255,253,249,0.78)] px-3 py-4">
                  <div className="flex min-w-max items-start gap-3">
                    {currentDocument.clips.map((clip, index) => {
                      const duration = Math.max(0.5, clip.outSec - clip.inSec);
                      const width = Math.max(180, duration * currentDocument.timelineZoom * 0.9);
                      return (
                        <SortableClipBlock
                          key={clip.id}
                          clip={clip}
                          index={index}
                          width={width}
                          active={clip.id === currentDocument.selectedClipId}
                          playing={isProgramPlaying && programPlaybackIndex === index}
                          snapEnabled={currentDocument.snapEnabled}
                          snapStepSec={currentDocument.snapStepSec}
                          onSelect={selectClip}
                          onTrim={updateClipRange}
                          onDelete={removeClip}
                        />
                      );
                    })}
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </Card>

        <Card
          className="ceramic-panel !border-transparent"
          title="Inspector"
          extra={selectedClip ? <Tag style={{ margin: 0 }}>#{selectedClipIndex + 1}</Tag> : null}
        >
          {!selectedClip ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="选择时间线中的片段后可在这里精修。" />
          ) : (
            <div className="space-y-4">
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    { value: "none", label: "None" },
                    { value: "cut", label: "Cut" },
                    { value: "fade", label: "Fade" },
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

              <div className="grid grid-cols-1 gap-2">
                <Button icon={<ScissorOutlined />} onClick={duplicateSelectedClip}>
                  复制当前片段
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => removeClip(selectedClip.id)}>
                  删除当前片段
                </Button>
              </div>
            </div>
          )}
        </Card>
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
