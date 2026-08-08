import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { discountCodeSchema, autoDiscountSchema } from "@/features/dashboard/services/dashboard-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

function parseDate(v?: string) {
  return v ? new Date(v) : undefined;
}

export function getDiscounts(businessId: string) {
  return repo.getDiscounts(businessId);
}

export async function getDiscountForEdit(businessId: string, discountId: string) {
  const discount = await repo.getDiscountForEdit(discountId);
  if (!discount || discount.businessId !== businessId) return null;
  return discount;
}

export async function createDiscountCode(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = discountCodeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const duplicate = await repo.findDiscountByCode(businessId, parsed.data.code);
  if (duplicate) return { ok: false, error: "این کد تخفیف قبلاً ثبت شده است." };

  await repo.createDiscount({
    businessId,
    type: "CODE",
    name: parsed.data.name,
    code: parsed.data.code,
    description: parsed.data.description,
    startDate: parseDate(parsed.data.startDate),
    endDate: parseDate(parsed.data.endDate),
    isActive: parsed.data.isActive,
  });
  logger.info("dashboard.discount_code_created", { businessId, code: parsed.data.code });
  return { ok: true };
}

export async function updateDiscountCode(
  businessId: string,
  discountId: string,
  input: unknown
): Promise<ServiceResult> {
  const existing = await repo.getDiscountForEdit(discountId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "کد تخفیف پیدا نشد." };

  const parsed = discountCodeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const duplicate = await repo.findDiscountByCode(businessId, parsed.data.code, discountId);
  if (duplicate) return { ok: false, error: "این کد تخفیف قبلاً ثبت شده است." };

  await repo.updateDiscount(discountId, {
    name: parsed.data.name,
    code: parsed.data.code,
    description: parsed.data.description ?? null,
    startDate: parseDate(parsed.data.startDate) ?? null,
    endDate: parseDate(parsed.data.endDate) ?? null,
    isActive: parsed.data.isActive,
  });
  logger.info("dashboard.discount_code_updated", { businessId, discountId });
  return { ok: true };
}

export async function createAutoDiscount(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = autoDiscountSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  await repo.createDiscount({
    businessId,
    type: "AUTOMATIC",
    name: data.name,
    percent: data.percent,
    scope: data.scope,
    categoryIds: data.scope === "CATEGORY" ? data.categoryIds : [],
    productId: data.scope === "PRODUCT" ? data.productId : undefined,
    description: data.description,
    startDate: parseDate(data.startDate),
    endDate: parseDate(data.endDate),
    isActive: data.isActive,
  });
  logger.info("dashboard.auto_discount_created", { businessId, name: data.name });
  return { ok: true };
}

export async function updateAutoDiscount(
  businessId: string,
  discountId: string,
  input: unknown
): Promise<ServiceResult> {
  const existing = await repo.getDiscountForEdit(discountId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "تخفیف پیدا نشد." };

  const parsed = autoDiscountSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  await repo.updateDiscount(discountId, {
    name: data.name,
    percent: data.percent,
    scope: data.scope,
    categoryIds: data.scope === "CATEGORY" ? data.categoryIds : [],
    productId: data.scope === "PRODUCT" ? data.productId : null,
    description: data.description ?? null,
    startDate: parseDate(data.startDate) ?? null,
    endDate: parseDate(data.endDate) ?? null,
    isActive: data.isActive,
  });
  logger.info("dashboard.auto_discount_updated", { businessId, discountId });
  return { ok: true };
}

export async function deleteDiscount(businessId: string, discountId: string): Promise<ServiceResult> {
  const existing = await repo.getDiscountForEdit(discountId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "تخفیف پیدا نشد." };
  await repo.deleteDiscount(discountId);
  logger.info("dashboard.discount_deleted", { businessId, discountId });
  return { ok: true };
}

export async function toggleDiscountActive(
  businessId: string,
  discountId: string,
  isActive: boolean
): Promise<ServiceResult> {
  const existing = await repo.getDiscountForEdit(discountId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "تخفیف پیدا نشد." };
  await repo.updateDiscount(discountId, { isActive });
  return { ok: true };
}
