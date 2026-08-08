import { describe, it, expect } from "vitest";
import { computePlanStatus } from "./plan-status";

describe("computePlanStatus", () => {
  it("computes days remaining and progress at the midpoint of a 30-day cycle", () => {
    const startedAt = new Date(2026, 6, 9); // 2026-07-09
    const expiresAt = new Date(2026, 7, 8); // 2026-08-08 (30 days later)
    const now = new Date(2026, 6, 24); // 15 days in

    const status = computePlanStatus(startedAt, expiresAt, now);
    expect(status.totalDays).toBe(30);
    expect(status.daysRemaining).toBe(15);
    expect(status.progressPercent).toBeCloseTo(50, 0);
    expect(status.isExpired).toBe(false);
  });

  it("clamps daysRemaining to 0 and marks expired once past expiresAt", () => {
    const startedAt = new Date(2026, 0, 1);
    const expiresAt = new Date(2026, 0, 31);
    const now = new Date(2026, 1, 15); // well past expiry

    const status = computePlanStatus(startedAt, expiresAt, now);
    expect(status.daysRemaining).toBe(0);
    expect(status.isExpired).toBe(true);
    expect(status.progressPercent).toBe(100);
  });

  it("never exceeds 100% progress even before isExpired flips (same instant as expiresAt)", () => {
    const startedAt = new Date(2026, 0, 1);
    const expiresAt = new Date(2026, 0, 31);
    const status = computePlanStatus(startedAt, expiresAt, expiresAt);
    expect(status.progressPercent).toBe(100);
    expect(status.isExpired).toBe(true);
  });

  it("reports 0% progress and full days remaining right at plan start", () => {
    const startedAt = new Date(2026, 0, 1);
    const expiresAt = new Date(2026, 0, 31);
    const status = computePlanStatus(startedAt, expiresAt, startedAt);
    expect(status.progressPercent).toBe(0);
    expect(status.daysRemaining).toBe(30);
    expect(status.isExpired).toBe(false);
  });
});
