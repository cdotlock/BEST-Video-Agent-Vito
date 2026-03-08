import type {
  MemoryRecommendations,
  RecommendWorkflowPathsResult,
  WorkflowPathId,
} from "@/lib/services/video-memory-service";
import type { DomainResources } from "@/lib/services/video-workflow-service";
import { inferReferenceRole } from "@/lib/video/reference-roles";

export interface WorkflowGraphSignals {
  executionMode: "checkpoint" | "yolo";
  checkpointAlignmentRequired: boolean;
  enableSelfReview: boolean;
  hasStyleProfile: boolean;
  hasSequenceContent: boolean;
  storyboardDensity: "single" | "grid_2x2" | "grid_3x3" | null;
  hasImageReference: boolean;
  hasReferenceVideo: boolean;
  hasFirstFrameReference: boolean;
  hasLastFrameReference: boolean;
  wantsMultiClip: boolean;
  prefersCharacterPriority: boolean;
  prefersEmptyShotPriority: boolean;
  needsDialogue: boolean;
  customKnowledge: boolean;
  workflowTemplate: boolean;
}

export interface WorkflowGraphNode {
  id: string;
  title: string;
  status: "ready" | "active" | "blocked" | "optional";
  why: string[];
  predecessors: string[];
  candidatePaths: string[];
  preferredTools: string[];
  reviewGate: string;
}

export interface WorkflowGraphSnapshot {
  summary: string;
  activeNodeId: string;
  activePathIds: WorkflowPathId[];
  suggestedNext: string[];
  reviewRubric: string[];
  nodes: WorkflowGraphNode[];
}

function hasAssetRole(
  resources: DomainResources,
  role: string,
): boolean {
  return resources.categories.some((group) =>
    group.items.some((item) => {
      const inferred = inferReferenceRole({
        category: item.category,
        mediaType: item.mediaType,
        title: item.title,
        data: item.data,
      });
      return inferred === role;
    }),
  );
}

function countMedia(resources: DomainResources, mediaType: string): number {
  return resources.categories.reduce(
    (sum, group) => sum + group.items.filter((item) => item.mediaType === mediaType).length,
    0,
  );
}

function buildReviewRubric(signals: WorkflowGraphSignals): string[] {
  const rubric = [
    "画风是否统一，是否已经有稳定 style_ref 或 style profile",
    "分镜密度是否匹配不确定性，是否需要从 single 升到 2x2/3x3",
    "动画短片里主体轮廓、姿态和主动作是否一眼可读，而不是信息堆满整张画面",
    "角色、场景、空镜、动作参考是否角色分离而非混杂",
    "镜头是否只承载一个主戏剧动作 / 主情绪，并保住 screen direction 与空间地理",
    "若目标包含叙事或口播，是否先补对白脚本再生视频",
  ];
  if (signals.wantsMultiClip) {
    rubric.push("是否已经积累足够候选片段进入粗剪，而不是过早定稿");
  }
  if (signals.hasReferenceVideo) {
    rubric.push("是否应该走 mixed_refs，而不是退回 prompt-only");
  }
  if (signals.hasFirstFrameReference || signals.hasLastFrameReference) {
    rubric.push("首帧 / 尾帧参考是否足够清晰，是否应切到 first_frame 或 first_last_frame");
  }
  if (signals.prefersCharacterPriority) {
    rubric.push("角色是否需要先用立绘或设定图稳定，再做后续镜头生成");
  }
  if (signals.prefersEmptyShotPriority) {
    rubric.push("是否应该先补空镜和场景镜头，让节奏与气氛成立后再补主体镜头");
  }
  if (signals.enableSelfReview) {
    rubric.push("关键阶段结束后是否需要写回 path review / feedback 到主动记忆");
  }
  if (signals.needsDialogue) {
    rubric.push("对白镜头里是否给口型、停顿与表演留出节奏，而不是让大动作盖过台词");
  }
  return rubric;
}

