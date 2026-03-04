"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Empty,
  Spin,
  Typography,
  Button,
  ConfigProvider,
  Input,
  App,
} from "antd";
import {
  ReloadOutlined,
  VideoCameraOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { fetchJson, getErrorMessage } from "@/app/components/client-utils";
import type { ProjectSummary } from "./types";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function VideoNovelListPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchJson<ProjectSummary[]>("/api/video/projects");
      setProjects(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleSelect = (project: ProjectSummary) => {
    router.push(`/video/${project.id}?name=${encodeURIComponent(project.name)}`);
  };

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
      void message.error(getErrorMessage(err, "Failed to create project"));
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
      void message.error(getErrorMessage(err, "Failed to delete project"));
    }
  }, [loadProjects, message]);

  const handleCreateFromEnter = useCallback((ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      void handleCreate();
    }
  }, [handleCreate]);

  const handleCreateFromButton = useCallback(() => {
    void handleCreate();
  }, [handleCreate]);

  const handleReload = useCallback(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleDeleteClick = useCallback((event: React.MouseEvent, projectId: string) => {
    event.stopPropagation();
    void handleDelete(projectId);
  }, [handleDelete]);

  const renderProjectSize = (description: string | null): string => {
    if (!description) return "No description";
    const trimmed = description.trim();
    if (trimmed.length === 0) return "No description";
    return trimmed;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#ffffff",
          colorBorder: "#e5e7eb",
          borderRadius: 10,
        },
      }}
    >
      <main className="flex h-screen w-full flex-col bg-[#f7f8fa] text-slate-900">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <VideoCameraOutlined style={{ fontSize: 20, color: "#2563eb" }} />
            <div>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Video Projects
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Create and manage universal video projects
              </Typography.Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              size="small"
              placeholder="New project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleCreateFromEnter}
              style={{ width: 220 }}
              disabled={isCreating}
            />
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateFromButton}
              loading={isCreating}
              disabled={newName.trim().length === 0}
            >
              New
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReload}
              loading={isLoading}
            >
              Refresh
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spin description="Loading projects…" size="large" />
            </div>
          ) : projects.length === 0 ? (
            <Empty description="No projects found" style={{ marginTop: 80 }} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  hoverable
                  onClick={() => handleSelect(project)}
                  styles={{
                    body: { padding: 16 },
                  }}
                  style={{
                    background: "#ffffff",
                    borderColor: "#e5e7eb",
                  }}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Typography.Text strong style={{ fontSize: 14 }}>
                      {project.name}
                    </Typography.Text>
                    <Button
                      size="small"
                      danger
                      onClick={(e) => handleDeleteClick(e, project.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <Typography.Text strong style={{ fontSize: 14 }}>
                    {renderProjectSize(project.description)}
                  </Typography.Text>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>ID: {project.id.slice(0, 8)}…</span>
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </ConfigProvider>
  );
}
