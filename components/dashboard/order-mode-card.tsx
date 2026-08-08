"use client";

import { useState, type ComponentType } from "react";
import { Clock } from "lucide-react";
import { Toggle } from "@/components/dashboard/toggle";
import { PrepTimeStepper } from "@/components/dashboard/prep-time-stepper";

export function OrderModeCard({
  icon: Icon,
  name,
  label,
  sub,
  defaultOn,
  prepName,
  defaultPrep,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  name: string;
  label: string;
  sub: string;
  defaultOn: boolean;
  prepName: string;
  defaultPrep: number;
}) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div
      className="flex flex-col gap-5 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] transition-opacity"
      style={{ opacity: on ? 1 : 0.7 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl"
            style={{ background: on ? "#EAF3EB" : "#F1F1F1" }}
          >
            <Icon size={26} className={on ? "text-brand" : "text-[#B0B0B0]"} />
          </div>
          <div className="text-right">
            <div className="text-[17px] font-semibold">{label}</div>
            <div className="mt-0.5 text-xs font-light text-text-3">{sub}</div>
          </div>
        </div>
        <input type="hidden" name={name} value={on ? "on" : ""} />
        <Toggle checked={on} onChange={setOn} />
      </div>

      <div className="h-px bg-[#F2F2F2]" />

      <div className="flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-2 text-[#666]">
          <Clock size={18} className="text-[#9A9A9A]" />
          <span className="text-sm font-light">زمان آماده‌سازی</span>
        </div>
        <PrepTimeStepper name={prepName} defaultValue={defaultPrep} />
      </div>
    </div>
  );
}
