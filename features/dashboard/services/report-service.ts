import "server-only";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { getOutstandingCreditForRange } from "@/features/credits/services/credit-service";
import {
  bucketOrders,
  summarizeRange,
  topProducts,
  earliestWindowStart,
  currentWindowBounds,
  summarizeCashRegister,
  type ReportRange,
  type ReportBucket,
  type ReportSummary,
  type TopProductRow,
  type OrderPoint,
  type OrderItemPoint,
  type PaymentMethodPoint,
  type CashRegisterSummary,
} from "@/features/dashboard/services/report-aggregation";

const RANGES: ReportRange[] = ["daily", "weekly", "monthly"];
const TOP_PRODUCTS_LIMIT = 5;

export type OrdersReport = Record<ReportRange, { chart: ReportBucket[]; summary: ReportSummary }>;
export type ProductsReport = Record<ReportRange, TopProductRow[]>;
export type CashRegisterReport = Record<
  ReportRange,
  CashRegisterSummary & { creditOutstanding: number; topProducts: TopProductRow[] }
>;

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

export async function getCashRegisterReport(businessId: string): Promise<CashRegisterReport> {
  const now = new Date();
  const since = earliestWindowStart(now);

  const [orders, itemRows] = await Promise.all([
    repo.getOrdersForCashRegisterReport(businessId, since),
    repo.getOrderItemsForReport(businessId, since),
  ]);

  const points: PaymentMethodPoint[] = orders.map((o) => ({
    createdAt: o.createdAt,
    totalPrice: o.totalPrice,
    paymentMethod: o.paymentMethod,
    type: o.type,
  }));
  const items: OrderItemPoint[] = itemRows.map((r) => ({
    createdAt: r.order.createdAt,
    productId: r.productId,
    productName: r.product.name,
    categoryName: r.product.category.name,
    imageUrl: r.product.imageUrl,
    quantity: r.quantity,
  }));

  const outstandingEntries = await Promise.all(
    RANGES.map(async (range) => {
      const w = currentWindowBounds(range, now);
      const outstanding = await getOutstandingCreditForRange(businessId, { gte: w.start, lt: w.end });
      return [range, outstanding] as const;
    })
  );
  const outstandingByRange = Object.fromEntries(outstandingEntries) as Record<ReportRange, number>;

  return Object.fromEntries(
    RANGES.map((range) => [
      range,
      {
        ...summarizeCashRegister(points, range, now),
        creditOutstanding: outstandingByRange[range],
        topProducts: topProducts(items, range, now, TOP_PRODUCTS_LIMIT),
      },
    ])
  ) as CashRegisterReport;
}
