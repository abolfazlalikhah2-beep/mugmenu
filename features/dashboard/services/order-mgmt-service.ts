import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import {
  manualOrderSchema,
  orderStatusSchema,
  bulkOrderStatusSchema,
  assignCourierSchema,
} from "@/features/dashboard/services/dashboard-schemas";
import { validateOrderDraft, computeTotal } from "@/features/menu/services/order-flow";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { createCreditRecord } from "@/features/credits/services/credit-service";
import { nextDailyInvoiceNumber } from "@/lib/invoice-number";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

export function getOrders(businessId: string, filter: { status?: OrderStatus; search?: string }) {
  return repo.getOrders(businessId, filter);
}

export function getRecentOrders(businessId: string, take: number) {
  return repo.getRecentOrders(businessId, take);
}

/** Orders placed after `since`, for the dashboard's new-order poll (app/api/dashboard/new-orders/route.ts). */
export function getOrdersCreatedSince(businessId: string, since: Date) {
  return repo.getOrdersCreatedSince(businessId, since);
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

export async function bulkUpdateOrderStatus(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = bulkOrderStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const result = await repo.bulkUpdateOrderStatus(businessId, parsed.data.orderIds, parsed.data.status);
  logger.info("dashboard.order_status_bulk_changed", {
    businessId,
    status: parsed.data.status,
    requested: parsed.data.orderIds.length,
    updated: result.count,
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

  const business = await repo.getBusinessById(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  // The type selector already hides disabled modes, but re-check here too —
  // never trust the client to only ever submit an allowed type.
  const typeAccepted =
    (data.type === "DINE_IN" && business.acceptsDineIn) ||
    (data.type === "TAKEAWAY" && business.acceptsTakeaway) ||
    (data.type === "DELIVERY" && business.acceptsDelivery);
  if (!typeAccepted) return { ok: false, error: "این روش سفارش در حال حاضر برای این مجموعه فعال نیست." };

  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await repo.getProductsByIds(businessId, productIds);
  if (products.length !== productIds.length) {
    return { ok: false, error: "یکی از آیتم‌های انتخاب‌شده معتبر نیست." };
  }

  const priceMap = new Map(products.map((p) => [p.id, p.price]));
  const totalPrice = computeTotal(data.items, priceMap);

  // Courier assignment only makes sense for delivery orders — same rule
  // as assignCourier() above, checked here too since this is a separate
  // entry point.
  let courierId: string | undefined;
  if (data.type === "DELIVERY" && data.courierId) {
    const courier = await repo.getCourierForEdit(data.courierId);
    if (!courier || courier.businessId !== businessId || !courier.isActive) {
      return { ok: false, error: "پیک انتخاب‌شده معتبر نیست." };
    }
    courierId = data.courierId;
  }

  const receiptInvoiceNumber = await nextDailyInvoiceNumber(businessId);

  const order = await repo.createManualOrder({
    businessId,
    type: data.type,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    tableNumber: data.tableNumber,
    address: data.address,
    totalPrice,
    paymentMethod: data.paymentMethod,
    receiptInvoiceNumber,
    courierId,
    items: data.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: priceMap.get(i.productId) ?? 0,
    })),
  });

  if (data.customerBirthDate) {
    await repo.upsertCustomerBirthDate(businessId, data.customerPhone, data.customerName, new Date(data.customerBirthDate));
  }

  if (data.paymentMethod === "CREDIT") {
    await createCreditRecord({
      businessId,
      orderId: order.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      amount: totalPrice,
      notes: data.creditNote,
    });
  }

  logger.info("dashboard.manual_order_created", {
    businessId,
    orderId: order.id,
    type: data.type,
    paymentMethod: data.paymentMethod,
  });
  return { ok: true, orderId: order.id };
}

/** Business-scoped phone lookup for the manual order modal's auto-fill — returns null (not an error) when nothing matches, since not finding a name is a normal case, not a failure. */
export async function lookupCustomerByPhone(businessId: string, phone: string): Promise<string | null> {
  const trimmed = phone.trim();
  if (trimmed.length < 6) return null;
  return repo.findCustomerNameByPhone(businessId, trimmed);
}

export interface ManualOrderCatalog {
  products: { id: string; name: string; price: number; imageUrl: string | null; categoryId: string }[];
  categories: { id: string; name: string }[];
  /** For the "پیک" select, shown only when type is DELIVERY — see manual-order-modal.tsx. */
  couriers: { id: string; name: string }[];
}

/**
 * Fetched on demand (client calls this only after the manual order modal
 * has already opened, see manual-order-modal.tsx) rather than on every
 * /dashboard/orders page load — the full active catalog can be sizeable and
 * most page visits never open the modal at all.
 */
export async function getManualOrderCatalog(businessId: string): Promise<ManualOrderCatalog> {
  const allowed = await businessHasFeature(businessId, "order.manual_entry");
  if (!allowed) return { products: [], categories: [], couriers: [] };

  const [products, couriers] = await Promise.all([
    repo.getProducts(businessId).then((rows) => rows.filter((p) => p.isActive)),
    repo.getActiveCouriers(businessId),
  ]);

  const categoryById = new Map<string, { name: string; sortOrder: number }>();
  for (const p of products) {
    if (!categoryById.has(p.categoryId)) {
      categoryById.set(p.categoryId, { name: p.category.name, sortOrder: p.category.sortOrder });
    }
  }
  const categories = [...categoryById.entries()]
    .sort((a, b) => a[1].sortOrder - b[1].sortOrder)
    .map(([id, c]) => ({ id, name: c.name }));

  return {
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      categoryId: p.categoryId,
    })),
    categories,
    couriers: couriers.map((c) => ({ id: c.id, name: c.name })),
  };
}
