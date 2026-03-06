import { z } from "zod";
import { bizPool } from "@/lib/biz-db";
import { resolveTable, GLOBAL_USER } from "@/lib/biz-db-namespace";
import { ensureVideoSchema } from "@/lib/video/schema";
import {
  MemoryProviderSchema,
  recordPreferenceFeedback,
} from "@/lib/services/video-memory-service";

export const PublicImageProviderSchema = z.enum(["unsplash", "pexels", "pixabay"]);
export type PublicImageProvider = z.infer<typeof PublicImageProviderSchema>;

const STYLE_PROFILE_TABLE = "video_style_profiles";

async function physical(logicalName: string): Promise<string> {
  await ensureVideoSchema();
  const resolved = await resolveTable(GLOBAL_USER, logicalName);
  if (!resolved) {
    throw new Error(`Video table "${logicalName}" not found in BizTableMapping`);
  }
  return resolved.physicalName;
}

const PublicSourceSchema = z.enum(["unsplash", "pexels", "pixabay", "custom"]);

export const StyleReferenceSchema = z.object({
  source: PublicSourceSchema,
  sourceId: z.string().min(1),
  imageUrl: z.string().url(),
  thumbUrl: z.string().url().nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
  title: z.string().nullable().optional(),
  authorName: z.string().nullable().optional(),
  authorUrl: z.string().url().nullable().optional(),
  license: z.string().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  color: z.string().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type StyleReference = z.infer<typeof StyleReferenceSchema>;

const StyleAnalysisSchema = z.object({
  summary: z.string(),
  confidence: z.number().min(0).max(1),
  palette: z.enum(["warm", "cool", "neutral", "mixed"]),
  tokenWeights: z.array(
    z.object({
      token: z.string(),
      weight: z.number().positive(),
    }),
  ),
});

export type StyleAnalysis = z.infer<typeof StyleAnalysisSchema>;

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

export interface CreateStyleProfileInput {
  projectId: string | null;
  memoryUser: string | null;
  name: string;
  query: string | null;
  positivePrompt: string;
  negativePrompt: string;
  styleTokens: string[];
  references: StyleReference[];
  analysis: StyleAnalysis;
}

export interface ReverseStyleInput {
  projectId: string | null;
  memoryUser: string | null;
  sequenceKey: string | null;
  profileName: string;
  query: string | null;
  creativeGoal: string | null;
  references: StyleReference[];
  saveProfile: boolean;
}

export interface ReverseStyleResult {
  styleTokens: string[];
  positivePrompt: string;
  negativePrompt: string;
  analysis: StyleAnalysis;
  profile: StyleProfile | null;
}

export interface ProviderSearchStatus {
  provider: PublicImageProvider;
  status: "ok" | "skipped" | "error";
  count: number;
  error?: string;
}

export interface SearchStyleImagesResult {
  query: string;
  page: number;
  perPage: number;
  items: StyleReference[];
  providers: ProviderSearchStatus[];
}

export interface SearchStyleImagesParams {
  query: string;
  providers: PublicImageProvider[];
  page: number;
  perPage: number;
}

const UnsplashResponseSchema = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      description: z.string().nullable().optional(),
      alt_description: z.string().nullable().optional(),
      width: z.number().int().optional(),
      height: z.number().int().optional(),
      color: z.string().nullable().optional(),
      urls: z.object({
        regular: z.string().url(),
        small: z.string().url(),
      }),
      links: z.object({
        html: z.string().url(),
      }),
      user: z.object({
        name: z.string(),
        links: z.object({
          html: z.string().url(),
        }),
      }),
      tags: z.array(z.object({ title: z.string() })).optional(),
    }),
  ).default([]),
});

const PexelsResponseSchema = z.object({
  photos: z.array(
    z.object({
      id: z.union([z.number().int(), z.string()]),
      width: z.number().int().optional(),
      height: z.number().int().optional(),
      avg_color: z.string().optional(),
      alt: z.string().nullable().optional(),
      photographer: z.string().optional(),
      photographer_url: z.string().url().optional(),
      url: z.string().url(),
      src: z.object({
        large2x: z.string().url().optional(),
        large: z.string().url().optional(),
        medium: z.string().url().optional(),
        small: z.string().url().optional(),
      }),
    }),
  ).default([]),
});

