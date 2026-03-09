"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  App,
  Button,
  Collapse,
  Drawer,
  Empty,
  Grid,
  Input,
  Spin,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  BgColorsOutlined,
  DeleteOutlined,
  EditOutlined,
  ExpandOutlined,
  LinkOutlined,
  ScissorOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { z } from "zod";
import type { DomainResources, DomainResource } from "../types";
import { fetchJson } from "@/app/components/client-utils";
import { inferReferenceRole, type VideoReferenceRole } from "@/lib/video/reference-roles";
import {
  buildClipAtlasDragPayload,
  CLIP_ATLAS_DRAG_MIME,
} from "@/lib/video/clip-drag";

export interface ResourcePanelProps {
  resources: DomainResources | null;
  isLoading: boolean;
  sequenceId: string | null;
  onRefresh?: () => void;
  onInjectMessage?: (message: string) => void;
  onAttachContextResource?: (resource: DomainResource) => void;
  onAttachStyleReference?: (resource: DomainResource) => void;
  onQueueClipResource?: (resource: DomainResource) => void;
  embedded?: boolean;
}

type ResourceMediaFilter = "all" | "image" | "video" | "json";

const ResourceDataSchema = z.object({
  prompt: z.string().optional(),
  userPrompt: z.string().optional(),
  key: z.string().optional(),
}).passthrough();

const ResourceDataEnvelopeSchema = z.object({
  __af_resource_data_v: z.literal(2),
  payload: z.unknown(),
}).passthrough();

const KeyResourceDetailSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
});

type RoleCountMap = Record<VideoReferenceRole, number>;

function buildAsideClass(embedded: boolean): string {
  if (embedded) return "ceramic-panel ceramic-resource-panel flex min-h-0 h-full w-full flex-col overflow-hidden";
  return "ceramic-panel ceramic-resource-panel flex min-h-0 h-full w-72 min-w-[240px] shrink-0 flex-col overflow-hidden";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createRoleCountMap(): RoleCountMap {
  return {
    style_ref: 0,
    scene_ref: 0,
    empty_shot_ref: 0,
    character_ref: 0,
    motion_ref: 0,
    first_frame_ref: 0,
    last_frame_ref: 0,
    storyboard_ref: 0,
    dialogue_ref: 0,
  };
}

function getReferenceRoleLabel(resource: DomainResource): string | null {
  const role = inferReferenceRole({
    category: resource.category,
    mediaType: resource.mediaType,
    title: resource.title,
    data: resource.data,
  });
  if (!role) return null;
  switch (role) {
    case "style_ref":
      return "画风参考";
    case "scene_ref":
      return "场景";
    case "empty_shot_ref":
      return "空镜";
    case "character_ref":
      return "角色";
    case "motion_ref":
      return "动作";
    case "first_frame_ref":
      return "起始帧";
    case "last_frame_ref":
      return "结束帧";
    case "storyboard_ref":
      return "分镜";
    case "dialogue_ref":
      return "对白";
    default:
      return null;
  }
}

function isResourceMediaFilter(value: string): value is ResourceMediaFilter {
  return value === "all" || value === "image" || value === "video" || value === "json";
}

function looksLikeJsonDocument(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.length < 2) return false;
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return true;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) return true;
  if (trimmed.startsWith("\"{") && trimmed.endsWith("}\"")) return true;
  if (trimmed.startsWith("\"[") && trimmed.endsWith("]\"")) return true;
  return false;
}

function normalizeResourceData(raw: unknown): unknown {
  let current: unknown = raw;
  const envelope = ResourceDataEnvelopeSchema.safeParse(current);
  if (envelope.success) {
    current = envelope.data.payload;
  }

  for (let depth = 0; depth < 3; depth += 1) {
    if (typeof current !== "string") break;
    if (!looksLikeJsonDocument(current)) break;
    try {
      const parsed: unknown = JSON.parse(current);
      if (parsed === current) break;
      current = parsed;
    } catch {
      break;
    }
  }
  return current;
}

function readResourceData(resource: DomainResource): z.infer<typeof ResourceDataSchema> | null {
  const parsed = ResourceDataSchema.safeParse(normalizeResourceData(resource.data));
  if (!parsed.success) return null;
  return parsed.data;
}

