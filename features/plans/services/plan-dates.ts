export type BillingCycle = "MONTHLY" | "SIX_MONTH" | "ANNUAL";

export interface PlanDates {
  planStartedAt: Date;
  planExpiresAt: Date;
}

const CYCLE_DAYS: Record<BillingCycle, number> = {
  MONTHLY: 30,
  SIX_MONTH: 183,
  ANNUAL: 365,
};

/**
 * Single source of truth for the planStartedAt/planExpiresAt window implied
 * by a billing cycle. Pure — no I/O — so every write site that sets
 * billingCycle (plan-repository's updateBusinessPlan, superadmin's
 * renewSubscriptionManually, onboarding's createBusiness) computes the same
 * dates instead of re-implementing the day math and risking drift.
 */
export function computePlanDates(billingCycle: BillingCycle, from = new Date()): PlanDates {
  const planStartedAt = new Date(from);
  const planExpiresAt = new Date(from);
  planExpiresAt.setDate(planExpiresAt.getDate() + CYCLE_DAYS[billingCycle]);
  return { planStartedAt, planExpiresAt };
}
