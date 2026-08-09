import { describe, it, expect } from "vitest";
import { formatRelativeDateTime } from "./relative-date";

const now = new Date(2026, 4, 19, 18, 0); // 2026-05-19 18:00 local

describe("formatRelativeDateTime", () => {
  it("labels a timestamp from earlier today as امروز", () => {
    const date = new Date(2026, 4, 19, 12, 30);
    expect(formatRelativeDateTime(date, now)).toBe("امروز · ۱۲:۳۰");
  });

  it("labels a timestamp from yesterday as دیروز", () => {
    const date = new Date(2026, 4, 18, 19, 10);
    expect(formatRelativeDateTime(date, now)).toBe("دیروز · ۱۹:۱۰");
  });

  it("falls back to a Persian day/month for anything older", () => {
    const date = new Date(2026, 4, 10, 10, 0);
    const result = formatRelativeDateTime(date, now);
    expect(result).not.toContain("امروز");
    expect(result).not.toContain("دیروز");
    expect(result).toContain("۱۰:۰۰");
  });

  it("treats a date just after local midnight as دیروز, not امروز", () => {
    const almostMidnightYesterday = new Date(2026, 4, 18, 23, 59);
    const justAfterMidnightToday = new Date(2026, 4, 19, 0, 5);
    expect(formatRelativeDateTime(almostMidnightYesterday, justAfterMidnightToday)).toBe("دیروز · ۲۳:۵۹");
  });
});
