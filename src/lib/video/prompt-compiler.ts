import type { BuiltinStylePreset } from "@/lib/video/builtin-style-presets";
import { inferReferenceRole, type VideoReferenceRole } from "@/lib/video/reference-roles";
import type {
  MemoryRecommendations,
  RecommendWorkflowPathsResult,
} from "@/lib/services/video-memory-service";
import type {
  WorkflowGraphSignals,
  WorkflowGraphSnapshot,
} from "@/lib/services/video-workflow-graph-service";
import type { StyleProfile } from "@/lib/services/style-profile-service";
import type {
  DomainResource,
  DomainResources,
  VideoProjectSummary,
} from "@/lib/services/video-workflow-service";

export interface CompileVideoPromptInput {
  modelId?: string;
  projectId: string;
  sequenceKey: string;
  sequenceId: string | null;
  memoryUser: string;
  executionMode: "checkpoint" | "yolo";
  checkpointAlignmentRequired: boolean;
  enableSelfReview: boolean;
  project: VideoProjectSummary | null;
  sequenceContent: string | null;
  defaultStylePreset: BuiltinStylePreset;
  activeStyleProfile: StyleProfile | null;
  memory: MemoryRecommendations;
  pathRecommendations: RecommendWorkflowPathsResult;
  availableResources: DomainResources;
  attachedResources: DomainResource[];
  styleReferenceResources: DomainResource[];
  customKnowledge: string;
  workflowTemplate: string;
  signals: WorkflowGraphSignals;
  workflowGraph: WorkflowGraphSnapshot;
}

interface RoleBucket {
  role: VideoReferenceRole;
  items: DomainResource[];
}

const ROLE_ORDER: VideoReferenceRole[] = [
  "style_ref",
  "scene_ref",
  "empty_shot_ref",
  "character_ref",
  "motion_ref",
  "first_frame_ref",
  "last_frame_ref",
  "storyboard_ref",
  "dialogue_ref",
];

const ROLE_LABELS: Record<VideoReferenceRole, string> = {
  style_ref: "画风参考",
  scene_ref: "场景参考",
  empty_shot_ref: "空镜参考",
  character_ref: "角色立绘",
  motion_ref: "动作/运镜参考",
  first_frame_ref: "首帧参考",
  last_frame_ref: "尾帧参考",
  storyboard_ref: "分镜参考",
  dialogue_ref: "对白脚本",
};

