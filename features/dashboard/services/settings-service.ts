import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { settingsSchema } from "@/features/dashboard/services/dashboard-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export function getBusiness(businessId: string) {
  return repo.getBusinessById(businessId);
}

export async function updateSettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.settings_updated", { businessId });
  return { ok: true };
}

export async function toggleAcceptingOrders(
  businessId: string,
  isAcceptingOrders: boolean
): Promise<ServiceResult> {
  await repo.updateBusiness(businessId, { isAcceptingOrders });
  logger.info("dashboard.accepting_orders_toggled", { businessId, isAcceptingOrders });
  return { ok: true };
}
