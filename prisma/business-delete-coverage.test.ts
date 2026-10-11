import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { computeAutoCascaded, computeDependents, parseRelationEdges } from "./schema-graph";

/**
 * Guards features/superadmin's deleteBusinessCascade() against schema
 * drift: every model that has a foreign-key chain back to Business must
 * either be explicitly deleted inside deleteBusinessCascade(), or be
 * `onDelete: Cascade`-removed by the database as a consequence of one of
 * those explicit deletes (e.g. ProductOptionGroup/ProductOption cascading
 * off Product). If someone adds a new `businessId` column (or hangs a model
 * off an existing child of Business) without updating the cascade, this
 * test fails instead of the super admin hitting a foreign-key-violation
 * error — or worse, silently leaving orphaned rows if the schema is later
 * changed to cascade.
 *
 * Reads the repository file as plain text (rather than importing it) so
 * this test doesn't need a live Postgres connection or to fight the
 * `import "server-only"` guard at the top of that module.
 */

const schemaText = fs.readFileSync(path.join(import.meta.dirname, "schema.prisma"), "utf8");
const repositoryText = fs.readFileSync(
  path.join(import.meta.dirname, "..", "features", "superadmin", "repositories", "superadmin-repository.ts"),
  "utf8"
);

function extractCascadeFunctionBody(source: string): string {
  const start = source.indexOf("export function deleteBusinessCascade");
  if (start === -1) throw new Error("deleteBusinessCascade() not found in superadmin-repository.ts");
  const end = source.indexOf("\n}", start);
  return source.slice(start, end);
}

function delegateToModelName(delegate: string): string {
  return delegate.charAt(0).toUpperCase() + delegate.slice(1);
}

function extractExplicitlyDeletedModels(cascadeBody: string): Set<string> {
  const models = new Set<string>();
  const callRe = /prisma\.(\w+)\.(deleteMany|delete)\(/g;
  let m: RegExpExecArray | null;
  while ((m = callRe.exec(cascadeBody))) {
    models.add(delegateToModelName(m[1]));
  }
  return models;
}

describe("deleteBusinessCascade coverage", () => {
  const edges = parseRelationEdges(schemaText);
  const dependents = computeDependents(edges, "Business");
  const cascadeBody = extractCascadeFunctionBody(repositoryText);
  const explicitlyDeleted = extractExplicitlyDeletedModels(cascadeBody);

  it("deletes the Business row itself", () => {
    expect(explicitlyDeleted.has("Business")).toBe(true);
  });

  it("covers every model with a foreign-key chain back to Business", () => {
    const covered = computeAutoCascaded(edges, explicitlyDeleted);
    const missing = [...dependents].filter((model) => !covered.has(model)).sort();

    if (missing.length > 0) {
      throw new Error(
        `deleteBusinessCascade() in features/superadmin/repositories/superadmin-repository.ts is missing: ${missing.join(", ")}. ` +
          "Add an explicit prisma.<model>.deleteMany({ where: ... }) for each (in an order that respects " +
          "its own foreign keys) before the final business delete."
      );
    }
    expect(missing).toEqual([]);
  });

  it("only deletes models that actually depend on Business (sanity check on the graph parser)", () => {
    // Business itself and anything the cascade touches that ISN'T a real
    // dependent would mean the parser or the cascade disagree about the
    // schema — worth a loud failure rather than a silently-wrong allowlist.
    const extra = [...explicitlyDeleted].filter((model) => model !== "Business" && !dependents.has(model));
    expect(extra).toEqual([]);
  });
});
