/**
 * Pure — no I/O — wallet/loyalty math, so it's trivial to unit test. Rates
 * mirror what Customer Account.dc.html shows (۵٪ cashback, ۲٬۰۰۰ points to
 * the gold tier); there's no admin control for these yet (see
 * features/customer/README.md), same simplification already made for the
 * hardcoded subscription plan defaults on Business.
 */

export const CASHBACK_PERCENT = 5;
const TOMAN_PER_LOYALTY_POINT = 1000;
const GOLD_TIER_THRESHOLD = 2000;

export function computeCashback(orderTotal: number): number {
  return Math.round((orderTotal * CASHBACK_PERCENT) / 100);
}

export function computeLoyaltyPointsEarned(orderTotal: number): number {
  return Math.floor(orderTotal / TOMAN_PER_LOYALTY_POINT);
}

export type LoyaltyTier = "SILVER" | "GOLD";

export interface LoyaltyTierStatus {
  tier: LoyaltyTier;
  pointsToNextTier: number;
  nextTierThreshold: number | null;
}

export function computeLoyaltyTier(points: number): LoyaltyTierStatus {
  if (points >= GOLD_TIER_THRESHOLD) {
    return { tier: "GOLD", pointsToNextTier: 0, nextTierThreshold: null };
  }
  return {
    tier: "SILVER",
    pointsToNextTier: GOLD_TIER_THRESHOLD - points,
    nextTierThreshold: GOLD_TIER_THRESHOLD,
  };
}

export interface LoyaltyReward {
  label: string;
  cost: number;
}

export const LOYALTY_REWARDS: LoyaltyReward[] = [
  { label: "یک نوشیدنی رایگان", cost: 500 },
  { label: "۱۰٪ تخفیف سفارش بعدی", cost: 800 },
  { label: "دسر رایگان", cost: 1500 },
];

export function isRewardUnlocked(points: number, reward: LoyaltyReward): boolean {
  return points >= reward.cost;
}
