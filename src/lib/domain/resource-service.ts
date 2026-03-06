/**
 * Domain Resource Service — generic CRUD for the domain_resources table.
 *
 * No business concepts (characters, costumes, scenes, shots) — only
 * scope, category, and media_type.
 */

import { bizPool } from "@/lib/biz-db";
import { resolveTable, GLOBAL_USER } from "@/lib/biz-db-namespace";
import { ensureDomainResourcesTable, DOMAIN_RESOURCES_TABLE } from "./resource-schema";
import { prisma } from "@/lib/db";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

export interface ResourceScopeFilter {
  scopeType: string;
  scopeId: string;
}

type ResourcePayloadType =
  | "null"
  | "boolean"
  | "number"
  | "string"
  | "array"
  | "object";

const RESOURCE_DATA_ENVELOPE_VERSION = 2;

interface ResourceDataEnvelope {
  __af_resource_data_v: typeof RESOURCE_DATA_ENVELOPE_VERSION;
  encoding: "utf-8";
  payloadType: ResourcePayloadType;
  payload: unknown;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function physical(): Promise<string> {
  await ensureDomainResourcesTable();
  const resolved = await resolveTable(GLOBAL_USER, DOMAIN_RESOURCES_TABLE);
  if (!resolved) throw new Error("domain_resources table not found in BizTableMapping");
  return resolved.physicalName;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function looksLikeJsonDocument(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.length < 2) return false;
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return true;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) return true;
  if (trimmed.startsWith("\"{") && trimmed.endsWith("}\"")) return true;
  if (trimmed.startsWith("\"[") && trimmed.endsWith("]\"")) return true;
  return false;
}

function unwrapLegacyData(input: unknown): unknown {
  let current: unknown = input;
  for (let depth = 0; depth < 3; depth += 1) {
    if (typeof current !== "string") break;
    if (!looksLikeJsonDocument(current)) break;
    try {
      const parsed: unknown = JSON.parse(current);
      if (parsed === current) break;
      current = parsed;
    } catch {
      break;
    }
  }
  return current;
}

function payloadTypeOf(input: unknown): ResourcePayloadType {
  if (input === null) return "null";
  if (Array.isArray(input)) return "array";
  switch (typeof input) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    default:
      return "object";
  }
}

function isResourceDataEnvelope(input: unknown): input is ResourceDataEnvelope {
  if (!isRecord(input)) return false;
  return input.__af_resource_data_v === RESOURCE_DATA_ENVELOPE_VERSION
    && input.encoding === "utf-8"
    && typeof input.updatedAt === "string"
    && "payload" in input;
}

function encodeResourceData(data: unknown): ResourceDataEnvelope {
  const normalizedPayload = decodeResourceData(data);
  return {
    __af_resource_data_v: RESOURCE_DATA_ENVELOPE_VERSION,
    encoding: "utf-8",
    payloadType: payloadTypeOf(normalizedPayload),
    payload: normalizedPayload,
    updatedAt: new Date().toISOString(),
  };
}

function decodeResourceData(data: unknown): unknown {
  if (isResourceDataEnvelope(data)) {
    return unwrapLegacyData(data.payload);
  }
  return unwrapLegacyData(data);
}

