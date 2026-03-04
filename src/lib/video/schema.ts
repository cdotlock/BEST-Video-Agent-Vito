/**
 * Video workflow — schema bootstrap.
 *
 * Ensures the domain_resources table and video project/sequence/style tables exist in biz-db.
 * domain_resources is the single generic resource table (categories are data).
 * video_projects + video_sequences are the generic workflow containers.
 * video_style_profiles stores reusable style prompts/tokens/references.
 */

import { bizPool, bizDbReady } from "@/lib/biz-db";
import {
  resolveTable,
  ensureMapping,
  GLOBAL_USER,
} from "@/lib/biz-db-namespace";
import { ensureDomainResourcesTable } from "@/lib/domain/resource-schema";

/* ------------------------------------------------------------------ */
/*  Project / Sequence DDL                                              */
/* ------------------------------------------------------------------ */

const VIDEO_PROJECTS_LOGICAL = "video_projects";
const VIDEO_SEQUENCES_LOGICAL = "video_sequences";
const VIDEO_STYLE_PROFILES_LOGICAL = "video_style_profiles";
const VIDEO_MEMORY_EVENTS_LOGICAL = "video_memory_events";
const VIDEO_MEMORY_PREFS_LOGICAL = "video_memory_preferences";

const VIDEO_PROJECTS_DDL = `CREATE TABLE IF NOT EXISTS "$TABLE" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)`;

const VIDEO_SEQUENCES_DDL = `CREATE TABLE IF NOT EXISTS "$TABLE" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  sequence_key TEXT NOT NULL,
  sequence_name TEXT,
  sequence_content TEXT,
  active_style_profile_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`;

const VIDEO_STYLE_PROFILES_DDL = `CREATE TABLE IF NOT EXISTS "$TABLE" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT,
  name TEXT NOT NULL,
  query TEXT,
  positive_prompt TEXT NOT NULL,
  negative_prompt TEXT,
  style_tokens JSONB NOT NULL,
  reference_images JSONB NOT NULL,
  analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)`;

const VIDEO_MEMORY_EVENTS_DDL = `CREATE TABLE IF NOT EXISTS "$TABLE" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_user TEXT NOT NULL,
  project_id TEXT,
  sequence_key TEXT,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`;

const VIDEO_MEMORY_PREFS_DDL = `CREATE TABLE IF NOT EXISTS "$TABLE" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_user TEXT NOT NULL,
  pref_key TEXT NOT NULL,
  pref_value TEXT NOT NULL,
  weight DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (memory_user, pref_key, pref_value)
)`;

/* ------------------------------------------------------------------ */
/*  Ensure schema exists                                               */
/* ------------------------------------------------------------------ */

let ensured = false;
let ensuring: Promise<void> | null = null;

/**
 * Ensure video workflow tables exist in biz-db.
 * Safe to call multiple times — only runs once.
 */
