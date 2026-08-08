import { describe, it, expect } from "vitest";
import { nextStatus, canCancel, isTerminal, progressSteps, statusLabel } from "./order-status-flow";

describe("nextStatus", () => {
  it("advances through the happy path", () => {
    expect(nextStatus("NEW")).toBe("PREPARING");
    expect(nextStatus("PREPARING")).toBe("READY");
    expect(nextStatus("READY")).toBe("DELIVERED");
  });

  it("returns null once delivered", () => {
    expect(nextStatus("DELIVERED")).toBeNull();
  });

  it("returns null for a canceled order", () => {
    expect(nextStatus("CANCELED")).toBeNull();
  });
});

describe("canCancel", () => {
  it("allows cancel before delivery", () => {
    expect(canCancel("NEW")).toBe(true);
    expect(canCancel("PREPARING")).toBe(true);
    expect(canCancel("READY")).toBe(true);
  });

  it("blocks cancel once delivered or already canceled", () => {
    expect(canCancel("DELIVERED")).toBe(false);
    expect(canCancel("CANCELED")).toBe(false);
  });
});

describe("isTerminal", () => {
  it("flags delivered and canceled as terminal", () => {
    expect(isTerminal("DELIVERED")).toBe(true);
    expect(isTerminal("CANCELED")).toBe(true);
    expect(isTerminal("READY")).toBe(false);
  });
});

describe("progressSteps", () => {
  it("marks steps up to and including the current one as reached", () => {
    const steps = progressSteps("PREPARING");
    expect(steps.map((s) => [s.status, s.reached])).toEqual([
      ["NEW", true],
      ["PREPARING", true],
      ["READY", false],
      ["DELIVERED", false],
    ]);
  });

  it("marks nothing as reached for a canceled order", () => {
    const steps = progressSteps("CANCELED");
    expect(steps.every((s) => !s.reached)).toBe(true);
  });
});

describe("statusLabel", () => {
  it("returns Persian labels for every status", () => {
    expect(statusLabel("NEW")).toBe("ثبت شد");
    expect(statusLabel("CANCELED")).toBe("لغو شد");
  });
});
