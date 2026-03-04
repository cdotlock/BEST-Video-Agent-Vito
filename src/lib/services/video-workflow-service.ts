/**
 * Video Workflow Service — generic project/sequence data access for video UI.
 *
 * Uses:
 * - domain_resources (generic media/material store)
 * - video_projects (project container)
 * - video_sequences (sequence container)
 */

import { randomUUID } from "node:crypto";
import { bizPool } from "@/lib/biz-db";
import { resolveTable, GLOBAL_USER } from "@/lib/biz-db-namespace";
import { ensureVideoSchema } from "@/lib/video/schema";
import { prisma } from "@/lib/db";
import {
  getResourcesByScope,
  deleteResourcesByScope,
  updateResourceData,
  deleteResource,
} from "@/lib/domain/resource-service";
import type {
  DomainResource,
  CategoryGroup,
  DomainResources,
} from "@/lib/domain/resource-service";

export type { DomainResource, CategoryGroup, DomainResources };

/* ------------------------------------------------------------------ */
/*  Helper: resolve physical table name                                */
/* ------------------------------------------------------------------ */

async function physical(logicalName: string): Promise<string> {
  await ensureVideoSchema();
  const resolved = await resolveTable(GLOBAL_USER, logicalName);
  if (!resolved) throw new Error(`Video table "${logicalName}" not found in BizTableMapping`);
  return resolved.physicalName;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface VideoProjectSummary {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SequenceStatus = "empty" | "uploaded" | "has_resources";

export interface VideoSequenceSummary {
  id: string;
  projectId: string;
  sequenceKey: string;
  sequenceName: string | null;
  activeStyleProfileId: string | null;
  status: SequenceStatus;
  createdAt: string;
}

export interface SequenceRuntimeContext {
  sequenceId: string;
  sequenceContent: string | null;
  activeStyleProfileId: string | null;
}

/* ------------------------------------------------------------------ */
/*  Project CRUD                                                       */
/* ------------------------------------------------------------------ */

export async function listProjects(): Promise<VideoProjectSummary[]> {
  const tProjects = await physical("video_projects");
  const { rows } = await bizPool.query(
    `SELECT id, name, description, created_at, updated_at
     FROM "${tProjects}"
     ORDER BY updated_at DESC, created_at DESC`,
  );

  return (rows as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    description: row.description == null ? null : String(row.description),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }));
}

