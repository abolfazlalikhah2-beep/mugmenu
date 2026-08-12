import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/customer/repositories/customer-repository";
import {
  computeCashback,
  computeLoyaltyPointsEarned,
  computeLoyaltyTier,
  isRewardUnlocked,
  LOYALTY_REWARDS,
  REVIEW_LOYALTY_POINTS,
  DEFAULT_CASHBACK_SETTINGS,
} from "@/features/customer/services/loyalty";

export async function getWalletAndLoyaltySummary(customerAccountId: string) {
  const account = await repo.getAccountById(customerAccountId);
  if (!account) return null;

  const settings = await repo.getBusinessCashbackSettings(account.businessId);
  const tierStatus = computeLoyaltyTier(account.loyaltyPoints);
  return {
    walletBalance: account.walletBalance,
    loyaltyPoints: account.loyaltyPoints,
    tier: tierStatus,
    cashbackPercent: settings?.cashbackPercent ?? DEFAULT_CASHBACK_SETTINGS.percent,
    rewards: LOYALTY_REWARDS.map((r) => ({ ...r, unlocked: isRewardUnlocked(account.loyaltyPoints, r) })),
  };
}

export function getWalletLedger(customerAccountId: string) {
  return repo.getWalletTransactions(customerAccountId);
}

/**
 * Credits cashback + loyalty points for an order placed while logged in.
 * Called from features/menu's order flow right after the order is created
 * — never reduces the order's own total (see WalletTransaction's schema
 * comment; spending the balance at checkout is future work). businessId is
 * the caller's already-loaded Business (menu/services/order-service.ts),
 * used to load the admin's configured cashback rate/cap.
 */
export async function creditCashbackForOrder(
  customerAccountId: string,
  businessId: string,
  orderId: string,
  orderTotal: number
) {
  const businessSettings = await repo.getBusinessCashbackSettings(businessId);
  const settings = businessSettings
    ? {
        enabled: businessSettings.cashbackEnabled,
        percent: businessSettings.cashbackPercent,
        capPerOrder: businessSettings.cashbackCapPerOrder,
      }
    : DEFAULT_CASHBACK_SETTINGS;
  const cashback = computeCashback(orderTotal, settings);
  const points = computeLoyaltyPointsEarned(orderTotal);

  if (cashback > 0) {
    await repo.creditWallet({
      customerAccountId,
      orderId,
      type: "CASHBACK_EARNED",
      amount: cashback,
      note: "کش‌بک سفارش",
    });
  }
  if (points > 0) await repo.incrementLoyaltyPoints(customerAccountId, points);

  logger.info("customer.cashback_credited", { customerAccountId, orderId, cashback, points });
  return { cashback, points };
}

/** Flat loyalty-point award for submitting a review (features/menu's review-service). No wallet ledger entry — this isn't cashback. */
export async function awardReviewPoints(customerAccountId: string, orderId: string) {
  await repo.incrementLoyaltyPoints(customerAccountId, REVIEW_LOYALTY_POINTS);
  logger.info("customer.review_points_awarded", {
    customerAccountId,
    orderId,
    points: REVIEW_LOYALTY_POINTS,
  });
  return REVIEW_LOYALTY_POINTS;
}
