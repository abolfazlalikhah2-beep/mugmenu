import "server-only";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { onboardingSchema } from "@/features/dashboard/services/dashboard-schemas";
import { getPlanByKey } from "@/features/plans/repositories/plan-repository";
import { computePlanDates } from "@/features/plans/services/plan-dates";

// New businesses default to the base plan (firuze), not a free grant of a
// paid tier — there's no self-service plan picker or payment gateway at
// signup yet (phase 3 payment work, see CLAUDE.md), so upgrading to
// yashm/opal/zomorrod happens manually via the super admin panel (either a
// real subscription or the demo trial modal), never automatically.
const DEFAULT_SIGNUP_PLAN_KEY = "firuze";
const DEFAULT_SIGNUP_BILLING_CYCLE = "MONTHLY";

export type ServiceResult = { ok: true; slug: string } | { ok: false; error: string };

export async function completeOnboarding(userId: string, input: unknown): Promise<ServiceResult> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const existingSlug = await prisma.business.findUnique({ where: { slug: data.slug } });
  if (existingSlug) {
    return { ok: false, error: "این شناسه قبلاً استفاده شده است." };
  }

  const defaultPlan = await getPlanByKey(DEFAULT_SIGNUP_PLAN_KEY);
  if (!defaultPlan) return { ok: false, error: "خطای پیکربندی پلن. با پشتیبانی تماس بگیرید." };

  const { planStartedAt, planExpiresAt } = computePlanDates(DEFAULT_SIGNUP_BILLING_CYCLE);
  const business = await repo.createBusiness({
    ...data,
    planId: defaultPlan.id,
    billingCycle: DEFAULT_SIGNUP_BILLING_CYCLE,
    planStartedAt,
    planExpiresAt,
  });
  await repo.linkUserToBusiness(userId, business.id);
  logger.info("dashboard.onboarding_completed", { businessId: business.id, slug: business.slug });

  return { ok: true, slug: business.slug };
}
