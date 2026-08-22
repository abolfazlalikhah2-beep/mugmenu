import { describe, expect, it } from "vitest";
import { computeCreditStatus } from "@/features/credits/services/credit-status";

describe("computeCreditStatus", () => {
  it("is PARTIAL when paidAmount is less than amount", () => {
    expect(computeCreditStatus(100_000, 40_000)).toBe("PARTIAL");
  });

  it("is PAID when paidAmount equals amount", () => {
    expect(computeCreditStatus(100_000, 100_000)).toBe("PAID");
  });

  it("is PAID when paidAmount exceeds amount (overpayment)", () => {
    expect(computeCreditStatus(100_000, 120_000)).toBe("PAID");
  });

  it("is PARTIAL right after the first partial payment", () => {
    expect(computeCreditStatus(100_000, 1)).toBe("PARTIAL");
  });
});
