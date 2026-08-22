import type { ReactNode } from "react";

export function CashStatCard({
  icon,
  label,
  value,
  unit,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
  note?: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-[20px] bg-card p-[22px_24px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-light text-[#8A8A8A]">{label}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3EB]">{icon}</div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[30px] font-bold">{value}</span>
        <span className="text-sm font-light text-[#9F9F9F]">{unit}</span>
      </div>
      {note && <span className="text-xs font-light text-[#B0B0B0]">{note}</span>}
    </div>
  );
}
