/**
 * Pure aggregation for the couriers page's stat tiles and per-courier
 * "امروز" column. No I/O — dashboard-repository.ts supplies the raw rows
 * (busy count per courier via a filtered relation count, today's DELIVERY
 * orders via a createdAt range), this module just does the math.
 *
 * "میانگین زمان ارسال" from the design isn't computed here — the app has no
 * pickup/delivered timestamp to derive it from, so it's left out rather than
 * faked.
 */

export interface CourierBusyRow {
  id: string;
  isActive: boolean;
  /** Orders assigned to this courier that are not yet DELIVERED/CANCELED. */
  busyCount: number;
}

export interface TodayOrderRow {
  courierId: string | null;
}

export interface CourierSummary {
  activeCouriersCount: number;
  /** Sum of every courier's busyCount — orders currently in flight. */
  inTransitCount: number;
  todayDeliveriesCount: number;
}

export function summarizeCouriers(couriers: CourierBusyRow[], todayOrders: TodayOrderRow[]): CourierSummary {
  return {
    activeCouriersCount: couriers.filter((c) => c.isActive).length,
    inTransitCount: couriers.reduce((sum, c) => sum + c.busyCount, 0),
    todayDeliveriesCount: todayOrders.length,
  };
}

/** courierId -> count of today's DELIVERY orders assigned to them. */
export function todayCountByCourier(todayOrders: TodayOrderRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const o of todayOrders) {
    if (!o.courierId) continue;
    counts[o.courierId] = (counts[o.courierId] ?? 0) + 1;
  }
  return counts;
}
