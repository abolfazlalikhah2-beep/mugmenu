import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/superadmin/repositories/superadmin-repository";
import * as planService from "@/features/plans/services/plan-service";
import { changePlanSchema } from "@/features/superadmin/services/superadmin-schemas";
import { computeSubscriptionStatus, type SubscriptionStatus } from "@/features/superadmin/services/subscription-status";

function priceForCycle(plan: { monthlyPrice: number; annualPrice: number }, billingCycle: "MONTHLY" | "ANNUAL") {
  return billingCycle === "ANNUAL" ? plan.annualPrice : plan.monthlyPrice;
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
    activity,
    payments,
  };
}

export type CustomerDetail = NonNullable<Awaited<ReturnType<typeof getCustomerDetail>>>;

export async function renewSubscription(businessId: string): Promise<ServiceResult> {
  const business = await repo.getBusinessDetail(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const amount = priceForCycle(business.plan, business.billingCycle);
  await repo.renewSubscriptionManually(businessId, amount, business.plan.name);
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
