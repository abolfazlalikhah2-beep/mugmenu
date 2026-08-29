import Image from "next/image";
import Link from "next/link";
import { Crown, Calendar } from "lucide-react";
import { formatToman } from "@/features/menu/utils/money";
import type { PlanStatus } from "@/features/dashboard/services/plan-status";

const BILLING_CYCLE_LABEL: Record<string, string> = {
  MONTHLY: "ماهانه",
  SIX_MONTH: "۶ ماهه",
  ANNUAL: "سالانه",
};

export function PlanCard({
  planName,
  priceToman,
  expiresAt,
  status,
  billingCycle,
}: {
  planName: string;
  priceToman: number;
  expiresAt: Date;
  status: PlanStatus;
  billingCycle: "MONTHLY" | "SIX_MONTH" | "ANNUAL";
}) {
  return (
    <div className="relative flex flex-col gap-[22px] overflow-hidden rounded-[26px] bg-[#0F7A3B] p-[26px_22px] text-white sm:p-[34px_36px]">
      <Image
        src="/brand/green-gradient.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover opacity-90"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-3.5">
        <div className="flex flex-col gap-2.5 text-right">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-white/18">
              <Crown size={24} />
            </div>
            <div>
              <div className="text-[13px] font-light opacity-85">پلن فعلی</div>
              <div className="text-[22px] font-bold sm:text-[26px]">{planName}</div>
            </div>
          </div>
          <div className="mt-1.5 text-[28px] font-extrabold sm:text-[34px]">
            {formatToman(priceToman)}
            <span className="mr-1.5 text-sm font-light opacity-85">
              تومان / {BILLING_CYCLE_LABEL[billingCycle] ?? "ماهانه"}
            </span>
          </div>
        </div>
        <span className="rounded-[9px] bg-white px-3 py-[5px] text-xs font-medium text-[#0F7A3B]">
          {status.isExpired ? "منقضی‌شده" : "فعال"}
        </span>
      </div>

      <div className="relative flex flex-col gap-3.5 sm:flex-row">
        <div className="flex-1 rounded-2xl bg-white/14 p-[16px_18px] text-right">
          <div className="mb-2 flex items-center justify-end gap-2 opacity-85">
            <span className="text-[13px] font-light">تاریخ انقضا</span>
            <Calendar size={16} />
          </div>
          <div className="text-lg font-semibold">
            {expiresAt.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </div>
        <div className="flex-1 rounded-2xl bg-white/14 p-[16px_18px] text-right">
          <div className="mb-2 text-[13px] font-light opacity-85">روزهای باقی‌مانده</div>
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="text-[13px] font-light opacity-85">روز</span>
            <span className="text-2xl font-extrabold">{status.daysRemaining.toLocaleString("fa-IR")}</span>
          </div>
        </div>
      </div>

      <div className="relative h-2 overflow-hidden rounded-md bg-white/25">
        <div className="h-full rounded-md bg-white" style={{ width: `${status.progressPercent}%` }} />
      </div>

      <div className="relative flex flex-col items-center gap-2">
        <Link
          href="/payment"
          className="flex h-[54px] w-full items-center justify-center rounded-[15px] bg-white text-[17px] font-bold text-[#0F7A3B]"
        >
          تمدید اشتراک
        </Link>
        <span className="text-[11px] font-light text-white/80">پرداخت کارت‌به‌کارت</span>
      </div>
    </div>
  );
}
