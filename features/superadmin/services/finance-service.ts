import "server-only";
import { logger } from "@/lib/logger";
import { computeDelta } from "@/features/dashboard/services/stat-delta";
import { getPaymentGateway } from "@/lib/payments/payment-gateway";
import * as repo from "@/features/superadmin/repositories/superadmin-repository";
import { gatewaySettingsSchema } from "@/features/superadmin/services/superadmin-schemas";
import type { TransactionStatus } from "@/lib/generated/prisma/enums";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export interface FinanceTransactionRow {
  id: string;
  payerName: string;
  storeName: string;
  amount: number;
  planName: string;
  status: TransactionStatus;
  createdAt: Date;
}

function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1);
}

export async function getFinanceStats() {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = addMonths(thisMonthStart, -1);
  const thisYearStart = startOfYear(now);
  const lastYearStart = new Date(thisYearStart.getFullYear() - 1, 0, 1);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    revenueThisMonth,
    revenueLastMonth,
    revenueThisYear,
    revenueLastYear,
    activeSubscriptions,
    newSubscriptionsThisMonth,
    failedTransactions,
  ] = await Promise.all([
    repo.sumTransactionAmount("PAID", { gte: thisMonthStart }),
    repo.sumTransactionAmount("PAID", { gte: lastMonthStart, lt: thisMonthStart }),
    repo.sumTransactionAmount("PAID", { gte: thisYearStart }),
    repo.sumTransactionAmount("PAID", { gte: lastYearStart, lt: thisYearStart }),
    repo.countActiveSubscriptions(now),
    repo.countNewSubscriptionsThisMonth(thisMonthStart),
    repo.countFailedTransactions({ gte: last30Days }),
  ]);

  return {
    revenueThisMonth: { value: revenueThisMonth, ...computeDelta(revenueThisMonth, revenueLastMonth) },
    revenueThisYear: { value: revenueThisYear, ...computeDelta(revenueThisYear, revenueLastYear) },
    activeSubscriptions: { value: activeSubscriptions, newThisMonth: newSubscriptionsThisMonth },
    failedTransactions: { value: failedTransactions },
  };
}

export async function getTransactions(take?: number): Promise<FinanceTransactionRow[]> {
  const rows = await repo.getTransactionsForFinance(take);
  return rows.map((t) => ({
    id: t.id,
    payerName: t.business.owners[0]?.fullName ?? "—",
    storeName: t.business.name,
    amount: t.amount,
    planName: t.planName,
    status: t.status,
    createdAt: t.createdAt,
  }));
}

export async function getGatewaySettings() {
  return repo.getOrCreatePlatformSettings();
}

export async function updateGatewaySettings(input: unknown): Promise<ServiceResult> {
  const parsed = gatewaySettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const settings = await repo.getOrCreatePlatformSettings();
  const { connected } = await getPaymentGateway().testConnection({
    merchantId: parsed.data.zarinpalMerchantId ?? "",
    apiKey: parsed.data.zarinpalApiKey || settings.zarinpalApiKey || "",
    callbackUrl: parsed.data.zarinpalCallbackUrl ?? "",
    sandbox: parsed.data.zarinpalSandbox,
  });

  await repo.updatePlatformSettings(settings.id, {
    zarinpalMerchantId: parsed.data.zarinpalMerchantId,
    ...(parsed.data.zarinpalApiKey ? { zarinpalApiKey: parsed.data.zarinpalApiKey } : {}),
    zarinpalCallbackUrl: parsed.data.zarinpalCallbackUrl,
    zarinpalSandbox: parsed.data.zarinpalSandbox,
    zarinpalConnected: connected,
  });

  logger.info("superadmin.gateway_settings_updated", { connected });
  return { ok: true };
}

export async function toggleGatewayEnabled(
  next: boolean
): Promise<{ ok: boolean; error?: string }> {
  const settings = await repo.getOrCreatePlatformSettings();
  await repo.updatePlatformSettings(settings.id, { gatewayEnabled: next });
  logger.info("superadmin.gateway_enabled_toggled", { gatewayEnabled: next });
  return { ok: true };
}
