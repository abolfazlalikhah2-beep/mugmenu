import "server-only";
import * as repo from "@/features/plans/repositories/plan-repository";
import { resolveFeatureAccess, type FeatureAccess } from "@/features/plans/services/feature-access";
import type { FeatureKey } from "@/features/plans/feature-matrix";

export type { FeatureAccess } from "@/features/plans/services/feature-access";

export interface BusinessFeatureSet {
  planKey: string;
  planName: string;
  keys: Set<string>;
  limits: Record<string, string | null>;
}

/**
 * One query for a whole page — pages/layouts that need to gate several
 * features should call this once and pass the result down, rather than
 * calling businessHasFeature() repeatedly per render.
 */
export async function getBusinessFeatureSet(businessId: string): Promise<BusinessFeatureSet | null> {
  const plan = await repo.getBusinessPlanFeatures(businessId);
  if (!plan) return null;
  const keys = new Set(plan.features.map((f) => f.featureKey));
  const limits: Record<string, string | null> = {};
  for (const f of plan.features) limits[f.featureKey] = f.limitValue;
  return { planKey: plan.key, planName: plan.name, keys, limits };
}

export async function getBusinessFeatureAccess(businessId: string, featureKey: FeatureKey): Promise<FeatureAccess> {
  const plan = await repo.getBusinessPlanFeatures(businessId);
  if (!plan) return { included: false, limit: null };
  return resolveFeatureAccess(plan.features, featureKey);
}

export async function businessHasFeature(businessId: string, featureKey: FeatureKey): Promise<boolean> {
  return (await getBusinessFeatureAccess(businessId, featureKey)).included;
}

export async function getBusinessFeatureLimit(businessId: string, featureKey: FeatureKey): Promise<string | null> {
  return (await getBusinessFeatureAccess(businessId, featureKey)).limit;
}

export function getAllPlans() {
  return repo.getAllPlansWithFeatures();
}

export function changeBusinessPlan(businessId: string, planId: string, billingCycle: "MONTHLY" | "ANNUAL") {
  return repo.updateBusinessPlan(businessId, planId, billingCycle);
}