export async function createProject(
  name: string,
  description: string | null,
): Promise<{ id: string }> {
  const tProjects = await physical("video_projects");
  const id = randomUUID();
  const { rows } = await bizPool.query(
    `INSERT INTO "${tProjects}" (id, name, description)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [id, name, description],
  );
  const row = rows[0] as { id: string } | undefined;
  if (!row) throw new Error("Failed to create project");
  return row;
}

/* ------------------------------------------------------------------ */
/*  Sequence CRUD                                                      */
/* ------------------------------------------------------------------ */

export async function listSequences(projectId: string): Promise<VideoSequenceSummary[]> {
  const tSeq = await physical("video_sequences");
  const { rows: sequences } = await bizPool.query(
    `SELECT id, project_id, sequence_key, sequence_name,
            active_style_profile_id,
            sequence_content IS NOT NULL AS has_content,
            created_at
     FROM "${tSeq}"
     WHERE project_id = $1
     ORDER BY sequence_key`,
    [projectId],
  );

  const out: VideoSequenceSummary[] = [];
  for (const row of sequences as Array<Record<string, unknown>>) {
    const sequenceId = String(row.id);
    const hasContent = row.has_content === true;
    let hasResources = false;
    if (hasContent) {
      const groups = await getResourcesByScope("sequence", sequenceId);
      hasResources = groups.length > 0;
    }

    out.push({
      id: sequenceId,
      projectId: String(row.project_id),
      sequenceKey: String(row.sequence_key),
      sequenceName: row.sequence_name == null ? null : String(row.sequence_name),
      activeStyleProfileId:
        row.active_style_profile_id == null ? null : String(row.active_style_profile_id),
      status: !hasContent ? "empty" : hasResources ? "has_resources" : "uploaded",
      createdAt: String(row.created_at),
    });
  }

  return out;
}

export async function createSequence(
  projectId: string,
  sequenceKey: string,
  sequenceName: string | null,
  sequenceContent: string | null,
): Promise<{ id: string }> {
  const tSeq = await physical("video_sequences");
  const { rows } = await bizPool.query(
    `INSERT INTO "${tSeq}" (project_id, sequence_key, sequence_name, sequence_content)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (project_id, sequence_key)
     DO UPDATE SET
       sequence_name = EXCLUDED.sequence_name,
       sequence_content = EXCLUDED.sequence_content
     RETURNING id`,
    [projectId, sequenceKey, sequenceName, sequenceContent],
  );
  const row = rows[0] as { id: string } | undefined;
  if (!row) throw new Error("Failed to create sequence");
  return row;
}

export async function deleteSequence(sequenceId: string): Promise<void> {
  const tSeq = await physical("video_sequences");

  // Lookup project_id + sequence_key for session cleanup.
  const { rows: seqRows } = await bizPool.query(
    `SELECT project_id, sequence_key FROM "${tSeq}" WHERE id = $1 LIMIT 1`,
    [sequenceId],
  );
  const seqRow = seqRows[0] as { project_id: string; sequence_key: string } | undefined;

  await deleteResourcesByScope("sequence", sequenceId);
  await bizPool.query(`DELETE FROM "${tSeq}" WHERE id = $1`, [sequenceId]);

  if (seqRow) {
    const userName = `video:${seqRow.project_id}:${seqRow.sequence_key}`;
    const user = await prisma.user.findUnique({ where: { name: userName } });
    if (user) {
      await prisma.chatSession.deleteMany({ where: { userId: user.id } });
    }
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const tProjects = await physical("video_projects");
  const tSeq = await physical("video_sequences");

  // 1) Cleanup project-level resources.
  await deleteResourcesByScope("project", projectId);

  // 2) Find all sequences for cleanup.
  const { rows } = await bizPool.query(
    `SELECT id, sequence_key FROM "${tSeq}" WHERE project_id = $1`,
    [projectId],
  );
  for (const row of rows as Array<{ id: string; sequence_key: string }>) {
    await deleteResourcesByScope("sequence", row.id);

    const userName = `video:${projectId}:${row.sequence_key}`;
    const user = await prisma.user.findUnique({ where: { name: userName } });
    if (user) {
      await prisma.chatSession.deleteMany({ where: { userId: user.id } });
    }
  }

  // 3) Delete sequences then project.
  await bizPool.query(`DELETE FROM "${tSeq}" WHERE project_id = $1`, [projectId]);
  await bizPool.query(`DELETE FROM "${tProjects}" WHERE id = $1`, [projectId]);
}

/* ------------------------------------------------------------------ */
/*  Resources                                                          */
/* ------------------------------------------------------------------ */

export async function getResources(
  sequenceId: string,
  projectId: string,
): Promise<DomainResources> {
  const [projectGroups, sequenceGroups] = await Promise.all([
    getResourcesByScope("project", projectId),
    getResourcesByScope("sequence", sequenceId),
  ]);

  const merged = new Map<string, DomainResource[]>();
  for (const g of [...projectGroups, ...sequenceGroups]) {
    const existing = merged.get(g.category);
    if (existing) {
      existing.push(...g.items);
    } else {
      merged.set(g.category, [...g.items]);
    }
  }

  return {
    categories: [...merged.entries()].map(([category, items]) => ({ category, items })),
  };
}

/* ------------------------------------------------------------------ */
/*  Resource mutations                                                 */
/* ------------------------------------------------------------------ */

export { updateResourceData, deleteResource };

export async function getSequenceContent(sequenceId: string): Promise<string | null> {
  const tSeq = await physical("video_sequences");
  const { rows } = await bizPool.query(
    `SELECT sequence_content FROM "${tSeq}" WHERE id = $1 LIMIT 1`,
    [sequenceId],
  );
  const row = rows[0] as { sequence_content: string | null } | undefined;
  return row?.sequence_content ?? null;
}

export async function getSequenceStatus(sequenceId: string): Promise<SequenceStatus> {
  const tSeq = await physical("video_sequences");
  const { rows } = await bizPool.query(
    `SELECT sequence_content IS NOT NULL AS has_content
     FROM "${tSeq}"
     WHERE id = $1`,
    [sequenceId],
  );
  const row = rows[0] as { has_content: boolean } | undefined;
  if (!row || !row.has_content) return "empty";

  const groups = await getResourcesByScope("sequence", sequenceId);
  return groups.length > 0 ? "has_resources" : "uploaded";
}

export async function setSequenceStyleProfile(
  sequenceId: string,
  profileId: string | null,
): Promise<void> {
  const tSeq = await physical("video_sequences");
  await bizPool.query(
    `UPDATE "${tSeq}"
     SET active_style_profile_id = $1
     WHERE id = $2`,
    [profileId, sequenceId],
  );
}

export async function getSequenceRuntimeContext(
  projectId: string,
  sequenceKey: string,
): Promise<SequenceRuntimeContext | null> {
  const tSeq = await physical("video_sequences");
  const { rows } = await bizPool.query(
    `SELECT id, sequence_content, active_style_profile_id
     FROM "${tSeq}"
     WHERE project_id = $1 AND sequence_key = $2
     LIMIT 1`,
    [projectId, sequenceKey],
  );
  const row = rows[0] as
    | {
      id: string;
      sequence_content: string | null;
      active_style_profile_id: string | null;
    }
    | undefined;

  if (!row) return null;
  return {
    sequenceId: row.id,
    sequenceContent: row.sequence_content,
    activeStyleProfileId: row.active_style_profile_id,
  };
}
