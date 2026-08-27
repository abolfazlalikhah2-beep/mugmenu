import "server-only";
import { prisma } from "@/lib/db";
import { computePlanDates, type BillingCycle } from "@/features/plans/services/plan-dates";

export function getAllPlansWithFeatures() {
  return prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
    include: { features: true },
  });
}

export function getPlanByKey(key: string) {
  return prisma.plan.findUnique({ where: { key }, include: { features: true } });
}

export async function getBusinessPlanState(businessId: string) {
  return prisma.business.findUnique({
    where: { id: businessId },
    select: {
      isDemoActive: true,
      demoExpiresAt: true,
      plan: { select: { key: true, name: true, features: true } },
    },
  });
}

// planId, billingCycle, planStartedAt, and planExpiresAt must ALWAYS be
// written together, never in isolation — planExpiresAt only makes sense
// relative to the billingCycle that produced it (30 days for MONTHLY, 365
// for ANNUAL, see computePlanDates). Writing billingCycle without
// recomputing planExpiresAt (or vice versa) leaves a business's plan window
// silently wrong — e.g. an ANNUAL business stuck with a 30-day expiry — with
// no error, since Prisma has no way to enforce this invariant across columns.
// Every call site that changes a business's plan/cycle (this function,
// dashboard-repository's createBusiness at onboarding, superadmin's
// renewSubscriptionManually) must go through computePlanDates.
export function updateBusinessPlan(businessId: string, planId: string, billingCycle: BillingCycle) {
  const { planStartedAt, planExpiresAt } = computePlanDates(billingCycle);

  return prisma.business.update({
    where: { id: businessId },
    data: { planId, billingCycle, planStartedAt, planExpiresAt },
  });
}
