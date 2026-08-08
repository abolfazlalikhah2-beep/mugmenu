import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import * as userRepo from "@/features/auth/repositories/user-repository";
import { computePlanStatus } from "@/features/dashboard/services/plan-status";

export async function getAccountOverview(businessId: string) {
  const business = await repo.getBusinessById(businessId);
  if (!business) return null;

  const userCount = await userRepo.countUsersForBusiness(businessId);
  const status = computePlanStatus(business.planStartedAt, business.planExpiresAt);

  return {
    planName: business.planName,
    planPriceToman: business.planPriceToman,
    planMaxUsers: business.planMaxUsers,
    planExpiresAt: business.planExpiresAt,
    userCount,
    status,
  };
}
