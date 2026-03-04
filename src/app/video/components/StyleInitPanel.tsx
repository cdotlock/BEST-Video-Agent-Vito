"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
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
}

export function StyleInitPanel({
  projectId,
  sequenceId,
  sequenceKey,
  memoryUser,
  onInjectMessage,
}: StyleInitPanelProps) {
  const screens = Grid.useBreakpoint();
  const drawerWidth: number | string = screens.lg ? 960 : "100%";
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    if (!open) return;
    void loadProfiles();
    void loadRecommendations();
  }, [open, loadProfiles, loadRecommendations]);

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
      setOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setApplyingProfile(false);
    }
  }, [applyProfileToSequence, buildInjectInstruction, onInjectMessage, reverseResult?.profile]);

  const handleApplySavedProfile = useCallback(async (profile: StyleProfile) => {
    setError(null);
    setApplyingProfile(true);
    try {
      await applyProfileToSequence(profile);
      onInjectMessage(buildInjectInstruction(profile));
      setOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setApplyingProfile(false);
    }
  }, [applyProfileToSequence, buildInjectInstruction, onInjectMessage]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
        <div className="min-w-0">
          <Typography.Text strong style={{ fontSize: 12 }}>Style Init</Typography.Text>
          <div className="text-[10px] text-slate-500">
            Search references, reverse prompts, save profile.
          </div>
        </div>
        <Button
          size="small"
          icon={<BgColorsOutlined />}
          onClick={() => setOpen(true)}
          disabled={!sequenceId || !sequenceKey}
        >
          Open
        </Button>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Style Initialization"
        width={drawerWidth}
      >
        <div className="space-y-3">
          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          <Card size="small" title="1) Search Public Gallery">
            {recommendations && recommendations.totalPreferenceItems > 0 && (
              <div className="mb-2 rounded border border-emerald-300/50 bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-900">
                <div className="font-medium">Memory Defaults (Auto-on)</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {recommendations.preferredStyleTokens.slice(0, 6).map((token) => (
                    <Tag key={token} color="green">{token}</Tag>
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
                Search
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
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No references yet" />
              )}
            </div>
          </Card>

          <Card size="small" title="2) Reverse Prompt + Save Profile">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                placeholder="Profile name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Input
                placeholder="Creative goal (optional)"
                value={creativeGoal}
                onChange={(e) => setCreativeGoal(e.target.value)}
              />
              <Button
                type="primary"
                loading={reversing}
                onClick={() => void handleReverse()}
                disabled={selectedReferenceItems.length === 0}
              >
                Reverse & Save ({selectedReferenceItems.length})
              </Button>
            </div>

            {reverseResult && (
              <div className="mt-3 space-y-2 rounded border border-slate-200 bg-slate-50 p-3">
                <Typography.Text strong style={{ fontSize: 12 }}>Tokens</Typography.Text>
                <div className="flex flex-wrap gap-1.5">
                  {reverseResult.styleTokens.map((token) => (
                    <Tag key={token}>{token}</Tag>
                  ))}
                </div>
                <Typography.Paragraph copyable style={{ marginBottom: 0, whiteSpace: "pre-wrap", fontSize: 12 }}>
                  Positive: {reverseResult.positivePrompt}
                </Typography.Paragraph>
                <Typography.Paragraph copyable style={{ marginBottom: 0, whiteSpace: "pre-wrap", fontSize: 12 }}>
                  Negative: {reverseResult.negativePrompt}
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
                  Apply To Chat
                </Button>
              </div>
            )}
          </Card>

          <Card
            size="small"
            title="Saved Profiles"
            extra={
              <Button size="small" loading={loadingProfiles} onClick={() => void loadProfiles()}>
                Refresh
              </Button>
            }
          >
            {profiles.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No saved profiles" />
            ) : (
              <div className="space-y-2">
                {profiles.slice(0, 6).map((profile) => (
                  <div key={profile.id} className="rounded border border-slate-200 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <Typography.Text strong style={{ fontSize: 12 }} ellipsis>
                        {profile.name}
                      </Typography.Text>
                      <Tag>{profile.styleTokens.length} tokens</Tag>
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
                        Apply
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
