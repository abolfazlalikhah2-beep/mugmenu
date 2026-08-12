import { cn } from "@/lib/utils";
import type { TrendPoint } from "@/features/dashboard/services/menu-analytics-aggregation";

export function MenuWeeklyVisitsCard({ weekly }: { weekly: TrendPoint[] }) {
  const max = Math.max(...weekly.map((w) => w.count), 1);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-card p-[20px_18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[24px_26px]">
      <div>
        <div className="text-[15px] font-semibold sm:text-base">بازدید هفتگی</div>
        <div className="mt-0.5 text-xs font-light text-text-3">مقایسه ۷ روز اخیر</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {weekly.map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-[13px] text-[#5F5F5F]">{w.label}</span>
            <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-[#F4F5F4]">
              <div
                className={cn("absolute inset-y-0 end-0 rounded-lg", i === weekly.length - 1 ? "bg-brand" : "bg-[#CDE6D0]")}
                style={{ width: `${(w.count / max) * 100}%` }}
              />
            </div>
            <span className="font-mont w-10 shrink-0 text-left text-xs font-semibold text-[#333]">
              {w.count.toLocaleString("fa-IR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
