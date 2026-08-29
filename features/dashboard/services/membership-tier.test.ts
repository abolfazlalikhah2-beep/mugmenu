import { describe, it, expect } from "vitest";
import { computeMembershipTier, type MembershipTierThresholds } from "./membership-tier";

const THRESHOLDS: MembershipTierThresholds = {
  silverMinOrders: 5,
  silverMinSpend: 1000000,
  goldMinOrders: 15,
  goldMinSpend: 3000000,
  vipMinOrders: 30,
  vipMinSpend: 7000000,
};

describe("computeMembershipTier", () => {
  it("is NONE below every threshold", () => {
    expect(computeMembershipTier(2, 200000, THRESHOLDS)).toBe("NONE");
  });

  it("reaches SILVER by order count alone", () => {
    expect(computeMembershipTier(5, 0, THRESHOLDS)).toBe("SILVER");
  });

  it("reaches SILVER by spend alone, below the order-count threshold", () => {
    expect(computeMembershipTier(1, 1000000, THRESHOLDS)).toBe("SILVER");
  });

  it("reaches GOLD once either the order-count or spend threshold is met", () => {
    expect(computeMembershipTier(15, 0, THRESHOLDS)).toBe("GOLD");
    expect(computeMembershipTier(0, 3000000, THRESHOLDS)).toBe("GOLD");
  });

  it("reaches VIP at the top threshold, taking priority over lower tiers", () => {
    expect(computeMembershipTier(30, 0, THRESHOLDS)).toBe("VIP");
    expect(computeMembershipTier(100, 100000000, THRESHOLDS)).toBe("VIP");
  });

  it("is graded by whichever metric is more generous, never averaged", () => {
    // Huge order count, zero spend — still grades by count alone.
    expect(computeMembershipTier(50, 0, THRESHOLDS)).toBe("VIP");
  });
});