const PixabayResponseSchema = z.object({
  hits: z.array(
    z.object({
      id: z.union([z.number().int(), z.string()]),
      pageURL: z.string().url(),
      webformatURL: z.string().url().optional(),
      largeImageURL: z.string().url().optional(),
      previewURL: z.string().url().optional(),
      user: z.string().optional(),
      userImageURL: z.string().url().optional(),
      tags: z.string().optional(),
      imageWidth: z.number().int().optional(),
      imageHeight: z.number().int().optional(),
    }),
  ).default([]),
});

const StyleProfileDbRowSchema = z.object({
  id: z.string(),
  project_id: z.string().nullable(),
  name: z.string(),
  query: z.string().nullable(),
  positive_prompt: z.string(),
  negative_prompt: z.string().nullable(),
  style_tokens: z.unknown(),
  reference_images: z.unknown(),
  analysis: z.unknown().nullable(),
  created_at: z.union([z.date(), z.string()]),
  updated_at: z.union([z.date(), z.string()]),
});

const WORD_TOKEN_MAP = new Map<string, string>([
  ["anime", "anime illustration"],
  ["manga", "manga linework"],
  ["cinematic", "cinematic framing"],
  ["film", "film grain"],
  ["vintage", "vintage tone"],
  ["retro", "retro styling"],
  ["minimal", "minimal composition"],
  ["minimalist", "minimal composition"],
  ["realistic", "photorealistic detail"],
  ["photorealistic", "photorealistic detail"],
  ["watercolor", "watercolor texture"],
  ["oil", "oil painting texture"],
  ["noir", "high contrast noir"],
  ["neon", "neon accents"],
  ["futuristic", "futuristic lighting"],
  ["cyberpunk", "cyberpunk ambience"],
  ["dreamy", "dreamy atmosphere"],
  ["dramatic", "dramatic lighting"],
  ["soft", "soft lighting"],
  ["portrait", "portrait framing"],
  ["landscape", "wide landscape composition"],
  ["macro", "macro close-up detail"],
]);

const PHRASE_TOKEN_MAP: Array<{ phrase: string; token: string; weight: number }> = [
  { phrase: "电影感", token: "cinematic framing", weight: 2 },
  { phrase: "赛博", token: "cyberpunk ambience", weight: 2 },
  { phrase: "霓虹", token: "neon accents", weight: 2 },
  { phrase: "复古", token: "vintage tone", weight: 2 },
  { phrase: "极简", token: "minimal composition", weight: 2 },
  { phrase: "写实", token: "photorealistic detail", weight: 2 },
  { phrase: "动漫", token: "anime illustration", weight: 2 },
  { phrase: "水彩", token: "watercolor texture", weight: 2 },
  { phrase: "油画", token: "oil painting texture", weight: 2 },
  { phrase: "胶片", token: "film grain", weight: 2 },
  { phrase: "梦幻", token: "dreamy atmosphere", weight: 2 },
  { phrase: "高对比", token: "high contrast noir", weight: 2 },
];

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "the",
  "of",
  "to",
  "for",
  "with",
  "in",
  "on",
  "at",
  "by",
  "from",
  "is",
  "are",
  "this",
  "that",
  "image",
  "photo",
  "illustration",
  "art",
  "style",
  "作品",
  "图片",
  "风格",
  "视觉",
  "一个",
  "一种",
]);

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;

  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((c) => Number.isNaN(c))) return null;
  return { r, g, b };
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s =
    delta === 0
      ? 0
      : delta / (1 - Math.abs(2 * l - 1));

  return { h, s, l };
}

function detectPalette(colors: Array<string | null | undefined>): "warm" | "cool" | "neutral" | "mixed" {
  let warm = 0;
  let cool = 0;
  let neutral = 0;

  for (const color of colors) {
    if (!color) continue;
    const rgb = parseHexColor(color);
    if (!rgb) continue;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    if (hsl.s < 0.12) {
      neutral += 1;
      continue;
    }

    if (hsl.h < 70 || hsl.h >= 300) {
      warm += 1;
    } else if (hsl.h >= 150 && hsl.h < 280) {
      cool += 1;
    } else {
      neutral += 1;
    }
  }

  if (warm === 0 && cool === 0 && neutral === 0) return "neutral";
  if (warm > 0 && cool > 0 && Math.abs(warm - cool) <= Math.ceil((warm + cool) * 0.35)) {
    return "mixed";
  }
  if (warm > cool && warm >= neutral) return "warm";
  if (cool > warm && cool >= neutral) return "cool";
  return "neutral";
}

function addToken(counts: Map<string, number>, token: string, weight = 1): void {
  counts.set(token, (counts.get(token) ?? 0) + weight);
}

