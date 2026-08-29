import "server-only";
import * as repo from "@/features/plans/repositories/plan-repository";
import { resolveFeatureAccess, type FeatureAccess } from "@/features/plans/services/feature-access";
import { isDemoEffective } from "@/features/plans/services/demo-access";
import type { FeatureKey } from "@/features/plans/feature-matrix";
import type { BillingCycle } from "@/features/plans/services/plan-dates";
import { logger } from "@/lib/logger";

export type { FeatureAccess } from "@/features/plans/services/feature-access";

export interface BusinessFeatureSet {
  planKey: string;
  planName: string;
  keys: Set<string>;
  limits: Record<string, string | null>;
}

const DEMO_PLAN_KEY = "menu-advanced";

/**
 * While a super-admin demo trial is active and not yet expired, the
 * business's actual planId is ignored and it's treated as menu-advanced —
 * see features/plans/services/demo-access.ts's isDemoEffective.
 */
async function resolveEffectivePlan(businessId: string) {
  const business = await repo.getBusinessPlanState(businessId);
  if (!business) return null;
  if (isDemoEffective(business)) {
    const demoPlan = await repo.getPlanByKey(DEMO_PLAN_KEY);
    if (demoPlan) return demoPlan;
  }
  return business.plan;
}

/**
 * One query for a whole page — pages/layouts that need to gate several
 * features should call this once and pass the result down, rather than
 * calling businessHasFeature() repeatedly per render.
 */
export async function getBusinessFeatureSet(businessId: string): Promise<BusinessFeatureSet | null> {
  const plan = await resolveEffectivePlan(businessId);
  if (!plan) return null;
  const keys = new Set(plan.features.map((f) => f.featureKey));
  const limits: Record<string, string | null> = {};
  for (const f of plan.features) limits[f.featureKey] = f.limitValue;

  // TEMP DEBUG — remove after diagnosing the menu-order lock bug.
  logger.info("plans.debug_feature_set", {
    businessId,
    effectivePlanId: plan.id,
    effectivePlanKey: plan.key,
    featureCount: keys.size,
    hasDiscountManualAuto: keys.has("discount.manual_auto"),
    hasOrderManualEntry: keys.has("order.manual_entry"),
  });

  return { planKey: plan.key, planName: plan.name, keys, limits };
}

export async function getBusinessFeatureAccess(businessId: string, featureKey: FeatureKey): Promise<FeatureAccess> {
  const plan = await resolveEffectivePlan(businessId);
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

export function changeBusinessPlan(businessId: string, planId: string, billingCycle: BillingCycle) {
  return repo.updateBusinessPlan(businessId, planId, billingCycle);
}
