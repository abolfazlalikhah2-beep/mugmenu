/**
 * Pure evaluation of a category's optional day/time visibility window
 * (dashboard "زمان‌بندی نمایش" on the category modal). No I/O — takes `now`
 * as a parameter so it's trivial to unit test and safe to reuse for both the
 * public menu's category filter (menu-service.ts) and the dashboard modal's
 * live preview.
 */

export interface CategorySchedule {
  scheduleEnabled: boolean;
  /** JS Date#getDay() values (0=Sunday..6=Saturday). Empty means every day. */
  scheduleDays: number[];
  scheduleStart: string | null;
  scheduleEnd: string | null;
}

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Whether `now` falls inside the schedule's time-of-day window — handles windows that wrap past midnight (e.g. 22:00–02:00). */
export function isWithinTimeWindow(start: string, end: string, now: Date): boolean {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  if (startMin === endMin) return true;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (startMin < endMin) return nowMin >= startMin && nowMin < endMin;
  return nowMin >= startMin || nowMin < endMin;
}

/** A schedule-disabled category (or one missing its time fields) is always visible. */
export function isCategoryVisibleNow(schedule: CategorySchedule, now: Date = new Date()): boolean {
  if (!schedule.scheduleEnabled) return true;
  if (schedule.scheduleDays.length > 0 && !schedule.scheduleDays.includes(now.getDay())) return false;
  if (!schedule.scheduleStart || !schedule.scheduleEnd) return true;
  return isWithinTimeWindow(schedule.scheduleStart, schedule.scheduleEnd, now);
}
