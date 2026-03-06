"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Empty,
  Input,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  RocketOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { fetchJson, getErrorMessage } from "@/app/components/client-utils";
import type { ProjectSummary } from "./types";
import { videoWorkspaceTheme } from "./theme";

function sortByUpdatedAt(items: ProjectSummary[]): ProjectSummary[] {
  return [...items].sort((a, b) => {
    const left = new Date(a.updatedAt).getTime();
    const right = new Date(b.updatedAt).getTime();
    return right - left;
  });
}

function deriveProjectName(idea: string): string {
  const normalized = idea.replace(/\s+/g, " ").trim();
  if (normalized.length <= 28) return normalized;
  return `${normalized.slice(0, 28)}...`;
}

export default function VideoProjectHomePage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [ideaInput, setIdeaInput] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchJson<ProjectSummary[]>("/api/video/projects");
      setProjects(sortByUpdatedAt(data));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "加载项目失败"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return projects;
    return projects.filter((item) => {
      const name = item.name.toLowerCase();
      const desc = (item.description ?? "").toLowerCase();
      return name.includes(needle) || desc.includes(needle);
    });
  }, [projects, query]);

  const latestProject = useMemo(() => filteredProjects[0] ?? null, [filteredProjects]);

  const handleSelect = useCallback((project: ProjectSummary) => {
    router.push(`/video/${project.id}?name=${encodeURIComponent(project.name)}`);
  }, [router]);

  const handleCreateFromIdea = useCallback(async () => {
    const idea = ideaInput.trim();
    if (!idea) return;

    const projectName = deriveProjectName(idea);
    setIsCreating(true);
    try {
      const created = await fetchJson<{ id: string }>("/api/video/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName, description: idea }),
      });
      setIdeaInput("");
      await loadProjects();
      router.push(
        `/video/${created.id}?name=${encodeURIComponent(projectName)}&idea=${encodeURIComponent(idea)}`,
      );
    } catch (err: unknown) {
      void message.error(getErrorMessage(err, "创建项目失败"));
    } finally {
      setIsCreating(false);
    }
  }, [ideaInput, loadProjects, message, router]);

  const handleDelete = useCallback(async (projectId: string) => {
    try {
      await fetchJson(`/api/video/projects/${encodeURIComponent(projectId)}`, {
        method: "DELETE",
      });
      await loadProjects();
    } catch (err: unknown) {
      void message.error(getErrorMessage(err, "删除项目失败"));
    }
  }, [loadProjects, message]);

  return (
    <ConfigProvider theme={videoWorkspaceTheme}>
      <main className="ceramic-page flex h-screen w-full flex-col text-[var(--af-text)]">
        <div className="px-4 pt-4">
          <header className="ceramic-topbar px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <VideoCameraOutlined style={{ fontSize: 20, color: "var(--af-brand)" }} />
              <div>
                <Typography.Title level={4} style={{ margin: 0, color: "var(--af-text)" }}>
                  BEST Video Agent
                </Typography.Title>
                <Typography.Text style={{ fontSize: 12, color: "var(--af-muted)" }}>
                  一句话开始创作，Agent 自动规划并执行
                </Typography.Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {latestProject && (
                <Button
                  icon={<RocketOutlined />}
                  onClick={() => handleSelect(latestProject)}
                >
                  继续最近故事
                </Button>
              )}
              <Button icon={<ReloadOutlined />} onClick={() => void loadProjects()} loading={isLoading}>
                刷新
              </Button>
            </div>
          </div>
          </header>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-6">
          {error && (
            <div className="mx-auto mb-4 max-w-4xl rounded-[22px] border border-[rgba(198,90,75,0.24)] bg-[rgba(255,245,244,0.9)] px-4 py-2 text-sm text-[#a04438]">
              {error}
            </div>
          )}

          <section className="mx-auto max-w-4xl">
            <Card className="ceramic-panel ceramic-panel--raised !border-transparent" styles={{ body: { padding: 24 } }}>
              <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 8, textAlign: "center", color: "var(--af-text)" }}>
                你想创建什么视频？
              </Typography.Title>
              <Typography.Paragraph style={{ textAlign: "center", marginBottom: 16, color: "var(--af-muted)" }}>
                直接说目标，系统会自动拆解工作流、匹配风格并开始创作。
              </Typography.Paragraph>

              <Input.TextArea
                value={ideaInput}
                onChange={(event) => setIdeaInput(event.target.value)}
                placeholder="说一句你想创作的视频内容，例如：做一个治愈系咖啡品牌短片，镜头柔和，氛围温暖。"
                autoSize={{ minRows: 4, maxRows: 8 }}
                onPressEnter={(event) => {
                  if (event.shiftKey) return;
                  event.preventDefault();
                  void handleCreateFromIdea();
                }}
                style={{ fontSize: 15 }}
              />
              <div className="mt-3 flex justify-center">
                <Button
                  type="primary"
                  size="large"
                  loading={isCreating}
                  disabled={ideaInput.trim().length === 0}
                  onClick={() => void handleCreateFromIdea()}
                >
                  开始创作
                </Button>
              </div>
            </Card>
          </section>

          <section className="mx-auto mt-6 max-w-6xl">
            <div className="mb-3 flex items-center justify-between">
              <Typography.Title level={5} style={{ margin: 0, color: "var(--af-text)" }}>已创建故事</Typography.Title>
              <Input
                allowClear
                placeholder="搜索故事"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                style={{ width: 260 }}
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-14">
                <Spin size="large" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card className="ceramic-panel !border-transparent">
                <Empty
                  description={projects.length === 0 ? "还没有故事，先输入一句话开始创作。" : "没有匹配的故事"}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    size="small"
                    className="ceramic-panel !border-transparent"
                    title={(
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate">{project.name}</span>
                        <Tag color="green" style={{ margin: 0 }}>
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </Tag>
                      </div>
                    )}
                    extra={(
                      <Button
                        danger
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => void handleDelete(project.id)}
                      />
                    )}
                  >
                    <div className="line-clamp-3 min-h-[52px] text-[12px] text-slate-600">
                      {project.description?.trim() || "暂无描述"}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button type="primary" size="small" onClick={() => handleSelect(project)}>
                        继续创作
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </ConfigProvider>
  );
}
