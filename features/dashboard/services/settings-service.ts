import "server-only";
import { logger } from "@/lib/logger";
import { getMenuUrl } from "@/lib/menu-url";
import { deleteImageByUrl } from "@/features/uploads/services/storage-service";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import {
  businessInfoSchema,
  businessHoursSchema,
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

export async function getBusinessMenuUrl(businessId: string): Promise<string | null> {
  const info = await repo.getBusinessMenuUrlInfo(businessId);
  if (!info) return null;
  return getMenuUrl({ slug: info.slug, planKey: info.plan.key, customDomain: info.customDomain });
}

export async function updateBusinessInfo(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = businessInfoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateBusiness(businessId, parsed.data);
  logger.info("dashboard.business_info_updated", { businessId });
  return { ok: true };
}

export async function updateBusinessHours(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = businessHoursSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.upsertBusinessHours(businessId, parsed.data.days);
  logger.info("dashboard.business_hours_updated", { businessId });
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

  const existing = await repo.getBusinessById(businessId);
  await repo.updateBusiness(businessId, parsed.data);
  // Only after the DB write succeeds, so a failed update never leaves the
  // business pointing at a logo we've already deleted from S3.
  if (existing?.logoUrl && parsed.data.logoUrl && existing.logoUrl !== parsed.data.logoUrl) {
    await deleteImageByUrl(existing.logoUrl);
  }
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
