const EXPIRING_SOON_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRING" | "EXPIRED";

/**
 * Pure — no I/O — so it's trivial to unit test. Business has no explicit
 * "trial" flag; a business with no PAID transaction yet is still on its
 * first (trial) cycle. Suspension (تعلیق پنل) is shown as a separate badge
 * by the caller, not folded in here.
 */
export function computeSubscriptionStatus(
  input: { planExpiresAt: Date; hasPaidTransaction: boolean },
  now = new Date()
): SubscriptionStatus {
  const remainingMs = input.planExpiresAt.getTime() - now.getTime();
  if (remainingMs <= 0) return "EXPIRED";
  if (remainingMs <= EXPIRING_SOON_DAYS * DAY_MS) return "EXPIRING";
  if (!input.hasPaidTransaction) return "TRIAL";
  return "ACTIVE";
}
