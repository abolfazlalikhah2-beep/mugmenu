import { describe, it, expect } from "vitest";
import {
  summarizeMembers,
  memberGrowthTrend,
  cashbackTrend,
  applyLoyaltyFilter,
  toLoyaltyMemberRow,
  type MemberPoint,
  type CashbackPoint,
  type LoyaltyMemberRow,
} from "./loyalty-club-aggregation";

// Fixed "now" so month/day boundaries are deterministic across runs.
const NOW = new Date(2026, 7, 8, 15, 30, 0); // 2026-08-08 15:30 local time

function monthsAgo(n: number, day = 5): Date {
  return new Date(2026, 7 - n, day, 12, 0, 0);
}

function daysAgo(n: number): Date {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  return d;
}

describe("summarizeMembers", () => {
  it("counts total members and new-this-month vs new-last-month", () => {
    const members: MemberPoint[] = [
      { createdAt: monthsAgo(0) }, // this month
      { createdAt: monthsAgo(0) }, // this month
      { createdAt: monthsAgo(1) }, // last month
      { createdAt: monthsAgo(6) },
    ];
    const summary = summarizeMembers(members, NOW);
    expect(summary.totalCount).toBe(4);
    expect(summary.newThisMonth).toBe(2);
    expect(summary.delta.up).toBe(true);
  });
});

describe("memberGrowthTrend", () => {
  it("returns 12 cumulative monthly buckets, oldest first", () => {
    const members: MemberPoint[] = [{ createdAt: monthsAgo(11) }, { createdAt: monthsAgo(1) }, { createdAt: monthsAgo(0) }];
    const trend = memberGrowthTrend(members, NOW);
    expect(trend).toHaveLength(12);
    expect(trend[0].count).toBe(1); // oldest bucket includes the 11-months-ago signup
    expect(trend[11].count).toBe(3); // cumulative total by this month
  });

  it("carries forward members that signed up before the 12-month window", () => {
    const members: MemberPoint[] = [{ createdAt: monthsAgo(20) }];
    const trend = memberGrowthTrend(members, NOW);
    expect(trend[0].count).toBe(1);
    expect(trend[11].count).toBe(1);
  });
});

describe("cashbackTrend", () => {
  it("sums cashback amounts per month, oldest first, over 6 months", () => {
    const ledger: CashbackPoint[] = [
      { createdAt: monthsAgo(5), amount: 10000 },
      { createdAt: monthsAgo(0), amount: 20000 },
      { createdAt: monthsAgo(0), amount: 5000 },
    ];
    const trend = cashbackTrend(ledger, NOW);
    expect(trend).toHaveLength(6);
    expect(trend[0].count).toBe(10000);
    expect(trend[5].count).toBe(25000);
  });
});

describe("applyLoyaltyFilter", () => {
  const members: LoyaltyMemberRow[] = [
    { id: "1", name: "a", phone: "1", joinedAt: NOW, orderCount: 3, lastOrderAt: daysAgo(2), walletBalance: 10000, loyaltyPoints: 100 },
    { id: "2", name: "b", phone: "2", joinedAt: NOW, orderCount: 5, lastOrderAt: daysAgo(40), walletBalance: 150000, loyaltyPoints: 2500 },
    { id: "3", name: "c", phone: "3", joinedAt: NOW, orderCount: 0, lastOrderAt: null, walletBalance: 0, loyaltyPoints: 0 },
  ];

  it("ALL returns everyone unchanged", () => {
    expect(applyLoyaltyFilter(members, "ALL", NOW)).toHaveLength(3);
  });

  it("INACTIVE_30 includes members with no order in 30 days and members who never ordered", () => {
    const result = applyLoyaltyFilter(members, "INACTIVE_30", NOW);
    expect(result.map((m) => m.id).sort()).toEqual(["2", "3"]);
  });

  it("INACTIVE_90 excludes the 40-day-inactive member (still within 90 days)", () => {
    const result = applyLoyaltyFilter(members, "INACTIVE_90", NOW);
    expect(result.map((m) => m.id)).toEqual(["3"]);
  });

  it("GOLD filters by the real points-based tier, not order count", () => {
    const result = applyLoyaltyFilter(members, "GOLD", NOW);
    expect(result.map((m) => m.id)).toEqual(["2"]);
  });

  it("WALLET_100K filters by wallet balance threshold", () => {
    const result = applyLoyaltyFilter(members, "WALLET_100K", NOW);
    expect(result.map((m) => m.id)).toEqual(["2"]);
  });
});

describe("toLoyaltyMemberRow", () => {
  it("maps a raw CustomerAccount row (with _count/orders) to a flat member row", () => {
    const row = toLoyaltyMemberRow({
      id: "1",
      fullName: "مریم احمدی",
      phone: "0912",
      createdAt: NOW,
      walletBalance: 5000,
      loyaltyPoints: 200,
      _count: { orders: 3 },
      orders: [{ createdAt: daysAgo(1) }],
    });
    expect(row).toEqual({
      id: "1",
      name: "مریم احمدی",
      phone: "0912",
      joinedAt: NOW,
      orderCount: 3,
      lastOrderAt: daysAgo(1),
      walletBalance: 5000,
      loyaltyPoints: 200,
    });
  });

  it("sets lastOrderAt to null when the member has never ordered", () => {
    const row = toLoyaltyMemberRow({
      id: "2",
      fullName: "رضا",
      phone: "0913",
      createdAt: NOW,
      walletBalance: 0,
      loyaltyPoints: 0,
      _count: { orders: 0 },
      orders: [],
    });
    expect(row.lastOrderAt).toBeNull();
  });
});
