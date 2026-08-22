"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Contact, Wallet, LifeBuoy, ShieldCheck, CreditCard, ReceiptText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/features/auth/routes/actions";

const NAV = [
  { href: "/superadmin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/superadmin/customers", label: "مشتریان", icon: Contact },
  { href: "/superadmin/finance", label: "مالی", icon: Wallet },
  { href: "/superadmin/payment-cards", label: "تنظیمات پرداخت", icon: CreditCard },
  { href: "/superadmin/payment-requests", label: "درخواست‌های پرداخت", icon: ReceiptText },
  { href: "/superadmin/tickets", label: "تیکت‌ها", icon: LifeBuoy },
  { href: "/superadmin/users", label: "کاربران", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-[264px] shrink-0 flex-col border-l border-[#EDEDED] bg-card p-[30px_20px]">
      <div className="flex flex-col gap-1 px-2 pb-7">
        <Image
          src="/brand/wordmark-faded.png"
          alt="ماگ‌منو"
          width={126}
          height={38}
          className="h-[30px] w-auto [filter:invert(38%)_sepia(50%)_saturate(700%)_hue-rotate(80deg)]"
        />
        <span className="font-mont text-[10px] tracking-[0.28em] text-[#B7B7B7]">SUPER ADMIN</span>
      </div>
      <nav className="flex flex-col gap-1.5">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-[50px] items-center gap-3 rounded-2xl px-4 text-[15px]",
                active ? "bg-[#EAF3EB] font-medium text-brand" : "font-normal text-[#7A7A7A]"
              )}
            >
              <item.icon size={21} className={active ? "text-brand" : "text-[#9A9A9A]"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="mt-auto">
        <button
          type="submit"
          className="flex h-[50px] w-full items-center gap-3 rounded-2xl px-4 text-[15px] text-[#C15656]"
        >
          <LogOut size={21} />
          خروج
        </button>
      </form>
    </div>
  );
}
