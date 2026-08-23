/**
 * Parses the Jalali `?from=1403-01-01&to=1403-03-31` query params shared by
 * every report/analytics page's custom date-range filter into a Gregorian
 * [start, end] instant pair for server-side WHERE clauses. Pure — no I/O —
 * so the parsing/validation rules are unit-testable without a request.
 */
import { toGregorian, toJalaali } from "@/lib/jalali";

export interface DateRange {
  start: Date;
  end: Date;
}

const JALALI_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseJalaliDayStart(value: string): Date | null {
  const m = JALALI_DATE_RE.exec(value);
  if (!m) return null;
  const jy = Number(m[1]);
  const jm = Number(m[2]);
  const jd = Number(m[3]);
  if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return null;
  try {
    const { gy, gm, gd } = toGregorian(jy, jm, jd);
    const date = new Date(gy, gm - 1, gd, 0, 0, 0, 0);
    // Reject e.g. 1403-12-30 in a non-leap year — toGregorian doesn't validate day-of-month itself.
    const back = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (back.jy !== jy || back.jm !== jm || back.jd !== jd) return null;
    return date;
  } catch {
    return null;
  }
}

/**
 * Reads `from`/`to` from a page's resolved searchParams. Returns null when
 * either is missing/malformed or `to` is before `from` — callers treat that
 * the same as "no custom range selected" (falling back to daily/weekly/monthly)
 * rather than erroring, since a stale/hand-edited URL shouldn't break the page.
 */
export function parseDateRangeParams(params: { from?: string; to?: string }): DateRange | null {
  if (!params.from || !params.to) return null;
  const start = parseJalaliDayStart(params.from);
  const endDay = parseJalaliDayStart(params.to);
  if (!start || !endDay) return null;

  const end = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate(), 23, 59, 59, 999);
  if (end < start) return null;
  return { start, end };
}

function toJalaliDateString(d: Date): string {
  const { jy, jm, jd } = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${jy}-${pad(jm)}-${pad(jd)}`;
}

/** "1403-01-01-تا-1403-03-31" — used to name CSV exports for a custom range. */
export function formatDateRangeForFilename(range: DateRange): string {
  return `${toJalaliDateString(range.start)}-تا-${toJalaliDateString(range.end)}`;
}
