import "server-only";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import * as repo from "@/features/payments/repositories/payment-repository";
import {
  paymentCardSchema,
  createPaymentRequestSchema,
  verifyPaymentRequestSchema,
} from "@/features/payments/services/payment-schemas";
import * as planService from "@/features/plans/services/plan-service";
import type { PaymentRequestStatus, BillingCycle } from "@/lib/generated/prisma/enums";

export type ServiceResult = { ok: true } | { ok: false; error: string };
export type VerifyResult = { ok: true; businessId: string } | { ok: false; error: string };

// ---------- Cards (super admin) ----------

export function getPaymentCards() {
  return repo.getAllPaymentCards();
}

export async function createCard(input: unknown): Promise<ServiceResult> {
  const parsed = paymentCardSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  await repo.createPaymentCard(parsed.data);
  logger.info("payments.card_created", { bankName: parsed.data.bankName });
  return { ok: true };
}

export async function updateCard(id: string, input: unknown): Promise<ServiceResult> {
  const parsed = paymentCardSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  await repo.updatePaymentCard(id, parsed.data);
  logger.info("payments.card_updated", { id });
  return { ok: true };
}

export async function toggleCardActive(id: string, isActive: boolean): Promise<ServiceResult> {
  await repo.setPaymentCardActive(id, isActive);
  logger.info("payments.card_active_toggled", { id, isActive });
  return { ok: true };
}

export async function deleteCard(id: string): Promise<ServiceResult> {
  await repo.deletePaymentCard(id);
  logger.info("payments.card_deleted", { id });
  return { ok: true };
}

// ---------- Plan pricing (for the /payment page) ----------

export interface PlanPricing {
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  amount: number;
}

export async function getPlanPricing(planId: string, billingCycle: BillingCycle): Promise<PlanPricing | null> {
  const plans = await planService.getAllPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return null;
  const amount = billingCycle === "ANNUAL" ? plan.annualPrice : plan.monthlyPrice;
  return { planId: plan.id, planName: plan.name, billingCycle, amount };
}

export async function pickRandomActiveCard() {
  const cards = await repo.getActivePaymentCards();
  if (cards.length === 0) return null;
  return cards[Math.floor(Math.random() * cards.length)];
}

// ---------- Business-side request ----------

const CREATE_REQUEST_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 }; // 5 requests / hour / business

export async function createRequest(businessId: string, input: unknown): Promise<ServiceResult> {
  const { allowed } = checkRateLimit(`payment-request:${businessId}`, CREATE_REQUEST_LIMIT);
  if (!allowed) {
    logger.warn("payments.request_rate_limited", { businessId });
    return { ok: false, error: "تعداد درخواست پرداخت بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const parsed = createPaymentRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const card = await repo.getPaymentCardById(parsed.data.assignedCardId);
  if (!card || !card.isActive) return { ok: false, error: "کارت پرداخت انتخاب‌شده معتبر نیست." };

  await repo.createPaymentRequest({
    businessId,
    amount: parsed.data.amount,
    assignedCardId: parsed.data.assignedCardId,
    screenshotUrl: parsed.data.screenshotUrl,
  });
  logger.info("payments.request_created", { businessId, amount: parsed.data.amount });
  return { ok: true };
}

export interface BusinessPaymentRequestRow {
  id: string;
  amount: number;
  cardLabel: string;
  status: PaymentRequestStatus;
  createdAt: Date;
}

export async function getRequestsForBusiness(businessId: string): Promise<BusinessPaymentRequestRow[]> {
  const rows = await repo.getPaymentRequestsForBusiness(businessId);
  return rows.map((r) => ({
    id: r.id,
    amount: r.amount,
    cardLabel: `${r.assignedCard.bankName} · ${lastFour(r.assignedCard.cardNumber)}`,
    status: r.status,
    createdAt: r.createdAt,
  }));
}

// ---------- Super-admin review ----------

function lastFour(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.slice(-4);
}

export interface PaymentRequestRow {
  id: string;
  businessId: string;
  storeName: string;
  amount: number;
  cardLabel: string;
  referenceNumber: string | null;
  screenshotUrl: string | null;
  status: PaymentRequestStatus;
  notes: string | null;
  createdAt: Date;
}

export async function getRequestRows(filter?: { status?: PaymentRequestStatus }): Promise<PaymentRequestRow[]> {
  const rows = await repo.getAllPaymentRequests(filter);
  return rows.map((r) => ({
    id: r.id,
    businessId: r.businessId,
    storeName: r.business.name,
    amount: r.amount,
    cardLabel: `${r.assignedCard.bankName} · ${lastFour(r.assignedCard.cardNumber)}`,
    referenceNumber: r.referenceNumber,
    screenshotUrl: r.screenshotUrl,
    status: r.status,
    notes: r.notes,
    createdAt: r.createdAt,
  }));
}

export async function verifyRequest(id: string, input: unknown): Promise<VerifyResult> {
  const parsed = verifyPaymentRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const request = await repo.getPaymentRequestById(id);
  if (!request) return { ok: false, error: "درخواست پیدا نشد." };

  if (parsed.data.status === "VERIFIED") {
    const plans = await planService.getAllPlans();
    if (!plans.some((p) => p.id === parsed.data.newPlanId)) return { ok: false, error: "پلن نامعتبر است." };
    await planService.changeBusinessPlan(request.businessId, parsed.data.newPlanId!, parsed.data.billingCycle ?? "MONTHLY");
  }

  await repo.updatePaymentRequestStatus(id, {
    status: parsed.data.status,
    referenceNumber: parsed.data.referenceNumber,
    notes: parsed.data.notes || null,
    verifiedAt: new Date(),
  });

  logger.info("payments.request_verified", { id, status: parsed.data.status, businessId: request.businessId });
  return { ok: true, businessId: request.businessId };
}
