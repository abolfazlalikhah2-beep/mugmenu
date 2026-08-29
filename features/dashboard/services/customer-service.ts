import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { aggregateCustomers, type CustomerSummary } from "@/features/dashboard/utils/aggregate-customers";
import { computeCustomerDetailStats, type CustomerDetailStats } from "@/features/dashboard/services/customer-detail";
import {
  computeMembershipTier,
  DEFAULT_MEMBERSHIP_TIER_THRESHOLDS,
  type MembershipTier,
  type MembershipTierThresholds,
} from "@/features/dashboard/services/membership-tier";

export interface CustomerListRow extends CustomerSummary {
  tier: MembershipTier;
}

function thresholdsFromBusiness(business: MembershipTierThresholds | null): MembershipTierThresholds {
  return business ?? DEFAULT_MEMBERSHIP_TIER_THRESHOLDS;
}

export async function getCustomers(businessId: string, search?: string): Promise<CustomerListRow[]> {
  const [orders, business] = await Promise.all([
    repo.getCustomerOrders(businessId, search),
    repo.getBusinessById(businessId),
  ]);
  const thresholds = thresholdsFromBusiness(business);
  return aggregateCustomers(orders).map((c) => ({
    ...c,
    tier: computeMembershipTier(c.orderCount, c.totalSpend, thresholds),
  }));
}

export interface CustomerDetail {
  name: string;
  phone: string;
  tier: MembershipTier;
  stats: CustomerDetailStats;
}

/** null when this phone has no orders for this business — a stale/mistyped URL, not a real error. */
export async function getCustomerDetail(businessId: string, phone: string): Promise<CustomerDetail | null> {
  const [orders, business] = await Promise.all([
    repo.getCustomerOrdersWithItems(businessId, phone),
    repo.getBusinessById(businessId),
  ]);
  const stats = computeCustomerDetailStats(orders);
  if (!stats) return null;

  const thresholds = thresholdsFromBusiness(business);
  return {
    name: orders[orders.length - 1].customerName,
    phone,
    tier: computeMembershipTier(stats.orderCount, stats.totalSpend, thresholds),
    stats,
  };
}