function stringifyResourceData(resource: DomainResource): string {
  const normalized = normalizeResourceData(resource.data);
  if (typeof normalized === "string") return normalized;
  if (normalized == null) return "";
  return JSON.stringify(normalized, null, 2);
}

function sanitizePromptForPlayer(rawPrompt: string | null): string {
  if (!rawPrompt || rawPrompt.trim().length === 0) return "";

  const blockedPrefixes = [
    "selected_builtin_",
    "style_tokens=",
    "positive_prompt=",
    "negative_prompt=",
    "memory_",
    "project_id:",
    "sequence_key:",
    "resource_id=",
    "reference_image_url=",
    "hidden_dialogue_context=",
    "scopeType=",
    "scopeId=",
  ];

  const cleaned = rawPrompt
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => {
      const normalized = line.toLowerCase();
      return !blockedPrefixes.some((prefix) => normalized.startsWith(prefix.toLowerCase()));
    });

  return cleaned.join("\n").slice(0, 1600);
}

function readResourcePrompt(resource: DomainResource): string | null {
  const data = readResourceData(resource);
  if (!data) return null;
  const candidate = data.userPrompt ?? data.prompt ?? null;
  if (!candidate || candidate.trim().length === 0) return null;
  const safePrompt = sanitizePromptForPlayer(candidate);
  return safePrompt.trim().length > 0 ? safePrompt : null;
}

function buildSearchText(resource: DomainResource): string {
  const parts: string[] = [resource.category, resource.title ?? ""];
  const prompt = readResourcePrompt(resource);
  if (prompt) parts.push(prompt);
  const normalized = normalizeResourceData(resource.data);
  if (typeof normalized === "string") parts.push(normalized);
  return parts.join(" ").toLowerCase();
}

function buildRerollInstruction(resource: DomainResource, prompt: string): string {
  return [
    "请基于以下创作描述重 roll 该素材。",
    `resource_id=${resource.id}`,
    `resource_title=${resource.title ?? "untitled"}`,
    `resource_media_type=${resource.mediaType}`,
    `creative_prompt=${prompt}`,
  ].join("\n");
}

function buildCurrentShotInstruction(
  resource: DomainResource,
  slot: "start_frame" | "end_frame",
): string {
  const slotLabel = slot === "start_frame" ? "起始帧参考" : "结束帧参考";
  const strategyHint = slot === "start_frame"
    ? "若本轮只需要起始约束，请明确走 first_frame，不要自动升级到 first_last_frame。"
    : "只有当本轮明确需要起止约束时，才把它作为尾帧并走 first_last_frame。";
  return [
    `请把以下素材作为当前镜头的${slotLabel}。`,
    `resource_id=${resource.id}`,
    `resource_title=${resource.title ?? "untitled"}`,
    `resource_media_type=${resource.mediaType}`,
    strategyHint,
  ].join("\n");
}

function buildSemanticRolePayload(resource: DomainResource, role: VideoReferenceRole): unknown {
  const normalized = normalizeResourceData(resource.data);
  if (isPlainObject(normalized)) {
    return {
      ...normalized,
      semanticRole: role,
    };
  }
  return {
    semanticRole: role,
    preservedData: normalized,
  };
}

function semanticRoleActionLabel(role: VideoReferenceRole): string {
  switch (role) {
    case "first_frame_ref":
      return "起始帧参考";
    case "last_frame_ref":
      return "结束帧参考";
    case "character_ref":
      return "角色锚点";
    case "empty_shot_ref":
      return "空镜锚点";
    default:
      return getReferenceRoleLabel({
        id: "",
        category: "",
        mediaType: "json",
        title: role,
        url: null,
        data: { semanticRole: role },
        keyResourceId: null,
        sortOrder: 0,
      }) ?? role;
  }
}

function countAtlasRoles(resources: DomainResources | null): RoleCountMap {
  const counts = createRoleCountMap();
  if (!resources) return counts;

  for (const group of resources.categories) {
    for (const item of group.items) {
      const role = inferReferenceRole({
        category: item.category,
        mediaType: item.mediaType,
        title: item.title,
        data: item.data,
      });
      if (!role) continue;
      counts[role] += 1;
    }
  }

  return counts;
}

