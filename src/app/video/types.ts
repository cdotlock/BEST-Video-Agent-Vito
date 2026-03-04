/* ------------------------------------------------------------------ */
/*  Video workflow UI types                                            */
/* ------------------------------------------------------------------ */

export type SequenceStatus = "empty" | "uploaded" | "has_resources";

export interface SequenceSummary {
  id: string;
  projectId: string;
  sequenceKey: string;
  sequenceName: string | null;
  activeStyleProfileId: string | null;
  status: SequenceStatus;
  createdAt: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ---- Generic domain resource types ---- */

export interface DomainResource {
  id: string;
  category: string;
  mediaType: string;
  title: string | null;
  url: string | null;
  data: unknown;
  keyResourceId: string | null;
  sortOrder: number;
}

export interface CategoryGroup {
  category: string;
  items: DomainResource[];
}

export interface DomainResources {
  categories: CategoryGroup[];
}

export interface VideoResourceData {
  key?: string;
  prompt?: string;
  sourceImageUrl?: string | null;
}

export interface VideoContext {
  projectId: string;
  sequenceKey: string;
}

export type ExecutionMode = "checkpoint" | "yolo";
export type WorkspaceView = "chat" | "clip";

export interface VideoTimelineEvent {
  id: string;
  type: "tool_start" | "tool_end" | "stream_end" | "error";
  at: string;
  name?: string;
  index?: number;
  total?: number;
  durationMs?: number;
  error?: string;
}

/* ---- Style init ---- */

export type PublicImageProvider = "unsplash" | "pexels" | "pixabay";
export type PublicImageSource = PublicImageProvider | "custom";

export interface StyleReference {
  source: PublicImageSource;
  sourceId: string;
  imageUrl: string;
  thumbUrl?: string | null;
  sourceUrl?: string | null;
  title?: string | null;
  authorName?: string | null;
  authorUrl?: string | null;
  license?: string | null;
  width?: number | null;
  height?: number | null;
  color?: string | null;
  tags: string[];
}

export interface StyleTokenWeight {
  token: string;
  weight: number;
}

export interface StyleAnalysis {
  summary: string;
  confidence: number;
  palette: "warm" | "cool" | "neutral" | "mixed";
  tokenWeights: StyleTokenWeight[];
}

export interface StyleProfile {
  id: string;
  projectId: string | null;
  name: string;
  query: string | null;
  positivePrompt: string;
  negativePrompt: string;
  styleTokens: string[];
  references: StyleReference[];
  analysis: StyleAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSearchStatus {
  provider: PublicImageProvider;
  status: "ok" | "skipped" | "error";
  count: number;
  error?: string;
}

export interface StyleSearchResult {
  query: string;
  page: number;
  perPage: number;
  items: StyleReference[];
  providers: ProviderSearchStatus[];
}

export interface StyleReverseResult {
  styleTokens: string[];
  positivePrompt: string;
  negativePrompt: string;
  analysis: StyleAnalysis;
  profile: StyleProfile | null;
}

export interface MemoryRecommendations {
  memoryUser: string;
  enabled: true;
  preferredStyleTokens: string[];
  preferredWorkflowPaths: string[];
  preferredProviders: PublicImageProvider[];
  positivePromptHint: string | null;
  negativePromptHint: string | null;
  queryHint: string | null;
  totalPreferenceItems: number;
}

export interface WorkflowPathRecommendation {
  pathId: string;
  title: string;
  score: number;
  why: string[];
  steps: string[];
}

export interface WorkflowPathRecommendationsResult {
  memoryUser: string;
  recommendations: WorkflowPathRecommendation[];
}
