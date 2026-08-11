import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import {
  businessInfoSchema,
  orderSettingsSchema,
  qrSettingsSchema,
  paymentSettingsSchema,
  menuAppearanceSchema,
  languageSettingsSchema,
} from "@/features/dashboard/services/dashboard-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export function getBusiness(businessId: string) {
  return repo.getBusinessById(businessId);
}

export async function updateBusinessInfo(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = businessInfoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.business_info_updated", { businessId });
  return { ok: true };
}

export async function updateOrderSettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = orderSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.order_settings_updated", { businessId });
  return { ok: true };
}

export async function updateQrSettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = qrSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.qr_settings_updated", { businessId });
  return { ok: true };
}

export async function updatePaymentSettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = paymentSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.payment_settings_updated", { businessId });
  return { ok: true };
}

export async function updateMenuAppearance(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = menuAppearanceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.menu_appearance_updated", { businessId });
  return { ok: true };
}

export async function updateLanguageSettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = languageSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.language_settings_updated", { businessId });
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
