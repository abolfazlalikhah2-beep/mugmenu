/**
 * Pure parsing of prisma/schema.prisma's relation graph — no Prisma client,
 * no DB connection. Used by business-delete-coverage.test.ts to check that
 * features/superadmin's deleteBusinessCascade() still accounts for every
 * model that (directly or transitively) carries a foreign key back to
 * Business, so a newly added model with a `businessId` (or a model hanging
 * off one of Business's children) can't silently escape cleanup.
 */

export interface RelationEdge {
  /** The model that holds the foreign key (the "many" side of a belongs-to). */
  child: string;
  /** The model the foreign key points at. */
  parent: string;
  /** e.g. "Cascade" / "SetNull" / "Restrict" — absent means Prisma's default (no cascade). */
  onDelete: string | null;
  field: string;
}

const MODEL_BLOCK_RE = /model\s+(\w+)\s*\{([\s\S]*?)\n\}/g;
// A field line that owns a `@relation(fields: [...], references: [...])` —
// the back-reference side (array type, named relation with no `fields:`)
// is intentionally not matched, since it's the same edge from the other
// model's perspective.
const RELATION_FIELD_RE = /^\s*(\w+)\s+(\w+)(\?)?\s*(\[\])?\s*@relation\(([^)]*)\)/gm;

export function parseRelationEdges(schemaText: string): RelationEdge[] {
  const edges: RelationEdge[] = [];
  let modelMatch: RegExpExecArray | null;
  MODEL_BLOCK_RE.lastIndex = 0;
  while ((modelMatch = MODEL_BLOCK_RE.exec(schemaText))) {
    const modelName = modelMatch[1];
    const body = modelMatch[2];
    let fieldMatch: RegExpExecArray | null;
    RELATION_FIELD_RE.lastIndex = 0;
    while ((fieldMatch = RELATION_FIELD_RE.exec(body))) {
      const [, fieldName, fieldType, , , relationArgs] = fieldMatch;
      if (!relationArgs.includes("fields:")) continue;
      const onDeleteMatch = relationArgs.match(/onDelete:\s*(\w+)/);
      edges.push({ child: modelName, parent: fieldType, onDelete: onDeleteMatch?.[1] ?? null, field: fieldName });
    }
  }
  return edges;
}

/** Every model with a (possibly multi-hop) foreign-key chain ending at `target`. */
export function computeDependents(edges: RelationEdge[], target: string): Set<string> {
  const dependents = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of edges) {
      if (e.child === target) continue;
      if ((e.parent === target || dependents.has(e.parent)) && !dependents.has(e.child)) {
        dependents.add(e.child);
        changed = true;
      }
    }
  }
  return dependents;
}

/**
 * Starting from `seedModels` (models already known to be removed — either
 * explicitly, or because they're the root itself), follows `onDelete:
 * Cascade` edges forward to find every model the database will delete on
 * its own as a side effect.
 */
export function computeAutoCascaded(edges: RelationEdge[], seedModels: Iterable<string>): Set<string> {
  const covered = new Set(seedModels);
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of edges) {
      if (e.onDelete === "Cascade" && covered.has(e.parent) && !covered.has(e.child)) {
        covered.add(e.child);
        changed = true;
      }
    }
  }
  return covered;
}
