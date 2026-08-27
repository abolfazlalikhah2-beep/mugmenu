import { describe, it, expect } from "vitest";
import { computePlanDates } from "./plan-dates";

describe("computePlanDates", () => {
  it("sets a 30-day window for MONTHLY", () => {
    const from = new Date(2026, 7, 8); // 2026-08-08
    const { planStartedAt, planExpiresAt } = computePlanDates("MONTHLY", from);
    expect(planStartedAt).toEqual(from);
    expect(planExpiresAt).toEqual(new Date(2026, 8, 7)); // 2026-09-07
  });

  it("sets a 365-day window for ANNUAL", () => {
    const from = new Date(2026, 7, 8); // 2026-08-08
    const { planStartedAt, planExpiresAt } = computePlanDates("ANNUAL", from);
    expect(planStartedAt).toEqual(from);
    expect(planExpiresAt).toEqual(new Date(2027, 7, 8)); // 2027-08-08
  });

  it("defaults `from` to now when omitted", () => {
    const before = Date.now();
    const { planStartedAt } = computePlanDates("MONTHLY");
    const after = Date.now();
    expect(planStartedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(planStartedAt.getTime()).toBeLessThanOrEqual(after);
  });
});
