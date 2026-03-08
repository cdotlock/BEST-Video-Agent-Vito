import { z } from "zod";
import type { DomainResource } from "@/app/video/types";

export const CLIP_ATLAS_DRAG_MIME = "application/x-agent-forge-video-resource";

export const ClipAtlasDragPayloadSchema = z.object({
  type: z.literal("video_resource"),
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  category: z.string().min(1),
});

export type ClipAtlasDragPayload = z.infer<typeof ClipAtlasDragPayloadSchema>;

export function buildClipAtlasDragPayload(
  resource: DomainResource,
): ClipAtlasDragPayload | null {
  if (resource.mediaType !== "video" || !resource.url) return null;
  const parsed = ClipAtlasDragPayloadSchema.safeParse({
    type: "video_resource",
    id: resource.id,
    title: resource.title?.trim() || resource.category,
    url: resource.url,
    category: resource.category,
  });
  if (!parsed.success) return null;
  return parsed.data;
}

export function parseClipAtlasDragPayload(raw: string): ClipAtlasDragPayload | null {
  try {
    const parsedJson: unknown = JSON.parse(raw);
    const parsed = ClipAtlasDragPayloadSchema.safeParse(parsedJson);
    if (!parsed.success) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
