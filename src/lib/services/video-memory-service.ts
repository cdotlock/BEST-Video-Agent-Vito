import { z } from "zod";
import { bizPool } from "@/lib/biz-db";
import { resolveTable, GLOBAL_USER } from "@/lib/biz-db-namespace";
import { ensureVideoSchema } from "@/lib/video/schema";

const MEMORY_EVENTS_TABLE = "video_memory_events";
const MEMORY_PREFS_TABLE = "video_memory_preferences";

export type PreferenceEventType =
  | "style_profile_saved"
  | "style_profile_applied"
  | "generation_feedback"
  | "manual_feedback";

export const MemoryProviderSchema = z.enum(["unsplash", "pexels", "pixabay"]);
export type MemoryProvider = z.infer<typeof MemoryProviderSchema>;

export interface PreferenceFeedbackInput {
  memoryUser: string;
  projectId: string | null;
  sequenceKey: string | null;
  eventType: PreferenceEventType;
  styleTokens: string[];
  providers: MemoryProvider[];
  positivePrompt: string | null;
  negativePrompt: string | null;
  query: string | null;
  strength: number;
  note: string | null;
}

export interface MemoryRecommendations {
  memoryUser: string;
  enabled: true;
  preferredStyleTokens: string[];
  preferredProviders: MemoryProvider[];
  positivePromptHint: string | null;
  negativePromptHint: string | null;
  queryHint: string | null;
  totalPreferenceItems: number;
}

const PreferenceRowSchema = z.object({
  pref_key: z.string(),
  pref_value: z.string(),
  weight: z.union([z.number(), z.string()]),
  updated_at: z.union([z.date(), z.string()]),
});

function toNumber(value: number | string): number {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return parsed;
}

function normalizeMemoryUser(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "default";
}

function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

function dedupeList<T extends string>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

async function physical(logicalName: string): Promise<string> {
  await ensureVideoSchema();
  const resolved = await resolveTable(GLOBAL_USER, logicalName);
  if (!resolved) {
    throw new Error(`Video table "${logicalName}" not found in BizTableMapping`);
  }
  return resolved.physicalName;
}

async function upsertPreference(
  prefsTable: string,
  memoryUser: string,
  key: string,
  value: string,
  delta: number,
  source: PreferenceEventType,
): Promise<void> {
  if (value.trim().length === 0) return;
  await bizPool.query(
    `INSERT INTO "${prefsTable}" (memory_user, pref_key, pref_value, weight, last_source)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (memory_user, pref_key, pref_value)
     DO UPDATE SET
       weight = GREATEST(0, "${prefsTable}".weight + EXCLUDED.weight),
       last_source = EXCLUDED.last_source,
       updated_at = NOW()`,
    [memoryUser, key, value, delta, source],
  );
}

export async function recordPreferenceFeedback(input: PreferenceFeedbackInput): Promise<void> {
  const eventsTable = await physical(MEMORY_EVENTS_TABLE);
  const prefsTable = await physical(MEMORY_PREFS_TABLE);

  const memoryUser = normalizeMemoryUser(input.memoryUser);
  const strength = clamp(input.strength, -2, 2);

  const styleTokens = dedupeList(
    input.styleTokens
      .map((token) => normalizeToken(token))
      .filter((token) => token.length > 0),
  );

  const providers = dedupeList(input.providers);

  const payload = {
    styleTokens,
    providers,
    positivePrompt: input.positivePrompt,
    negativePrompt: input.negativePrompt,
    query: input.query,
    note: input.note,
    strength,
  };

  await bizPool.query(
    `INSERT INTO "${eventsTable}" (memory_user, project_id, sequence_key, event_type, payload)
     VALUES ($1, $2, $3, $4, $5)`,
    [memoryUser, input.projectId, input.sequenceKey, input.eventType, JSON.stringify(payload)],
  );

  for (const token of styleTokens) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "style_token",
      token,
      strength,
      input.eventType,
    );
  }

  for (const provider of providers) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "provider",
      provider,
      strength * 0.8,
      input.eventType,
    );
  }

  if (input.positivePrompt && input.positivePrompt.trim().length > 0) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "positive_prompt",
      input.positivePrompt.trim(),
      strength * 0.6,
      input.eventType,
    );
  }

  if (input.negativePrompt && input.negativePrompt.trim().length > 0) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "negative_prompt",
      input.negativePrompt.trim(),
      strength * 0.6,
      input.eventType,
    );
  }

  if (input.query && input.query.trim().length > 0) {
    await upsertPreference(
      prefsTable,
      memoryUser,
      "query_hint",
      input.query.trim(),
      strength * 0.5,
      input.eventType,
    );
  }

  await bizPool.query(
    `DELETE FROM "${prefsTable}"
     WHERE memory_user = $1 AND weight <= 0`,
    [memoryUser],
  );
}

export async function getMemoryRecommendations(
  memoryUserInput: string,
): Promise<MemoryRecommendations> {
  const prefsTable = await physical(MEMORY_PREFS_TABLE);
  const memoryUser = normalizeMemoryUser(memoryUserInput);

  const { rows } = await bizPool.query(
    `SELECT pref_key, pref_value, weight, updated_at
     FROM "${prefsTable}"
     WHERE memory_user = $1 AND weight > 0
     ORDER BY weight DESC, updated_at DESC
     LIMIT 300`,
    [memoryUser],
  );

  const parsedRows = rows
    .map((row) => PreferenceRowSchema.safeParse(row))
    .filter((result) => result.success)
    .map((result) => result.data);

  const styleTokenRows = parsedRows.filter((row) => row.pref_key === "style_token");
  const providerRows = parsedRows.filter((row) => row.pref_key === "provider");
  const positiveRows = parsedRows.filter((row) => row.pref_key === "positive_prompt");
  const negativeRows = parsedRows.filter((row) => row.pref_key === "negative_prompt");
  const queryRows = parsedRows.filter((row) => row.pref_key === "query_hint");

  const preferredStyleTokens = dedupeList(
    styleTokenRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .slice(0, 8)
      .map((row) => row.pref_value),
  );

  const preferredProviders = dedupeList(
    providerRows
      .sort((a, b) => toNumber(b.weight) - toNumber(a.weight))
      .map((row) => row.pref_value)
      .filter((value): value is MemoryProvider => MemoryProviderSchema.safeParse(value).success),
  ).slice(0, 3);

  const bestPositive = positiveRows[0]?.pref_value ?? null;
  const bestNegative = negativeRows[0]?.pref_value ?? null;
  const bestQuery = queryRows[0]?.pref_value ?? null;

  return {
    memoryUser,
    enabled: true,
    preferredStyleTokens,
    preferredProviders,
    positivePromptHint: bestPositive,
    negativePromptHint: bestNegative,
    queryHint: bestQuery,
    totalPreferenceItems: parsedRows.length,
  };
}

export async function clearMemory(memoryUserInput: string): Promise<{
  deletedEvents: number;
  deletedPreferences: number;
}> {
  const eventsTable = await physical(MEMORY_EVENTS_TABLE);
  const prefsTable = await physical(MEMORY_PREFS_TABLE);
  const memoryUser = normalizeMemoryUser(memoryUserInput);

  const eventsRes = await bizPool.query(
    `DELETE FROM "${eventsTable}" WHERE memory_user = $1`,
    [memoryUser],
  );
  const prefsRes = await bizPool.query(
    `DELETE FROM "${prefsTable}" WHERE memory_user = $1`,
    [memoryUser],
  );

  return {
    deletedEvents: eventsRes.rowCount ?? 0,
    deletedPreferences: prefsRes.rowCount ?? 0,
  };
}