function toResource(row: Record<string, unknown>): DomainResource {
  return {
    id: row.id as string,
    category: row.category as string,
    mediaType: row.media_type as string,
    title: (row.title as string | null) ?? null,
    url: (row.url as string | null) ?? null,
    data: decodeResourceData(row.data ?? null),
    keyResourceId: (row.key_resource_id as string | null) ?? (row.image_gen_id as string | null) ?? null,
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Query                                                              */
/* ------------------------------------------------------------------ */

/**
 * Get all resources for a given scope, grouped by category.
 */
export async function getResourcesByScope(
  scopeType: string,
  scopeId: string,
): Promise<CategoryGroup[]> {
  const t = await physical();
  const { rows } = await bizPool.query(
    `SELECT * FROM "${t}"
     WHERE scope_type = $1 AND scope_id = $2
     ORDER BY category, sort_order, created_at`,
    [scopeType, scopeId],
  );

  const groups = new Map<string, DomainResource[]>();
  for (const raw of rows as Array<Record<string, unknown>>) {
    const r = toResource(raw);
    const list = groups.get(r.category) ?? [];
    list.push(r);
    groups.set(r.category, list);
  }

  return [...groups.entries()].map(([category, items]) => ({ category, items }));
}

/**
 * Get resources by id, constrained to allowed scopes.
 * Used by context injection to avoid cross-project leakage.
 */
export async function getResourcesByIdsInScopes(
  resourceIds: string[],
  scopes: ResourceScopeFilter[],
): Promise<DomainResource[]> {
  if (resourceIds.length === 0 || scopes.length === 0) return [];

  const t = await physical();
  const tupleSql = scopes
    .map((_, index) => `($${index * 2 + 2}, $${index * 2 + 3})`)
    .join(", ");
  const scopeParams = scopes.flatMap((scope) => [scope.scopeType, scope.scopeId]);

  const { rows } = await bizPool.query(
    `SELECT *
     FROM "${t}"
     WHERE id::text = ANY($1::text[])
       AND (scope_type, scope_id) IN (VALUES ${tupleSql})
     ORDER BY category, sort_order, created_at`,
    [resourceIds, ...scopeParams],
  );

  return (rows as Array<Record<string, unknown>>).map(toResource);
}

/**
 * Collect all known image/video URLs from domain_resources for de-duplication
 * against KeyResource "other images".
 */
export async function collectKnownUrls(
  scopeType: string,
  scopeId: string,
): Promise<Set<string>> {
  const t = await physical();
  const { rows } = await bizPool.query(
    `SELECT url FROM "${t}"
     WHERE scope_type = $1 AND scope_id = $2
       AND url IS NOT NULL`,
    [scopeType, scopeId],
  );
  const urls = new Set<string>();
  for (const row of rows as Array<{ url: string }>) {
    urls.add(row.url);
  }
  return urls;
}

/* ------------------------------------------------------------------ */
/*  Mutate                                                             */
/* ------------------------------------------------------------------ */

export interface CreateResourceInput {
  scopeType: string;
  scopeId: string;
  category: string;
  mediaType: string;
  title?: string;
  url?: string;
  data?: unknown;
  keyResourceId?: string;
  sortOrder?: number;
}

/**
 * Insert a new resource into domain_resources.
 * Returns the generated UUID.
 */
export async function createResource(input: CreateResourceInput): Promise<string> {
  const t = await physical();
  const { rows } = await bizPool.query(
    `INSERT INTO "${t}"
       (scope_type, scope_id, category, media_type, title, url, data, key_resource_id, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id`,
    [
      input.scopeType,
      input.scopeId,
      input.category,
      input.mediaType,
      input.title ?? null,
      input.url ?? null,
      input.data === undefined ? null : encodeResourceData(input.data),
      input.keyResourceId ?? null,
      input.sortOrder ?? 0,
    ],
  );
  return (rows[0] as { id: string }).id;
}

/**
 * Upsert a resource by keyResourceId — if a row with the same key_resource_id
 * already exists in the same scope, update it; otherwise insert.
 */
export async function upsertByKeyResource(input: CreateResourceInput & { keyResourceId: string }): Promise<string> {
  const t = await physical();
  const { rows: existing } = await bizPool.query(
    `SELECT id FROM "${t}"
     WHERE scope_type = $1 AND scope_id = $2 AND key_resource_id = $3
     LIMIT 1`,
    [input.scopeType, input.scopeId, input.keyResourceId],
  );
  if ((existing as Array<{ id: string }>).length > 0) {
    const id = (existing[0] as { id: string }).id;
    await bizPool.query(
      `UPDATE "${t}"
       SET category = $1, title = $2, url = $3, data = $4, sort_order = $5
       WHERE id = $6`,
      [
        input.category,
        input.title ?? null,
        input.url ?? null,
        input.data === undefined ? null : encodeResourceData(input.data),
        input.sortOrder ?? 0,
        id,
      ],
    );
    return id;
  }
  return createResource(input);
}

/**
 * Delete all resources for a given scope (used when deleting an episode).
 */
export async function deleteResourcesByScope(
  scopeType: string,
  scopeId: string,
): Promise<void> {
  const t = await physical();
  await bizPool.query(
    `DELETE FROM "${t}" WHERE scope_type = $1 AND scope_id = $2`,
    [scopeType, scopeId],
  );
}

/**
 * Delete a single resource by id.
 * If the resource has a linked KeyResource, cascade-delete it
 * (KeyResourceVersion rows are removed by Prisma onDelete: Cascade).
 */
export async function deleteResource(id: string): Promise<void> {
  const t = await physical();

  // Fetch linked key_resource_id before deleting
  const { rows } = await bizPool.query(
    `SELECT key_resource_id FROM "${t}" WHERE id = $1 LIMIT 1`,
    [id],
  );
  const row = rows[0] as { key_resource_id: string | null } | undefined;
  const linkedId = row?.key_resource_id ?? null;

  // Delete the biz-db row
  await bizPool.query(`DELETE FROM "${t}" WHERE id = $1`, [id]);

  // Cascade-delete linked KeyResource (+ all versions) if present
  if (linkedId) {
    await prisma.keyResource.delete({ where: { id: linkedId } }).catch(() => {
      // KeyResource may already be gone or ID may not match — ignore
    });
  }
}

/**
 * Update the `data` JSONB field of a resource (for JSON editor).
 */
export async function updateResourceData(
  id: string,
  data: unknown,
): Promise<void> {
  const t = await physical();
  await bizPool.query(
    `UPDATE "${t}" SET data = $1 WHERE id = $2`,
    [encodeResourceData(data), id],
  );
}
