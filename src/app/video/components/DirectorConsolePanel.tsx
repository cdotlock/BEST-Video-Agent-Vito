"use client";

import { useMemo } from "react";
import { Button, Card, Tag, Typography } from "antd";
import {
  BgColorsOutlined,
  CompassOutlined,
  DeploymentUnitOutlined,
  ScissorOutlined,
} from "@ant-design/icons";
import type {
  DomainResources,
  ExecutionMode,
  VideoProConfig,
} from "../types";
import { inferReferenceRole, type VideoReferenceRole } from "@/lib/video/reference-roles";

export interface DirectorConsolePanelProps {
  resources: DomainResources | null;
  executionMode: ExecutionMode;
  memoryUser: string;
  proConfig: VideoProConfig;
  contextMaterialCount: number;
  styleReferenceCount: number;
  capabilitySkills?: string[];
  capabilityMcps?: string[];
  onInjectMessage?: (message: string) => void;
  onOpenStyle?: () => void;
  onOpenPro?: () => void;
  onSwitchToClip?: () => void;
}

interface QuickActionSpec {
  id: string;
  label: string;
  hint: string;
  onTrigger: (() => void) | null;
}

type RoleCountMap = Record<VideoReferenceRole, number>;

const ROLE_META: Array<{
  role: VideoReferenceRole;
  label: string;
  tone: "gold" | "blue" | "green" | "purple" | "cyan";
}> = [
  { role: "style_ref", label: "画风", tone: "gold" },
  { role: "scene_ref", label: "场景", tone: "green" },
  { role: "empty_shot_ref", label: "空镜", tone: "cyan" },
  { role: "character_ref", label: "角色", tone: "blue" },
  { role: "motion_ref", label: "动作", tone: "purple" },
  { role: "first_frame_ref", label: "首帧", tone: "gold" },
  { role: "last_frame_ref", label: "尾帧", tone: "gold" },
  { role: "storyboard_ref", label: "分镜", tone: "purple" },
  { role: "dialogue_ref", label: "对白", tone: "cyan" },
];

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

function summarizeStoryboardDensity(config: VideoProConfig): string {
  const text = `${config.workflowTemplate}\n${config.customKnowledge}`.toLowerCase();
  if (text.includes("九宫格") || text.includes("3x3")) return "九宫格探索";
  if (text.includes("四宫格") || text.includes("2x2")) return "四宫格探索";
  if (text.trim().length > 0) return "单张分镜";
  return "按不确定性动态决定";
}

