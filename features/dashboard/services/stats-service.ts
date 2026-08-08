import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { computeDelta } from "@/features/dashboard/services/stat-delta";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export async function getDashboardStats(businessId: string) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const yesterdayStart = addDays(todayStart, -1);

  const [ordersToday, ordersYesterday, customersToday, customersYesterday, revenueToday, revenueYesterday] =
    await Promise.all([
      repo.countOrders(businessId, { gte: todayStart, lt: tomorrowStart }),
      repo.countOrders(businessId, { gte: yesterdayStart, lt: todayStart }),
      repo.countDistinctCustomers(businessId, { gte: todayStart, lt: tomorrowStart }),
      repo.countDistinctCustomers(businessId, { gte: yesterdayStart, lt: todayStart }),
      repo.sumRevenue(businessId, { gte: todayStart, lt: tomorrowStart }),
      repo.sumRevenue(businessId, { gte: yesterdayStart, lt: todayStart }),
    ]);

  return {
    orders: { value: ordersToday, ...computeDelta(ordersToday, ordersYesterday) },
    customers: { value: customersToday, ...computeDelta(customersToday, customersYesterday) },
    revenue: { value: revenueToday, ...computeDelta(revenueToday, revenueYesterday) },
  };
}

/** 24 buckets (hour of day), summed over the last 30 days — the "busy time" chart. */
export async function getBusyHours(businessId: string): Promise<number[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const timestamps = await repo.getOrderTimestampsThisMonth(businessId, since);
  const buckets = new Array(24).fill(0);
  for (const t of timestamps) {
    buckets[t.createdAt.getHours()] += 1;
  }
  return buckets;
}

export interface TopProduct {
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

export async function getCategorySummary(
  businessId: string
): Promise<{ totalSales: number; topProducts: TopProduct[] }> {
  const items = await repo.getOrderItemsWithProduct(businessId);
  let totalSales = 0;
  const byProduct = new Map<string, TopProduct>();

  for (const item of items) {
    const revenue = item.quantity * item.unitPrice;
    totalSales += revenue;
    const existing = byProduct.get(item.productId);
    if (existing) {
      existing.quantity += item.quantity;
      existing.revenue += revenue;
    } else {
      byProduct.set(item.productId, {
        name: item.product.name,
        category: item.product.category.name,
        quantity: item.quantity,
        revenue,
      });
    }
  }

  const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 3);
  return { totalSales, topProducts };
}
