import { User, Bell } from "lucide-react";

export function Topbar({
  title,
  agentName,
  action,
}: {
  title: string;
  agentName: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-[#EDEDED] bg-card px-[34px]">
      <div className="text-[23px] font-semibold">{title}</div>
      <div className="flex items-center gap-4.5">
        {action}
        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-2xl bg-[#F0F0F0] relative">
          <Bell size={22} className="text-[#5A5A5A]" />
          <span className="absolute top-2.5 right-3 h-1.5 w-1.5 rounded-full bg-[#E5484D]" />
        </div>
        <span className="h-[30px] w-px bg-[#ECECEC]" />
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-sm font-medium">{agentName}</div>
            <div className="text-xs font-light text-text-3">سوپرادمین</div>
          </div>
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl bg-[#E5F0E6]">
            <User size={22} className="text-brand" />
          </div>
        </div>
      </div>
    </div>
  );
}
