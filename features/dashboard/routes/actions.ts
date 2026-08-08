"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession, requireBusinessOwner } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import * as onboardingService from "@/features/dashboard/services/onboarding-service";
import * as settingsService from "@/features/dashboard/services/settings-service";
import * as orderMgmtService from "@/features/dashboard/services/order-mgmt-service";
import * as productService from "@/features/dashboard/services/product-service";
import * as categoryService from "@/features/dashboard/services/category-service";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export async function onboardingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  const user = await findUserByPhone(session.phone);
  if (!user) return { error: "کاربر پیدا نشد." };

  const result = await onboardingService.completeOnboarding(user.id, {
    name: String(formData.get("name") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  redirect("/dashboard");
}

export async function toggleAcceptingOrdersAction(isAcceptingOrders: boolean) {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.toggleAcceptingOrders(businessId, isAcceptingOrders);
  revalidatePath("/dashboard");
  return result;
}

export async function updateSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.updateSettings(businessId, {
    name: String(formData.get("name") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    openingHoursStart: String(formData.get("openingHoursStart") ?? ""),
    openingHoursEnd: String(formData.get("openingHoursEnd") ?? ""),
    acceptsDineIn: bool(formData, "acceptsDineIn"),
    acceptsTakeaway: bool(formData, "acceptsTakeaway"),
    acceptsDelivery: bool(formData, "acceptsDelivery"),
    acceptsOnlinePayment: bool(formData, "acceptsOnlinePayment"),
    acceptsCashPayment: bool(formData, "acceptsCashPayment"),
    packagingFee: String(formData.get("packagingFee") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await orderMgmtService.updateOrderStatus(businessId, { orderId, status });
  revalidatePath("/dashboard/orders");
  return result;
}

export async function createProductAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await productService.createProduct(businessId, {
    categoryId: String(formData.get("categoryId") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    discountPercent: String(formData.get("discountPercent") ?? "0"),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/products");
  return { ok: true };
}

export async function updateProductAction(
  productId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await productService.updateProduct(businessId, productId, {
    categoryId: String(formData.get("categoryId") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    discountPercent: String(formData.get("discountPercent") ?? "0"),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/products");
  return { ok: true };
}

export async function deleteProductAction(productId: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await productService.deleteProduct(businessId, productId);
  revalidatePath("/dashboard/products");
  return result;
}

export async function toggleProductActiveAction(productId: string, isActive: boolean) {
  const { businessId } = await requireBusinessOwner();
  const result = await productService.toggleProductActive(businessId, productId, isActive);
  revalidatePath("/dashboard/products");
  return result;
}

export async function createCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.createCategory(businessId, {
    name: String(formData.get("name") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/categories");
  return { ok: true };
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.updateCategory(businessId, categoryId, {
    name: String(formData.get("name") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/categories");
  return { ok: true };
}

export async function deleteCategoryAction(categoryId: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.deleteCategory(businessId, categoryId);
  revalidatePath("/dashboard/categories");
  return result;
}

export async function toggleCategoryActiveAction(categoryId: string, isActive: boolean) {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.toggleCategoryActive(businessId, categoryId, isActive);
  revalidatePath("/dashboard/categories");
  return result;
}

export async function moveCategoryAction(categoryId: string, direction: "up" | "down") {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.moveCategory(businessId, categoryId, direction);
  revalidatePath("/dashboard/categories");
  return result;
}
