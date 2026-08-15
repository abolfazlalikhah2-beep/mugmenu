import { describe, expect, it } from "vitest";
import {
  summarizeCouriers,
  todayCountByCourier,
  type CourierBusyRow,
  type TodayOrderRow,
} from "./courier-aggregation";

describe("summarizeCouriers", () => {
  it("counts active couriers, sums busy orders, and counts today's deliveries", () => {
    const couriers: CourierBusyRow[] = [
      { id: "c1", isActive: true, busyCount: 2 },
      { id: "c2", isActive: true, busyCount: 0 },
      { id: "c3", isActive: false, busyCount: 0 },
      { id: "c4", isActive: true, busyCount: 1 },
    ];
    const todayOrders: TodayOrderRow[] = [{ courierId: "c1" }, { courierId: "c1" }, { courierId: null }];

    const summary = summarizeCouriers(couriers, todayOrders);
    expect(summary.activeCouriersCount).toBe(3);
    expect(summary.inTransitCount).toBe(3);
    expect(summary.todayDeliveriesCount).toBe(3);
  });

  it("handles no couriers/orders", () => {
    expect(summarizeCouriers([], [])).toEqual({
      activeCouriersCount: 0,
      inTransitCount: 0,
      todayDeliveriesCount: 0,
    });
  });
});

describe("todayCountByCourier", () => {
  it("groups today's orders by courier, ignoring unassigned ones", () => {
    const todayOrders: TodayOrderRow[] = [
      { courierId: "c1" },
      { courierId: "c1" },
      { courierId: "c2" },
      { courierId: null },
    ];
    expect(todayCountByCourier(todayOrders)).toEqual({ c1: 2, c2: 1 });
  });

  it("returns an empty object when nothing is assigned", () => {
    expect(todayCountByCourier([{ courierId: null }])).toEqual({});
  });
});
