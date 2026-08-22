"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Package, LayoutGrid, Tag, Receipt, HandCoins, Bike, MessageCircle, Contact, ChartLine, Users, LifeBuoy, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/features/auth/routes/actions";
import { Lock } from "lucide-react";
import type { FeatureKey } from "@/features/plans/feature-matrix";
import { useSidebar } from "@/features/dashboard/client/sidebar-context";

const NAV: { href: string; label: string; icon: typeof Home; featureKey?: FeatureKey }[] = [
  { href: "/dashboard", label: "داشبورد", icon: Home },
  { href: "/dashboard/products", label: "محصولات", icon: Package },
  { href: "/dashboard/categories", label: "دسته‌بندی", icon: LayoutGrid },
  { href: "/dashboard/discounts", label: "تخفیف‌ها", icon: Tag, featureKey: "discount.manual_auto" },
  { href: "/dashboard/orders", label: "سفارشات", icon: Receipt },
  { href: "/dashboard/credits", label: "نسیه", icon: HandCoins, featureKey: "order.manual_entry" },
  { href: "/dashboard/couriers", label: "پیک‌ها", icon: Bike, featureKey: "delivery.internal_riders" },
  { href: "/dashboard/messages", label: "پیام‌ها", icon: MessageCircle, featureKey: "sms.panel" },
  { href: "/dashboard/customers", label: "مشتریان", icon: Contact },
  { href: "/dashboard/reports", label: "گزارش‌ها", icon: ChartLine },
  { href: "/dashboard/users", label: "کاربران", icon: Users },
  { href: "/dashboard/support", label: "پشتیبانی", icon: LifeBuoy },
  { href: "/dashboard/settings", label: "تنظیمات", icon: Settings },
];

export function Sidebar({ featureKeys }: { featureKeys: string[] }) {
  const pathname = usePathname();
  const { open, close } = useSidebar();
  const has = (key?: FeatureKey) => !key || featureKeys.includes(key);

  // A route change means a nav link was just clicked — close the off-canvas
  // sidebar so it doesn't stay open over the newly-navigated page on mobile.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/35 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-[264px] shrink-0 flex-col border-l border-[#EDEDED] bg-card p-[30px_20px] transition-transform duration-200 md:static md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center gap-2.5 px-2 pb-7">
          <Image
            src="/brand/wordmark-faded.png"
            alt="ماگ‌منو"
            width={126}
            height={38}
            className="h-[30px] w-auto [filter:invert(38%)_sepia(50%)_saturate(700%)_hue-rotate(80deg)]"
          />
        </div>
        <nav className="flex flex-col gap-1.5 overflow-y-auto">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            const locked = !has(item.featureKey);
            return (
              <Link
                key={item.href}
                href={locked ? "/dashboard/account" : item.href}
                className={cn(
                  "flex h-[50px] items-center gap-3 rounded-2xl px-4 text-[15px]",
                  active ? "bg-[#EAF3EB] font-medium text-brand" : "font-normal text-[#7A7A7A]"
                )}
              >
                <item.icon size={21} className={active ? "text-brand" : "text-[#9A9A9A]"} />
                <span className="flex-1">{item.label}</span>
                {locked && (
                  <span
                    title="این امکان در پلن شما موجود نیست، برای ارتقا کلیک کنید"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-[#9A9A9A]"
                  >
                    <Lock size={11} />
                  </span>
                )}
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
    </>
  );
}