function collectTokens(corpusParts: string[], colors: Array<string | null | undefined>): {
  tokens: string[];
  tokenWeights: Array<{ token: string; weight: number }>;
  palette: "warm" | "cool" | "neutral" | "mixed";
} {
  const counts = new Map<string, number>();
  const joined = corpusParts.join(" ").toLowerCase();

  for (const item of PHRASE_TOKEN_MAP) {
    if (joined.includes(item.phrase.toLowerCase())) {
      addToken(counts, item.token, item.weight);
    }
  }

  const words = joined.match(/[a-z][a-z0-9_-]{1,}/g) ?? [];
  for (const rawWord of words) {
    const word = rawWord.replace(/[_-]+/g, "");
    if (STOPWORDS.has(word)) continue;

    const mapped = WORD_TOKEN_MAP.get(word);
    if (mapped) {
      addToken(counts, mapped, 1.5);
      continue;
    }

    if (word.length >= 4) {
      addToken(counts, word, 1);
    }
  }

  const palette = detectPalette(colors);
  if (palette === "warm") addToken(counts, "warm color palette", 2);
  if (palette === "cool") addToken(counts, "cool color palette", 2);
  if (palette === "neutral") addToken(counts, "neutral color palette", 1.5);
  if (palette === "mixed") addToken(counts, "balanced color contrast", 2);

  const sorted = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([token, weight]) => ({ token, weight: Number(weight.toFixed(2)) }));

  const tokens = sorted.map((it) => it.token);
  return { tokens, tokenWeights: sorted, palette };
}

function buildPositivePrompt(
  creativeGoal: string | null,
  styleTokens: string[],
): string {
  const goal = creativeGoal && creativeGoal.trim().length > 0
    ? creativeGoal.trim()
    : "subject faithful to the current sequence intent";

  const stylePart = styleTokens.length > 0
    ? styleTokens.join(", ")
    : "clean composition, coherent style";

  return [
    goal,
    stylePart,
    "high detail",
    "professional lighting",
    "clear focal subject",
    "consistent visual language",
  ].join(", ");
}

function buildNegativePrompt(): string {
  return [
    "low quality",
    "blurry",
    "watermark",
    "extra text",
    "artifact",
    "distorted anatomy",
    "overexposed",
    "underexposed",
  ].join(", ");
}

function toIsoString(value: Date | string): string {
  if (value instanceof Date) return value.toISOString();
  return value;
}

function parseJsonField(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

function toStyleProfile(rowRaw: unknown): StyleProfile {
  const row = StyleProfileDbRowSchema.parse(rowRaw);

  const parsedTokens = z.array(z.string()).safeParse(parseJsonField(row.style_tokens));
  const styleTokens = parsedTokens.success ? parsedTokens.data : [];

  const parsedRefs = z.array(StyleReferenceSchema).safeParse(parseJsonField(row.reference_images));
  const references = parsedRefs.success ? parsedRefs.data : [];

  const parsedAnalysis = StyleAnalysisSchema.safeParse(parseJsonField(row.analysis));
  const analysis = parsedAnalysis.success
    ? parsedAnalysis.data
    : {
      summary: "No analysis metadata",
      confidence: 0.5,
      palette: "neutral" as const,
      tokenWeights: [],
    };

  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    query: row.query,
    positivePrompt: row.positive_prompt,
    negativePrompt: row.negative_prompt ?? "",
    styleTokens,
    references,
    analysis,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

async function fetchJsonWithTimeout(
  url: string,
  init: RequestInit,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function searchUnsplash(
  query: string,
  page: number,
  perPage: number,
): Promise<StyleReference[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  }

  const url =
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}` +
    `&page=${page}&per_page=${perPage}&orientation=landscape`;

  const raw = await fetchJsonWithTimeout(url, {
    headers: {
      Authorization: `Client-ID ${key}`,
      "Accept-Version": "v1",
    },
  });
  const parsed = UnsplashResponseSchema.parse(raw);

  return parsed.results.map((item) => ({
    source: "unsplash",
    sourceId: item.id,
    imageUrl: item.urls.regular,
    thumbUrl: item.urls.small,
    sourceUrl: item.links.html,
    title: item.description ?? item.alt_description ?? null,
    authorName: item.user.name,
    authorUrl: item.user.links.html,
    license: "Unsplash License",
    width: item.width ?? null,
    height: item.height ?? null,
    color: item.color ?? null,
    tags: item.tags?.map((tag) => tag.title) ?? [],
  }));
}

async function searchPexels(
  query: string,
  page: number,
  perPage: number,
): Promise<StyleReference[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error("PEXELS_API_KEY is not configured");
  }

  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}` +
    `&page=${page}&per_page=${perPage}&orientation=landscape`;

  const raw = await fetchJsonWithTimeout(url, {
    headers: {
      Authorization: key,
    },
  });
  const parsed = PexelsResponseSchema.parse(raw);

  return parsed.photos.map((item) => ({
    source: "pexels",
    sourceId: String(item.id),
    imageUrl: item.src.large2x ?? item.src.large ?? item.src.medium ?? item.src.small ?? item.url,
    thumbUrl: item.src.small ?? item.src.medium ?? null,
    sourceUrl: item.url,
    title: item.alt ?? null,
    authorName: item.photographer ?? null,
    authorUrl: item.photographer_url ?? null,
    license: "Pexels License",
    width: item.width ?? null,
    height: item.height ?? null,
    color: item.avg_color ?? null,
    tags: item.alt ? item.alt.split(/\s+/).filter((v) => v.length > 0).slice(0, 8) : [],
  }));
}

async function searchPixabay(
  query: string,
  page: number,
  perPage: number,
): Promise<StyleReference[]> {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) {
    throw new Error("PIXABAY_API_KEY is not configured");
  }

  const url =
    `https://pixabay.com/api/?key=${encodeURIComponent(key)}` +
    `&q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}` +
    "&image_type=photo&safesearch=true";

  const raw = await fetchJsonWithTimeout(url, { method: "GET" });
  const parsed = PixabayResponseSchema.parse(raw);

  return parsed.hits.map((item) => ({
    source: "pixabay",
    sourceId: String(item.id),
    imageUrl: item.largeImageURL ?? item.webformatURL ?? item.previewURL ?? item.pageURL,
    thumbUrl: item.previewURL ?? item.webformatURL ?? null,
    sourceUrl: item.pageURL,
    title: null,
    authorName: item.user ?? null,
    authorUrl: null,
    license: "Pixabay License",
    width: item.imageWidth ?? null,
    height: item.imageHeight ?? null,
    color: null,
    tags: item.tags
      ? item.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      : [],
  }));
}