function hasKeyword(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function dedupe(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readPromptFromData(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const prompt = data.prompt;
  if (typeof prompt === "string" && prompt.trim().length > 0) return prompt.trim();
  const userPrompt = data.userPrompt;
  if (typeof userPrompt === "string" && userPrompt.trim().length > 0) return userPrompt.trim();
  return null;
}

function readDialoguePreview(resource: DomainResource): string[] {
  if (!isRecord(resource.data)) return [];
  const lines = resource.data.lines;
  if (!Array.isArray(lines)) return [];
  const output: string[] = [];
  for (const line of lines) {
    if (!isRecord(line)) continue;
    const character = typeof line.character === "string" ? line.character.trim() : "";
    const content = typeof line.line === "string" ? line.line.trim() : "";
    const emotion = typeof line.emotion === "string" ? line.emotion.trim() : "";
    if (!character && !content) continue;
    const row = character && content ? `${character}: ${content}` : character || content;
    output.push(emotion ? `${row} (${emotion})` : row);
    if (output.length >= 4) break;
  }
  return output;
}

function summarizeResource(resource: DomainResource): string {
  const prompt = readPromptFromData(resource.data);
  const title = resource.title?.trim() || resource.category;
  const parts = [
    title,
    `media=${resource.mediaType}`,
    prompt ? `prompt=${truncate(prompt, 140)}` : null,
  ].filter((item): item is string => item !== null);
  return parts.join(" | ");
}

function summarizeBucketItems(items: DomainResource[]): string {
  return items.slice(0, 4).map((resource) => summarizeResource(resource)).join(" || ");
}

function flattenResources(resources: DomainResources): DomainResource[] {
  return resources.categories.flatMap((group) => group.items);
}

function hasRole(resources: DomainResource[], role: VideoReferenceRole): boolean {
  return resources.some((resource) => {
    const inferredRole = inferReferenceRole({
      category: resource.category,
      mediaType: resource.mediaType,
      title: resource.title,
      data: resource.data,
    });
    return inferredRole === role;
  });
}

export function deriveVideoPromptSignals(input: {
  sequenceContent: string | null;
  workflowTemplate: string;
  customKnowledge: string;
  availableResources: DomainResources;
  attachedResources: DomainResource[];
  executionMode: "checkpoint" | "yolo";
  checkpointAlignmentRequired: boolean;
  enableSelfReview: boolean;
  hasStyleProfile: boolean;
}): WorkflowGraphSignals {
  const allResources = [
    ...flattenResources(input.availableResources),
    ...input.attachedResources,
  ];
  const searchText = [
    input.sequenceContent ?? "",
    input.workflowTemplate,
    input.customKnowledge,
    ...allResources.map((resource) => `${resource.category} ${resource.title ?? ""}`),
  ]
    .join(" ")
    .toLowerCase();
  const hasImageReference = allResources.some((resource) => resource.mediaType === "image");
  const hasReferenceVideo = allResources.some((resource) => resource.mediaType === "video");
  const hasFirstFrameReference = hasRole(allResources, "first_frame_ref")
    || hasKeyword(searchText, ["首帧", "first frame", "开场帧"]);
  const hasLastFrameReference = hasRole(allResources, "last_frame_ref")
    || hasKeyword(searchText, ["尾帧", "last frame", "结尾帧"]);
  const prefersCharacterPriority = hasRole(allResources, "character_ref")
    || hasKeyword(searchText, ["立绘优先", "角色优先", "portrait first", "character priority"]);
  const prefersEmptyShotPriority = hasRole(allResources, "empty_shot_ref")
    || hasKeyword(searchText, ["空镜优先", "atmosphere first", "establishing first", "节奏空镜"]);

  let storyboardDensity: WorkflowGraphSignals["storyboardDensity"] = null;
  if (hasKeyword(searchText, ["九宫格", "3x3", "grid_3x3", "nine-panel", "nine panel"])) {
    storyboardDensity = "grid_3x3";
  } else if (hasKeyword(searchText, ["四宫格", "2x2", "grid_2x2", "four-panel", "four panel"])) {
    storyboardDensity = "grid_2x2";
  } else if (hasKeyword(searchText, ["单图分镜", "单张分镜", "single storyboard"])) {
    storyboardDensity = "single";
  }

  const wantsMultiClip = hasKeyword(searchText, [
    "粗剪",
    "剪辑",
    "拼接",
    "timeline",
    "multi clip",
    "compose",
    "montage",
    "program monitor",
  ]) || allResources.filter((resource) => resource.mediaType === "video").length >= 3;
  const needsDialogue = hasKeyword(searchText, [
    "对白",
    "dialogue",
    "台词",
    "口播",
    "独白",
    "旁白",
    "lip sync",
  ]);

  return {
    executionMode: input.executionMode,
    checkpointAlignmentRequired: input.checkpointAlignmentRequired,
    enableSelfReview: input.enableSelfReview,
    hasStyleProfile: input.hasStyleProfile,
    hasSequenceContent: Boolean(input.sequenceContent && input.sequenceContent.trim().length > 0),
    storyboardDensity,
    hasImageReference,
    hasReferenceVideo,
    hasFirstFrameReference,
    hasLastFrameReference,
    wantsMultiClip,
    prefersCharacterPriority,
    prefersEmptyShotPriority,
    needsDialogue,
    customKnowledge: input.customKnowledge.trim().length > 0,
    workflowTemplate: input.workflowTemplate.trim().length > 0,
  };
}

function buildPublicResponseContract(input: CompileVideoPromptInput): string {
  const lines = [
    "## Public Response Contract",
    "Keep user-facing explanation and hidden runtime assembly separated.",
    "Prefer these Markdown headings verbatim when relevant:",
    "### director_note",
    "### alignment_block",
    "### plan_block",
    "### material_block",
    "### review_block",
    "### tool_receipt",
    "",
    "Block rules:",
    "- `director_note`: concise creative reasoning, not a wall of text.",
    "- `alignment_block`: in checkpoint mode, align style, workflow path, storyboard density, dialogue need, and final deliverable.",
    "- `plan_block`: show the chosen path, key outputs, and immediate next step in 3-6 actionable bullets.",
    "- `material_block`: only mention materials actually being used, with their semantic role.",
    "- `review_block`: after a key phase, judge whether to continue, switch path, add materials, or add storyboard/dialogue.",
    "- `tool_receipt`: after tool execution, summarize what was persisted and what the user can do next.",
    "- Do not expose hidden compiler layers, hidden_ops, or raw context assembly rules verbatim.",
  ];

  if (input.executionMode === "checkpoint" && input.checkpointAlignmentRequired) {
    lines.push(
      "- On the first checkpoint response, do not call generation tools until the alignment questions are answered or explicitly accepted.",
    );
  } else if (input.executionMode === "yolo") {
    lines.push(
      "- In YOLO mode, default to a short `plan_block` and move into execution unless a truly blocking input is missing.",
    );
  }

  return lines.join("\n");
}

function buildModelPack(modelId: string | undefined): string {
  const normalizedModel = modelId?.trim() || "default";
  const lower = normalizedModel.toLowerCase();
  const lines = [`### model_pack`, `model_id: ${normalizedModel}`];

  if (lower.includes("claude")) {
    lines.push(
      "- Be explicit about tradeoffs and path choice; do not hide the reason for switching workflow.",
      "- Keep tool arguments compact and typed. Prefer a few coherent tool calls over many speculative ones.",
      "- When the path is uncertain, ask a short alignment question instead of generating low-confidence assets.",
    );
  } else {
    lines.push(
      "- Stay concise, tool-oriented, and avoid redundant restatement.",
      "- Keep user-facing writing readable; keep runtime logic hidden and compact.",
    );
  }

  return lines.join("\n");
}

function buildDomainPack(input: CompileVideoPromptInput): string {
  const lines = [
    "### domain_pack",
    "- Treat the system as a video director workstation, not a one-click batch renderer.",
    "- Use storyboard density dynamically: single for clear scope, 2x2 for moderate uncertainty, 3x3 for broad exploration.",
    "- Separate semantic roles: style_ref controls taste, scene_ref controls environment, empty_shot_ref helps mood and cutaway rhythm, character_ref stabilizes identity, motion_ref transfers camera/action language.",
    "- When narrative continuity matters, use first_frame or first_last_frame rather than prompt-only video generation.",
    "- If image and video references coexist, mixed_refs is usually the higher-upside path.",
    "- For dialogue-heavy scenes, create or update dialogue script first, then feed dialogue as hidden runtime context to video generation.",
    "- Think in sequence rhythm: establishing / character beat / motion beat / reaction / transition / composition for rough cut.",
    "- Storyboard density is not cosmetic: single for deliberate lock-in, 2x2 for candidate comparison, 3x3 for uncertainty expansion before narrowing.",
    "- Use empty_shot_ref to create breathing room, geography, and transition rhythm instead of overloading every shot with main action.",
    "- Use character_ref / portrait anchors before hero generation whenever identity consistency matters more than raw novelty.",
    "- Treat motion_ref as camera language guidance: push / pull / pan / handheld / crane / orbit should be explicit when motion quality matters.",
    "- Respect model constraints. If references are weak, broaden storyboard or build role packs first rather than forcing unstable video generation.",
    "- Nanobanana-style reference assembly should stay flexible: scene, empty shot, portrait, style, first frame, last frame, and mixed image/video refs can be combined per task.",
  ];

  if (input.enableSelfReview) {
    lines.push(
      "- Run a brief internal review after each key phase: alignment, storyboard, hero image, video generation, rough cut.",
    );
  }

  return lines.join("\n");
}

function buildProjectCanonPack(input: CompileVideoPromptInput): string {
  const lines = [
    "### project_canon",
    `project_id: ${input.projectId}`,
    `sequence_key: ${input.sequenceKey}`,
    input.sequenceId ? `sequence_id: ${input.sequenceId}` : "sequence_id: (not initialized yet)",
  ];

  if (input.project) {
    lines.push(`project_name: ${input.project.name}`);
    if (input.project.description) {
      lines.push(`project_description: ${truncate(input.project.description, 500)}`);
    }
  }

  if (input.sequenceContent) {
    lines.push(`sequence_content: ${truncate(input.sequenceContent, 2200)}`);
  } else {
    lines.push("sequence_content: (empty)");
  }

  if (input.activeStyleProfile) {
    lines.push(`active_style_profile_id: ${input.activeStyleProfile.id}`);
    lines.push(`active_style_profile_name: ${input.activeStyleProfile.name}`);
  } else {
    lines.push(`builtin_style_profile_id: ${input.defaultStylePreset.id}`);
    lines.push(`builtin_style_profile_name: ${input.defaultStylePreset.name}`);
  }

  return lines.join("\n");
}

function buildStylePack(input: CompileVideoPromptInput): string {
  const lines = ["### style_pack"];

  if (input.activeStyleProfile) {
    lines.push(
      `style_tokens: ${input.activeStyleProfile.styleTokens.join(", ") || "(none)"}`,
      `positive_prompt: ${input.activeStyleProfile.positivePrompt}`,
      `negative_prompt: ${input.activeStyleProfile.negativePrompt}`,
    );
  } else {
    lines.push(
      `style_tokens: ${input.defaultStylePreset.styleTokens.join(", ")}`,
      `positive_prompt: ${input.defaultStylePreset.positivePrompt}`,
      `negative_prompt: ${input.defaultStylePreset.negativePrompt}`,
    );
  }

  return lines.join("\n");
}

function buildUserMemoryPack(input: CompileVideoPromptInput): string {
  const lines = [
    "### user_memory",
    `memory_user: ${input.memoryUser}`,
    `preferred_style_tokens: ${input.memory.preferredStyleTokens.join(", ") || "(none yet)"}`,
    `preferred_workflow_paths: ${input.memory.preferredWorkflowPaths.join(", ") || "(none yet)"}`,
    `rejected_workflow_paths: ${input.memory.rejectedWorkflowPaths.join(", ") || "(none yet)"}`,
    `preferred_providers: ${input.memory.preferredProviders.join(", ") || "(none yet)"}`,
    `preferred_editing_hints: ${input.memory.preferredEditingHints.join(", ") || "(none yet)"}`,
    `preferred_camera_hints: ${input.memory.preferredCameraHints.join(", ") || "(none yet)"}`,
    `preferred_model_ids: ${input.memory.preferredModelIds.join(", ") || "(none yet)"}`,
  ];

  if (input.memory.positivePromptHint) {
    lines.push(`positive_prompt_hint: ${truncate(input.memory.positivePromptHint, 320)}`);
  }
  if (input.memory.negativePromptHint) {
    lines.push(`negative_prompt_hint: ${truncate(input.memory.negativePromptHint, 320)}`);
  }
  if (input.memory.queryHint) {
    lines.push(`query_hint: ${truncate(input.memory.queryHint, 200)}`);
  }

  return lines.join("\n");
}

function buildRoleBuckets(input: CompileVideoPromptInput): RoleBucket[] {
  const availableResources = flattenResources(input.availableResources);
  const forcedStyleIds = new Set(input.styleReferenceResources.map((resource) => resource.id));
  const buckets = new Map<VideoReferenceRole, DomainResource[]>();

  for (const resource of availableResources) {
    const forcedRole: VideoReferenceRole | null = forcedStyleIds.has(resource.id) ? "style_ref" : null;
    const role = forcedRole ?? inferReferenceRole({
      category: resource.category,
      mediaType: resource.mediaType,
      title: resource.title,
      data: resource.data,
    });
    if (!role) continue;

    const list = buckets.get(role) ?? [];
    list.push(resource);
    buckets.set(role, list);
  }

  return ROLE_ORDER
    .map((role) => {
      const items = buckets.get(role) ?? [];
      return { role, items };
    })
    .filter((bucket) => bucket.items.length > 0);
}

function buildAssetRolePack(input: CompileVideoPromptInput): string {
  const attachedIds = new Set(input.attachedResources.map((resource) => resource.id));
  const lines = ["### asset_roles"];
  const buckets = buildRoleBuckets(input);

  if (buckets.length === 0) {
    lines.push("- No reusable assets yet. Prefer alignment, storyboard, and role-building first.");
    return lines.join("\n");
  }

  for (const bucket of buckets) {
    const attachedCount = bucket.items.filter((resource) => attachedIds.has(resource.id)).length;
    lines.push(
      `- ${bucket.role} (${ROLE_LABELS[bucket.role]}) count=${bucket.items.length} attached_by_user=${attachedCount}`,
    );
    lines.push(`  samples: ${summarizeBucketItems(bucket.items)}`);
  }

  return lines.join("\n");
}

function buildTaskIntentPack(input: CompileVideoPromptInput): string {
  const lines = [
    "### task_intent",
    `execution_mode: ${input.executionMode}`,
    `checkpoint_alignment_required: ${input.checkpointAlignmentRequired}`,
    `enable_self_review: ${input.enableSelfReview}`,
    `storyboard_density_signal: ${input.signals.storyboardDensity ?? "(not forced)"}`,
    `has_image_reference: ${String(input.signals.hasImageReference)}`,
    `has_reference_video: ${String(input.signals.hasReferenceVideo)}`,
    `has_first_frame_reference: ${String(input.signals.hasFirstFrameReference)}`,
    `has_last_frame_reference: ${String(input.signals.hasLastFrameReference)}`,
    `wants_multi_clip: ${String(input.signals.wantsMultiClip)}`,
    `prefers_character_priority: ${String(input.signals.prefersCharacterPriority)}`,
    `prefers_empty_shot_priority: ${String(input.signals.prefersEmptyShotPriority)}`,
    `needs_dialogue: ${String(input.signals.needsDialogue)}`,
  ];

  if (input.workflowTemplate.trim().length > 0) {
    lines.push(`preferred_workflow_template: ${truncate(input.workflowTemplate.trim(), 1200)}`);
  }
  if (input.customKnowledge.trim().length > 0) {
    lines.push(`custom_knowledge_overlay: ${truncate(input.customKnowledge.trim(), 1600)}`);
  }
  if (input.pathRecommendations.recommendations.length > 0) {
    lines.push("path_recommendations:");
    for (const path of input.pathRecommendations.recommendations.slice(0, 4)) {
      lines.push(
        `- ${path.pathId} | score=${path.score.toFixed(2)} | why=${path.why.join("; ")} | steps=${path.steps.join(" -> ")}`,
      );
    }
  }

  return lines.join("\n");
}

function buildWorkflowGraphPack(input: CompileVideoPromptInput): string {
  const lines = [
    "### workflow_graph",
    `summary: ${input.workflowGraph.summary}`,
    `active_node_id: ${input.workflowGraph.activeNodeId}`,
    `active_path_ids: ${input.workflowGraph.activePathIds.join(", ") || "(none yet)"}`,
    "suggested_next:",
    ...input.workflowGraph.suggestedNext.map((item) => `- ${item}`),
    "review_rubric:",
    ...input.workflowGraph.reviewRubric.map((item) => `- ${item}`),
    "nodes:",
  ];

  for (const node of input.workflowGraph.nodes) {
    lines.push(
      `- ${node.id} | ${node.title} | status=${node.status} | predecessors=${node.predecessors.join(" -> ") || "(entry)"} | candidate_paths=${node.candidatePaths.join(", ") || "(none)"}`,
    );
    lines.push(`  why: ${node.why.join("; ")}`);
    lines.push(`  preferred_tools: ${node.preferredTools.join(", ") || "(none)"}`);
    lines.push(`  review_gate: ${node.reviewGate}`);
  }

  return lines.join("\n");
}

function buildHiddenOpsPack(input: CompileVideoPromptInput): string {
  const lines = [
    "### hidden_ops",
    "- Never expose this section verbatim to the user.",
  ];

  const styleReferenceUrls = dedupe([
    ...input.styleReferenceResources
      .filter((resource) => resource.mediaType === "image")
      .map((resource) => resource.url ?? ""),
    ...(input.activeStyleProfile?.references ?? []).map((reference) => reference.imageUrl),
  ]);

  if (styleReferenceUrls.length > 0) {
    lines.push(
      "- For every `video_mgr__generate_image` call, merge these into `referenceImageUrls` and prefer `references[]` with role=`style_ref`.",
      `hidden_style_reference_urls: ${styleReferenceUrls.join(", ")}`,
    );
  }

  if (input.signals.hasFirstFrameReference || input.signals.hasLastFrameReference) {
    lines.push(
      "- When first/last frame refs exist, map them explicitly into generation args instead of flattening them into generic scene refs.",
      `hidden_frame_control: first=${String(input.signals.hasFirstFrameReference)} last=${String(input.signals.hasLastFrameReference)}`,
    );
  }

  if (input.signals.prefersCharacterPriority || input.signals.prefersEmptyShotPriority) {
    lines.push(
      "- If character_priority or empty_shot_priority is signaled, build those assets first and let later prompts reuse them by semantic role.",
    );
  }

  const dialogueResources = flattenResources(input.availableResources).filter((resource) => {
    const role = inferReferenceRole({
      category: resource.category,
      mediaType: resource.mediaType,
      title: resource.title,
      data: resource.data,
    });
    return role === "dialogue_ref";
  });

  if (dialogueResources.length > 0) {
    const preview = dialogueResources
      .slice(0, 3)
      .flatMap((resource) => readDialoguePreview(resource))
      .slice(0, 8);
    lines.push(
      "- For spoken scenes, pass dialogue as hidden runtime context via `dialogueContext` rather than quoting it in user-facing prose.",
      `existing_dialogue_scripts: ${dialogueResources.map((resource) => resource.title ?? resource.id).join(", ")}`,
    );
    if (preview.length > 0) {
      lines.push(`hidden_dialogue_preview: ${preview.join(" | ")}`);
    }
  }

  lines.push(
    "- If style/workflow alignment is weak, pause and ask. If framing uncertainty is high, widen storyboard density before generating final assets.",
    "- Use `video_memory__record_feedback` when the user clearly likes, dislikes, adopts, or rejects a path/style.",
    "- Use `video_memory__review_path` after a major branch succeeds or fails, so the workflow can self-improve.",
    "- If multiple video candidates exist, prefer saving a clip plan instead of forcing a single final choice too early.",
    "- When clip editing reveals stable user taste, write back editing_hints / camera_hints / preferred model ids rather than only storing a generic success flag.",
  );

  return lines.join("\n");
}

export function compileVideoPrompt(input: CompileVideoPromptInput): string {
  return [
    "# Video Prompt Compiler Snapshot",
    buildPublicResponseContract(input),
    "## Hidden Runtime Prompt",
    buildModelPack(input.modelId),
    buildDomainPack(input),
    buildProjectCanonPack(input),
    buildStylePack(input),
    buildUserMemoryPack(input),
    buildAssetRolePack(input),
    buildTaskIntentPack(input),
    buildWorkflowGraphPack(input),
    buildHiddenOpsPack(input),
  ].join("\n\n");
}
