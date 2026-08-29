import { describe, it, expect } from "vitest";
import { computeCustomerDetailStats } from "./customer-detail";

describe("computeCustomerDetailStats", () => {
  it("returns null for a customer with no orders", () => {
    expect(computeCustomerDetailStats([])).toBeNull();
  });

  it("computes totals, average order value, and the date range", () => {
    const now = new Date("2026-04-01T00:00:00Z");
    const stats = computeCustomerDetailStats(
      [
        { createdAt: new Date("2026-01-01"), totalPrice: 100000, items: [] },
        { createdAt: new Date("2026-02-01"), totalPrice: 200000, items: [] },
      ],
      now
    );
    expect(stats?.orderCount).toBe(2);
    expect(stats?.totalSpend).toBe(300000);
    expect(stats?.averageOrderValue).toBe(150000);
    expect(stats?.firstOrderAt).toEqual(new Date("2026-01-01"));
    expect(stats?.lastOrderAt).toEqual(new Date("2026-02-01"));
  });

  it("counts days since the last order relative to now", () => {
    const now = new Date("2026-01-11T00:00:00Z");
    const stats = computeCustomerDetailStats([{ createdAt: new Date("2026-01-01"), totalPrice: 50000, items: [] }], now);
    expect(stats?.daysSinceLastOrder).toBe(10);
  });

  it("ranks favorite items by total quantity ordered, most first, capped at 3", () => {
    const stats = computeCustomerDetailStats([
      {
        createdAt: new Date("2026-01-01"),
        totalPrice: 100000,
        items: [
          { quantity: 2, product: { name: "کباب کوبیده" } },
          { quantity: 1, product: { name: "زرشک پلو" } },
        ],
      },
      {
        createdAt: new Date("2026-01-05"),
        totalPrice: 50000,
        items: [
          { quantity: 3, product: { name: "کباب کوبیده" } },
          { quantity: 6, product: { name: "نوشابه" } },
          { quantity: 1, product: { name: "سالاد" } },
        ],
      },
    ]);
    expect(stats?.favoriteItems).toEqual([
      { name: "نوشابه", quantity: 6 },
      { name: "کباب کوبیده", quantity: 5 },
      { name: "زرشک پلو", quantity: 1 },
    ]);
  });

  it("never divides orders-per-month by less than one month, even for a same-day repeat customer", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const stats = computeCustomerDetailStats(
      [
        { createdAt: new Date("2026-01-01T08:00:00Z"), totalPrice: 10000, items: [] },
        { createdAt: new Date("2026-01-01T10:00:00Z"), totalPrice: 10000, items: [] },
      ],
      now
    );
    expect(stats?.ordersPerMonth).toBe(2);
  });
});
