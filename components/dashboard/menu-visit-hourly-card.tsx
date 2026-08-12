import { cn } from "@/lib/utils";

export function MenuVisitHourlyCard({ hourly }: { hourly: number[] }) {
  const max = Math.max(...hourly, 1);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-card p-[20px_18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[24px_26px]">
      <div>
        <div className="text-[15px] font-semibold sm:text-base">ساعات اوج بازدید</div>
        <div className="mt-0.5 text-xs font-light text-text-3">توزیع بازدید بر حسب ساعت — امروز</div>
      </div>
      <div className="flex h-20 items-end gap-[3px]">
        {hourly.map((v, i) => (
          <div
            key={i}
            title={`${i.toString().padStart(2, "0")}:۰۰ · ${v.toLocaleString("fa-IR")} بازدید`}
            className={cn("flex-1 rounded-[3px]", v === max && v > 0 ? "bg-brand" : "bg-[#E5F0E6]")}
            style={{ height: `${max > 0 ? Math.max((v / max) * 100, 3) : 3}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-text-3">
        <span>۰۰</span>
        <span>۰۶</span>
        <span>۱۲</span>
        <span>۱۸</span>
        <span>۲۳</span>
      </div>
    </div>
  );
}
