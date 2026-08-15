import { describe, expect, it } from "vitest";
import { isCategoryVisibleNow, isWithinTimeWindow, timeToMinutes } from "@/features/menu/utils/category-schedule";

function at(hh: number, mm: number, day = 3) {
  // 2026-08-19 is a Wednesday (day=3); other days derived by offsetting the date.
  const d = new Date(2026, 7, 16 + day, hh, mm);
  return d;
}

describe("timeToMinutes", () => {
  it("converts HH:mm to minutes since midnight", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("07:30")).toBe(450);
    expect(timeToMinutes("23:59")).toBe(1439);
  });
});

describe("isWithinTimeWindow", () => {
  it("handles a normal same-day window", () => {
    expect(isWithinTimeWindow("07:00", "11:00", at(9, 0))).toBe(true);
    expect(isWithinTimeWindow("07:00", "11:00", at(6, 59))).toBe(false);
    expect(isWithinTimeWindow("07:00", "11:00", at(11, 0))).toBe(false);
  });

  it("handles a window that wraps past midnight", () => {
    expect(isWithinTimeWindow("22:00", "02:00", at(23, 0))).toBe(true);
    expect(isWithinTimeWindow("22:00", "02:00", at(1, 0))).toBe(true);
    expect(isWithinTimeWindow("22:00", "02:00", at(10, 0))).toBe(false);
  });

  it("treats an equal start/end as open all day", () => {
    expect(isWithinTimeWindow("08:00", "08:00", at(3, 0))).toBe(true);
  });
});

describe("isCategoryVisibleNow", () => {
  it("is always visible when scheduling is disabled", () => {
    expect(
      isCategoryVisibleNow(
        { scheduleEnabled: false, scheduleDays: [], scheduleStart: "07:00", scheduleEnd: "08:00" },
        at(12, 0)
      )
    ).toBe(true);
  });

  it("hides the category outside its time window", () => {
    const schedule = { scheduleEnabled: true, scheduleDays: [], scheduleStart: "07:00", scheduleEnd: "11:00" };
    expect(isCategoryVisibleNow(schedule, at(9, 0))).toBe(true);
    expect(isCategoryVisibleNow(schedule, at(13, 42))).toBe(false);
  });

  it("hides the category on days not in scheduleDays", () => {
    const wednesday = 3;
    const schedule = { scheduleEnabled: true, scheduleDays: [wednesday], scheduleStart: null, scheduleEnd: null };
    expect(isCategoryVisibleNow(schedule, at(9, 0, wednesday))).toBe(true);
    expect(isCategoryVisibleNow(schedule, at(9, 0, wednesday + 1))).toBe(false);
  });

  it("treats an empty scheduleDays as every day", () => {
    const schedule = { scheduleEnabled: true, scheduleDays: [], scheduleStart: null, scheduleEnd: null };
    expect(isCategoryVisibleNow(schedule, at(9, 0, 0))).toBe(true);
    expect(isCategoryVisibleNow(schedule, at(9, 0, 6))).toBe(true);
  });
});
