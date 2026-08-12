/**
 * Pure — no I/O — wallet/loyalty math, so it's trivial to unit test. Tier
 * thresholds mirror what Customer Account.dc.html shows (۲٬۰۰۰ points to
 * gold) and have no admin control (see features/customer/README.md), same
 * simplification already made for the hardcoded subscription plan defaults
 * on Business. Cashback rate *is* admin-controlled — see CashbackSettings
 * below, sourced from Business.cashback* (dashboard "باشگاه مشتریان" ›
 * "کش‌بک" tab).
 */

const TOMAN_PER_LOYALTY_POINT = 1000;
const GOLD_TIER_THRESHOLD = 2000;
/** Flat award for submitting a post-order review (Customer Feedback.dc.html), unrelated to order-total-based points above. */
export const REVIEW_LOYALTY_POINTS = 50;

export interface CashbackSettings {
  enabled: boolean;
  percent: number;
  capPerOrder: number;
}

/** Matches Business's column defaults — used when a settings row can't be loaded and by existing tests/call sites that don't care about admin overrides. */
export const DEFAULT_CASHBACK_SETTINGS: CashbackSettings = {
  enabled: true,
  percent: 5,
  capPerOrder: 50000,
};

export function computeCashback(orderTotal: number, settings: CashbackSettings = DEFAULT_CASHBACK_SETTINGS): number {
  if (!settings.enabled) return 0;
  const raw = Math.round((orderTotal * settings.percent) / 100);
  return Math.min(raw, settings.capPerOrder);
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
