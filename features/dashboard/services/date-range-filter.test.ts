import { describe, expect, it } from "vitest";
import { parseDateRangeParams, formatDateRangeForFilename } from "@/features/dashboard/services/date-range-filter";

describe("parseDateRangeParams", () => {
  it("parses a valid Jalali range into Gregorian day bounds", () => {
    const range = parseDateRangeParams({ from: "1403-01-01", to: "1403-01-10" });
    expect(range).not.toBeNull();
    expect(range!.start.getFullYear()).toBe(2024);
    expect(range!.start.getMonth()).toBe(2); // March, 0-indexed
    expect(range!.start.getDate()).toBe(20);
    expect(range!.start.getHours()).toBe(0);
    expect(range!.end.getHours()).toBe(23);
    expect(range!.end.getMinutes()).toBe(59);
    expect(range!.end.getSeconds()).toBe(59);
  });

  it("returns null when either param is missing", () => {
    expect(parseDateRangeParams({ from: "1403-01-01" })).toBeNull();
    expect(parseDateRangeParams({ to: "1403-01-10" })).toBeNull();
    expect(parseDateRangeParams({})).toBeNull();
  });

  it("returns null for malformed date strings", () => {
    expect(parseDateRangeParams({ from: "not-a-date", to: "1403-01-10" })).toBeNull();
    expect(parseDateRangeParams({ from: "1403-1-1", to: "1403-01-10" })).toBeNull();
    expect(parseDateRangeParams({ from: "1403-13-01", to: "1403-01-10" })).toBeNull();
  });

  it("returns null for a day that doesn't exist in that Jalali month (e.g. Esfand 30 in a non-leap year)", () => {
    expect(parseDateRangeParams({ from: "1404-12-30", to: "1405-01-10" })).toBeNull();
  });

  it("returns null when the end date is before the start date", () => {
    expect(parseDateRangeParams({ from: "1403-03-01", to: "1403-01-01" })).toBeNull();
  });

  it("accepts an equal start and end date (single-day range)", () => {
    const range = parseDateRangeParams({ from: "1403-01-01", to: "1403-01-01" });
    expect(range).not.toBeNull();
    expect(range!.end.getTime() - range!.start.getTime()).toBe(24 * 60 * 60 * 1000 - 1);
  });
});

describe("formatDateRangeForFilename", () => {
  it("formats both bounds back as Jalali date strings", () => {
    const range = parseDateRangeParams({ from: "1403-01-01", to: "1403-03-31" })!;
    expect(formatDateRangeForFilename(range)).toBe("1403-01-01-تا-1403-03-31");
  });
});
