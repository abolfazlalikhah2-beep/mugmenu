import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { courierSchema } from "@/features/dashboard/services/dashboard-schemas";
import { startOfDay } from "@/features/dashboard/services/date-utils";
import { summarizeCouriers, todayCountByCourier } from "@/features/dashboard/services/courier-aggregation";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export async function getCouriersPageData(businessId: string, now = new Date()) {
  const [couriers, todayOrders] = await Promise.all([
    repo.getCouriers(businessId),
    repo.getTodayDeliveryOrders(businessId, startOfDay(now)),
  ]);
  const busyRows = couriers.map((c) => ({ id: c.id, isActive: c.isActive, busyCount: c._count.orders }));
  const summary = summarizeCouriers(busyRows, todayOrders);
  const todayByCourier = todayCountByCourier(todayOrders);

  return {
    couriers: couriers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      vehicleType: c.vehicleType,
      nationalCode: c.nationalCode,
      coverageZones: c.coverageZones,
      isActive: c.isActive,
      busyCount: c._count.orders,
      todayCount: todayByCourier[c.id] ?? 0,
    })),
    summary,
  };
}

export function getActiveCouriers(businessId: string) {
  return repo.getActiveCouriers(businessId);
}

export async function getCourierForEdit(businessId: string, courierId: string) {
  const courier = await repo.getCourierForEdit(courierId);
  if (!courier || courier.businessId !== businessId) return null;
  return courier;
}

export async function createCourier(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = courierSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.createCourier({ businessId, ...parsed.data });
  logger.info("dashboard.courier_created", { businessId, name: parsed.data.name });
  return { ok: true };
}

export async function updateCourier(businessId: string, courierId: string, input: unknown): Promise<ServiceResult> {
  const existing = await repo.getCourierForEdit(courierId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "پیک پیدا نشد." };
  }
  const parsed = courierSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateCourier(courierId, parsed.data);
  logger.info("dashboard.courier_updated", { businessId, courierId });
  return { ok: true };
}

export async function deleteCourier(businessId: string, courierId: string): Promise<ServiceResult> {
  const existing = await repo.getCourierForEdit(courierId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "پیک پیدا نشد." };
  }
  await repo.deleteCourier(courierId);
  logger.info("dashboard.courier_deleted", { businessId, courierId });
  return { ok: true };
}

export async function toggleCourierActive(businessId: string, courierId: string, isActive: boolean): Promise<ServiceResult> {
  const existing = await repo.getCourierForEdit(courierId);
  if (!existing || existing.businessId !== businessId) {
    return { ok: false, error: "پیک پیدا نشد." };
  }
  await repo.updateCourier(courierId, { isActive });
  return { ok: true };
}
