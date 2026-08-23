"use client";

import { cn } from "@/lib/utils";
import type { ReportRange } from "@/features/dashboard/services/report-aggregation";

const OPTIONS: { value: ReportRange; label: string }[] = [
  { value: "daily", label: "روزانه" },
  { value: "weekly", label: "هفتگی" },
  { value: "monthly", label: "ماهانه" },
];

export function RangeSwitch({
  value,
  onChange,
  fullWidth,
  disabled,
}: {
  value: ReportRange;
  onChange: (range: ReportRange) => void;
  fullWidth?: boolean;
  /** Dimmed and non-interactive while a custom date range filter is active (see JalaliDateRangePicker). */
  disabled?: boolean;
}) {
  return (
    <div className={cn("flex gap-1 rounded-[13px] bg-[#EDEFED] p-1", fullWidth && "w-full", disabled && "opacity-40")}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex h-10 items-center justify-center rounded-[10px] px-6 text-sm",
            fullWidth && "flex-1",
            disabled && "cursor-not-allowed",
            value === o.value
              ? "bg-card font-medium text-brand shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              : "font-normal text-[#7C7C7C]"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
