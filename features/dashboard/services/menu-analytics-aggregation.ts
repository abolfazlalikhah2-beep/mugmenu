import { computeDelta, type StatDelta } from "@/features/dashboard/services/stat-delta";
import { startOfDay, addDays, startOfMonth, addMonths } from "@/features/dashboard/services/date-utils";
import type { OrderItemPoint } from "@/features/dashboard/services/report-aggregation";

export type VisitSource = "QR" | "LINK" | "DIRECT";

export const SOURCE_LABEL: Record<VisitSource, string> = {
  QR: "اسکن QR روی میز",
  LINK: "لینک مستقیم",
  DIRECT: "ورود مستقیم",
};

/** A landing on the menu-entry page (`/{slug}`) — one row per visit, always has a source. */
export interface EntryVisitPoint {
  createdAt: Date;
  source: VisitSource;
}

/** An item detail-page open — one row per view. */
export interface ItemViewPoint {
  createdAt: Date;
  productId: string;
  productName: string;
  categoryName: string;
  imageUrl: string | null;
}

export interface TrendPoint {
  label: string;
  count: number;
}

export interface SourceSlice {
  source: VisitSource;
  count: number;
  percent: number;
}

export interface TopMenuItemRow {
  name: string;
  category: string;
  imageUrl: string | null;
  views: number;
  orders: number;
}

export interface MenuAnalyticsSummary {
  today: { count: number; delta: StatDelta };
  week: { count: number; delta: StatDelta };
  month: { count: number; delta: StatDelta };
  dailyAvg: { count: number; delta: StatDelta };
}

/** Earliest instant any of this module's windows (month-to-date, trailing 30d, trailing 14d) can reach back to. */
export function earliestMenuAnalyticsStart(now = new Date()): Date {
  return addMonths(startOfMonth(now), -1);
}

function inRange(visits: EntryVisitPoint[], start: Date, end: Date): EntryVisitPoint[] {
  return visits.filter((v) => v.createdAt >= start && v.createdAt < end);
}

/** Today / trailing-7-days / month-to-date visit counts, each vs. the equivalent immediately-prior period. */
export function summarizeMenuVisits(visits: EntryVisitPoint[], now = new Date()): MenuAnalyticsSummary {
  const todayStart = startOfDay(now);
  const todayEnd = addDays(todayStart, 1);
  const yesterdayStart = addDays(todayStart, -1);

  const weekStart = addDays(todayStart, -6);
  const prevWeekStart = addDays(weekStart, -7);

  const monthStart = startOfMonth(now);
  const prevMonthStart = addMonths(monthStart, -1);

  const todayCount = inRange(visits, todayStart, todayEnd).length;
  const yesterdayCount = inRange(visits, yesterdayStart, todayStart).length;

  const weekCount = inRange(visits, weekStart, todayEnd).length;
  const prevWeekCount = inRange(visits, prevWeekStart, weekStart).length;

  const monthCount = inRange(visits, monthStart, todayEnd).length;
  const prevMonthCount = inRange(visits, prevMonthStart, monthStart).length;

  const daysSoFarThisMonth = Math.max(1, Math.round((todayEnd.getTime() - monthStart.getTime()) / 86_400_000));
  const daysInPrevMonth = Math.max(1, Math.round((monthStart.getTime() - prevMonthStart.getTime()) / 86_400_000));
  const dailyAvg = Math.round(monthCount / daysSoFarThisMonth);
  const prevDailyAvg = Math.round(prevMonthCount / daysInPrevMonth);

  return {
    today: { count: todayCount, delta: computeDelta(todayCount, yesterdayCount) },
    week: { count: weekCount, delta: computeDelta(weekCount, prevWeekCount) },
    month: { count: monthCount, delta: computeDelta(monthCount, prevMonthCount) },
    dailyAvg: { count: dailyAvg, delta: computeDelta(dailyAvg, prevDailyAvg) },
  };
}

/** Trailing daily visit counts, oldest first, today last — for the 14-day trend line chart. */
export function dailyTrend(visits: EntryVisitPoint[], now = new Date(), days = 14): TrendPoint[] {
  const start = addDays(startOfDay(now), -(days - 1));
  return Array.from({ length: days }, (_, i) => {
    const dayStart = addDays(start, i);
    const dayEnd = addDays(dayStart, 1);
    return {
      label: dayStart.toLocaleDateString("fa-IR", { day: "2-digit", month: "short" }),
      count: inRange(visits, dayStart, dayEnd).length,
    };
  });
}

/** Trailing 7 days by weekday, oldest first — for the "بازدید هفتگی" comparison card. */
export function weeklyTrend(visits: EntryVisitPoint[], now = new Date()): TrendPoint[] {
  return dailyTrend(visits, now, 7).map((p, i) => ({
    ...p,
    label: addDays(startOfDay(now), -6 + i).toLocaleDateString("fa-IR", { weekday: "long" }),
  }));
}

/** Visit count per hour-of-day (0-23) for today only — for the "ساعات اوج بازدید" histogram. */
export function hourlyToday(visits: EntryVisitPoint[], now = new Date()): number[] {
  const todayStart = startOfDay(now);
  const todayEnd = addDays(todayStart, 1);
  const hours = new Array(24).fill(0) as number[];
  for (const v of visits) {
    if (v.createdAt >= todayStart && v.createdAt < todayEnd) hours[v.createdAt.getHours()]++;
  }
  return hours;
}

