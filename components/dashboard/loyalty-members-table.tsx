import { computeLoyaltyTier } from "@/features/customer/services/loyalty";
import type { LoyaltyMemberRow } from "@/features/dashboard/services/loyalty-club-aggregation";
import { formatToman } from "@/features/menu/utils/money";
import { cn } from "@/lib/utils";

function TierBadge({ points }: { points: number }) {
  const { tier } = computeLoyaltyTier(points);
  return tier === "GOLD" ? (
    <span className="rounded-[9px] bg-star/15 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#C79A00]">طلایی</span>
  ) : (
    <span className="rounded-[9px] bg-[#F1F1F1] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#5F5F5F]">نقره‌ای</span>
  );
}

function dateLabel(d: Date) {
  return d.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" });
}

export function LoyaltyMembersTable({ members }: { members: LoyaltyMemberRow[] }) {
  return (
    <div className="flex flex-col gap-1 rounded-[22px] bg-card p-[8px_16px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[8px_20px]">
      <div className="hidden items-center gap-4 border-b border-[#F0F0F0] p-[14px] text-[13px] font-light text-[#A0A0A0] sm:flex">
        <span className="w-11" />
        <span className="flex-1 text-right">نام عضو</span>
        <span className="w-[150px] text-right">شماره تلفن</span>
        <span className="w-[130px] text-right">تاریخ عضویت</span>
        <span className="w-[70px] text-left">سفارش</span>
        <span className="w-[110px] text-left">کیف‌پول</span>
        <span className="w-[80px] text-left">سطح</span>
      </div>

      {members.length === 0 && (
        <div className="p-6 text-center text-sm text-text-3">عضوی در باشگاه مشتریان ثبت نشده است.</div>
      )}

      {members.map((m, i) => (
        <div
          key={m.id}
          className={cn(
            "flex items-center gap-3 py-3.5 sm:gap-4 sm:px-3.5 sm:py-4",
            i > 0 && "border-t border-[#F4F4F4]"
          )}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0E6] text-base font-semibold text-brand sm:h-12 sm:w-12">
            {m.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1 text-right">
            <div className="truncate text-sm font-medium sm:text-[15px]">{m.name}</div>
            <div dir="ltr" className="mt-0.5 text-right text-xs font-light text-text-3 sm:hidden">
              {m.phone}
            </div>
          </div>
          <div className="hidden w-[150px] shrink-0 text-[#666] sm:block">
            <span dir="ltr" className="text-sm font-light">
              {m.phone}
            </span>
          </div>
          <span className="hidden w-[130px] shrink-0 text-left text-[13px] font-light text-text-3 sm:block">
            {dateLabel(m.joinedAt)}
          </span>
          <span className="font-mont hidden w-[70px] shrink-0 text-left text-[13px] font-light text-text-3 sm:block">
            {m.orderCount.toLocaleString("fa-IR")}
          </span>
          <span className="font-mont hidden w-[110px] shrink-0 text-left text-[13px] text-[#333] sm:block">
            {formatToman(m.walletBalance)}
          </span>
          <div className="w-[80px] shrink-0 text-left">
            <TierBadge points={m.loyaltyPoints} />
          </div>
        </div>
      ))}
    </div>
  );
}
