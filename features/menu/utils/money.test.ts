import { describe, it, expect } from "vitest";
import { computeDiscountedPrice } from "./money";

describe("computeDiscountedPrice", () => {
  it("returns the original price when there is no discount", () => {
    expect(computeDiscountedPrice(100000, null)).toBe(100000);
    expect(computeDiscountedPrice(100000, undefined)).toBe(100000);
    expect(computeDiscountedPrice(100000, 0)).toBe(100000);
  });

  it("applies a percent discount", () => {
    expect(computeDiscountedPrice(100000, 10)).toBe(90000);
    expect(computeDiscountedPrice(220000, 15)).toBe(187000);
  });

  it("rounds to the nearest toman", () => {
    expect(computeDiscountedPrice(385000, 20)).toBe(308000);
    expect(computeDiscountedPrice(180000, 20)).toBe(144000);
    expect(computeDiscountedPrice(99999, 10)).toBe(89999);
  });
});
