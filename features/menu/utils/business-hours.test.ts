import { describe, expect, it } from "vitest";
import {
  DEFAULT_BUSINESS_HOURS,
  dayLabel,
  getDayHours,
  isOpenNow,
  summarizeUniformHours,
  type DayHours,
} from "@/features/menu/utils/business-hours";

function at(hh: number, mm: number, day = 3) {
  // 2026-08-19 is a Wednesday (day=3); other days derived by offsetting the date.
  const d = new Date(2026, 7, 16 + day, hh, mm);
  return d;
}

const WEEK: DayHours[] = [
  { dayOfWeek: 0, isClosed: false, openTime: "09:00", closeTime: "22:00" },
  { dayOfWeek: 1, isClosed: false, openTime: "09:00", closeTime: "22:00" },
  { dayOfWeek: 2, isClosed: false, openTime: "09:00", closeTime: "22:00" },
  { dayOfWeek: 3, isClosed: false, openTime: "09:00", closeTime: "22:00" },
  { dayOfWeek: 4, isClosed: false, openTime: "12:00", closeTime: "01:00" },
  { dayOfWeek: 5, isClosed: true, openTime: "09:00", closeTime: "22:00" },
  { dayOfWeek: 6, isClosed: false, openTime: "09:00", closeTime: "22:00" },
];

describe("getDayHours", () => {
  it("finds the row for a given day", () => {
    expect(getDayHours(WEEK, 4)).toEqual(WEEK[4]);
  });

  it("returns null when the day has no row", () => {
    expect(getDayHours([], 3)).toBeNull();
  });
});

describe("isOpenNow", () => {
  it("is open within today's window (Wednesday)", () => {
    expect(isOpenNow(WEEK, at(12, 0, 3))).toBe(true);
    expect(isOpenNow(WEEK, at(23, 0, 3))).toBe(false);
  });

  it("handles a window that wraps past midnight (Thursday 12:00-01:00)", () => {
    expect(isOpenNow(WEEK, at(23, 30, 4))).toBe(true);
    expect(isOpenNow(WEEK, at(2, 0, 4))).toBe(false);
  });

  it("is always closed on a day marked isClosed (Friday)", () => {
    expect(isOpenNow(WEEK, at(12, 0, 5))).toBe(false);
  });

  it("is closed when today has no row at all", () => {
    expect(isOpenNow([], at(12, 0, 3))).toBe(false);
  });
});

describe("summarizeUniformHours", () => {
  it("returns the shared range when every day matches and none are closed", () => {
    expect(summarizeUniformHours(DEFAULT_BUSINESS_HOURS)).toEqual({ openTime: "09:00", closeTime: "22:00" });
  });

  it("returns null when any day differs or is closed", () => {
    expect(summarizeUniformHours(WEEK)).toBeNull();
  });

  it("returns null for an empty list", () => {
    expect(summarizeUniformHours([])).toBeNull();
  });
});

describe("dayLabel", () => {
  it("returns the Persian label by default", () => {
    expect(dayLabel("fa", 6)).toBe("شنبه");
    expect(dayLabel("fa", 5)).toBe("جمعه");
  });

  it("returns the English label", () => {
    expect(dayLabel("en", 6)).toBe("Saturday");
    expect(dayLabel("en", 5)).toBe("Friday");
  });
});
