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
  List,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  RocketOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { fetchJson, getErrorMessage } from "@/app/components/client-utils";
import type { ProjectSummary } from "./types";

function sortByUpdatedAt(items: ProjectSummary[]): ProjectSummary[] {
  return [...items].sort((a, b) => {
    const left = new Date(a.updatedAt).getTime();
    const right = new Date(b.updatedAt).getTime();
    return right - left;
  });
}

export default function VideoProjectHomePage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
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

  const handleCreate = useCallback(async () => {
    const name = newName.trim();
    if (!name) return;
    setIsCreating(true);
    try {
      const created = await fetchJson<{ id: string }>("/api/video/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: null }),
      });
      setNewName("");
      await loadProjects();
      router.push(`/video/${created.id}?name=${encodeURIComponent(name)}`);
    } catch (err: unknown) {
      void message.error(getErrorMessage(err, "创建项目失败"));
    } finally {
      setIsCreating(false);
    }
  }, [loadProjects, message, newName, router]);

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
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f5f7fa",
          colorBorder: "#e5e7eb",
          borderRadius: 12,
          fontFamily: "\"IBM Plex Sans\", \"Noto Sans SC\", \"PingFang SC\", sans-serif",
        },
      }}
    >
      <main className="flex h-screen w-full flex-col bg-[#f5f7fa] text-slate-900">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <VideoCameraOutlined style={{ fontSize: 20, color: "#2563eb" }} />
              <div>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  BEST Video Agent
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  白色高效视频工作台：项目管理、风格初始化、分镜与剪辑一体化
                </Typography.Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button icon={<ReloadOutlined />} onClick={() => void loadProjects()} loading={isLoading}>
                刷新
              </Button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <section className="space-y-4 xl:col-span-2">
              <Card size="small" title="快速创建项目">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr,auto]">
                  <Input
                    placeholder="输入项目名称，例如：品牌宣传片 Q2"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onPressEnter={() => void handleCreate()}
                    disabled={isCreating}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => void handleCreate()}
                    loading={isCreating}
                    disabled={newName.trim().length === 0}
                  >
                    创建并进入
                  </Button>
                </div>
              </Card>

              <Card
                size="small"
                title="项目列表"
                extra={<Tag>{filteredProjects.length} 项</Tag>}
              >
                <div className="mb-3">
                  <Input
                    allowClear
                    placeholder="搜索项目名称/描述"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Spin size="large" />
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <Empty
                    description={projects.length === 0 ? "还没有项目，先创建一个。" : "没有匹配的项目"}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <List
                    dataSource={filteredProjects}
                    renderItem={(project) => (
                      <List.Item
                        key={project.id}
                        actions={[
                          <Button key="open" type="link" onClick={() => handleSelect(project)}>
                            打开
                          </Button>,
                          <Button
                            key="delete"
                            danger
                            type="link"
                            onClick={() => void handleDelete(project.id)}
                          >
                            删除
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <div className="flex items-center gap-2">
                              <Typography.Text strong>{project.name}</Typography.Text>
                              <Tag color="blue" style={{ margin: 0 }}>
                                {new Date(project.updatedAt).toLocaleDateString()}
                              </Tag>
                            </div>
                          }
                          description={project.description?.trim() || "无描述"}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </section>

            <section className="space-y-4">
              <Card size="small" title="工作台状态">
                <div className="grid grid-cols-2 gap-2">
                  <Statistic title="项目总数" value={projects.length} />
                  <Statistic title="当前可见" value={filteredProjects.length} />
                </div>
                {latestProject && (
                  <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-2.5">
                    <Typography.Text strong style={{ fontSize: 12 }}>
                      最近更新
                    </Typography.Text>
                    <div className="mt-1 text-[12px] text-slate-700">{latestProject.name}</div>
                    <Button
                      className="mt-2"
                      type="primary"
                      icon={<RocketOutlined />}
                      onClick={() => handleSelect(latestProject)}
                      block
                    >
                      继续创作
                    </Button>
                  </div>
                )}
              </Card>

              <Card size="small" title="新手 4 步">
                <div className="space-y-2 text-[12px] text-slate-700">
                  <div>1. 创建项目并进入。</div>
                  <div>2. 上传 `.md/.txt` 序列文件。</div>
                  <div>3. 在 Style Init 中搜图并反推风格。</div>
                  <div>4. 选择 YOLO/Checkpoint 后开始生成，再到 Clip 保存拼接计划。</div>
                </div>
                <Button
                  className="mt-3"
                  type="default"
                  block
                  onClick={() => {
                    if (latestProject) handleSelect(latestProject);
                  }}
                  disabled={!latestProject}
                >
                  打开最近项目开始
                </Button>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </ConfigProvider>
  );
}
