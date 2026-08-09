import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { aggregateCustomers } from "@/features/dashboard/utils/aggregate-customers";

export async function getCustomers(businessId: string, search?: string) {
  const orders = await repo.getCustomerOrders(businessId, search);
  return aggregateCustomers(orders);
}
