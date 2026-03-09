"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Checkbox,
  Drawer,
  Empty,
  Grid,
  Input,
  Select,
  Spin,
  Tag,
  Typography,
} from "antd";
import { SearchOutlined, BgColorsOutlined, SendOutlined } from "@ant-design/icons";
import { fetchJson } from "@/app/components/client-utils";
import type {
  MemoryRecommendations,
  PublicImageProvider,
  StyleProfile,
  StyleReference,
  StyleReverseResult,
  StyleSearchResult,
  WorkflowPathRecommendation,
  WorkflowPathRecommendationsResult,
} from "../types";

const DEFAULT_PROVIDERS: PublicImageProvider[] = ["unsplash", "pexels", "pixabay"];

function refId(ref: StyleReference): string {
  return `${ref.source}:${ref.sourceId}`;
}

export interface StyleInitPanelProps {
  projectId: string;
  sequenceId: string | null;
  sequenceKey: string | null;
  memoryUser: string;
  onInjectMessage: (message: string) => void;
  openSignal?: number;
  onOpenChange?: (open: boolean) => void;
  showInlineTrigger?: boolean;
}

export function StyleInitPanel({
  projectId,
  sequenceId,
  sequenceKey,
  memoryUser,
  onInjectMessage,
  openSignal,
  onOpenChange,
  showInlineTrigger = true,
}: StyleInitPanelProps) {
  const { message } = App.useApp();
  const screens = Grid.useBreakpoint();
  const drawerWidth: number | string = screens.lg ? 960 : "100%";
  const [open, setOpen] = useState(false);
  const [isPathReviewing, setIsPathReviewing] = useState(false);
  const [query, setQuery] = useState("");
  const [profileName, setProfileName] = useState("");
  const [creativeGoal, setCreativeGoal] = useState("");
  const [providers, setProviders] = useState<PublicImageProvider[]>(DEFAULT_PROVIDERS);

  const [searching, setSearching] = useState(false);
  const [reversing, setReversing] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [applyingProfile, setApplyingProfile] = useState(false);

  const [searchResult, setSearchResult] = useState<StyleSearchResult | null>(null);
  const [reverseResult, setReverseResult] = useState<StyleReverseResult | null>(null);
  const [profiles, setProfiles] = useState<StyleProfile[]>([]);
  const [recommendations, setRecommendations] = useState<MemoryRecommendations | null>(null);
  const [pathRecommendations, setPathRecommendations] = useState<WorkflowPathRecommendation[]>([]);
  const [selectedRefs, setSelectedRefs] = useState<Set<string>>(new Set<string>());
  const [error, setError] = useState<string | null>(null);

  const selectedReferenceItems = useMemo(
    () => (searchResult?.items ?? []).filter((item) => selectedRefs.has(refId(item))),
    [searchResult?.items, selectedRefs],
  );

  const loadProfiles = useCallback(async () => {
    setLoadingProfiles(true);
    try {
      const data = await fetchJson<StyleProfile[]>(
        `/api/video/style/profiles?projectId=${encodeURIComponent(projectId)}`,
      );
      setProfiles(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoadingProfiles(false);
    }
  }, [projectId]);

  const loadRecommendations = useCallback(async () => {
    try {
      const data = await fetchJson<MemoryRecommendations>(
        `/api/video/memory/recommendations?memoryUser=${encodeURIComponent(memoryUser)}`,
      );
      setRecommendations(data);
      setQuery((prev) => (prev.trim().length === 0 && data.queryHint ? data.queryHint : prev));
      setProviders((prev) => {
        const isDefault = prev.length === DEFAULT_PROVIDERS.length
          && DEFAULT_PROVIDERS.every((provider) => prev.includes(provider));
        if (!isDefault) return prev;
        if (data.preferredProviders.length === 0) return prev;
        return data.preferredProviders;
      });
    } catch {
      // best effort: recommendations are optional
    }
  }, [memoryUser]);

  const loadPathRecommendations = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        memoryUser,
      });
      if (creativeGoal.trim().length > 0) {
        params.set("goal", creativeGoal.trim());
      }
      const data = await fetchJson<WorkflowPathRecommendationsResult>(
        `/api/video/memory/path-recommendations?${params.toString()}`,
      );
      setPathRecommendations(data.recommendations);
    } catch {
      setPathRecommendations([]);
    }
  }, [creativeGoal, memoryUser]);

  useEffect(() => {
    if (!open) return;
    void loadProfiles();
    void loadRecommendations();
    void loadPathRecommendations();
  }, [open, loadPathRecommendations, loadProfiles, loadRecommendations]);

  useEffect(() => {
    if (openSignal === undefined) return;
    setOpen(true);
  }, [openSignal]);

  const changeOpen = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }, [onOpenChange]);

  const handleSearch = useCallback(async () => {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setError("请输入搜索关键词");
      return;
    }

    setError(null);
    setSearching(true);
    setSearchResult(null);
    setSelectedRefs(new Set<string>());
    setReverseResult(null);

    try {
      const data = await fetchJson<StyleSearchResult>("/api/video/style/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: cleanQuery,
          providers,
          page: 1,
          perPage: 18,
        }),
      });
      setSearchResult(data);
      if (!profileName.trim()) {
        setProfileName(cleanQuery.replace(/\s+/g, "_").slice(0, 40) || "style_profile");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSearching(false);
    }
  }, [profileName, providers, query]);

  const toggleReference = useCallback((item: StyleReference) => {
    const id = refId(item);
    setSelectedRefs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleReverse = useCallback(async () => {
    if (!profileName.trim()) {
      setError("请填写风格档案名称");
      return;
    }

    if (selectedReferenceItems.length === 0) {
      setError("请至少选择 1 张参考图");
      return;
    }

    setError(null);
    setReversing(true);
    try {
      const data = await fetchJson<StyleReverseResult>("/api/video/style/reverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          memoryUser,
          sequenceKey,
          profileName: profileName.trim(),
          query: query.trim() || null,
          creativeGoal: creativeGoal.trim() || null,
          references: selectedReferenceItems,
          saveProfile: true,
        }),
      });

      setReverseResult(data);
      const profile = data.profile;
      if (profile) {
        setProfiles((prev) => [profile, ...prev.filter((p) => p.id !== profile.id)]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setReversing(false);
    }
  }, [creativeGoal, memoryUser, profileName, projectId, query, selectedReferenceItems, sequenceKey]);

  const applyProfileToSequence = useCallback(async (profile: StyleProfile) => {
    if (!sequenceId || !sequenceKey) {
      throw new Error("请先选择序列");
    }
    await fetchJson(`/api/video/sequences/${encodeURIComponent(sequenceId)}/style-profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        sequenceKey,
        profileId: profile.id,
        memoryUser,
      }),
    });
  }, [memoryUser, projectId, sequenceId, sequenceKey]);

  const buildInjectInstruction = useCallback((profile: StyleProfile): string => {
    const tokenText = profile.styleTokens.join(", ");
    return [
      `请将风格档案 \"${profile.name}\" 应用于当前序列。`,
      `sequence_key=${sequenceKey ?? "unknown"}`,
      `style_profile_id=${profile.id}`,
      `style_tokens=${tokenText}`,
      `positive_prompt=${profile.positivePrompt}`,
      `negative_prompt=${profile.negativePrompt}`,
      "请按 Base / Style / Content / Task 四层 Prompt 组装继续推进。",
      "请继续按当前执行模式推进。",
    ].join("\n");
  }, [sequenceKey]);

  const handleInject = useCallback(async () => {
    const profile = reverseResult?.profile;
    if (!profile) {
      setError("请先完成风格反推并保存 profile");
      return;
    }

    setError(null);
    setApplyingProfile(true);
    try {
      await applyProfileToSequence(profile);
      onInjectMessage(buildInjectInstruction(profile));
      changeOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setApplyingProfile(false);
    }
  }, [applyProfileToSequence, buildInjectInstruction, changeOpen, onInjectMessage, reverseResult?.profile]);

  const handleApplySavedProfile = useCallback(async (profile: StyleProfile) => {
    setError(null);
    setApplyingProfile(true);
    try {
      await applyProfileToSequence(profile);
      onInjectMessage(buildInjectInstruction(profile));
      changeOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setApplyingProfile(false);
    }
  }, [applyProfileToSequence, buildInjectInstruction, changeOpen, onInjectMessage]);

  const sendPathReview = useCallback(async (
    pathId: string,
    score: number,
    note: string,
  ) => {
    setIsPathReviewing(true);
    try {
      await fetchJson("/api/video/memory/path-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memoryUser,
          projectId,
          sequenceKey,
          pathId,
          score,
          note,
        }),
      });
    } finally {
      setIsPathReviewing(false);
    }
  }, [memoryUser, projectId, sequenceKey]);

  const handleAdoptPath = useCallback(async (path: WorkflowPathRecommendation) => {
    const instruction = [
      `请采用推荐路径：${path.pathId}（${path.title}）`,
      `sequence_key=${sequenceKey ?? "unknown"}`,
      "请按以下步骤执行：",
      ...path.steps.map((step, index) => `${index + 1}. ${step}`),
      "若当前模式为 YOLO，请直接执行；若为 Checkpoint，请在关键高成本动作前确认。",
    ].join("\n");

    try {
      await sendPathReview(path.pathId, 1, "adopted_from_style_init");
      onInjectMessage(instruction);
      void message.success("已采用推荐路径并注入对话。");
      changeOpen(false);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : String(err);
      void message.error(`路径应用失败: ${errorText}`);
    }
  }, [changeOpen, message, onInjectMessage, sendPathReview, sequenceKey]);

  const handleRejectPath = useCallback(async (path: WorkflowPathRecommendation) => {
    try {
      await sendPathReview(path.pathId, -0.5, "dismissed_from_style_init");
      setPathRecommendations((prev) => prev.filter((item) => item.pathId !== path.pathId));
      void message.success("已记录为不偏好路径。");
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : String(err);
      void message.error(`记录失败: ${errorText}`);
    }
  }, [message, sendPathReview]);

  return (
    <>
      {showInlineTrigger && (
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
          <div className="min-w-0">
            <Typography.Text strong style={{ fontSize: 12 }}>风格初始化</Typography.Text>
            <div className="text-[10px] text-slate-500">
              搜图、反推、保存并应用风格档案。
            </div>
          </div>
          <Button
            size="small"
            icon={<BgColorsOutlined />}
            onClick={() => changeOpen(true)}
            disabled={!sequenceId || !sequenceKey}
          >
            打开
          </Button>
        </div>
      )}

      <Drawer
        open={open}
        onClose={() => changeOpen(false)}
        title="风格初始化"
        size={drawerWidth}
      >
        <div className="space-y-3">
          {error && (
            <Alert
              type="error"
              title={error}
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          <Card size="small" title="1) 搜索公共图库">
            {recommendations && recommendations.totalPreferenceItems > 0 && (
              <div className="mb-2 rounded border border-emerald-300/50 bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-900">
                <div className="font-medium">长期记忆默认项（自动启用）</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {recommendations.preferredStyleTokens.slice(0, 6).map((token) => (
                    <Tag key={token} color="green">{token}</Tag>
                  ))}
                </div>
                {recommendations.preferredWorkflowPaths.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {recommendations.preferredWorkflowPaths.slice(0, 3).map((path) => (
                      <Tag key={path} color="blue">{path}</Tag>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pathRecommendations.length > 0 && (
              <div className="mb-2 rounded border border-blue-200 bg-blue-50 px-2 py-1.5 text-[11px] text-blue-950">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium">路径推荐（可直接采用）</span>
                  <Button
                    size="small"
                    type="text"
                    onClick={() => void loadPathRecommendations()}
                    loading={isPathReviewing}
                  >
                    刷新
                  </Button>
                </div>
                <div className="space-y-2">
                  {pathRecommendations.slice(0, 3).map((path) => (
                    <div key={path.pathId} className="rounded border border-blue-200 bg-white px-2 py-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{path.title}</div>
                          <div className="truncate text-[10px] text-blue-700">{path.pathId} · score {path.score}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => void handleAdoptPath(path)}
                            loading={isPathReviewing}
                          >
                            采用
                          </Button>
                          <Button
                            size="small"
                            onClick={() => void handleRejectPath(path)}
                            loading={isPathReviewing}
                          >
                            跳过
                          </Button>
                        </div>
                      </div>
                      {path.why.length > 0 && (
                        <div className="mt-1 text-[10px] text-blue-700">
                          {path.why.join(" · ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                placeholder="e.g. cinematic cyberpunk rainy street"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Select<PublicImageProvider[]>
                mode="multiple"
                value={providers}
                options={[
                  { value: "unsplash", label: "Unsplash" },
                  { value: "pexels", label: "Pexels" },
                  { value: "pixabay", label: "Pixabay" },
                ]}
                onChange={(value) => setProviders(value.length > 0 ? value : DEFAULT_PROVIDERS)}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                loading={searching}
                onClick={() => void handleSearch()}
              >
                搜索
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {(searchResult?.providers ?? []).map((p) => (
                <Tag key={p.provider} color={p.status === "ok" ? "green" : p.status === "skipped" ? "orange" : "red"}>
                  {p.provider}: {p.count}
                </Tag>
              ))}
            </div>

            <div className="mt-3">
              {searching ? (
                <div className="py-8 text-center"><Spin /></div>
              ) : searchResult && searchResult.items.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {searchResult.items.map((item) => {
                    const checked = selectedRefs.has(refId(item));
                    return (
                      <button
                        key={refId(item)}
                        type="button"
                        className={`overflow-hidden rounded border text-left transition ${
                          checked ? "border-emerald-400" : "border-slate-200"
                        }`}
                        onClick={() => toggleReference(item)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbUrl ?? item.imageUrl}
                          alt={item.title ?? item.sourceId}
                          className="h-28 w-full object-cover"
                        />
                        <div className="space-y-1 p-2">
                          <div className="line-clamp-2 text-[11px] text-slate-700">
                            {item.title || item.tags.slice(0, 3).join(", ") || "Untitled"}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>{item.source}</span>
                            <Checkbox checked={checked} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无参考图" />
              )}
            </div>
          </Card>

          <Card size="small" title="2) 反推 Prompt 并保存档案">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                placeholder="风格档案名"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Input
                placeholder="Creative goal (optional)"
                value={creativeGoal}
                onChange={(e) => {
                  setCreativeGoal(e.target.value);
                }}
              />
              <Button
                type="primary"
                loading={reversing}
                onClick={() => void handleReverse()}
                disabled={selectedReferenceItems.length === 0}
              >
                反推并保存 ({selectedReferenceItems.length})
              </Button>
            </div>

            {reverseResult && (
              <div className="mt-3 space-y-2 rounded border border-slate-200 bg-slate-50 p-3">
                <Typography.Text strong style={{ fontSize: 12 }}>风格关键词</Typography.Text>
                <div className="flex flex-wrap gap-1.5">
                  {reverseResult.styleTokens.map((token) => (
                    <Tag key={token}>{token}</Tag>
                  ))}
                </div>
                <Typography.Paragraph copyable style={{ marginBottom: 0, whiteSpace: "pre-wrap", fontSize: 12 }}>
                  正向提示词: {reverseResult.positivePrompt}
                </Typography.Paragraph>
                <Typography.Paragraph copyable style={{ marginBottom: 0, whiteSpace: "pre-wrap", fontSize: 12 }}>
                  负向提示词: {reverseResult.negativePrompt}
                </Typography.Paragraph>
                <div className="text-[11px] text-slate-500">
                  {reverseResult.analysis.summary} (confidence {reverseResult.analysis.confidence})
                </div>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => void handleInject()}
                  loading={applyingProfile}
                >
                  应用并注入对话
                </Button>
              </div>
            )}
          </Card>

          <Card
            size="small"
            title="已保存风格档案"
            extra={
              <Button size="small" loading={loadingProfiles} onClick={() => void loadProfiles()}>
                刷新
              </Button>
            }
          >
            {profiles.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无已保存风格档案" />
            ) : (
              <div className="space-y-2">
                {profiles.slice(0, 6).map((profile) => (
                  <div key={profile.id} className="rounded border border-slate-200 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <Typography.Text strong style={{ fontSize: 12 }} ellipsis>
                        {profile.name}
                      </Typography.Text>
                      <Tag>{profile.styleTokens.length} 个关键词</Tag>
                    </div>
                    <div className="mt-1 line-clamp-2 text-[11px] text-slate-500">
                      {profile.styleTokens.join(", ")}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        size="small"
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={() => void handleApplySavedProfile(profile)}
                        loading={applyingProfile}
                      >
                        应用
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </Drawer>
    </>
  );
}
