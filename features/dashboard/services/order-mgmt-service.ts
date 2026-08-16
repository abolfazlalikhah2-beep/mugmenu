import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { manualOrderSchema, orderStatusSchema, assignCourierSchema } from "@/features/dashboard/services/dashboard-schemas";
import { validateOrderDraft, computeTotal } from "@/features/menu/services/order-flow";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

export function getOrders(businessId: string, filter: { status?: OrderStatus; search?: string }) {
  return repo.getOrders(businessId, filter);
}

export function getRecentOrders(businessId: string, take: number) {
  return repo.getRecentOrders(businessId, take);
}

export async function getOrderDetail(businessId: string, orderId: string) {
  const order = await repo.getOrderWithItems(orderId);
  if (!order || order.businessId !== businessId) return null;
  return order;
}

export type ServiceResult = { ok: true } | { ok: false; error: string };

export async function updateOrderStatus(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = orderStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const order = await repo.getOrderWithItems(parsed.data.orderId);
  if (!order || order.businessId !== businessId) {
    return { ok: false, error: "سفارش پیدا نشد." };
  }

  await repo.updateOrderStatus(parsed.data.orderId, parsed.data.status);
  logger.info("dashboard.order_status_changed", {
    businessId,
    orderId: parsed.data.orderId,
    status: parsed.data.status,
  });
  return { ok: true };
}

export async function assignCourier(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = assignCourierSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const order = await repo.getOrderWithItems(parsed.data.orderId);
  if (!order || order.businessId !== businessId) {
    return { ok: false, error: "سفارش پیدا نشد." };
  }
  if (order.type !== "DELIVERY") {
    return { ok: false, error: "فقط سفارش‌های «ارسال با پیک» قابل تخصیص پیک هستند." };
  }

  if (parsed.data.courierId) {
    const courier = await repo.getCourierForEdit(parsed.data.courierId);
    if (!courier || courier.businessId !== businessId || !courier.isActive) {
      return { ok: false, error: "پیک انتخاب‌شده معتبر نیست." };
    }
  }

  await repo.assignCourierToOrder(parsed.data.orderId, parsed.data.courierId ?? null);
  logger.info("dashboard.order_courier_assigned", {
    businessId,
    orderId: parsed.data.orderId,
    courierId: parsed.data.courierId ?? null,
  });
  return { ok: true };
}

export type CreateManualOrderResult = { ok: true; orderId: string } | { ok: false; error: string };

export async function createManualOrder(businessId: string, input: unknown): Promise<CreateManualOrderResult> {
  const allowed = await businessHasFeature(businessId, "order.manual_entry");
  if (!allowed) return { ok: false, error: "ثبت سفارش دستی در پلن شما موجود نیست." };

  const parsed = manualOrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const fieldError = validateOrderDraft(data.type, data);
  if (fieldError) return { ok: false, error: fieldError };

  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await repo.getProductsByIds(businessId, productIds);
  if (products.length !== productIds.length) {
    return { ok: false, error: "یکی از آیتم‌های انتخاب‌شده معتبر نیست." };
  }

  const priceMap = new Map(products.map((p) => [p.id, p.price]));
  const totalPrice = computeTotal(data.items, priceMap);

  const order = await repo.createManualOrder({
    businessId,
    type: data.type,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    tableNumber: data.tableNumber,
    address: data.address,
    totalPrice,
    items: data.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: priceMap.get(i.productId) ?? 0,
    })),
  });

  logger.info("dashboard.manual_order_created", { businessId, orderId: order.id, type: data.type });
  return { ok: true, orderId: order.id };
}
