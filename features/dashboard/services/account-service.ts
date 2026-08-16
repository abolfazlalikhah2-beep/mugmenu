import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import * as userRepo from "@/features/auth/repositories/user-repository";
import { computePlanStatus } from "@/features/dashboard/services/plan-status";
import { getBusinessFeatureSet } from "@/features/plans/services/plan-service";
import { FEATURE_LABELS } from "@/features/plans/feature-labels";
import type { FeatureKey } from "@/features/plans/feature-matrix";

export async function getAccountOverview(businessId: string) {
  const business = await repo.getBusinessWithPlan(businessId);
  if (!business) return null;

  const [userCount, featureSet] = await Promise.all([
    userRepo.countUsersForBusiness(businessId),
    getBusinessFeatureSet(businessId),
  ]);
  const status = computePlanStatus(business.planStartedAt, business.planExpiresAt);
  const priceToman = business.billingCycle === "ANNUAL" ? business.plan.annualPrice : business.plan.monthlyPrice;
  const featureLabels = featureSet
    ? [...featureSet.keys].map((key) => FEATURE_LABELS[key as FeatureKey]).filter(Boolean)
    : [];

  return {
    planName: business.plan.name,
    planPriceToman: priceToman,
    planMaxUsers: business.planMaxUsers,
    planExpiresAt: business.planExpiresAt,
    userCount,
    status,
    featureLabels,
  };
}
