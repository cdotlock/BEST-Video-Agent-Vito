import { z } from "zod";

export const VideoReferenceRoleSchema = z.enum([
  "style_ref",
  "scene_ref",
  "empty_shot_ref",
  "character_ref",
  "motion_ref",
  "first_frame_ref",
  "last_frame_ref",
  "storyboard_ref",
  "dialogue_ref",
]);

export type VideoReferenceRole = z.infer<typeof VideoReferenceRoleSchema>;

export const VisualReferenceRoleSchema = z.enum([
  "style_ref",
  "scene_ref",
  "empty_shot_ref",
  "character_ref",
  "motion_ref",
  "first_frame_ref",
  "last_frame_ref",
  "storyboard_ref",
]);

export type VisualReferenceRole = z.infer<typeof VisualReferenceRoleSchema>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRoleCandidate(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const semanticRole = data.semanticRole;
  if (typeof semanticRole === "string" && semanticRole.trim().length > 0) {
    return semanticRole.trim();
  }
  const role = data.role;
  if (typeof role === "string" && role.trim().length > 0) {
    return role.trim();
  }
  const type = data.type;
  if (type === "dialogue_script") return "dialogue_ref";
  return null;
}

function hasKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function inferReferenceRole(input: {
  category: string;
  mediaType: string;
  title?: string | null;
  data?: unknown;
}): VideoReferenceRole | null {
  const fromData = readRoleCandidate(input.data);
  if (fromData && VideoReferenceRoleSchema.safeParse(fromData).success) {
    return fromData as VideoReferenceRole;
  }

  const searchText = [
    input.category,
    input.title ?? "",
    typeof fromData === "string" ? fromData : "",
  ].join(" ").toLowerCase();

  if (hasKeyword(searchText, ["dialogue", "script", "台词", "对白", "口播", "独白"])) {
    return "dialogue_ref";
  }
  if (hasKeyword(searchText, ["last frame", "尾帧", "结尾帧"])) {
    return "last_frame_ref";
  }
  if (hasKeyword(searchText, ["first frame", "首帧", "开场帧"])) {
    return "first_frame_ref";
  }
  if (hasKeyword(searchText, ["storyboard", "分镜", "镜头草图", "九宫格", "四宫格"])) {
    return "storyboard_ref";
  }
  if (hasKeyword(searchText, ["style", "画风", "风格", "moodboard"])) {
    return "style_ref";
  }
  if (hasKeyword(searchText, ["empty", "空镜", "establishing", "氛围"])) {
    return "empty_shot_ref";
  }
  if (hasKeyword(searchText, ["scene", "场景", "环境", "场设"])) {
    return "scene_ref";
  }
  if (hasKeyword(searchText, ["character", "角色", "立绘", "portrait", "人设"])) {
    return "character_ref";
  }
  if (hasKeyword(searchText, ["motion", "动作", "运镜", "camera", "镜头运动"])) {
    return "motion_ref";
  }

  if (input.mediaType === "video") {
    return "motion_ref";
  }
  if (input.mediaType === "image") {
    return "scene_ref";
  }
  return null;
}
