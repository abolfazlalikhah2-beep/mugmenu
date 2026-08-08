import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import {
  bucketOrders,
  summarizeRange,
  topProducts,
  earliestWindowStart,
  type ReportRange,
  type ReportBucket,
  type ReportSummary,
  type TopProductRow,
  type OrderPoint,
  type OrderItemPoint,
} from "@/features/dashboard/services/report-aggregation";

const RANGES: ReportRange[] = ["daily", "weekly", "monthly"];

export type OrdersReport = Record<ReportRange, { chart: ReportBucket[]; summary: ReportSummary }>;
export type ProductsReport = Record<ReportRange, TopProductRow[]>;

export async function getOrdersReport(businessId: string): Promise<OrdersReport> {
  const now = new Date();
  const orders: OrderPoint[] = await repo.getOrdersForReport(businessId, earliestWindowStart(now));

  return Object.fromEntries(
    RANGES.map((range) => [
      range,
      { chart: bucketOrders(orders, range, now), summary: summarizeRange(orders, range, now) },
    ])
  ) as OrdersReport;
}

export async function getProductsReport(businessId: string): Promise<ProductsReport> {
  const now = new Date();
  const rows = await repo.getOrderItemsForReport(businessId, earliestWindowStart(now));
  const items: OrderItemPoint[] = rows.map((r) => ({
    createdAt: r.order.createdAt,
    productId: r.productId,
    productName: r.product.name,
    categoryName: r.product.category.name,
    imageUrl: r.product.imageUrl,
    quantity: r.quantity,
  }));

  return Object.fromEntries(RANGES.map((range) => [range, topProducts(items, range, now)])) as ProductsReport;
}
