import Link from "next/link";
import { User } from "lucide-react";
import { ServerToggle } from "@/components/dashboard/server-toggle";
import { toggleAcceptingOrdersAction } from "@/features/dashboard/routes/actions";

export function Topbar({
  title,
  businessName,
  isAcceptingOrders,
  action,
}: {
  title: string;
  businessName: string;
  isAcceptingOrders: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-[#EDEDED] bg-card px-[34px]">
      <div className="text-[23px] font-semibold">{title}</div>
      <div className="flex items-center gap-4.5">
        {action}
        <div className="flex items-center gap-2">
          <span className="text-sm font-light text-[#777]">وضعیت سفارش‌گیری</span>
          <ServerToggle initial={isAcceptingOrders} action={toggleAcceptingOrdersAction} />
        </div>
        <span className="h-[30px] w-px bg-[#ECECEC]" />
        <Link href="/dashboard/account" className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-sm font-medium">{businessName}</div>
            <div className="text-xs font-light text-text-3">مدیر مجموعه</div>
          </div>
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl bg-[#E5F0E6]">
            <User size={22} className="text-brand" />
          </div>
        </Link>
      </div>
    </div>
  );
}