export function ResourcePanel({
  resources,
  isLoading,
  sequenceId,
  onRefresh,
  onInjectMessage,
  onAttachContextResource,
  onAttachStyleReference,
  onQueueClipResource,
  embedded = false,
}: ResourcePanelProps) {
  const ASIDE_CLASS = buildAsideClass(embedded);
  const { message } = App.useApp();
  const screens = Grid.useBreakpoint();

  const [searchText, setSearchText] = useState("");
  const [mediaFilter, setMediaFilter] = useState<ResourceMediaFilter>("all");

  const [editingItem, setEditingItem] = useState<{ id: string; title: string; data: unknown } | null>(null);
  const [editText, setEditText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [expandedOpen, setExpandedOpen] = useState(false);

  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const knownKeysRef = useRef<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const [selectedResource, setSelectedResource] = useState<DomainResource | null>(null);
  const [detailPrompt, setDetailPrompt] = useState("");
  const [detailPreviewUrl, setDetailPreviewUrl] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [rerolling, setRerolling] = useState(false);

  const openDetail = useCallback((resource: DomainResource) => {
    setSelectedResource(resource);
  }, []);

  useEffect(() => {
    if (!selectedResource) {
      setDetailPrompt("");
      setDetailPreviewUrl(null);
      return;
    }

    let cancelled = false;
    const localPrompt = readResourcePrompt(selectedResource) ?? "";
    setDetailPrompt(localPrompt);
    setDetailPreviewUrl(selectedResource.url);

    if (!selectedResource.keyResourceId) return;

    const load = async () => {
      setDetailLoading(true);
      try {
        const data = await fetchJson<unknown>(`/api/key-resources/${selectedResource.keyResourceId}`);
        const parsed = KeyResourceDetailSchema.safeParse(data);
        if (!parsed.success || cancelled) return;
        const prompt = sanitizePromptForPlayer(parsed.data.prompt ?? "");
        if (prompt.trim().length > 0) {
          setDetailPrompt(prompt);
        }
        if (parsed.data.url) {
          setDetailPreviewUrl(parsed.data.url);
        }
      } catch {
        // best effort
      } finally {
        if (!cancelled) {
          setDetailLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [selectedResource]);

  const handleDelete = useCallback(async (id: string) => {
    if (!sequenceId) return;
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await fetchJson(`/api/video/sequences/${encodeURIComponent(sequenceId)}/resources`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: id }),
      });
      void message.success("已删除");
      onRefresh?.();
    } catch {
      void message.error("删除失败");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [message, onRefresh, sequenceId]);

  const openEditor = useCallback((item: { id: string; title: string; data: unknown }) => {
    setEditingItem(item);
    if (item.data == null) {
      setEditText("");
      return;
    }
    if (typeof item.data === "string") {
      setEditText(item.data);
      return;
    }
    setEditText(JSON.stringify(item.data, null, 2));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingItem || !sequenceId) return;
    let parsed: unknown = null;
    const trimmed = editText.trim();
    if (trimmed.length > 0) {
      try {
        parsed = JSON.parse(editText);
      } catch {
        parsed = editText;
      }
    }
    setIsSaving(true);
    try {
      await fetchJson(`/api/video/sequences/${encodeURIComponent(sequenceId)}/resources`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: editingItem.id, data: parsed }),
      });
      void message.success("已保存");
      setEditingItem(null);
      onRefresh?.();
    } catch {
      void message.error("保存失败");
    } finally {
      setIsSaving(false);
    }
  }, [editText, editingItem, message, onRefresh, sequenceId]);

  const handleAtMaterial = useCallback((resource: DomainResource) => {
    if (!onAttachContextResource) {
      void message.warning("当前页面无法附加上下文。");
      return;
    }
    onAttachContextResource(resource);
    void message.success("已加入 @上下文，将在下一轮请求生效。");
  }, [message, onAttachContextResource]);

  const handleSetStyleRef = useCallback((resource: DomainResource) => {
    if (!onAttachStyleReference) {
      void message.warning("当前页面无法设置风格参考。");
      return;
    }
    if (resource.mediaType !== "image" || !resource.url) {
      void message.warning("仅图片素材支持设为新风格。");
      return;
    }
    onAttachStyleReference(resource);
    void message.success("已加入风格参考，将在后续生图隐式注入。");
  }, [message, onAttachStyleReference]);

  const handleAssignSemanticRole = useCallback(async (
    resource: DomainResource,
    role: VideoReferenceRole,
  ) => {
    if (!sequenceId) {
      void message.warning("请先创建或选择序列。");
      return;
    }

    try {
      await fetchJson(`/api/video/sequences/${encodeURIComponent(sequenceId)}/resources`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource.id,
          data: buildSemanticRolePayload(resource, role),
        }),
      });
      void message.success(`已设为${semanticRoleActionLabel(role)}。`);
      onRefresh?.();
    } catch {
      void message.error("设置素材语义失败。");
    }
  }, [message, onRefresh, sequenceId]);

  const handleUseForCurrentShot = useCallback((
    resource: DomainResource,
    slot: "start_frame" | "end_frame",
  ) => {
    if (!onInjectMessage) {
      void message.warning("当前页面无法把素材注入到当前镜头。");
      return;
    }
    if (resource.mediaType !== "image" || !resource.url) {
      void message.warning("当前镜头的起始帧/结束帧引用仅支持图片素材。");
      return;
    }
    onInjectMessage(buildCurrentShotInstruction(resource, slot));
    void message.success(
      slot === "start_frame"
        ? "已作为当前镜头的起始帧参考发到对话。"
        : "已作为当前镜头的结束帧参考发到对话。",
    );
  }, [message, onInjectMessage]);

  const handleQueueClip = useCallback((resource: DomainResource) => {
    if (!onQueueClipResource) {
      void message.warning("当前页面无法直接送入剪辑台。");
      return;
    }
    if (resource.mediaType !== "video" || !resource.url) {
      void message.warning("仅已生成的视频素材可以加入时间线。");
      return;
    }
    onQueueClipResource(resource);
    void message.success("已加入时间线。");
  }, [message, onQueueClipResource]);

  const handleRerollFromDetail = useCallback(async () => {
    if (!selectedResource) return;
    const prompt = detailPrompt.trim();
    if (prompt.length === 0) {
      void message.warning("请先填写创作描述。");
      return;
    }

    setRerolling(true);
    try {
      if (selectedResource.keyResourceId) {
        await fetchJson(`/api/key-resources/${selectedResource.keyResourceId}/regenerate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        void message.success("已重 roll，该素材正在刷新。");
        onRefresh?.();

        const latestDetail = await fetchJson<unknown>(`/api/key-resources/${selectedResource.keyResourceId}`);
        const parsed = KeyResourceDetailSchema.safeParse(latestDetail);
        if (parsed.success) {
          const nextPrompt = sanitizePromptForPlayer(parsed.data.prompt ?? prompt);
          if (nextPrompt.trim().length > 0) {
            setDetailPrompt(nextPrompt);
          }
          if (parsed.data.url) {
            setDetailPreviewUrl(parsed.data.url);
          }
        }
        return;
      }

      if (!onInjectMessage) {
        void message.warning("当前页面无法注入对话，无法重 roll。");
        return;
      }
      onInjectMessage(buildRerollInstruction(selectedResource, prompt));
      void message.success("已发送重 roll 指令到对话。");
    } catch {
      void message.error("重 roll 失败，请稍后重试。");
    } finally {
      setRerolling(false);
    }
  }, [detailPrompt, message, onInjectMessage, onRefresh, selectedResource]);

  const renderDeleteBtn = (id: string) => (
    <Button
      type="text"
      size="small"
      danger
      icon={<DeleteOutlined />}
      loading={deletingIds.has(id)}
      className="!absolute right-1 top-1 z-10 opacity-0 transition-opacity group-hover/card:opacity-100 !bg-white/90 !text-red-500 hover:!text-red-400"
      onClick={(e) => { e.stopPropagation(); void handleDelete(id); }}
      style={{ fontSize: 10, width: 22, height: 22, minWidth: 22 }}
    />
  );

  const renderImageItem = (resource: DomainResource) => (
    <div
      key={resource.id}
      className="group/card relative w-full overflow-hidden rounded-[18px] border border-[var(--af-border)] bg-[rgba(255,255,255,0.82)] text-left"
      onClick={() => openDetail(resource)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail(resource);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {renderDeleteBtn(resource.id)}
      {resource.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resource.url} alt={resource.title ?? "Image"} className="aspect-square w-full object-cover" />
      ) : (
        <div className="flex aspect-square items-center justify-center bg-slate-100 text-xs text-slate-500">
          暂无图片
        </div>
      )}
      <div className="flex items-center justify-between gap-1 border-t border-[rgba(229,221,210,0.7)] px-2 py-1.5">
        <div className="truncate text-[11px] font-medium text-[var(--af-text)]">{resource.title ?? "图片素材"}</div>
        <div className="flex items-center gap-1">
          {getReferenceRoleLabel(resource) ? (
            <Tag color="gold" style={{ margin: 0, fontSize: 10 }}>
              {getReferenceRoleLabel(resource)}
            </Tag>
          ) : null}
          <Tag style={{ margin: 0, fontSize: 10 }}>image</Tag>
        </div>
      </div>
    </div>
  );

  const renderVideoItem = (resource: DomainResource) => {
    const dragPayload = buildClipAtlasDragPayload(resource);

    return (
    <div
      key={resource.id}
      className="group/card relative w-full overflow-hidden rounded-[18px] border border-[var(--af-border)] bg-[rgba(255,255,255,0.82)] text-left"
      draggable={dragPayload !== null}
      onDragStart={(event) => {
        if (!dragPayload) return;
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData(CLIP_ATLAS_DRAG_MIME, JSON.stringify(dragPayload));
        event.dataTransfer.setData("text/plain", dragPayload.title);
      }}
      onClick={() => openDetail(resource)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail(resource);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {renderDeleteBtn(resource.id)}
      {resource.url ? (
        <video src={resource.url} muted className="aspect-[9/16] w-full object-cover" />
      ) : (
        <div className="flex aspect-[9/16] items-center justify-center bg-slate-100 text-xs text-slate-500">
          待生成视频
        </div>
      )}
      <div className="flex items-center justify-between gap-1 border-t border-[rgba(229,221,210,0.7)] px-2 py-1.5">
        <div className="truncate text-[11px] font-medium text-[var(--af-text)]">{resource.title ?? "视频素材"}</div>
        <div className="flex items-center gap-1">
          {dragPayload ? (
            <Tag color="green" style={{ margin: 0, fontSize: 10 }}>
              拖入时间线
            </Tag>
          ) : null}
          {getReferenceRoleLabel(resource) ? (
            <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>
              {getReferenceRoleLabel(resource)}
            </Tag>
          ) : null}
          <Tag style={{ margin: 0, fontSize: 10 }}>video</Tag>
        </div>
      </div>
    </div>
    );
  };

  const renderJsonItem = (resource: DomainResource) => {
    const text = stringifyResourceData(resource);

    return (
      <div
        key={resource.id}
        className="group/card relative cursor-pointer overflow-hidden rounded-[18px] border border-[var(--af-border)] bg-[rgba(255,255,255,0.82)]"
        onClick={() => openEditor({ id: resource.id, title: resource.title ?? "JSON", data: normalizeResourceData(resource.data) })}
        title="点击编辑"
      >
        {renderDeleteBtn(resource.id)}
        <pre className="max-h-32 overflow-hidden whitespace-pre-wrap break-all px-2 pt-2 pb-8 font-mono text-[9px] leading-relaxed text-slate-600">
          {text}
        </pre>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent px-2 pb-1.5 pt-6">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-[11px] font-medium text-slate-900">{resource.title ?? "JSON"}</div>
            <div className="flex items-center gap-1">
              {getReferenceRoleLabel(resource) ? (
                <Tag color="cyan" style={{ margin: 0, fontSize: 10 }}>
                  {getReferenceRoleLabel(resource)}
                </Tag>
              ) : null}
              <EditOutlined className="text-[11px] text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const categories = useMemo(() => {
    if (!resources) return [];
    const needle = searchText.trim().toLowerCase();

    return resources.categories
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (mediaFilter !== "all" && item.mediaType !== mediaFilter) return false;
          if (!needle) return true;
          return buildSearchText(item).includes(needle);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [mediaFilter, resources, searchText]);

  const totalResourceCount = useMemo(() => {
    if (!resources) return 0;
    return resources.categories.reduce((sum, group) => sum + group.items.length, 0);
  }, [resources]);

  const roleCounts = useMemo(() => countAtlasRoles(resources), [resources]);

  const mediaCounts = useMemo(() => {
    if (!resources) return { image: 0, video: 0, json: 0 };
    return resources.categories.reduce(
      (sum, group) => {
        for (const item of group.items) {
          if (item.mediaType === "image") sum.image += 1;
          else if (item.mediaType === "video") sum.video += 1;
          else if (item.mediaType === "json") sum.json += 1;
        }
        return sum;
      },
      { image: 0, video: 0, json: 0 },
    );
  }, [resources]);

  const categoryKeys = useMemo(() => categories.map((g) => `cat-${g.category}`), [categories]);
  useEffect(() => {
    const newKeys = categoryKeys.filter((k) => !knownKeysRef.current.has(k));
    if (newKeys.length > 0) {
      for (const k of newKeys) knownKeysRef.current.add(k);
      setActiveKeys((prev) => [...prev, ...newKeys]);
    }
  }, [categoryKeys]);

  const collapseItems = categories.map((group) => {
    const images = group.items.filter((item) => item.mediaType === "image");
    const videos = group.items.filter((item) => item.mediaType === "video");
    const jsons = group.items.filter((item) => item.mediaType === "json");

    return {
      key: `cat-${group.category}`,
      label: (
        <span className="flex items-center gap-1.5 text-xs font-medium">
          {group.category}
          <Tag style={{ fontSize: 10, lineHeight: "16px", margin: 0 }}>{group.items.length}</Tag>
        </span>
      ),
      children: (
        <div className="space-y-2">
          {images.length > 0 && <div className="grid grid-cols-2 gap-2">{images.map(renderImageItem)}</div>}
          {videos.length > 0 && <div className="grid grid-cols-2 gap-2">{videos.map(renderVideoItem)}</div>}
          {jsons.length > 0 && <div className="space-y-2">{jsons.map(renderJsonItem)}</div>}
        </div>
      ),
    };
  });

  if (isLoading) {
    return (
      <aside className={ASIDE_CLASS}>
        <div className="flex flex-1 items-center justify-center"><Spin size="small" /></div>
      </aside>
    );
  }

  if (!resources) {
    return (
      <aside className={ASIDE_CLASS}>
        <div className="flex flex-1 items-center justify-center px-3 text-center text-xs text-slate-500">
          先在对话里说一句你想创作的内容，Agent 会自动规划并开始执行。
        </div>
      </aside>
    );
  }

  if (totalResourceCount === 0) {
    return (
      <aside className={ASIDE_CLASS}>
        <div className="flex flex-1 items-center justify-center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无素材" />
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className={ASIDE_CLASS}>
        <div className="border-b border-slate-200 px-3 py-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="leading-tight">
              <Typography.Text strong style={{ fontSize: 12 }}>Asset Atlas</Typography.Text>
              <div className="text-[10px] text-[var(--af-muted)]">角色化素材图谱</div>
            </div>
            <Button
              size="small"
              icon={<ExpandOutlined />}
              onClick={() => setExpandedOpen(true)}
              title="展开素材"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Input
              size="small"
              placeholder="搜索素材标题 / 描述"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              allowClear
            />
            <Tabs
              size="small"
              activeKey={mediaFilter}
              onChange={(value) => {
                if (isResourceMediaFilter(value)) {
                  setMediaFilter(value);
                }
              }}
              items={[
                { key: "all", label: "全部" },
                { key: "image", label: "图片" },
                { key: "video", label: "视频" },
                { key: "json", label: "JSON" },
              ]}
            />
          </div>
          <div className="asset-overview-grid mt-2 grid grid-cols-1 gap-2">
            <div className="asset-overview-card">
              <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--af-muted)]">Resource Mix</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Tag style={{ margin: 0 }}>图片 {mediaCounts.image}</Tag>
                <Tag style={{ margin: 0 }}>视频 {mediaCounts.video}</Tag>
                <Tag style={{ margin: 0 }}>JSON {mediaCounts.json}</Tag>
              </div>
            </div>
            <div className="asset-overview-card">
              <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--af-muted)]">Semantic Roles</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {roleCounts.style_ref > 0 && <Tag color="gold" style={{ margin: 0 }}>画风 {roleCounts.style_ref}</Tag>}
                {roleCounts.character_ref > 0 && <Tag color="blue" style={{ margin: 0 }}>角色 {roleCounts.character_ref}</Tag>}
                {roleCounts.empty_shot_ref > 0 && <Tag color="cyan" style={{ margin: 0 }}>空镜 {roleCounts.empty_shot_ref}</Tag>}
                {roleCounts.storyboard_ref > 0 && <Tag color="purple" style={{ margin: 0 }}>分镜 {roleCounts.storyboard_ref}</Tag>}
                {roleCounts.first_frame_ref > 0 && <Tag color="gold" style={{ margin: 0 }}>起始帧 {roleCounts.first_frame_ref}</Tag>}
                {roleCounts.last_frame_ref > 0 && <Tag color="gold" style={{ margin: 0 }}>结束帧 {roleCounts.last_frame_ref}</Tag>}
                {Object.values(roleCounts).every((value) => value === 0) && (
                  <Tag style={{ margin: 0 }}>尚未建立语义锚点</Tag>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {collapseItems.length === 0 ? (
            <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-slate-500">
              当前筛选下没有素材。
            </div>
          ) : (
            <Collapse
              activeKey={activeKeys}
              onChange={(keys) => {
                if (Array.isArray(keys)) {
                  setActiveKeys(keys.map((key) => String(key)));
                  return;
                }
                if (typeof keys === "string") {
                  setActiveKeys([keys]);
                  return;
                }
                setActiveKeys([]);
              }}
              items={collapseItems}
              size="small"
              ghost
            />
          )}
        </div>
      </aside>

      <Drawer
        title="Asset Atlas"
        size={screens.lg ? 1080 : "100%"}
        open={expandedOpen}
        onClose={() => setExpandedOpen(false)}
      >
        {categories.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无素材" />
        ) : (
          <div className="space-y-3">
            {categories.map((group) => (
              <section key={group.category} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Typography.Text strong style={{ fontSize: 13 }}>{group.category}</Typography.Text>
                  <Tag style={{ margin: 0 }}>{group.items.length}</Tag>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((resource) => {
                    const isImage = resource.mediaType === "image";
                    const isVideo = resource.mediaType === "video";
                    const isJson = resource.mediaType === "json";

                    return (
                      <article key={resource.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <button
                          type="button"
                          className="block w-full text-left"
                          onClick={() => openDetail(resource)}
                        >
                          {isImage && resource.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={resource.url} alt={resource.title ?? "image"} className="h-40 w-full object-cover" />
                          )}
                          {isVideo && resource.url && (
                            <video src={resource.url} muted className="h-40 w-full object-cover" />
                          )}
                          {isJson && (
                            <pre className="max-h-40 overflow-hidden whitespace-pre-wrap break-all px-2 py-2 text-[10px] leading-relaxed text-slate-600">
                              {stringifyResourceData(resource)}
                            </pre>
                          )}
                          {!resource.url && (isImage || isVideo) && (
                            <div className="flex h-40 items-center justify-center bg-slate-100 text-xs text-slate-500">
                              待生成素材
                            </div>
                          )}
                        </button>

                        <div className="space-y-1 px-2 py-2">
                          <div className="truncate text-[12px] font-medium text-slate-800">
                            {resource.title ?? `${resource.mediaType} 素材`}
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <Button
                              size="small"
                              type="primary"
                              icon={<LinkOutlined />}
                              onClick={() => handleAtMaterial(resource)}
                            >
                              @该素材
                            </Button>
                            {isVideo && resource.url && (
                              <Button
                                size="small"
                                icon={<ScissorOutlined />}
                                onClick={() => handleQueueClip(resource)}
                              >
                                加入时间线
                              </Button>
                            )}
                            {isImage && resource.url && (
                              <Button
                                size="small"
                                icon={<BgColorsOutlined />}
                                onClick={() => handleSetStyleRef(resource)}
                              >
                                设为新风格
                              </Button>
                            )}
                            <Button
                              size="small"
                              icon={<SyncOutlined />}
                              onClick={() => openDetail(resource)}
                            >
                              重 roll
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </Drawer>

      <Drawer
        title={selectedResource ? (selectedResource.title ?? "Asset Inspector") : "Asset Inspector"}
        size={screens.lg ? 980 : "100%"}
        open={selectedResource !== null}
        onClose={() => setSelectedResource(null)}
        destroyOnClose
      >
        {!selectedResource ? null : (
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              系统内置提示词已保护，仅展示可编辑创作描述层。
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-2">
                {detailLoading ? (
                  <div className="flex h-72 items-center justify-center"><Spin /></div>
                ) : selectedResource.mediaType === "image" ? (
                  detailPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={detailPreviewUrl} alt={selectedResource.title ?? "image"} className="h-72 w-full rounded object-contain" />
                  ) : (
                    <div className="flex h-72 items-center justify-center text-xs text-slate-500">暂无图片预览</div>
                  )
                ) : selectedResource.mediaType === "video" ? (
                  detailPreviewUrl ? (
                    <video src={detailPreviewUrl} controls className="h-72 w-full rounded bg-black object-contain" />
                  ) : (
                    <div className="flex h-72 items-center justify-center text-xs text-slate-500">暂无视频预览</div>
                  )
                ) : (
                  <pre className="h-72 overflow-auto whitespace-pre-wrap break-all rounded bg-slate-50 p-2 text-[10px] leading-relaxed text-slate-600">
                    {stringifyResourceData(selectedResource)}
                  </pre>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <Typography.Text strong style={{ fontSize: 12 }}>创作描述（可编辑）</Typography.Text>
                <Input.TextArea
                  className="mt-2"
                  autoSize={{ minRows: 12, maxRows: 20 }}
                  value={detailPrompt}
                  onChange={(event) => setDetailPrompt(event.target.value)}
                  placeholder="描述你希望该素材呈现的画面、动作、镜头与风格"
                  style={{ fontSize: 12 }}
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="primary" icon={<LinkOutlined />} onClick={() => handleAtMaterial(selectedResource)}>
                    @该素材
                  </Button>
                  {selectedResource.mediaType === "image" && selectedResource.url && (
                    <Button onClick={() => handleUseForCurrentShot(selectedResource, "start_frame")}>
                      用于当前镜头起始帧
                    </Button>
                  )}
                  {selectedResource.mediaType === "image" && selectedResource.url && (
                    <Button onClick={() => handleUseForCurrentShot(selectedResource, "end_frame")}>
                      用于当前镜头结束帧
                    </Button>
                  )}
                  {selectedResource.mediaType === "image" && (
                    <Button onClick={() => void handleAssignSemanticRole(selectedResource, "character_ref")}>
                      角色锚点
                    </Button>
                  )}
                  {(selectedResource.mediaType === "image" || selectedResource.mediaType === "video") && (
                    <Button onClick={() => void handleAssignSemanticRole(selectedResource, "empty_shot_ref")}>
                      空镜锚点
                    </Button>
                  )}
                  {selectedResource.mediaType === "video" && selectedResource.url && (
                    <Button icon={<ScissorOutlined />} onClick={() => handleQueueClip(selectedResource)}>
                      加入时间线
                    </Button>
                  )}
                  {selectedResource.mediaType === "image" && selectedResource.url && (
                    <Button icon={<BgColorsOutlined />} onClick={() => handleSetStyleRef(selectedResource)}>
                      设为新风格
                    </Button>
                  )}
                  <Button
                    icon={<SyncOutlined />}
                    type="default"
                    loading={rerolling}
                    onClick={() => void handleRerollFromDetail()}
                    disabled={selectedResource.mediaType === "json"}
                  >
                    重 roll
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        title={editingItem?.title ?? "编辑 JSON"}
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        styles={{ wrapper: { width: 520 } }}
        extra={(
          <Button type="primary" size="small" onClick={() => void handleSave()} loading={isSaving}>
            保存
          </Button>
        )}
      >
        <Input.TextArea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoSize={{ minRows: 20, maxRows: 40 }}
          style={{ fontFamily: "monospace", fontSize: 12 }}
        />
      </Drawer>
    </>
  );
}