function normalizeProviders(providers: PublicImageProvider[]): PublicImageProvider[] {
  const out: PublicImageProvider[] = [];
  for (const provider of providers) {
    if (out.includes(provider)) continue;
    out.push(provider);
  }
  return out;
}

function dedupeValues<T extends string>(items: T[]): T[] {
  const out: T[] = [];
  for (const item of items) {
    if (out.includes(item)) continue;
    out.push(item);
  }
  return out;
}

export async function searchStyleImages(
  params: SearchStyleImagesParams,
): Promise<SearchStyleImagesResult> {
  const query = params.query.trim();
  if (!query) throw new Error("Search query cannot be empty");

  const page = Math.max(1, Math.floor(params.page));
  const perPage = clamp(Math.floor(params.perPage), 1, 40);
  const providers = normalizeProviders(params.providers.length > 0
    ? params.providers
    : ["unsplash", "pexels", "pixabay"]);

  const tasks = providers.map(async (provider) => {
    try {
      let items: StyleReference[];
      if (provider === "unsplash") {
        items = await searchUnsplash(query, page, perPage);
      } else if (provider === "pexels") {
        items = await searchPexels(query, page, perPage);
      } else {
        items = await searchPixabay(query, page, perPage);
      }
      return {
        provider,
        status: "ok" as const,
        count: items.length,
        items,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const isMissingKey = message.includes("not configured");
      return {
        provider,
        status: isMissingKey ? "skipped" as const : "error" as const,
        count: 0,
        items: [] as StyleReference[],
        error: message,
      };
    }
  });

  const settled = await Promise.all(tasks);
  const items = settled
    .flatMap((result) => result.items)
    .sort((a, b) => a.source.localeCompare(b.source));

  const providerStatus: ProviderSearchStatus[] = settled.map((result) => ({
    provider: result.provider,
    status: result.status,
    count: result.count,
    error: result.error,
  }));

  return {
    query,
    page,
    perPage,
    items,
    providers: providerStatus,
  };
}

export async function createStyleProfile(
  input: CreateStyleProfileInput,
): Promise<StyleProfile> {
  const table = await physical(STYLE_PROFILE_TABLE);
  const { rows } = await bizPool.query(
    `INSERT INTO "${table}"
      (project_id, name, query, positive_prompt, negative_prompt, style_tokens, reference_images, analysis)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, project_id, name, query, positive_prompt, negative_prompt,
               style_tokens, reference_images, analysis, created_at, updated_at`,
    [
      input.projectId,
      input.name,
      input.query,
      input.positivePrompt,
      input.negativePrompt,
      JSON.stringify(input.styleTokens),
      JSON.stringify(input.references),
      JSON.stringify(input.analysis),
    ],
  );

  const row = rows[0];
  if (!row) throw new Error("Failed to create style profile");
  return toStyleProfile(row);
}

export async function listStyleProfiles(
  projectId: string | null,
): Promise<StyleProfile[]> {
  const table = await physical(STYLE_PROFILE_TABLE);

  const query = projectId
    ? `SELECT id, project_id, name, query, positive_prompt, negative_prompt,
              style_tokens, reference_images, analysis, created_at, updated_at
       FROM "${table}"
       WHERE project_id = $1 OR project_id IS NULL
       ORDER BY updated_at DESC, created_at DESC`
    : `SELECT id, project_id, name, query, positive_prompt, negative_prompt,
              style_tokens, reference_images, analysis, created_at, updated_at
       FROM "${table}"
       WHERE project_id IS NULL
       ORDER BY updated_at DESC, created_at DESC`;

  const { rows } = projectId
    ? await bizPool.query(query, [projectId])
    : await bizPool.query(query);

  return rows.map((row) => toStyleProfile(row));
}

export async function getStyleProfileById(
  profileId: string,
): Promise<StyleProfile | null> {
  const table = await physical(STYLE_PROFILE_TABLE);
  const { rows } = await bizPool.query(
    `SELECT id, project_id, name, query, positive_prompt, negative_prompt,
            style_tokens, reference_images, analysis, created_at, updated_at
     FROM "${table}"
     WHERE id = $1
     LIMIT 1`,
    [profileId],
  );

  const row = rows[0];
  return row ? toStyleProfile(row) : null;
}

export async function reverseStyleFromReferences(
  input: ReverseStyleInput,
): Promise<ReverseStyleResult> {
  const references = input.references;
  if (references.length === 0) {
    throw new Error("At least one reference image is required");
  }

  const corpus: string[] = [];
  if (input.query) corpus.push(input.query);
  if (input.creativeGoal) corpus.push(input.creativeGoal);

  for (const ref of references) {
    if (ref.title) corpus.push(ref.title);
    if (ref.authorName) corpus.push(ref.authorName);
    if (ref.tags.length > 0) corpus.push(ref.tags.join(" "));
    corpus.push(ref.source);
  }

  const colors = references.map((ref) => ref.color);
  const collected = collectTokens(corpus, colors);

  const styleTokens = collected.tokens.length > 0
    ? collected.tokens
    : ["clean composition", "consistent visual language"];

  const positivePrompt = buildPositivePrompt(input.creativeGoal, styleTokens);
  const negativePrompt = buildNegativePrompt();

  const confidenceRaw = 0.42
    + Math.min(references.length, 6) * 0.06
    + Math.min(styleTokens.length, 8) * 0.03;
  const confidence = Number(clamp(confidenceRaw, 0.35, 0.95).toFixed(2));

  const analysis: StyleAnalysis = {
    summary: `Extracted ${styleTokens.length} style tokens from ${references.length} reference image(s), palette=${collected.palette}.`,
    confidence,
    palette: collected.palette,
    tokenWeights: collected.tokenWeights,
  };

  let profile: StyleProfile | null = null;
  if (input.saveProfile) {
    profile = await createStyleProfile({
      projectId: input.projectId,
      memoryUser: input.memoryUser,
      name: input.profileName,
      query: input.query,
      positivePrompt,
      negativePrompt,
      styleTokens,
      references,
      analysis,
    });
  }

  if (input.memoryUser) {
    const providers = dedupeValues(
      references
        .map((ref) => {
          const parsed = MemoryProviderSchema.safeParse(ref.source);
          return parsed.success ? parsed.data : null;
        })
        .filter((provider): provider is z.infer<typeof MemoryProviderSchema> => provider !== null),
    );

    await recordPreferenceFeedback({
      memoryUser: input.memoryUser,
      projectId: input.projectId,
      sequenceKey: input.sequenceKey,
      eventType: "style_profile_saved",
      styleTokens,
      workflowPaths: [],
      rejectedWorkflowPaths: [],
      providers,
      editingHints: [],
      cameraHints: [],
      modelIds: [],
      positivePrompt,
      negativePrompt,
      query: input.query,
      strength: 1,
      note: profile ? `profile:${profile.id}` : "reverse_only",
    });
  }

  return {
    styleTokens,
    positivePrompt,
    negativePrompt,
    analysis,
    profile,
  };
}
