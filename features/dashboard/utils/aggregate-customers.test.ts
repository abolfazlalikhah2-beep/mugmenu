import { describe, it, expect } from "vitest";
import { aggregateCustomers } from "./aggregate-customers";

describe("aggregateCustomers", () => {
  it("groups orders by phone and counts them", () => {
    const result = aggregateCustomers([
      { customerName: "علی", customerPhone: "0912", createdAt: new Date("2026-01-01") },
      { customerName: "علی", customerPhone: "0912", createdAt: new Date("2026-01-05") },
      { customerName: "مریم", customerPhone: "0913", createdAt: new Date("2026-01-02") },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "علی", phone: "0912", firstOrderAt: new Date("2026-01-01"), orderCount: 2 });
  });

  it("keeps the first order date, not the latest", () => {
    const result = aggregateCustomers([
      { customerName: "علی", customerPhone: "0912", createdAt: new Date("2026-01-01") },
      { customerName: "علی", customerPhone: "0912", createdAt: new Date("2026-02-01") },
    ]);
    expect(result[0].firstOrderAt).toEqual(new Date("2026-01-01"));
  });

  it("uses the most recently ordered name for a repeat customer", () => {
    const result = aggregateCustomers([
      { customerName: "علی رضایی", customerPhone: "0912", createdAt: new Date("2026-01-01") },
      { customerName: "علی ر.", customerPhone: "0912", createdAt: new Date("2026-01-05") },
    ]);
    expect(result[0].name).toBe("علی ر.");
  });

  it("sorts by order count descending", () => {
    const result = aggregateCustomers([
      { customerName: "مریم", customerPhone: "0913", createdAt: new Date("2026-01-01") },
      { customerName: "علی", customerPhone: "0912", createdAt: new Date("2026-01-01") },
      { customerName: "علی", customerPhone: "0912", createdAt: new Date("2026-01-02") },
    ]);
    expect(result.map((c) => c.phone)).toEqual(["0912", "0913"]);
  });

  it("returns an empty list for no orders", () => {
    expect(aggregateCustomers([])).toEqual([]);
  });
});
