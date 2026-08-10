import { describe, it, expect } from "vitest";
import {
  computeCashback,
  computeLoyaltyPointsEarned,
  computeLoyaltyTier,
  isRewardUnlocked,
  LOYALTY_REWARDS,
} from "./loyalty";

describe("computeCashback", () => {
  it("rounds 5% of the order total to the nearest toman", () => {
    expect(computeCashback(590000)).toBe(29500);
    expect(computeCashback(1)).toBe(0);
    expect(computeCashback(10)).toBe(1);
  });
});

describe("computeLoyaltyPointsEarned", () => {
  it("floors 1 point per 1000 toman spent", () => {
    expect(computeLoyaltyPointsEarned(1240000)).toBe(1240);
    expect(computeLoyaltyPointsEarned(999)).toBe(0);
    expect(computeLoyaltyPointsEarned(1999)).toBe(1);
  });
});

describe("computeLoyaltyTier", () => {
  it("is SILVER below the gold threshold, with points remaining", () => {
    const status = computeLoyaltyTier(1240);
    expect(status.tier).toBe("SILVER");
    expect(status.pointsToNextTier).toBe(760);
    expect(status.nextTierThreshold).toBe(2000);
  });

  it("is GOLD at or above the threshold, with nothing left to earn", () => {
    expect(computeLoyaltyTier(2000)).toEqual({ tier: "GOLD", pointsToNextTier: 0, nextTierThreshold: null });
    expect(computeLoyaltyTier(5000).tier).toBe("GOLD");
  });
});

describe("isRewardUnlocked", () => {
  it("unlocks a reward once points reach its cost, and not before", () => {
    const reward = LOYALTY_REWARDS[0];
    expect(isRewardUnlocked(reward.cost - 1, reward)).toBe(false);
    expect(isRewardUnlocked(reward.cost, reward)).toBe(true);
  });
});
