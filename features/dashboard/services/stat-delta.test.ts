import { describe, it, expect } from "vitest";
import { computeDelta } from "./stat-delta";

describe("computeDelta", () => {
  it("computes a positive percentage increase", () => {
    expect(computeDelta(12, 10)).toEqual({ deltaPercent: 20, up: true });
  });

  it("computes a negative percentage change as down", () => {
    expect(computeDelta(8, 10)).toEqual({ deltaPercent: 20, up: false });
  });

  it("treats no change as up (0%)", () => {
    expect(computeDelta(10, 10)).toEqual({ deltaPercent: 0, up: true });
  });

  it("does not divide by zero when yesterday was 0 and today has orders", () => {
    expect(computeDelta(5, 0)).toEqual({ deltaPercent: 100, up: true });
  });

  it("treats zero-to-zero as flat, not up 100%", () => {
    expect(computeDelta(0, 0)).toEqual({ deltaPercent: 0, up: true });
  });

  it("rounds fractional percentages", () => {
    expect(computeDelta(7, 6).deltaPercent).toBe(17); // 16.66... -> 17
  });
});
