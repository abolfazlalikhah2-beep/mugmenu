"use client";

import { cn } from "@/lib/utils";
import { RangeSwitch } from "@/components/dashboard/range-switch";
import type { ReportBucket, ReportRange } from "@/features/dashboard/services/report-aggregation";

export function OrdersReportChart({
  buckets,
  range,
  onRangeChange,
  disabled,
}: {
  buckets: ReportBucket[];
  range: ReportRange;
  onRangeChange: (range: ReportRange) => void;
  disabled?: boolean;
}) {
  const scaleMax = Math.max(...buckets.map((b) => b.count), 1) * 1.15;
  const highlightIndex = buckets.length - 1;

  return (
    <div className="flex flex-col gap-5 rounded-[22px] bg-card p-[20px_18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[26px_30px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-[11px] w-[11px] rounded-[3px] bg-brand" />
          <span className="text-sm text-[#666]">تعداد سفارش در بازه</span>
        </div>
        <RangeSwitch value={range} onChange={onRangeChange} disabled={disabled} />
      </div>
      <div className="flex h-[170px] items-end justify-between gap-2 pt-1.5 sm:h-[210px] sm:gap-4.5">
        {buckets.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2.5">
            <div className="flex h-[135px] w-full items-end justify-center sm:h-[175px]">
              <div
                title={`${b.count.toLocaleString("fa-IR")} سفارش`}
                className={cn(
                  "w-[70%] max-w-10 rounded-t-lg transition-[height]",
                  i === highlightIndex ? "bg-brand" : "bg-[#CDE6D0]"
                )}
                style={{ height: `${(b.count / scaleMax) * 100}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-[10px] text-[#9A9A9A] sm:text-xs">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