/** Traffic-source share over the trailing window — for the "منابع ورودی" donut card. */
export function sourceBreakdown(visits: EntryVisitPoint[], now = new Date(), days = 30): SourceSlice[] {
  const start = addDays(startOfDay(now), -(days - 1));
  const end = addDays(startOfDay(now), 1);
  const windowed = inRange(visits, start, end);
  const total = windowed.length;

  const counts: Record<VisitSource, number> = { QR: 0, LINK: 0, DIRECT: 0 };
  for (const v of windowed) counts[v.source]++;

  return (["QR", "LINK", "DIRECT"] as VisitSource[]).map((source) => ({
    source,
    count: counts[source],
    percent: total > 0 ? Math.round((counts[source] / total) * 100) : 0,
  }));
}

// ---------- Custom date-range filter (see date-range-filter.ts) ----------
//
// This tab has no daily/weekly/monthly toggle to begin with (unlike
// report-aggregation.ts) — it always shows fixed today/week/month cards.
// A custom range doesn't map onto that fixed shape, so when one is active
// the view swaps to this single custom summary instead (see
// menu-analytics-view.tsx): one total, a trend bucketed to the range's
// span, and sources/top-items bound to the same range.

export interface Window {
  start: Date;
  end: Date;
}

function inWindow(visits: EntryVisitPoint[], w: Window): EntryVisitPoint[] {
  return visits.filter((v) => v.createdAt >= w.start && v.createdAt <= w.end);
}

/** Total visits in the custom range — no delta, since an arbitrary range has no natural "previous period" to compare against. */
export function summarizeCustomVisits(visits: EntryVisitPoint[], w: Window): { count: number } {
  return { count: inWindow(visits, w).length };
}

/** Day/week bucket size for the custom-range trend, scaled to the span so a year-long range doesn't render 365 bars. */
function customBucketWindows(w: Window): Window[] {
  const spanDays = (w.end.getTime() - w.start.getTime()) / 86_400_000;
  const step = spanDays <= 31 ? 1 : 7;
  const out: Window[] = [];
  let cursor = startOfDay(w.start);
  while (cursor <= w.end) {
    const next = addDays(cursor, step);
    out.push({ start: cursor, end: next });
    cursor = next;
  }
  return out;
}

/** Trend series across the custom range, bucketed by day (or by week past ~1 month) — see customBucketWindows. */
export function customTrend(visits: EntryVisitPoint[], w: Window): TrendPoint[] {
  return customBucketWindows(w).map((bw) => ({
    label: bw.start.toLocaleDateString("fa-IR", { day: "2-digit", month: "short" }),
    count: visits.filter((v) => v.createdAt >= bw.start && v.createdAt < bw.end).length,
  }));
}

/** Same shape as sourceBreakdown, bound to the custom range instead of a trailing 30-day window. */
export function sourceBreakdownCustom(visits: EntryVisitPoint[], w: Window): SourceSlice[] {
  const windowed = inWindow(visits, w);
  const total = windowed.length;

  const counts: Record<VisitSource, number> = { QR: 0, LINK: 0, DIRECT: 0 };
  for (const v of windowed) counts[v.source]++;

  return (["QR", "LINK", "DIRECT"] as VisitSource[]).map((source) => ({
    source,
    count: counts[source],
    percent: total > 0 ? Math.round((counts[source] / total) * 100) : 0,
  }));
}

/** Same shape as topViewedItems, bound to the custom range instead of a trailing 30-day window. */
export function topViewedItemsCustom(
  itemViews: ItemViewPoint[],
  orderItems: OrderItemPoint[],
  w: Window,
  limit = 5
): TopMenuItemRow[] {
  const byProduct = new Map<string, TopMenuItemRow>();
  for (const v of itemViews) {
    if (v.createdAt < w.start || v.createdAt > w.end) continue;
    const existing = byProduct.get(v.productId);
    if (existing) existing.views += 1;
    else
      byProduct.set(v.productId, {
        name: v.productName,
        category: v.categoryName,
        imageUrl: v.imageUrl,
        views: 1,
        orders: 0,
      });
  }

  for (const o of orderItems) {
    if (o.createdAt < w.start || o.createdAt > w.end) continue;
    const existing = byProduct.get(o.productId);
    if (existing) existing.orders += o.quantity;
  }

  return [...byProduct.values()].sort((a, b) => b.views - a.views).slice(0, limit);
}

/**
 * Most-viewed item detail pages over the trailing window, with order quantity
 * for the same window merged in. Ranked by views (matches the design's
 * "بیشترین بازدید صفحه آیتم" heading) — a product ordered without its detail
 * page ever being opened (e.g. added straight from the category list) won't
 * appear here even if it sold well; that's the Products report tab's job.
 */
export function topViewedItems(
  itemViews: ItemViewPoint[],
  orderItems: OrderItemPoint[],
  now = new Date(),
  days = 30,
  limit = 5
): TopMenuItemRow[] {
  const start = addDays(startOfDay(now), -(days - 1));
  const end = addDays(startOfDay(now), 1);

  const byProduct = new Map<string, TopMenuItemRow>();
  for (const v of itemViews) {
    if (v.createdAt < start || v.createdAt >= end) continue;
    const existing = byProduct.get(v.productId);
    if (existing) existing.views += 1;
    else
      byProduct.set(v.productId, {
        name: v.productName,
        category: v.categoryName,
        imageUrl: v.imageUrl,
        views: 1,
        orders: 0,
      });
  }

  for (const o of orderItems) {
    if (o.createdAt < start || o.createdAt >= end) continue;
    const existing = byProduct.get(o.productId);
    if (existing) existing.orders += o.quantity;
  }

  return [...byProduct.values()].sort((a, b) => b.views - a.views).slice(0, limit);
}
