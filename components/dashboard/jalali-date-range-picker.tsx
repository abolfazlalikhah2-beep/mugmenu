"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarRange } from "lucide-react";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import { toJalaali, toGregorian } from "@/lib/jalali";
import { cn } from "@/lib/utils";

function gregorianIsoToJalaliParam(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const { jy, jm, jd } = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${jy}-${pad(jm)}-${pad(jd)}`;
}

function jalaliParamToGregorianIso(param: string | null): string | undefined {
  if (!param) return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(param);
  if (!m) return undefined;
  const { gy, gm, gd } = toGregorian(Number(m[1]), Number(m[2]), Number(m[3]));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${gy}-${pad(gm)}-${pad(gd)}`;
}

/**
 * A shared custom date-range filter for the dashboard's report/analytics
 * pages, alongside their existing روزانه/هفتگی/ماهانه RangeSwitch. Reads and
 * writes `?from=`/`?to=` in the URL as Jalali "YYYY-MM-DD" strings (per
 * repo convention: dates shown/persisted for the user are always Jalali,
 * never Gregorian) while the underlying JalaliDatePicker inputs still work
 * in Gregorian ISO internally — the two small converters above bridge that.
 * Other existing search params (e.g. credits' `status`) are preserved.
 */
export function JalaliDateRangePicker({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const appliedFrom = searchParams.get("from");
  const appliedTo = searchParams.get("to");
  const isActive = Boolean(appliedFrom && appliedTo);

  const [fromIso, setFromIso] = useState(() => jalaliParamToGregorianIso(appliedFrom) ?? "");
  const [toIso, setToIso] = useState(() => jalaliParamToGregorianIso(appliedTo) ?? "");

  const bothSelected = Boolean(fromIso && toIso);
  const invalid = bothSelected && toIso < fromIso;

  function navigate(next: URLSearchParams) {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function handleApply() {
    if (!bothSelected || invalid) return;
    const params = new URLSearchParams(searchParams);
    params.set("from", gregorianIsoToJalaliParam(fromIso));
    params.set("to", gregorianIsoToJalaliParam(toIso));
    navigate(params);
  }

  function handleClear() {
    setFromIso("");
    setToIso("");
    const params = new URLSearchParams(searchParams);
    params.delete("from");
    params.delete("to");
    navigate(params);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[18px] border p-4 transition-colors sm:flex-row sm:items-end sm:gap-3",
        isActive ? "border-brand bg-[#EAF3EB]" : "border-[#E3E3E3] bg-card",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
        {/* Keyed by its own value: JalaliDatePicker only reads defaultValue on mount, so پاک کردن (which resets fromIso/toIso to "") needs a remount to actually clear the visible input, not just this component's state. */}
        <JalaliDatePicker
          key={fromIso}
          name="from"
          label="از تاریخ"
          defaultValue={fromIso || null}
          onChange={setFromIso}
          className="sm:w-[160px]"
        />
        <JalaliDatePicker
          key={toIso}
          name="to"
          label="تا تاریخ"
          defaultValue={toIso || null}
          onChange={setToIso}
          className="sm:w-[160px]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {invalid && (
          <p className="text-right text-xs text-[#C15656]">تاریخ پایان باید بعد از تاریخ شروع باشد.</p>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApply}
            disabled={!bothSelected || invalid}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-brand px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CalendarRange size={16} />
            اعمال فیلتر
          </button>
          {(isActive || bothSelected) && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-10 items-center justify-center rounded-[10px] border border-[#DDD] px-4 text-sm text-[#666]"
            >
              پاک کردن
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
