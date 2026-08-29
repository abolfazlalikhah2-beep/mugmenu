import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import {
  cashbackSettingsSchema,
  birthdaySettingsSchema,
  birthdayTestSendSchema,
  membershipTierSettingsSchema,
} from "@/features/dashboard/services/dashboard-schemas";
import {
  summarizeMembers,
  memberGrowthTrend,
  cashbackTrend,
  applyLoyaltyFilter,
  toLoyaltyMemberRow,
  type LoyaltyFilter,
  type LoyaltyMemberRow,
} from "@/features/dashboard/services/loyalty-club-aggregation";
import { renderSmsTemplate } from "@/features/dashboard/utils/sms-template";
import { addMonths, startOfMonth } from "@/features/dashboard/services/date-utils";
import * as smsService from "@/features/dashboard/services/sms-service";

export type ServiceResult = { ok: true } | { ok: false; error: string };

const GROWTH_WINDOW_MONTHS = 12;
const LOYALTY_FILTERS: LoyaltyFilter[] = ["ALL", "INACTIVE_30", "INACTIVE_90", "GOLD", "WALLET_100K"];

export interface LoyaltyClubDashboard {
  summary: ReturnType<typeof summarizeMembers>;
  growth: ReturnType<typeof memberGrowthTrend>;
  cashback: ReturnType<typeof cashbackTrend>;
  latestMembers: LoyaltyMemberRow[];
}

export async function getLoyaltyClubDashboard(businessId: string): Promise<LoyaltyClubDashboard> {
  const now = new Date();
  const since = addMonths(startOfMonth(now), -(GROWTH_WINDOW_MONTHS - 1));

  const [members, ledger] = await Promise.all([
    repo.getLoyaltyMembers(businessId),
    repo.getCashbackLedger(businessId, since),
  ]);

  return {
    summary: summarizeMembers(members, now),
    growth: memberGrowthTrend(members, now, GROWTH_WINDOW_MONTHS),
    cashback: cashbackTrend(ledger, now),
    latestMembers: members.slice(0, 5).map(toLoyaltyMemberRow),
  };
}

/** Full member list for the export tab — same shape as the dashboard's latest-members table, just unlimited. */
export async function getLoyaltyMembersList(businessId: string): Promise<LoyaltyMemberRow[]> {
  const members = await repo.getLoyaltyMembers(businessId);
  return members.map(toLoyaltyMemberRow);
}

/** Live recipient counts per quick-filter, for the "ارسال پیام" tab. */
export async function getLoyaltyAudienceCounts(businessId: string): Promise<Record<LoyaltyFilter, number>> {
  const rows = await getLoyaltyMembersList(businessId);
  const now = new Date();
  const entries = LOYALTY_FILTERS.map((f) => [f, applyLoyaltyFilter(rows, f, now).length] as const);
  return Object.fromEntries(entries) as Record<LoyaltyFilter, number>;
}

export async function updateCashbackSettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = cashbackSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.cashback_settings_updated", { businessId, ...parsed.data });
  return { ok: true };
}

export async function updateBirthdaySettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = birthdaySettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.birthday_settings_updated", { businessId });
  return { ok: true };
}

export async function updateMembershipTierSettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = membershipTierSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.membership_tier_settings_updated", { businessId, ...parsed.data });
  return { ok: true };
}

/**
 * Sends the saved birthday template to a phone number the admin enters, so
 * they can preview it — no automatic daily send exists (no birthDate field,
 * no cron scheduler in this app). Reuses smsService.sendSingleSms rather
 * than talking to the SMS provider directly.
 */
export async function sendBirthdayTestMessage(businessId: string, input: unknown): Promise<smsService.SendSmsResult> {
  const parsed = birthdayTestSendSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const business = await repo.getBusinessById(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };
  if (!business.birthdayMessageText?.trim()) return { ok: false, error: "ابتدا متن پیام تولد را ذخیره کنید." };

  const text = renderSmsTemplate(business.birthdayMessageText, {
    customerName: "علی رضایی",
    creditAmount: business.birthdayGiftAmount,
  });
  return smsService.sendSingleSms(businessId, { phone: parsed.data.phone, text });
}
