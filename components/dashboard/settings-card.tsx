import type { ReactNode } from "react";
import { FormToggle } from "@/components/dashboard/form-toggle";

export function SettingsCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[22px] bg-card p-[26px_28px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="text-right">
        <div className="text-[17px] font-semibold">{title}</div>
        <div className="mt-1 text-[13px] font-light text-text-3">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

export function OrderModeRow({
  name,
  label,
  sub,
  defaultChecked,
}: {
  name: string;
  label: string;
  sub: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-[#F4F4F4] py-3.5 first:border-t-0">
      <div className="text-right">
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-0.5 text-xs font-light text-text-3">{sub}</div>
      </div>
      <FormToggle name={name} defaultChecked={defaultChecked} />
    </div>
  );
}
