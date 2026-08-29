/**
 * Pure — no I/O — loyalty club membership tier grading. Distinct from the
 * points-based SILVER/GOLD tier on the customer-facing wallet page
 * (features/customer/services/loyalty.ts's computeLoyaltyTier, which has no
 * admin control): this one grades a customer's *lifetime order history* for
 * one business against thresholds the owner configures (dashboard "باشگاه
 * مشتریان" › "سطوح عضویت" tab, stored on Business — see its schema
 * comment). Computed at read time, not stored per customer, so changing the
 * thresholds instantly re-grades everyone.
 */

export type MembershipTier = "NONE" | "SILVER" | "GOLD" | "VIP";

export interface MembershipTierThresholds {
  silverMinOrders: number;
  silverMinSpend: number;
  goldMinOrders: number;
  goldMinSpend: number;
  vipMinOrders: number;
  vipMinSpend: number;
}

/** Matches Business's column defaults — used when a business row can't be loaded. */
export const DEFAULT_MEMBERSHIP_TIER_THRESHOLDS: MembershipTierThresholds = {
  silverMinOrders: 5,
  silverMinSpend: 1000000,
  goldMinOrders: 15,
  goldMinSpend: 3000000,
  vipMinOrders: 30,
  vipMinSpend: 7000000,
};

export const MEMBERSHIP_TIER_LABELS: Record<MembershipTier, string> = {
  NONE: "عادی",
  SILVER: "نقره‌ای",
  GOLD: "طلایی",
  VIP: "ویژه",
};

/** A customer reaches a tier once their lifetime order count OR lifetime spend meets/exceeds that tier's threshold — checked from the highest tier down. */
export function computeMembershipTier(
  orderCount: number,
  totalSpend: number,
  thresholds: MembershipTierThresholds
): MembershipTier {
  if (orderCount >= thresholds.vipMinOrders || totalSpend >= thresholds.vipMinSpend) return "VIP";
  if (orderCount >= thresholds.goldMinOrders || totalSpend >= thresholds.goldMinSpend) return "GOLD";
  if (orderCount >= thresholds.silverMinOrders || totalSpend >= thresholds.silverMinSpend) return "SILVER";
  return "NONE";
}
