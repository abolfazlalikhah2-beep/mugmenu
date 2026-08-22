import "server-only";
import { prisma } from "@/lib/db";

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

export function updateBusinessPlan(businessId: string, planId: string, billingCycle: "MONTHLY" | "ANNUAL") {
  return prisma.business.update({ where: { id: businessId }, data: { planId, billingCycle } });
}
