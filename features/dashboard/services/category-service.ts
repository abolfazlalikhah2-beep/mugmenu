import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { categorySchema } from "@/features/dashboard/services/dashboard-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export function getCategories(businessId: string) {
  return repo.getCategoriesWithCounts(businessId);
}

export async function getCategoryForEdit(businessId: string, categoryId: string) {
  const category = await repo.getCategoryForEdit(categoryId);
  if (!category || category.businessId !== businessId) return null;
  return category;
}

export async function createCategory(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const sortOrder = await repo.nextCategorySortOrder(businessId);
  await repo.createCategory({ businessId, ...parsed.data, sortOrder });
  logger.info("dashboard.category_created", { businessId, name: parsed.data.name });
  return { ok: true };
}

export async function updateCategory(
  businessId: string,
  categoryId: string,
  input: unknown
): Promise<ServiceResult> {
  const existing = await repo.getCategoryForEdit(categoryId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "دسته پیدا نشد." };
  }
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateCategory(categoryId, parsed.data);
  logger.info("dashboard.category_updated", { businessId, categoryId });
  return { ok: true };
}

export async function deleteCategory(businessId: string, categoryId: string): Promise<ServiceResult> {
  const existing = await repo.getCategoryForEdit(categoryId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "دسته پیدا نشد." };
  }
  const productCount = await repo.countProductsInCategory(categoryId);
  if (productCount > 0) {
    return { ok: false, error: "این دسته محصول دارد؛ ابتدا محصولات آن را جابه‌جا یا حذف کنید." };
  }
  await repo.deleteCategory(categoryId);
  logger.info("dashboard.category_deleted", { businessId, categoryId });
  return { ok: true };
}

export async function toggleCategoryActive(
  businessId: string,
  categoryId: string,
  isActive: boolean
): Promise<ServiceResult> {
  const existing = await repo.getCategoryForEdit(categoryId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "دسته پیدا نشد." };
  }
  await repo.updateCategory(categoryId, { isActive });
  return { ok: true };
}

export async function moveCategory(
  businessId: string,
  categoryId: string,
  direction: "up" | "down"
): Promise<ServiceResult> {
  const categories = await repo.getCategoriesWithCounts(businessId);
  const index = categories.findIndex((c) => c.id === categoryId);
  if (index === -1) return { ok: false, error: "دسته پیدا نشد." };

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= categories.length) return { ok: true }; // already at the edge

  await repo.swapCategorySortOrder(
    { id: categories[index].id, sortOrder: categories[index].sortOrder },
    { id: categories[swapWith].id, sortOrder: categories[swapWith].sortOrder }
  );
  return { ok: true };
}
