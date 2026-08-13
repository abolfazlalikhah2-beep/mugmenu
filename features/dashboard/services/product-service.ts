import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { productSchema, productTranslationSchema } from "@/features/dashboard/services/dashboard-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export function getProducts(businessId: string) {
  return repo.getProducts(businessId);
}

export async function getProductForEdit(businessId: string, productId: string) {
  const product = await repo.getProductForEdit(productId);
  if (!product || product.businessId !== businessId) return null;
  return product;
}

export async function createProduct(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  await repo.createProduct({
    businessId,
    categoryId: data.categoryId,
    name: data.name,
    description: data.description,
    price: data.price,
    discountPercent: data.discountPercent,
    imageUrl: data.imageUrl,
    optionGroups: data.optionGroups,
  });
  logger.info("dashboard.product_created", { businessId, name: data.name });
  return { ok: true };
}

export async function updateProduct(
  businessId: string,
  productId: string,
  input: unknown
): Promise<ServiceResult> {
  const existing = await repo.getProductForEdit(productId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "محصول پیدا نشد." };
  }
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateProduct(productId, parsed.data);
  logger.info("dashboard.product_updated", { businessId, productId });
  return { ok: true };
}

export async function updateProductTranslation(
  businessId: string,
  productId: string,
  input: unknown
): Promise<ServiceResult> {
  const existing = await repo.getProductForEdit(productId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "محصول پیدا نشد." };
  }
  const parsed = productTranslationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateProduct(productId, parsed.data);
  return { ok: true };
}

export async function deleteProduct(businessId: string, productId: string): Promise<ServiceResult> {
  const existing = await repo.getProductForEdit(productId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "محصول پیدا نشد." };
  }
  await repo.deleteProduct(productId);
  logger.info("dashboard.product_deleted", { businessId, productId });
  return { ok: true };
}

export async function toggleProductActive(
  businessId: string,
  productId: string,
  isActive: boolean
): Promise<ServiceResult> {
  const existing = await repo.getProductForEdit(productId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "محصول پیدا نشد." };
  }
  await repo.updateProduct(productId, { isActive });
  return { ok: true };
}
