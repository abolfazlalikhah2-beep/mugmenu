import { describe, it, expect } from "vitest";
import {
  summarizeMenuVisits,
  dailyTrend,
  weeklyTrend,
  hourlyToday,
  sourceBreakdown,
  topViewedItems,
  type EntryVisitPoint,
  type ItemViewPoint,
} from "./menu-analytics-aggregation";
import type { OrderItemPoint } from "./report-aggregation";

// Fixed "now" so bucket boundaries are deterministic across runs.
const NOW = new Date(2026, 7, 8, 15, 30, 0); // 2026-08-08 15:30 local time

function day(offsetFromToday: number, hour = 12): Date {
  const d = new Date(2026, 7, 8, hour, 0, 0);
  d.setDate(d.getDate() + offsetFromToday);
  return d;
}

function visit(offsetFromToday: number, source: EntryVisitPoint["source"], hour = 12): EntryVisitPoint {
  return { createdAt: day(offsetFromToday, hour), source };
}

describe("summarizeMenuVisits", () => {
  it("counts today vs yesterday, trailing week vs the week before, and month-to-date vs last month", () => {
    const visits: EntryVisitPoint[] = [
      visit(0, "QR"),
      visit(0, "QR"),
      visit(-1, "LINK"),
      visit(-8, "DIRECT"), // outside trailing week, inside month-to-date if same month
    ];
    const summary = summarizeMenuVisits(visits, NOW);
    expect(summary.today.count).toBe(2);
    expect(summary.today.delta).toMatchObject({ up: true });
  });

  it("computes a month-to-date daily average", () => {
    const visits: EntryVisitPoint[] = [visit(0, "QR"), visit(-1, "QR")];
    const summary = summarizeMenuVisits(visits, NOW);
    // NOW is Aug 8 -> 8 days elapsed so far this month (Aug 1..8 inclusive)
    expect(summary.dailyAvg.count).toBe(Math.round(2 / 8));
  });
});

describe("dailyTrend", () => {
  it("returns 14 trailing daily buckets, oldest first, today last", () => {
    const visits: EntryVisitPoint[] = [visit(-13, "QR"), visit(0, "QR"), visit(0, "LINK")];
    const trend = dailyTrend(visits, NOW);
    expect(trend).toHaveLength(14);
    expect(trend[0].count).toBe(1);
    expect(trend[13].count).toBe(2);
  });
});

describe("weeklyTrend", () => {
  it("returns 7 trailing daily buckets with weekday labels", () => {
    const visits: EntryVisitPoint[] = [visit(0, "QR")];
    const trend = weeklyTrend(visits, NOW);
    expect(trend).toHaveLength(7);
    expect(trend[6].count).toBe(1);
    expect(typeof trend[0].label).toBe("string");
  });
});

describe("hourlyToday", () => {
  it("buckets today's visits by hour and ignores other days", () => {
    const visits: EntryVisitPoint[] = [visit(0, "QR", 9), visit(0, "QR", 9), visit(0, "QR", 20), visit(-1, "QR", 9)];
    const hours = hourlyToday(visits, NOW);
    expect(hours).toHaveLength(24);
    expect(hours[9]).toBe(2);
    expect(hours[20]).toBe(1);
    expect(hours.reduce((a, b) => a + b, 0)).toBe(3);
  });
});

describe("sourceBreakdown", () => {
  it("computes percentage share per source over the trailing window", () => {
    const visits: EntryVisitPoint[] = [visit(0, "QR"), visit(0, "QR"), visit(-1, "LINK"), visit(-2, "DIRECT")];
    const breakdown = sourceBreakdown(visits, NOW, 30);
    const qr = breakdown.find((b) => b.source === "QR")!;
    const link = breakdown.find((b) => b.source === "LINK")!;
    expect(qr.count).toBe(2);
    expect(qr.percent).toBe(50);
    expect(link.percent).toBe(25);
  });

  it("returns 0 percent for every source when there are no visits", () => {
    const breakdown = sourceBreakdown([], NOW, 30);
    expect(breakdown.every((b) => b.percent === 0)).toBe(true);
  });
});

describe("topViewedItems", () => {
  it("ranks by view count and merges in matching order quantity", () => {
    const views: ItemViewPoint[] = [
      { createdAt: day(0), productId: "p1", productName: "چلوکباب", categoryName: "کباب", imageUrl: null },
      { createdAt: day(0), productId: "p1", productName: "چلوکباب", categoryName: "کباب", imageUrl: null },
      { createdAt: day(-1), productId: "p2", productName: "جوجه", categoryName: "کباب", imageUrl: null },
    ];
    const orders: OrderItemPoint[] = [
      { createdAt: day(0), productId: "p1", productName: "چلوکباب", categoryName: "کباب", imageUrl: null, quantity: 3 },
      { createdAt: day(0), productId: "p3", productName: "نوشابه", categoryName: "نوشیدنی", imageUrl: null, quantity: 5 },
    ];
    const rows = topViewedItems(views, orders, NOW, 30, 5);
    expect(rows[0]).toMatchObject({ name: "چلوکباب", views: 2, orders: 3 });
    expect(rows[1]).toMatchObject({ name: "جوجه", views: 1, orders: 0 });
    // p3 was ordered but never viewed -> not in the views-ranked table
    expect(rows.find((r) => r.name === "نوشابه")).toBeUndefined();
  });

  it("excludes views/orders outside the trailing window", () => {
    const views: ItemViewPoint[] = [
      { createdAt: day(-31), productId: "p1", productName: "قدیمی", categoryName: "کباب", imageUrl: null },
    ];
    const rows = topViewedItems(views, [], NOW, 30, 5);
    expect(rows).toHaveLength(0);
  });
});
