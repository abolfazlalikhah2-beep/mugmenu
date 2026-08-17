import Link from "next/link";
import { User } from "lucide-react";
import { AcceptingOrdersToggle } from "@/components/dashboard/accepting-orders-toggle";
import { SidebarHamburgerButton } from "@/components/dashboard/sidebar-hamburger-button";

export function Topbar({
  title,
  businessName,
  action,
}: {
  title: string;
  businessName: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-[88px] shrink-0 items-center justify-between gap-3 border-b border-[#EDEDED] bg-card px-4 md:px-[34px]">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarHamburgerButton />
        <div className="truncate text-[19px] font-semibold md:text-[23px]">{title}</div>
      </div>
      <div className="flex items-center gap-4.5">
        {action}
        <AcceptingOrdersToggle className="hidden sm:flex" />
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
