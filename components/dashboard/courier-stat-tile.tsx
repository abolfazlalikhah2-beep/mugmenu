import type { ReactNode } from "react";

export function CourierStatTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-[20px] bg-card p-[18px_20px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3EB]">{icon}</div>
      <div className="text-right">
        <div className="text-[12.5px] text-[#9F9F9F]">{label}</div>
        <div className="mt-0.5 font-mont text-[22px] font-bold">{value}</div>
      </div>
    </div>
  );
}
