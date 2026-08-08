import "server-only";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { onboardingSchema } from "@/features/dashboard/services/dashboard-schemas";

export type ServiceResult = { ok: true; slug: string } | { ok: false; error: string };

export async function completeOnboarding(userId: string, input: unknown): Promise<ServiceResult> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const existingSlug = await prisma.business.findUnique({ where: { slug: data.slug } });
  if (existingSlug) {
    return { ok: false, error: "این شناسه قبلاً استفاده شده است." };
  }

  const business = await repo.createBusiness(data);
  await repo.linkUserToBusiness(userId, business.id);
  logger.info("dashboard.onboarding_completed", { businessId: business.id, slug: business.slug });

  return { ok: true, slug: business.slug };
}
