import { computeDelta, type StatDelta } from "@/features/dashboard/services/stat-delta";
import { startOfDay, addDays, startOfMonth, addMonths } from "@/features/dashboard/services/date-utils";

export type ReportRange = "daily" | "weekly" | "monthly";

export interface OrderPoint {
  createdAt: Date;
  totalPrice: number;
}

export interface OrderItemPoint {
  createdAt: Date;
  productId: string;
  productName: string;
  categoryName: string;
  imageUrl: string | null;
  quantity: number;
}

export interface ReportBucket {
  label: string;
  count: number;
  revenue: number;
}

export interface ReportSummary {
  count: number;
  revenue: number;
  avgOrder: number;
  countDelta: StatDelta;
  revenueDelta: StatDelta;
  avgOrderDelta: StatDelta;
}

export interface TopProductRow {
  name: string;
  category: string;
  imageUrl: string | null;
  sold: number;
}

export const RANGE_DELTA_LABEL: Record<ReportRange, string> = {
  daily: "نسبت به روز قبل",
  weekly: "نسبت به هفته قبل",
  monthly: "نسبت به ماه قبل",
};

const BUCKET_COUNT: Record<ReportRange, number> = { daily: 7, weekly: 8, monthly: 6 };

interface Window {
  start: Date;
  end: Date;
}

/** N trailing windows of the range's granularity, oldest first, ending at `now`'s current period (inclusive). */
function windows(range: ReportRange, now: Date): Window[] {
  const count = BUCKET_COUNT[range];
  const out: Window[] = [];

  if (range === "daily") {
    const tomorrowStart = startOfDay(addDays(now, 1));
    for (let i = count - 1; i >= 0; i--) {
      const end = addDays(tomorrowStart, -i);
      out.push({ start: addDays(end, -1), end });
    }
  } else if (range === "weekly") {
    const tomorrowStart = startOfDay(addDays(now, 1));
    for (let i = count - 1; i >= 0; i--) {
      const end = addDays(tomorrowStart, -i * 7);
      out.push({ start: addDays(end, -7), end });
    }
  } else {
    const thisMonthStart = startOfMonth(now);
    for (let i = count - 1; i >= 0; i--) {
      const start = addMonths(thisMonthStart, -i);
      out.push({ start, end: addMonths(start, 1) });
    }
  }

  return out;
}

/** Earliest instant any range's window set can reach back to — for sizing the DB lookback query. */
export function earliestWindowStart(now = new Date()): Date {
  const starts = (["daily", "weekly", "monthly"] as ReportRange[]).map((r) => windows(r, now)[0].start);
  return starts.reduce((min, d) => (d < min ? d : min));
}

function bucketLabel(range: ReportRange, w: Window): string {
  if (range === "daily") return w.start.toLocaleDateString("fa-IR", { weekday: "long" });
  if (range === "weekly") return w.start.toLocaleDateString("fa-IR", { day: "2-digit", month: "short" });
  return w.start.toLocaleDateString("fa-IR", { month: "long" });
}

function inWindow(orders: OrderPoint[], w: Window): OrderPoint[] {
  return orders.filter((o) => o.createdAt >= w.start && o.createdAt < w.end);
}

/** Trailing series (oldest → newest) for the trend chart. */
export function bucketOrders(orders: OrderPoint[], range: ReportRange, now = new Date()): ReportBucket[] {
  return windows(range, now).map((w) => {
    const matched = inWindow(orders, w);
    return {
      label: bucketLabel(range, w),
      count: matched.length,
      revenue: matched.reduce((sum, o) => sum + o.totalPrice, 0),
    };
  });
}

/** Current period (today / this week / this month) vs. the one immediately before it. */
export function summarizeRange(orders: OrderPoint[], range: ReportRange, now = new Date()): ReportSummary {
  const ws = windows(range, now);
  const current = ws[ws.length - 1];
  const previous = ws.length > 1 ? ws[ws.length - 2] : { start: new Date(current.start.getTime() - (current.end.getTime() - current.start.getTime())), end: current.start };

  const currentOrders = inWindow(orders, current);
  const previousOrders = inWindow(orders, previous);

  const count = currentOrders.length;
  const revenue = currentOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const avgOrder = count > 0 ? Math.round(revenue / count) : 0;

  const prevCount = previousOrders.length;
  const prevRevenue = previousOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const prevAvgOrder = prevCount > 0 ? Math.round(prevRevenue / prevCount) : 0;

  return {
    count,
    revenue,
    avgOrder,
    countDelta: computeDelta(count, prevCount),
    revenueDelta: computeDelta(revenue, prevRevenue),
    avgOrderDelta: computeDelta(avgOrder, prevAvgOrder),
  };
}

/** Top-selling products within the current period (today / this week / this month), by quantity. */
export function topProducts(
  items: OrderItemPoint[],
  range: ReportRange,
  now = new Date(),
  limit = 8
): TopProductRow[] {
  const ws = windows(range, now);
  const current = ws[ws.length - 1];
  const matched = items.filter((i) => i.createdAt >= current.start && i.createdAt < current.end);

  const byProduct = new Map<string, TopProductRow>();
  for (const item of matched) {
    const existing = byProduct.get(item.productId);
    if (existing) {
      existing.sold += item.quantity;
    } else {
      byProduct.set(item.productId, {
        name: item.productName,
        category: item.categoryName,
        imageUrl: item.imageUrl,
        sold: item.quantity,
      });
    }
  }

  return [...byProduct.values()].sort((a, b) => b.sold - a.sold).slice(0, limit);
}