export function buildWorkflowGraphSnapshot(input: {
  memory: MemoryRecommendations;
  pathRecommendations: RecommendWorkflowPathsResult;
  resources: DomainResources;
  signals: WorkflowGraphSignals;
}): WorkflowGraphSnapshot {
  const activePathIds = input.pathRecommendations.recommendations
    .map((item) => item.pathId)
    .slice(0, 4) as WorkflowPathId[];
  const videoCount = countMedia(input.resources, "video");
  const hasStoryboard = hasAssetRole(input.resources, "storyboard_ref");
  const hasDialogue = hasAssetRole(input.resources, "dialogue_ref");
  const hasCharacter = hasAssetRole(input.resources, "character_ref");
  const hasScene = hasAssetRole(input.resources, "scene_ref");
  const hasEmptyShot = hasAssetRole(input.resources, "empty_shot_ref");
  const roleCandidatePaths: WorkflowPathId[] = [];

  if (input.signals.prefersCharacterPriority) {
    roleCandidatePaths.push("path.role_pack.character_priority");
  }
  if (input.signals.prefersEmptyShotPriority) {
    roleCandidatePaths.push("path.role_pack.empty_shot_priority");
  }

  const nodes: WorkflowGraphNode[] = [
    {
      id: "alignment",
      title: "对齐创作方向",
      status: input.signals.executionMode === "checkpoint" && input.signals.checkpointAlignmentRequired
        ? "active"
        : "ready",
      why: [
        input.signals.executionMode === "checkpoint"
          ? "Checkpoint 模式首轮需要先确认方向"
          : "YOLO 模式可快速略过，但仍建议建立明确目标",
        input.signals.customKnowledge ? "存在用户知识叠层，需纳入计划" : "暂无额外知识叠层",
      ],
      predecessors: [],
      candidatePaths: ["path.style_bootstrap"],
      preferredTools: ["video_memory__recommend_paths"],
      reviewGate: "确认画风、路径、分镜密度、对白需求、最终交付物是否一致",
    },
    {
      id: "style",
      title: "风格与参考建模",
      status: input.signals.hasStyleProfile || hasAssetRole(input.resources, "style_ref")
        ? "ready"
        : "active",
      why: [
        input.signals.hasStyleProfile
          ? "已有序列级风格档案"
          : "需要建立 style_ref 或应用内置风格",
        input.memory.preferredStyleTokens.length > 0
          ? "长期记忆已有画风偏好"
          : "长期记忆暂无明确画风偏好",
      ],
      predecessors: ["alignment"],
      candidatePaths: ["path.style_bootstrap"],
      preferredTools: ["style_search__search_images", "style_search__reverse_style"],
      reviewGate: "检查 style_ref 是否足够稳定，避免后续镜头风格漂移",
    },
    {
      id: "storyboard",
      title: "分镜探索",
      status: hasStoryboard ? "ready" : "active",
      why: [
        input.signals.storyboardDensity === "grid_3x3"
          ? "当前更适合九宫格探索"
          : input.signals.storyboardDensity === "grid_2x2"
            ? "当前更适合四宫格探索"
            : "默认单图分镜，必要时可加密",
      ],
      predecessors: ["alignment", "style"],
      candidatePaths: activePathIds.filter((pathId) => pathId.startsWith("path.storyboard_density")),
      preferredTools: ["video_mgr__generate_storyboard_grid", "video_mgr__generate_image"],
      reviewGate: "检查分镜是否一眼读懂、是否需要补镜头/补空镜，或提高分镜密度",
    },
    {
      id: "role_pack",
      title: "角色/场景/空镜参考",
      status: hasCharacter || hasEmptyShot || hasScene
        ? "ready"
        : input.signals.prefersCharacterPriority || input.signals.prefersEmptyShotPriority
          ? "active"
          : "optional",
      why: [
        hasCharacter ? "已有角色资产" : "缺少角色立绘时，可先补角色稳定性",
        hasEmptyShot ? "已有空镜资产" : "缺少空镜时，节奏过渡可能偏硬",
        hasScene ? "已有场景参考" : "缺少 scene_ref 时场景连续性会更弱",
      ],
      predecessors: ["storyboard"],
      candidatePaths: roleCandidatePaths,
      preferredTools: ["video_mgr__generate_image"],
      reviewGate: "确认 scene_ref / character_ref / empty_shot_ref 是否已语义分离，且能稳定后续动画连续性",
    },
    {
      id: "dialogue",
      title: "对白脚本",
      status: input.signals.needsDialogue && !hasDialogue ? "active" : input.signals.needsDialogue ? "ready" : "optional",
      why: [
        input.signals.needsDialogue ? "任务包含对白/口播信号" : "当前任务对白需求较低",
        hasDialogue ? "已有对白脚本可复用" : "暂无对白脚本",
      ],
      predecessors: ["storyboard"],
      candidatePaths: [],
      preferredTools: ["video_mgr__save_dialogue_script"],
      reviewGate: "检查台词是否承载叙事，避免先做视频后补对白导致返工",
    },
    {
      id: "video_generation",
      title: "视频生成与候选探索",
      status: videoCount > 0 ? "ready" : "active",
      why: [
        input.signals.hasFirstFrameReference && input.signals.hasLastFrameReference
          ? "已具备首尾帧参考，优先 first_last_frame"
          : input.signals.hasFirstFrameReference
            ? "已具备首帧参考，优先 first_frame"
            : input.signals.hasReferenceVideo
              ? "存在视频参考，优先 mixed_refs"
              : "暂无视频参考，优先首帧/首尾帧路径",
        input.signals.wantsMultiClip ? "目标更偏多候选粗剪" : "目标可先少量候选再收敛",
      ],
      predecessors: ["storyboard", "role_pack", "dialogue"],
      candidatePaths: activePathIds.filter((pathId) =>
        pathId.startsWith("path.image_to_video") || pathId === "path.multi_reference_video",
      ),
      preferredTools: ["video_mgr__generate_video"],
      reviewGate: "检查动作弧线、运镜主轴和角色一致性，必要时改走 first_last_frame、mixed_refs 或补素材再生成",
    },
    {
      id: "rough_cut",
      title: "粗剪与候选筛选",
      status: input.signals.wantsMultiClip || videoCount >= 2 ? "active" : "optional",
      why: [
        input.signals.wantsMultiClip ? "目标明确包含多段拼接" : "若候选片段增加，建议进入粗剪",
        videoCount >= 2 ? "已有多个视频素材可供筛选" : "视频候选还不够多",
      ],
      predecessors: ["video_generation"],
      candidatePaths: activePathIds.filter((pathId) => pathId === "path.multi_clip_compose"),
      preferredTools: ["video_mgr__save_clip_plan"],
      reviewGate: "检查节奏、转场、冗余镜头、镜头接续和最终交付物是否匹配",
    },
  ];

  const activeNode = nodes.find((node) => node.status === "active")
    ?? nodes.find((node) => node.status === "ready")
    ?? nodes[0];

  const suggestedNext = nodes
    .filter((node) => node.status === "active" || node.status === "ready")
    .slice(0, 3)
    .map((node) => `${node.title}: ${node.reviewGate}`);

  const summary = [
    input.signals.executionMode === "checkpoint"
      ? "当前工作流会先对齐再推进"
      : "当前工作流会在信息充分时连续推进",
    input.signals.storyboardDensity
      ? `分镜密度偏好=${input.signals.storyboardDensity}`
      : "分镜密度将按不确定性动态决定",
    input.signals.hasFirstFrameReference && input.signals.hasLastFrameReference
      ? "已检测到首尾帧约束，first_last_frame 优先级上升"
      : input.signals.hasReferenceVideo
        ? "已检测到视频参考，mixed_refs 优先级上升"
        : "暂无视频参考，优先首帧/首尾帧或图像驱动路径",
    input.signals.prefersCharacterPriority
      ? "角色稳定性优先"
      : input.signals.prefersEmptyShotPriority
        ? "空镜与节奏优先"
        : "角色、空镜与场景参考将按素材缺口动态补齐",
  ].join("；");

  return {
    summary,
    activeNodeId: activeNode?.id ?? "alignment",
    activePathIds,
    suggestedNext,
    reviewRubric: buildReviewRubric(input.signals),
    nodes,
  };
}
