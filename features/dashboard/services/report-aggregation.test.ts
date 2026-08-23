import { describe, it, expect } from "vitest";
import {
  bucketOrders,
  summarizeRange,
  topProducts,
  earliestWindowStart,
  currentWindowBounds,
  summarizeCashRegister,
  bucketOrdersCustom,
  summarizeRangeCustom,
  summarizeCashRegisterCustom,
  topProductsCustom,
  type OrderPoint,
  type OrderItemPoint,
  type PaymentMethodPoint,
} from "./report-aggregation";

// Fixed "now" so bucket boundaries are deterministic across runs.
const NOW = new Date(2026, 7, 8, 15, 30, 0); // 2026-08-08 15:30 local time

function day(offsetFromToday: number, hour = 12): Date {
  const d = new Date(2026, 7, 8, hour, 0, 0);
  d.setDate(d.getDate() + offsetFromToday);
  return d;
}

describe("bucketOrders (daily)", () => {
  it("produces 7 trailing day buckets, oldest first, with today last", () => {
    const orders: OrderPoint[] = [
      { createdAt: day(-6), totalPrice: 100 }, // oldest bucket start (inclusive)
      { createdAt: day(0), totalPrice: 200 }, // today (last bucket)
      { createdAt: day(0), totalPrice: 50 },
    ];
    const buckets = bucketOrders(orders, "daily", NOW);
    expect(buckets).toHaveLength(7);
    expect(buckets[0]).toMatchObject({ count: 1, revenue: 100 });
    expect(buckets[6]).toMatchObject({ count: 2, revenue: 250 });
  });

  it("excludes orders older than the 7-day window (boundary is start-inclusive, exclusive before)", () => {
    const orders: OrderPoint[] = [{ createdAt: day(-7, 23), totalPrice: 999 }];
    const buckets = bucketOrders(orders, "daily", NOW);
    const total = buckets.reduce((s, b) => s + b.count, 0);
    expect(total).toBe(0);
  });

  it("excludes orders in the future (end is exclusive)", () => {
    const orders: OrderPoint[] = [{ createdAt: day(1), totalPrice: 999 }];
    const buckets = bucketOrders(orders, "daily", NOW);
    const total = buckets.reduce((s, b) => s + b.count, 0);
    expect(total).toBe(0);
  });
});

describe("bucketOrders (weekly/monthly bucket counts)", () => {
  it("produces 8 weekly buckets and 6 monthly buckets", () => {
    expect(bucketOrders([], "weekly", NOW)).toHaveLength(8);
    expect(bucketOrders([], "monthly", NOW)).toHaveLength(6);
  });
});

describe("summarizeRange", () => {
  it("compares today vs yesterday for the daily range", () => {
    const orders: OrderPoint[] = [
      { createdAt: day(0), totalPrice: 100 },
      { createdAt: day(0), totalPrice: 300 },
      { createdAt: day(-1), totalPrice: 100 },
    ];
    const summary = summarizeRange(orders, "daily", NOW);
    expect(summary.count).toBe(2);
    expect(summary.revenue).toBe(400);
    expect(summary.avgOrder).toBe(200);
    expect(summary.countDelta).toEqual({ deltaPercent: 100, up: true }); // 2 vs 1
  });

  it("returns zeroed averages with no division-by-zero when a period has no orders", () => {
    const summary = summarizeRange([], "daily", NOW);
    expect(summary).toMatchObject({ count: 0, revenue: 0, avgOrder: 0 });
    expect(summary.countDelta).toEqual({ deltaPercent: 0, up: true });
  });
});

describe("topProducts", () => {
  const items: OrderItemPoint[] = [
    { createdAt: day(0), productId: "a", productName: "چلوکباب", categoryName: "کباب‌ها", imageUrl: null, quantity: 3 },
    { createdAt: day(0), productId: "b", productName: "دوغ", categoryName: "نوشیدنی", imageUrl: null, quantity: 10 },
    { createdAt: day(0), productId: "a", productName: "چلوکباب", categoryName: "کباب‌ها", imageUrl: null, quantity: 2 },
    { createdAt: day(-2), productId: "a", productName: "چلوکباب", categoryName: "کباب‌ها", imageUrl: null, quantity: 99 }, // outside today-only window
  ];

  it("aggregates quantity per product within the current period and sorts descending", () => {
    const rows = topProducts(items, "daily", NOW);
    expect(rows).toEqual([
      { name: "دوغ", category: "نوشیدنی", imageUrl: null, sold: 10 },
      { name: "چلوکباب", category: "کباب‌ها", imageUrl: null, sold: 5 },
    ]);
  });

  it("respects the limit", () => {
    const rows = topProducts(items, "daily", NOW, 1);
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("دوغ");
  });
});

describe("earliestWindowStart", () => {
  it("reaches back at least 6 months for the monthly range", () => {
    const start = earliestWindowStart(NOW);
    const monthsBack = (NOW.getFullYear() - start.getFullYear()) * 12 + (NOW.getMonth() - start.getMonth());
    expect(monthsBack).toBeGreaterThanOrEqual(5);
  });
});

describe("currentWindowBounds", () => {
  it("matches the last window's bounds returned by bucketOrders for the same range", () => {
    const bounds = currentWindowBounds("daily", NOW);
    const buckets = bucketOrders(
      [{ createdAt: bounds.start, totalPrice: 1 }],
      "daily",
      NOW
    );
    expect(buckets[buckets.length - 1].count).toBe(1);
  });
});

