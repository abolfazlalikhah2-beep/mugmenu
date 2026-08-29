import Link from "next/link";
import { ChevronRight, ShoppingBag, Wallet, Receipt, CalendarClock, TrendingUp, Calendar } from "lucide-react";
import type { CustomerDetail } from "@/features/dashboard/services/customer-service";
import { formatToman } from "@/features/menu/utils/money";
import { cn } from "@/lib/utils";

function dateLabel(d: Date) {
  return d.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" });
}

function Stat({ icon: Icon, label, value }: { icon: typeof ShoppingBag; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-[22px] bg-card p-[20px_22px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3EB]">
        <Icon size={18} className="text-brand" />
      </div>
      <div className="text-[22px] font-bold">{value}</div>
      <div className="text-[13px] font-light text-[#8A8A8A]">{label}</div>
    </div>
  );
}

export function CustomerDetailView({ customer }: { customer: CustomerDetail }) {
  const { stats } = customer;

  return (
    <div className="flex flex-col gap-[18px] sm:gap-[22px]">
      <Link href="/dashboard/customers" className="flex w-fit items-center gap-1.5 text-sm text-text-3">
        <ChevronRight size={16} />
        بازگشت به لیست مشتریان
      </Link>

      <div className="flex flex-wrap items-center gap-3.5 rounded-[22px] bg-card p-[22px_24px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0E6] text-xl font-semibold text-brand">
          {customer.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="text-base font-semibold sm:text-lg">{customer.name}</div>
          <div dir="ltr" className="mt-1 text-right text-sm font-light text-text-3">
            {customer.phone}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        <Stat icon={ShoppingBag} label="تعداد سفارش" value={stats.orderCount.toLocaleString("fa-IR")} />
        <Stat icon={Wallet} label="جمع خرید" value={`${formatToman(stats.totalSpend)} ت`} />
        <Stat icon={Receipt} label="میانگین ارزش سفارش" value={`${formatToman(stats.averageOrderValue)} ت`} />
        <Stat icon={CalendarClock} label="روز از آخرین سفارش" value={stats.daysSinceLastOrder.toLocaleString("fa-IR")} />
        <Stat icon={TrendingUp} label="سفارش در ماه" value={stats.ordersPerMonth.toLocaleString("fa-IR")} />
        <Stat icon={Calendar} label="اولین سفارش" value={dateLabel(stats.firstOrderAt)} />
      </div>

      <div className="flex flex-col gap-3 rounded-[22px] bg-card p-[22px_24px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="text-right text-[15px] font-semibold">غذاهای محبوب</div>
        {stats.favoriteItems.length === 0 ? (
          <p className="text-right text-sm text-text-3">هنوز آیتمی ثبت نشده است.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {stats.favoriteItems.map((item, i) => (
              <div
                key={item.name}
                className={cn("flex items-center justify-between py-2", i > 0 && "border-t border-[#F4F4F4]")}
              >
                <span className="text-sm font-light text-text-3">{item.quantity.toLocaleString("fa-IR")} بار</span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
