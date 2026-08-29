import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import type { CustomerSummary } from "@/features/dashboard/utils/aggregate-customers";
import { cn } from "@/lib/utils";

function dateLabel(d: Date) {
  return d.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" });
}

export function CustomersTable({ customers }: { customers: CustomerSummary[] }) {
  return (
    <div className="flex flex-col gap-1 rounded-[22px] bg-card p-[8px_16px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[8px_20px]">
      <div className="hidden items-center gap-4 border-b border-[#F0F0F0] p-[14px] text-[13px] font-light text-[#A0A0A0] sm:flex">
        <span className="w-12" />
        <span className="flex-1 text-right">نام مشتری</span>
        <span className="w-[180px] text-right">شماره تلفن</span>
        <span className="text-right">اولین سفارش</span>
        <span className="w-[90px] text-left">تعداد</span>
      </div>

      {customers.length === 0 && (
        <div className="p-6 text-center text-sm text-text-3">مشتری‌ای ثبت نشده است.</div>
      )}

      {customers.map((c, i) => (
        <Link
          key={c.phone}
          href={`/dashboard/customers/${encodeURIComponent(c.phone)}`}
          className={cn(
            "flex items-center gap-3 py-3.5 sm:gap-4 sm:px-3.5 sm:py-4",
            i > 0 && "border-t border-[#F4F4F4]"
          )}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0E6] text-base font-semibold text-brand sm:h-12 sm:w-12">
            {c.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1 text-right">
            <div className="truncate text-sm font-medium sm:text-[15px]">{c.name}</div>
            <div dir="ltr" className="mt-0.5 text-right text-xs font-light text-text-3 sm:hidden">
              {c.phone}
            </div>
          </div>
          <div className="hidden w-[180px] shrink-0 items-center gap-2 text-[#666] sm:flex">
            <Phone size={15} className="text-[#9A9A9A]" />
            <span dir="ltr" className="text-sm font-light">
              {c.phone}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-[#9F9F9F]">
            <Calendar size={15} className="text-[#9A9A9A]" />
            <span className="text-xs font-light sm:text-[13px]">{dateLabel(c.firstOrderAt)}</span>
          </div>
          <span className="hidden w-[90px] shrink-0 text-left text-[13px] font-light text-text-3 sm:block">
            {c.orderCount.toLocaleString("fa-IR")} سفارش
          </span>
        </Link>
      ))}
    </div>
  );
}