describe("summarizeCashRegister", () => {
  const points: PaymentMethodPoint[] = [
    { createdAt: day(0), totalPrice: 100_000, paymentMethod: "CASH", type: "DINE_IN" },
    { createdAt: day(0), totalPrice: 50_000, paymentMethod: "CARD", type: "TAKEAWAY" },
    { createdAt: day(0), totalPrice: 200_000, paymentMethod: "CREDIT", type: "DELIVERY" },
    { createdAt: day(0), totalPrice: 30_000, paymentMethod: "CASH", type: "DINE_IN" },
    { createdAt: day(-2), totalPrice: 999_999, paymentMethod: "CASH", type: "DINE_IN" }, // outside today-only window
  ];

  it("totals sales for the current period only", () => {
    const summary = summarizeCashRegister(points, "daily", NOW);
    expect(summary.totalSales).toEqual({ count: 4, amount: 380_000 });
  });

  it("breaks totals down by payment method", () => {
    const summary = summarizeCashRegister(points, "daily", NOW);
    expect(summary.byPaymentMethod).toEqual({
      CASH: { count: 2, amount: 130_000 },
      CARD: { count: 1, amount: 50_000 },
      CREDIT: { count: 1, amount: 200_000 },
    });
  });

  it("counts orders by type", () => {
    const summary = summarizeCashRegister(points, "daily", NOW);
    expect(summary.byOrderType).toEqual({ DINE_IN: 2, TAKEAWAY: 1, DELIVERY: 1 });
  });

  it("returns all-zero breakdowns with no orders", () => {
    const summary = summarizeCashRegister([], "daily", NOW);
    expect(summary.totalSales).toEqual({ count: 0, amount: 0 });
    expect(summary.byPaymentMethod.CASH).toEqual({ count: 0, amount: 0 });
  });
});

describe("summarizeRangeCustom", () => {
  it("totals orders strictly within the custom [start, end] bounds, both inclusive", () => {
    const w = { start: day(-3), end: day(0) };
    const orders: OrderPoint[] = [
      { createdAt: day(-3), totalPrice: 100 }, // start boundary, inclusive
      { createdAt: day(0), totalPrice: 200 }, // end boundary, inclusive
      { createdAt: day(-4, 23), totalPrice: 999 }, // just before start, excluded
      { createdAt: day(1), totalPrice: 999 }, // just after end, excluded
    ];
    const summary = summarizeRangeCustom(orders, w);
    expect(summary).toEqual({ count: 2, revenue: 300, avgOrder: 150 });
  });

  it("returns zeroed totals for an empty range", () => {
    expect(summarizeRangeCustom([], { start: day(-3), end: day(0) })).toEqual({ count: 0, revenue: 0, avgOrder: 0 });
  });
});

describe("bucketOrdersCustom", () => {
  it("buckets by day for a short range and matches the total order count", () => {
    const w = { start: day(-2), end: day(0) };
    const orders: OrderPoint[] = [{ createdAt: day(-2) }, { createdAt: day(-1) }, { createdAt: day(0) }].map((o) => ({
      ...o,
      totalPrice: 100,
    }));
    const buckets = bucketOrdersCustom(orders, w);
    expect(buckets).toHaveLength(3);
    expect(buckets.reduce((s, b) => s + b.count, 0)).toBe(3);
  });

  it("switches to weekly buckets for a range longer than 31 days", () => {
    const w = { start: day(-60), end: day(0) };
    const buckets = bucketOrdersCustom([], w);
    expect(buckets.length).toBeGreaterThan(1);
    expect(buckets.length).toBeLessThanOrEqual(10);
  });
});

describe("summarizeCashRegisterCustom", () => {
  it("totals and breaks down orders within the custom range", () => {
    const w = { start: day(-1), end: day(0) };
    const points: PaymentMethodPoint[] = [
      { createdAt: day(0), totalPrice: 100_000, paymentMethod: "CASH", type: "DINE_IN" },
      { createdAt: day(-1), totalPrice: 50_000, paymentMethod: "CARD", type: "TAKEAWAY" },
      { createdAt: day(-5), totalPrice: 999_999, paymentMethod: "CASH", type: "DINE_IN" }, // outside range
    ];
    const summary = summarizeCashRegisterCustom(points, w);
    expect(summary.totalSales).toEqual({ count: 2, amount: 150_000 });
    expect(summary.byPaymentMethod.CASH).toEqual({ count: 1, amount: 100_000 });
  });
});

describe("topProductsCustom", () => {
  it("aggregates quantity per product within the custom range", () => {
    const w = { start: day(-1), end: day(0) };
    const items: OrderItemPoint[] = [
      { createdAt: day(0), productId: "a", productName: "چلوکباب", categoryName: "کباب‌ها", imageUrl: null, quantity: 3 },
      { createdAt: day(-1), productId: "a", productName: "چلوکباب", categoryName: "کباب‌ها", imageUrl: null, quantity: 2 },
      { createdAt: day(-5), productId: "a", productName: "چلوکباب", categoryName: "کباب‌ها", imageUrl: null, quantity: 99 },
    ];
    const rows = topProductsCustom(items, w);
    expect(rows).toEqual([{ name: "چلوکباب", category: "کباب‌ها", imageUrl: null, sold: 5 }]);
  });
});