export async function ensureVideoSchema(): Promise<void> {
  if (ensured) return;
  if (ensuring) {
    await ensuring;
    return;
  }

  ensuring = (async () => {
    await bizDbReady;

    // 1. domain_resources (generic)
    await ensureDomainResourcesTable();

    // 2. video_projects
    const projectsExisting = await resolveTable(GLOBAL_USER, VIDEO_PROJECTS_LOGICAL);
    let projectsTable: string;
    if (projectsExisting) {
      projectsTable = projectsExisting.physicalName;
      await bizPool.query(VIDEO_PROJECTS_DDL.replace("$TABLE", projectsTable));
    } else {
      projectsTable = await ensureMapping(GLOBAL_USER, VIDEO_PROJECTS_LOGICAL);
      await bizPool.query(VIDEO_PROJECTS_DDL.replace("$TABLE", projectsTable));
      console.log(`[video-schema] Created table "${VIDEO_PROJECTS_LOGICAL}" → "${projectsTable}"`);
    }

    // 3. video_sequences
    const sequencesExisting = await resolveTable(GLOBAL_USER, VIDEO_SEQUENCES_LOGICAL);
    let sequencesTable: string;
    if (sequencesExisting) {
      sequencesTable = sequencesExisting.physicalName;
      await bizPool.query(VIDEO_SEQUENCES_DDL.replace("$TABLE", sequencesTable));
    } else {
      sequencesTable = await ensureMapping(GLOBAL_USER, VIDEO_SEQUENCES_LOGICAL);
      await bizPool.query(VIDEO_SEQUENCES_DDL.replace("$TABLE", sequencesTable));
      console.log(`[video-schema] Created table "${VIDEO_SEQUENCES_LOGICAL}" → "${sequencesTable}"`);
    }

    // 4. Ensure required indexes (idempotent)
    await bizPool.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_${sequencesTable}_project_key
     ON "${sequencesTable}" (project_id, sequence_key)`,
    );
    await bizPool.query(
      `ALTER TABLE "${sequencesTable}" ADD COLUMN IF NOT EXISTS active_style_profile_id TEXT`,
    );
    await bizPool.query(
      `CREATE INDEX IF NOT EXISTS idx_${sequencesTable}_active_style_profile
     ON "${sequencesTable}" (active_style_profile_id)`,
    );

    // 5. video_style_profiles
    const styleExisting = await resolveTable(GLOBAL_USER, VIDEO_STYLE_PROFILES_LOGICAL);
    let styleTable: string;
    if (styleExisting) {
      styleTable = styleExisting.physicalName;
      await bizPool.query(VIDEO_STYLE_PROFILES_DDL.replace("$TABLE", styleTable));
    } else {
      styleTable = await ensureMapping(GLOBAL_USER, VIDEO_STYLE_PROFILES_LOGICAL);
      await bizPool.query(VIDEO_STYLE_PROFILES_DDL.replace("$TABLE", styleTable));
      console.log(`[video-schema] Created table "${VIDEO_STYLE_PROFILES_LOGICAL}" → "${styleTable}"`);
    }

    await bizPool.query(
      `CREATE INDEX IF NOT EXISTS idx_${styleTable}_project_id
     ON "${styleTable}" (project_id, updated_at DESC)`,
    );

    // 6. video_memory_events
    const memoryEventsExisting = await resolveTable(GLOBAL_USER, VIDEO_MEMORY_EVENTS_LOGICAL);
    let memoryEventsTable: string;
    if (memoryEventsExisting) {
      memoryEventsTable = memoryEventsExisting.physicalName;
      await bizPool.query(VIDEO_MEMORY_EVENTS_DDL.replace("$TABLE", memoryEventsTable));
    } else {
      memoryEventsTable = await ensureMapping(GLOBAL_USER, VIDEO_MEMORY_EVENTS_LOGICAL);
      await bizPool.query(VIDEO_MEMORY_EVENTS_DDL.replace("$TABLE", memoryEventsTable));
      console.log(`[video-schema] Created table "${VIDEO_MEMORY_EVENTS_LOGICAL}" → "${memoryEventsTable}"`);
    }
    await bizPool.query(
      `CREATE INDEX IF NOT EXISTS idx_${memoryEventsTable}_memory_user_created
     ON "${memoryEventsTable}" (memory_user, created_at DESC)`,
    );

    // 7. video_memory_preferences
    const memoryPrefsExisting = await resolveTable(GLOBAL_USER, VIDEO_MEMORY_PREFS_LOGICAL);
    let memoryPrefsTable: string;
    if (memoryPrefsExisting) {
      memoryPrefsTable = memoryPrefsExisting.physicalName;
      await bizPool.query(VIDEO_MEMORY_PREFS_DDL.replace("$TABLE", memoryPrefsTable));
    } else {
      memoryPrefsTable = await ensureMapping(GLOBAL_USER, VIDEO_MEMORY_PREFS_LOGICAL);
      await bizPool.query(VIDEO_MEMORY_PREFS_DDL.replace("$TABLE", memoryPrefsTable));
      console.log(`[video-schema] Created table "${VIDEO_MEMORY_PREFS_LOGICAL}" → "${memoryPrefsTable}"`);
    }
    await bizPool.query(
      `CREATE INDEX IF NOT EXISTS idx_${memoryPrefsTable}_memory_user_weight
     ON "${memoryPrefsTable}" (memory_user, weight DESC)`,
    );

    ensured = true;
  })();

  try {
    await ensuring;
  } finally {
    ensuring = null;
  }
}

/** The logical names of all video workflow tables. */
export const VIDEO_TABLE_NAMES = [
  "domain_resources",
  "video_projects",
  "video_sequences",
  "video_style_profiles",
  "video_memory_events",
  "video_memory_preferences",
];
