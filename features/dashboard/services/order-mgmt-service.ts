import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { orderStatusSchema } from "@/features/dashboard/services/dashboard-schemas";
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
