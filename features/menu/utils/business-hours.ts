/**
 * Pure evaluation of a business's per-day working hours (public menu
 * "ساعت کاری" accordion + dashboard settings' 7-day editor). No I/O — takes
 * `now` as a parameter so it's trivial to unit test. Mirrors
 * features/menu/utils/category-schedule.ts's day/time conventions (JS
 * Date#getDay(): 0=Sunday..6=Saturday) and reuses its time-window math.
 */

import { isWithinTimeWindow } from "@/features/menu/utils/category-schedule";
import type { MenuLang } from "@/features/menu/utils/menu-language";

export interface DayHours {
  dayOfWeek: number;
  isClosed: boolean;
  openTime: string;
  closeTime: string;
}

/** Display order for a Persian week (starts Saturday) — independent of the storage index above. */
export const FA_WEEK_ORDER: readonly number[] = [6, 0, 1, 2, 3, 4, 5];

const FA_DAY_LABEL: Record<number, string> = {
  0: "یکشنبه",
  1: "دوشنبه",
  2: "سه‌شنبه",
  3: "چهارشنبه",
  4: "پنجشنبه",
  5: "جمعه",
  6: "شنبه",
};

const EN_DAY_LABEL: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export function dayLabel(lang: MenuLang, dayOfWeek: number): string {
  return lang === "en" ? EN_DAY_LABEL[dayOfWeek] : FA_DAY_LABEL[dayOfWeek];
}

/** A sensible "every day, all day" default for a brand-new business (see dashboard-repository.ts's createBusiness). */
export const DEFAULT_BUSINESS_HOURS: DayHours[] = Array.from({ length: 7 }, (_, dayOfWeek) => ({
  dayOfWeek,
  isClosed: false,
  openTime: "09:00",
  closeTime: "22:00",
}));

export function getDayHours(hours: DayHours[], dayOfWeek: number): DayHours | null {
  return hours.find((h) => h.dayOfWeek === dayOfWeek) ?? null;
}

/** Whether the business is open right now, per today's row. False if today has no row or is marked closed. */
export function isOpenNow(hours: DayHours[], now: Date = new Date()): boolean {
  const today = getDayHours(hours, now.getDay());
  if (!today || today.isClosed) return false;
  return isWithinTimeWindow(today.openTime, today.closeTime, now);
}

/**
 * When every day shares the same open/close and none are closed, returns
 * that single range — used by the QR export card's compact "همه‌روزه" line,
 * which can't show a 7-day breakdown. Returns null otherwise rather than
 * guessing at a misleading summary.
 */
export function summarizeUniformHours(hours: DayHours[]): { openTime: string; closeTime: string } | null {
  if (hours.length === 0) return null;
  const [first, ...rest] = hours;
  if (first.isClosed) return null;
  const uniform = rest.every(
    (h) => !h.isClosed && h.openTime === first.openTime && h.closeTime === first.closeTime
  );
  return uniform ? { openTime: first.openTime, closeTime: first.closeTime } : null;
}
