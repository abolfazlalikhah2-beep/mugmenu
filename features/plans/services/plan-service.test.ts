import { describe, expect, it } from "vitest";
import { resolveFeatureAccess } from "@/features/plans/services/plan-service";

const rows = [
  { featureKey: "menu.core", limitValue: null },
  { featureKey: "printer.connection", limitValue: "2" },
];

describe("resolveFeatureAccess", () => {
  it("returns included:true with no limit for a plain boolean feature", () => {
    expect(resolveFeatureAccess(rows, "menu.core")).toEqual({ included: true, limit: null });
  });

  it("returns included:true with the plan's limit for a limited feature", () => {
    expect(resolveFeatureAccess(rows, "printer.connection")).toEqual({ included: true, limit: "2" });
  });

  it("returns included:false for a feature the plan doesn't have a row for", () => {
    expect(resolveFeatureAccess(rows, "sms.panel")).toEqual({ included: false, limit: null });
  });
});
