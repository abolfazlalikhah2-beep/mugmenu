import type { FeatureKey } from "@/features/plans/feature-matrix";

export interface FeatureAccess {
  included: boolean;
  limit: string | null;
}

export interface FeatureRow {
  featureKey: string;
  limitValue: string | null;
}

/** Pure — no I/O — so it's trivial to unit test against the seeded matrix. */
export function resolveFeatureAccess(rows: FeatureRow[], featureKey: FeatureKey): FeatureAccess {
  const row = rows.find((r) => r.featureKey === featureKey);
  return row ? { included: true, limit: row.limitValue } : { included: false, limit: null };
}
