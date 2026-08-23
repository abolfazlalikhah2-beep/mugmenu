"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  toJalaali,
  toGregorian,
  jalaaliMonthLength,
  JALALI_MONTH_NAMES,
  JALALI_WEEKDAY_NAMES,
  type JalaliDate,
} from "@/lib/jalali";

function isoToJalali(iso?: string | null): JalaliDate | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function jalaliToIso(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${gy}-${pad(gm)}-${pad(gd)}`;
}

function formatJalali(j: JalaliDate): string {
  return `${j.jd.toLocaleString("fa-IR")} ${JALALI_MONTH_NAMES[j.jm - 1]} ${j.jy.toLocaleString("fa-IR")}`;
}

function todayJalali(): JalaliDate {
  const now = new Date();
  return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function JalaliDatePicker({
  name,
  label,
  placeholder = "انتخاب تاریخ",
  defaultValue,
  className,
  onChange,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string | null;
  className?: string;
  /** Gregorian ISO ("YYYY-MM-DD") of the newly selected day, or "" when cleared. */
  onChange?: (iso: string) => void;
}) {
  const [iso, setIsoState] = useState(defaultValue ?? "");
  function setIso(next: string) {
    setIsoState(next);
    onChange?.(next);
  }
  const [open, setOpen] = useState(false);
  const initial = isoToJalali(defaultValue) ?? todayJalali();
  const [viewYear, setViewYear] = useState(initial.jy);
  const [viewMonth, setViewMonth] = useState(initial.jm);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const selected = isoToJalali(iso);
  const monthLength = jalaaliMonthLength(viewYear, viewMonth);
  const { gy, gm, gd } = toGregorian(viewYear, viewMonth, 1);
  const jsWeekday = new Date(gy, gm - 1, gd).getDay(); // 0=Sunday..6=Saturday
  const leadingBlanks = (jsWeekday + 1) % 7; // shift so Saturday=0

  function selectDay(day: number) {
    setIso(jalaliToIso(viewYear, viewMonth, day));
    setOpen(false);
  }

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  return (
    <div ref={wrapperRef} className={cn("relative flex flex-col gap-2", className)}>
      {label && <label className="text-right text-[13px] font-light text-text-4">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[50px] w-full items-center justify-between rounded-input border border-border-input px-[18px] text-right text-sm outline-none focus:border-brand"
      >
        <span className={selected ? "text-[#333]" : "text-[#9F9F9F]"}>
          {selected ? formatJalali(selected) : placeholder}
        </span>
        <CalendarIcon size={16} className="text-text-3" />
      </button>
      <input type="hidden" name={name} value={iso} />
      {open && (
        <div className="absolute top-[calc(100%+6px)] right-0 z-20 w-[280px] rounded-[18px] border border-[#EAEAEA] bg-card p-4 shadow-modal">
          <div className="flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="ماه قبل"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-[#F4F5F4]"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-sm font-medium">
              {JALALI_MONTH_NAMES[viewMonth - 1]} {viewYear.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="ماه بعد"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-[#F4F5F4]"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 pb-1 text-center text-[11px] text-text-3">
            {JALALI_WEEKDAY_NAMES.map((w, i) => (
              <span key={`${w}-${i}`}>{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: monthLength }, (_, i) => i + 1).map((day) => {
              const active = selected && selected.jy === viewYear && selected.jm === viewMonth && selected.jd === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-[12.5px] transition-colors",
                    active ? "bg-brand font-medium text-white" : "text-[#444] hover:bg-[#EAF3EB]"
                  )}
                >
                  {day.toLocaleString("fa-IR")}
                </button>
              );
            })}
          </div>
          {iso && (
            <button
              type="button"
              onClick={() => {
                setIso("");
                setOpen(false);
              }}
              className="mt-3 flex h-9 w-full items-center justify-center rounded-lg border border-[#EEE] text-[12px] text-[#888] transition-colors hover:bg-[#F8F8F8]"
            >
              پاک کردن
            </button>
          )}
        </div>
      )}
    </div>
  );
}
