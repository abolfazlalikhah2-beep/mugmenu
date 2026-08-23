import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/credits/repositories/credit-repository";
import { settleCreditSchema } from "@/features/credits/services/credit-schemas";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { computeCreditStatus } from "@/features/credits/services/credit-status";
import type { CreditStatus } from "@/lib/generated/prisma/enums";
import type { DateRange } from "@/features/dashboard/services/date-range-filter";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export interface CreateCreditRecordInput {
  businessId: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  notes?: string;
}

/**
 * Called internally from order-mgmt-service.createManualOrder right after
 * the order itself is created — never exposed as a standalone client
 * action, since a credit record must always be tied to a real order it was
 * derived from, not fabricated from arbitrary client input.
 */
export async function createCreditRecord(input: CreateCreditRecordInput) {
  const record = await repo.createCreditRecord({
    businessId: input.businessId,
    orderId: input.orderId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    amount: input.amount,
    notes: input.notes,
  });
  logger.info("credits.record_created", { businessId: input.businessId, orderId: input.orderId, amount: input.amount });
  return record;
}

export interface CreditRecordRow {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  orderDate: Date;
  amount: number;
  paidAmount: number;
  remaining: number;
  status: CreditStatus;
  notes: string | null;
}

export async function getCreditRecords(
  businessId: string,
  status?: CreditStatus,
  dateRange?: DateRange
): Promise<CreditRecordRow[]> {
  const rows = await repo.getCreditRecords(
    businessId,
    status,
    dateRange ? { gte: dateRange.start, lte: dateRange.end } : undefined
  );
  return rows.map((r) => ({
    id: r.id,
    orderId: r.orderId,
    customerName: r.customerName,
    customerPhone: r.customerPhone,
    orderDate: r.order.createdAt,
    amount: r.amount,
    paidAmount: r.paidAmount,
    remaining: r.amount - r.paidAmount,
    status: r.status,
    notes: r.notes,
  }));
}

export async function getCreditRecordDetail(businessId: string, id: string) {
  const record = await repo.getCreditRecordById(id);
  if (!record || record.businessId !== businessId) return null;
  return record;
}

export async function settleCreditRecord(businessId: string, id: string, input: unknown): Promise<ServiceResult> {
  const allowed = await businessHasFeature(businessId, "order.manual_entry");
  if (!allowed) return { ok: false, error: "این امکان در پلن شما موجود نیست." };

  const parsed = settleCreditSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const record = await repo.getCreditRecordById(id);
  if (!record || record.businessId !== businessId) return { ok: false, error: "رکورد نسیه پیدا نشد." };
  if (record.status === "PAID") return { ok: false, error: "این نسیه قبلاً تسویه شده است." };

  const paidAmount = record.paidAmount + parsed.data.receivedAmount;
  const status = computeCreditStatus(record.amount, paidAmount);

  await repo.updateCreditRecord(id, {
    paidAmount,
    status,
    notes: parsed.data.notes || record.notes,
    settledAt: status === "PAID" ? new Date() : record.settledAt,
  });

  logger.info("credits.record_settled", { businessId, id, receivedAmount: parsed.data.receivedAmount, status });
  return { ok: true };
}

/** Sum of (amount - paidAmount) across UNPAID/PARTIAL records in the range — used by the cash register report. */
export async function getOutstandingCreditForRange(businessId: string, range: { gte: Date; lt: Date }): Promise<number> {
  const rows = await repo.getOutstandingCreditForRange(businessId, range);
  return rows.reduce((sum, r) => sum + (r.amount - r.paidAmount), 0);
}