function buildRoleCounts(resources: DomainResources | null): RoleCountMap {
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

function buildRouteTracks(
  config: VideoProConfig,
  roleCounts: RoleCountMap,
  imageCount: number,
  videoCount: number,
): string[] {
  const text = `${config.workflowTemplate}\n${config.customKnowledge}`.toLowerCase();
  const tracks = [
    `分镜密度: ${summarizeStoryboardDensity(config)}`,
    roleCounts.first_frame_ref > 0 && roleCounts.last_frame_ref > 0
      ? "视频路径: 首尾帧受控路线优先"
      : roleCounts.first_frame_ref > 0
        ? "视频路径: 首帧图生视频优先"
        : videoCount > 0 && imageCount > 0
          ? "视频路径: mixed refs 优先"
          : "视频路径: 先补关键锚点，再进入视频生成",
    roleCounts.character_ref > 0
      ? "角色策略: 已有角色锚点，可先保身份一致性"
      : "角色策略: 角色锚点仍偏弱，建议先补稳定人设",
    roleCounts.empty_shot_ref > 0
      ? "节奏策略: 已有空镜，可组织呼吸与转场"
      : "节奏策略: 空镜偏少，容易只剩主镜头堆叠",
  ];

  if (text.includes("对白") || text.includes("口播") || text.includes("dialogue")) {
    tracks.push("叙事策略: 先对白脚本，再让镜头围绕台词组织");
  }
  if (text.includes("粗剪") || text.includes("多候选") || videoCount >= 3) {
    tracks.push("交付策略: 保留多候选，进入粗剪再定稿");
  }
  return tracks.slice(0, 5);
}

function buildMissingAnchors(roleCounts: RoleCountMap, imageCount: number, videoCount: number): string[] {
  const missing: string[] = [];
  if (roleCounts.storyboard_ref === 0) missing.push("缺少分镜探索");
  if (roleCounts.style_ref === 0 && imageCount > 0) missing.push("可补 style_ref");
  if (roleCounts.character_ref === 0 && imageCount > 0) missing.push("可补角色锚点");
  if (roleCounts.empty_shot_ref === 0) missing.push("可补空镜节奏");
  if (roleCounts.first_frame_ref === 0 && imageCount > 0) missing.push("可补首帧参考");
  if (videoCount < 2) missing.push("视频候选仍偏少");
  return missing.slice(0, 5);
}

export function DirectorConsolePanel({
  resources,
  executionMode,
  memoryUser,
  proConfig,
  contextMaterialCount,
  styleReferenceCount,
  capabilitySkills = [],
  capabilityMcps = [],
  onInjectMessage,
  onOpenStyle,
  onOpenPro,
  onSwitchToClip,
}: DirectorConsolePanelProps) {
  const roleCounts = useMemo(() => buildRoleCounts(resources), [resources]);

  const mediaCounts = useMemo(() => {
    const totals = { image: 0, video: 0, json: 0 };
    if (!resources) return totals;
    for (const group of resources.categories) {
      for (const item of group.items) {
        if (item.mediaType === "image") totals.image += 1;
        else if (item.mediaType === "video") totals.video += 1;
        else if (item.mediaType === "json") totals.json += 1;
      }
    }
    return totals;
  }, [resources]);

  const routeTracks = useMemo(
    () => buildRouteTracks(proConfig, roleCounts, mediaCounts.image, mediaCounts.video),
    [mediaCounts.image, mediaCounts.video, proConfig, roleCounts],
  );

  const missingAnchors = useMemo(
    () => buildMissingAnchors(roleCounts, mediaCounts.image, mediaCounts.video),
    [mediaCounts.image, mediaCounts.video, roleCounts],
  );

  const quickActions = useMemo<QuickActionSpec[]>(() => {
    const actions: QuickActionSpec[] = [];

    if (roleCounts.storyboard_ref === 0 && onInjectMessage) {
      actions.push({
        id: "storyboard-grid",
        label: "补四宫格分镜",
        hint: "先扩探索面，再锁定镜头",
        onTrigger: () => onInjectMessage(
          "请基于当前项目与已绑定素材，先生成一轮四宫格分镜探索，明确关键镜头、节奏和画面关系，再进入后续生成。",
        ),
      });
    }

    if (roleCounts.first_frame_ref > 0 && roleCounts.last_frame_ref > 0 && onInjectMessage) {
      actions.push({
        id: "first-last",
        label: "走首尾帧路线",
        hint: "约束运动起止，提升稳定性",
        onTrigger: () => onInjectMessage(
          "请优先使用当前首帧与尾帧参考，生成 2 到 3 条首尾帧受控视频候选，并在 review_block 中比较动作连贯性与结尾稳定性。",
        ),
      });
    } else if (roleCounts.first_frame_ref > 0 && onInjectMessage) {
      actions.push({
        id: "first-frame",
        label: "走首帧视频",
        hint: "用现有首帧快速推进候选",
        onTrigger: () => onInjectMessage(
          "请优先使用当前首帧参考生成视频候选，明确镜头运动与节奏，并在 review_block 中判断是否还需要补尾帧或 mixed refs。",
        ),
      });
    }

    if (roleCounts.character_ref === 0 && mediaCounts.image > 0 && onInjectMessage) {
      actions.push({
        id: "character-pack",
        label: "补角色锚点",
        hint: "先稳身份，再做镜头变化",
        onTrigger: () => onInjectMessage(
          "请从当前图片素材中优先整理或生成角色锚点，稳定身份特征后，再进入分镜或视频生成。",
        ),
      });
    }

    if (roleCounts.empty_shot_ref === 0 && onInjectMessage) {
      actions.push({
        id: "empty-shot",
        label: "补空镜节奏",
        hint: "给镜头呼吸和过渡空间",
        onTrigger: () => onInjectMessage(
          "请优先补一组 scene_ref 和 empty_shot_ref，用于建立空间、气氛和转场节奏，不要只生成主体镜头。",
        ),
      });
    }

    if (mediaCounts.video >= 2) {
      actions.push({
        id: "rough-cut",
        label: "进入粗剪",
        hint: "把候选片段拉进 Clip Studio",
        onTrigger: onSwitchToClip ?? null,
      });
    }

    actions.push({
      id: "style",
      label: "管理风格",
      hint: "补 style_ref 与风格档案",
      onTrigger: onOpenStyle ?? null,
    });
    actions.push({
      id: "pro",
      label: "打开 Pro",
      hint: "调整知识、模板与记忆",
      onTrigger: onOpenPro ?? null,
    });

    return actions.slice(0, 6);
  }, [
    mediaCounts.image,
    mediaCounts.video,
    onInjectMessage,
    onOpenPro,
    onOpenStyle,
    onSwitchToClip,
    roleCounts.character_ref,
    roleCounts.empty_shot_ref,
    roleCounts.first_frame_ref,
    roleCounts.last_frame_ref,
    roleCounts.storyboard_ref,
  ]);

  return (
    <Card
      size="small"
      className="director-console-panel mx-3 mt-3 !border-transparent"
      styles={{ body: { padding: 14 } }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Typography.Text strong style={{ fontSize: 13, color: "var(--af-text)" }}>
            Director Console
          </Typography.Text>
          <div className="mt-1 text-[11px] text-[var(--af-muted)]">
            把路径、记忆、能力和素材缺口显式化，帮助你以导演方式驱动 Agent。
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Tag color={executionMode === "yolo" ? "green" : "gold"} style={{ margin: 0 }}>
            {executionMode === "yolo" ? "YOLO 自动推进" : "Checkpoint 对齐优先"}
          </Tag>
          <Tag style={{ margin: 0 }}>memory:{memoryUser}</Tag>
          {proConfig.enableSelfReview && <Tag color="blue" style={{ margin: 0 }}>self-review</Tag>}
          {proConfig.workflowTemplate.trim().length > 0 && <Tag color="purple" style={{ margin: 0 }}>workflow template</Tag>}
          {proConfig.customKnowledge.trim().length > 0 && <Tag color="cyan" style={{ margin: 0 }}>custom knowledge</Tag>}
        </div>
      </div>

      <div className="director-console-grid mt-3 grid grid-cols-1 gap-3 xl:grid-cols-4">
        <div className="director-signal-card">
          <div className="director-signal-header">
            <CompassOutlined />
            <span>运行态</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Tag style={{ margin: 0 }}>图片 {mediaCounts.image}</Tag>
            <Tag style={{ margin: 0 }}>视频 {mediaCounts.video}</Tag>
            <Tag style={{ margin: 0 }}>JSON {mediaCounts.json}</Tag>
            <Tag style={{ margin: 0 }}>上下文 {contextMaterialCount}</Tag>
            <Tag style={{ margin: 0 }}>风格参考 {styleReferenceCount}</Tag>
          </div>
          <div className="mt-3 text-[11px] text-[var(--af-muted)]">
            分镜策略当前倾向：{summarizeStoryboardDensity(proConfig)}
          </div>
        </div>

        <div className="director-signal-card">
          <div className="director-signal-header">
            <DeploymentUnitOutlined />
            <span>路径轨道</span>
          </div>
          <div className="mt-2 space-y-1.5 text-[11px] text-[var(--af-text)]">
            {routeTracks.map((track) => (
              <div key={track} className="director-line-item">{track}</div>
            ))}
          </div>
        </div>

        <div className="director-signal-card">
          <div className="director-signal-header">
            <BgColorsOutlined />
            <span>素材语义</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLE_META.map((item) => {
              const count = roleCounts[item.role];
              if (count === 0) return null;
              return (
                <Tag key={item.role} color={item.tone} style={{ margin: 0 }}>
                  {item.label} {count}
                </Tag>
              );
            })}
            {ROLE_META.every((item) => roleCounts[item.role] === 0) && (
              <Tag style={{ margin: 0 }}>尚未建立语义锚点</Tag>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {missingAnchors.map((item) => (
              <Tag key={item} color="red" style={{ margin: 0 }}>
                {item}
              </Tag>
            ))}
          </div>
        </div>

        <div className="director-signal-card">
          <div className="director-signal-header">
            <ScissorOutlined />
            <span>快速编排</span>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="director-action-button"
                onClick={action.onTrigger ?? undefined}
                disabled={!action.onTrigger}
              >
                <span className="font-medium">{action.label}</span>
                <span className="text-[10px] text-[var(--af-muted)]">{action.hint}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {(capabilitySkills.length > 0 || capabilityMcps.length > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[rgba(229,221,210,0.86)] pt-3 text-[11px]">
          <Typography.Text style={{ fontSize: 11, color: "var(--af-muted)" }}>
            Runtime Capsules
          </Typography.Text>
          {capabilitySkills.slice(0, 4).map((skill) => (
            <Tag key={`skill-${skill}`} color="green" style={{ margin: 0 }}>{skill}</Tag>
          ))}
          {capabilityMcps.slice(0, 4).map((mcp) => (
            <Tag key={`mcp-${mcp}`} color="blue" style={{ margin: 0 }}>{mcp}</Tag>
          ))}
          {(capabilitySkills.length > 4 || capabilityMcps.length > 4) && (
            <Tag style={{ margin: 0 }}>更多能力在 Pro 中查看</Tag>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="small" icon={<BgColorsOutlined />} onClick={onOpenStyle} disabled={!onOpenStyle}>
          Style
        </Button>
        <Button size="small" onClick={onOpenPro} disabled={!onOpenPro}>
          Pro
        </Button>
      </div>
    </Card>
  );
}
