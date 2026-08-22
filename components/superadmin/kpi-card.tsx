import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  unit,
  icon,
  note,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-3.5 rounded-[22px] bg-card p-[22px_24px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-light text-text-3">{label}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3EB]">{icon}</div>
      </div>
      <div className="flex items-end gap-1.5 text-right">
        <span className="text-[26px] font-semibold">{value}</span>
        {unit && <span className="mb-[3px] text-xs font-light text-text-3">{unit}</span>}
      </div>
      {note && <span className="text-xs font-light text-[#B0B0B0]">{note}</span>}
    </div>
  );
}
