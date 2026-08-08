import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  deltaPercent,
  up,
  icon,
  className,
}: {
  label: string;
  value: string;
  deltaPercent: number;
  up: boolean;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-[22px] bg-card p-[22px_24px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-light text-[#8A8A8A]">{label}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3EB]">{icon}</div>
      </div>
      <div className="text-[30px] font-bold">{value}</div>
      <div className="flex items-center gap-1.5">
        <span className={cn("text-xs font-medium", up ? "text-brand" : "text-[#C15656]")}>
          {up ? "▲" : "▼"} {deltaPercent.toLocaleString("fa-IR")}٪
        </span>
        <span className="text-xs font-light text-[#B0B0B0]">نسبت به دیروز</span>
      </div>
    </div>
  );
}
