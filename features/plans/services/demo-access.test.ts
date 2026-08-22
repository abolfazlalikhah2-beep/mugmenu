import { describe, expect, it } from "vitest";
import { isDemoEffective } from "@/features/plans/services/demo-access";

const now = new Date("2026-08-22T00:00:00Z");

describe("isDemoEffective", () => {
  it("is false when isDemoActive is false, even with a future expiry", () => {
    expect(isDemoEffective({ isDemoActive: false, demoExpiresAt: new Date("2026-09-01") }, now)).toBe(false);
  });

  it("is false when demoExpiresAt is null", () => {
    expect(isDemoEffective({ isDemoActive: true, demoExpiresAt: null }, now)).toBe(false);
  });

  it("is false once demoExpiresAt has passed", () => {
    expect(isDemoEffective({ isDemoActive: true, demoExpiresAt: new Date("2026-08-01") }, now)).toBe(false);
  });

  it("is true when active and expiry is in the future", () => {
    expect(isDemoEffective({ isDemoActive: true, demoExpiresAt: new Date("2026-09-01") }, now)).toBe(true);
  });
});
