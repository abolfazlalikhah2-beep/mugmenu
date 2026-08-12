import { cn } from "@/lib/utils";
import type { TrendPoint } from "@/features/dashboard/services/menu-analytics-aggregation";

export function TrendBarList({
  points,
  title,
  subtitle,
  formatValue = (v: number) => v.toLocaleString("fa-IR"),
  labelWidthClass = "w-14",
  valueWidthClass = "w-10",
}: {
  points: TrendPoint[];
  title: string;
  subtitle: string;
  formatValue?: (value: number) => string;
  labelWidthClass?: string;
  valueWidthClass?: string;
}) {
  const max = Math.max(...points.map((p) => p.count), 1);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-card p-[20px_18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[24px_26px]">
      <div>
        <div className="text-[15px] font-semibold sm:text-base">{title}</div>
        <div className="mt-0.5 text-xs font-light text-text-3">{subtitle}</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {points.map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={cn(labelWidthClass, "shrink-0 text-[13px] text-[#5F5F5F]")}>{p.label}</span>
            <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-[#F4F5F4]">
              <div
                className={cn(
                  "absolute inset-y-0 end-0 rounded-lg",
                  i === points.length - 1 ? "bg-brand" : "bg-[#CDE6D0]"
                )}
                style={{ width: `${(p.count / max) * 100}%` }}
              />
            </div>
            <span className={cn(valueWidthClass, "font-mont shrink-0 text-left text-xs font-semibold text-[#333]")}>
              {formatValue(p.count)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
