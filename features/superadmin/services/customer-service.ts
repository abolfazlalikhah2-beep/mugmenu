import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";
import * as repo from "@/features/superadmin/repositories/superadmin-repository";
import * as planService from "@/features/plans/services/plan-service";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { changePlanSchema, demoTrialSchema, newCustomerSchema } from "@/features/superadmin/services/superadmin-schemas";
import { computeSubscriptionStatus, type SubscriptionStatus } from "@/features/superadmin/services/subscription-status";
import { isDemoEffective } from "@/features/plans/services/demo-access";
import { computePlanDates, type BillingCycle } from "@/features/plans/services/plan-dates";

function priceForCycle(plan: { monthlyPrice: number; sixMonthPrice: number; annualPrice: number }, billingCycle: BillingCycle) {
  if (billingCycle === "ANNUAL") return plan.annualPrice;
  if (billingCycle === "SIX_MONTH") return plan.sixMonthPrice;
  return plan.monthlyPrice;
}

export type ServiceResult = { ok: true } | { ok: false; error: string };

export interface CustomerSummary {
  id: string;
  store: string;
  owner: string;
  phone: string;
  address: string | null;
  planName: string;
  planExpiresAt: Date;
  status: SubscriptionStatus;
  isSuspended: boolean;
}

function toSummary(b: {
  id: string;
  name: string;
  address: string | null;
  plan: { name: string };
  planExpiresAt: Date;
  isSuspended: boolean;
  owners: { fullName: string; phone: string }[];
  transactions: { id: string }[];
}): CustomerSummary {
  const owner = b.owners[0];
  return {
    id: b.id,
    store: b.name,
    owner: owner?.fullName ?? "—",
    phone: owner?.phone ?? "—",
    address: b.address,
    planName: b.plan.name,
    planExpiresAt: b.planExpiresAt,
    isSuspended: b.isSuspended,
    status: computeSubscriptionStatus({ planExpiresAt: b.planExpiresAt, hasPaidTransaction: b.transactions.length > 0 }),
  };
}

export async function getCustomers(search?: string): Promise<CustomerSummary[]> {
  const rows = await repo.getBusinessesForList(search);
  return rows.map(toSummary);
}

export function getBusinessesForPicker() {
  return repo.getBusinessesForPicker();
}

export async function getCustomerDetail(businessId: string) {
  const business = await repo.getBusinessDetail(businessId);
  if (!business) return null;

  const [activity, payments] = await Promise.all([
    repo.getBusinessActivitySummary(businessId),
    repo.getPaymentsForBusiness(businessId),
  ]);

  const owner = business.owners.find((u) => u.role === "OWNER") ?? business.owners[0] ?? null;

  return {
    business,
    owner,
    status: computeSubscriptionStatus({
      planExpiresAt: business.planExpiresAt,
      hasPaidTransaction: business.transactions.length > 0,
    }),
    demoActive: isDemoEffective(business),
    activity,
    payments,
  };
}

export type CustomerDetail = NonNullable<Awaited<ReturnType<typeof getCustomerDetail>>>;

export async function renewSubscription(businessId: string): Promise<ServiceResult> {
  const business = await repo.getBusinessDetail(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const amount = priceForCycle(business.plan, business.billingCycle);
  await repo.renewSubscriptionManually(businessId, amount, business.plan.name, business.billingCycle);
  logger.info("superadmin.subscription_renewed", { businessId });
  return { ok: true };
}

export async function setSuspended(businessId: string, isSuspended: boolean): Promise<ServiceResult> {
  const business = await repo.getBusinessDetail(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  await repo.setBusinessSuspended(businessId, isSuspended);
  logger.info("superadmin.business_suspension_toggled", { businessId, isSuspended });
  return { ok: true };
}

export async function updateDemo(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = demoTrialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const business = await repo.getBusinessDetail(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const demoExpiresAt = parsed.data.demoExpiresAt ? new Date(`${parsed.data.demoExpiresAt}T23:59:59`) : null;
  await repo.updateBusinessDemo(businessId, parsed.data.isDemoActive, demoExpiresAt);
  logger.info("superadmin.business_demo_updated", {
    businessId,
    isDemoActive: parsed.data.isDemoActive,
    demoExpiresAt,
  });
  return { ok: true };
}

export function getPlansForPicker() {
  return planService.getAllPlans();
}

export async function changePlan(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = changePlanSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const business = await repo.getBusinessDetail(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const plans = await planService.getAllPlans();
  if (!plans.some((p) => p.id === parsed.data.planId)) return { ok: false, error: "پلن نامعتبر است." };

  await planService.changeBusinessPlan(businessId, parsed.data.planId, parsed.data.billingCycle);
  logger.info("superadmin.business_plan_changed", { businessId, planId: parsed.data.planId, billingCycle: parsed.data.billingCycle });
  return { ok: true };
}

function generateTempPassword(): string {
  return crypto.randomBytes(6).toString("base64url").slice(0, 8);
}

export type CreateCustomerResult =
  | { ok: true; businessId: string; slug: string; tempPassword: string }
  | { ok: false; error: string };

/**
 * Manual customer onboarding from the super-admin panel (پنل داخلی ماگ‌منو
 * "افزودن مشتری") — for phone-verified signups the normal path is
 * register + /onboarding, but staff sometimes need to create a paying
 * customer's account + business directly (e.g. onboarding over a phone
 * call). Creates User + Business in one transaction and puts the business
 * straight on the picked plan/cycle, mirroring what onboarding-service.ts
 * does for self-service signups.
 */
export async function createCustomer(input: unknown): Promise<CreateCustomerResult> {
  const parsed = newCustomerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const existingUser = await findUserByPhone(data.phone);
  if (existingUser) return { ok: false, error: "کاربری با این شماره قبلاً ثبت شده است." };

  const existingSlug = await repo.getBusinessBySlug(data.slug);
  if (existingSlug) return { ok: false, error: "این شناسه قبلاً استفاده شده است." };

  const plans = await planService.getAllPlans();
  if (!plans.some((p) => p.id === data.planId)) return { ok: false, error: "پلن نامعتبر است." };

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  const { planStartedAt, planExpiresAt } = computePlanDates(data.billingCycle as BillingCycle);

  const business = await repo.createCustomerWithOwner({
    fullName: data.fullName,
    phone: data.phone,
    passwordHash,
    businessName: data.businessName,
    slug: data.slug,
    planId: data.planId,
    billingCycle: data.billingCycle,
    planStartedAt,
    planExpiresAt,
  });

  logger.info("superadmin.customer_created", { businessId: business.id, slug: business.slug, planId: data.planId });
  return { ok: true, businessId: business.id, slug: business.slug, tempPassword };
}
