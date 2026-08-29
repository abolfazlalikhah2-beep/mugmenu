import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { aggregateCustomers } from "@/features/dashboard/utils/aggregate-customers";
import { computeCustomerDetailStats, type CustomerDetailStats } from "@/features/dashboard/services/customer-detail";

export async function getCustomers(businessId: string, search?: string) {
  const orders = await repo.getCustomerOrders(businessId, search);
  return aggregateCustomers(orders);
}

export interface CustomerDetail {
  name: string;
  phone: string;
  stats: CustomerDetailStats;
}

/** null when this phone has no orders for this business — a stale/mistyped URL, not a real error. */
export async function getCustomerDetail(businessId: string, phone: string): Promise<CustomerDetail | null> {
  const orders = await repo.getCustomerOrdersWithItems(businessId, phone);
  const stats = computeCustomerDetailStats(orders);
  if (!stats) return null;

  return {
    name: orders[orders.length - 1].customerName,
    phone,
    stats,
  };
}
