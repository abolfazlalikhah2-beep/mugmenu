import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import {
  summarizeMenuVisits,
  dailyTrend,
  weeklyTrend,
  hourlyToday,
  sourceBreakdown,
  topViewedItems,
  earliestMenuAnalyticsStart,
  type EntryVisitPoint,
  type ItemViewPoint,
  type MenuAnalyticsSummary,
  type TrendPoint,
  type SourceSlice,
  type TopMenuItemRow,
} from "@/features/dashboard/services/menu-analytics-aggregation";

export interface MenuAnalyticsReport {
  summary: MenuAnalyticsSummary;
  trend14d: TrendPoint[];
  weekly: TrendPoint[];
  hourly: number[];
  sources: SourceSlice[];
  topItems: TopMenuItemRow[];
}

export async function getMenuAnalyticsReport(businessId: string): Promise<MenuAnalyticsReport> {
  const now = new Date();
  const since = earliestMenuAnalyticsStart(now);

  const [entryRows, itemRows, orderItemRows] = await Promise.all([
    repo.getMenuEntryVisits(businessId, since),
    repo.getMenuItemViews(businessId, since),
    repo.getOrderItemsForReport(businessId, since),
  ]);

  const entryVisits: EntryVisitPoint[] = entryRows
    .filter((r): r is typeof r & { source: NonNullable<typeof r.source> } => r.source !== null)
    .map((r) => ({ createdAt: r.createdAt, source: r.source }));

  const itemViews: ItemViewPoint[] = itemRows
    .filter((r): r is typeof r & { productId: string; product: NonNullable<typeof r.product> } => r.productId !== null && r.product !== null)
    .map((r) => ({
      createdAt: r.createdAt,
      productId: r.productId,
      productName: r.product.name,
      categoryName: r.product.category.name,
      imageUrl: r.product.imageUrl,
    }));

  const orderItems = orderItemRows.map((r) => ({
    createdAt: r.order.createdAt,
    productId: r.productId,
    productName: r.product.name,
    categoryName: r.product.category.name,
    imageUrl: r.product.imageUrl,
    quantity: r.quantity,
  }));

  return {
    summary: summarizeMenuVisits(entryVisits, now),
    trend14d: dailyTrend(entryVisits, now),
    weekly: weeklyTrend(entryVisits, now),
    hourly: hourlyToday(entryVisits, now),
    sources: sourceBreakdown(entryVisits, now),
    topItems: topViewedItems(itemViews, orderItems, now),
  };
}
