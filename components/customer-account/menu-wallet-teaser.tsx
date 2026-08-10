import Link from "next/link";
import { Wallet } from "lucide-react";
import { formatToman } from "@/features/menu/utils/money";
import { CASHBACK_PERCENT } from "@/features/customer/services/loyalty";

export function MenuWalletTeaser({
  slug,
  walletBalance,
  loyaltyPoints,
}: {
  slug: string;
  walletBalance: number;
  loyaltyPoints: number;
}) {
  return (
    <Link
      href={`/${slug}/account`}
      className="mx-4.5 mt-3.5 flex items-center justify-between rounded-card-sm border border-[#EFEFEF] p-3.5 md:mx-10"
    >
      <div className="flex items-center gap-2.5">
        <Wallet size={20} className="text-brand" />
        <div>
          <div className="text-[12.5px] font-light text-text-3">کیف پول شما</div>
          <div className="mt-0.5 text-[15px] font-semibold">{formatToman(walletBalance)} تومان</div>
        </div>
      </div>
      <span className="rounded-[9px] bg-brand/10 px-3 py-1.5 text-[12.5px] text-brand">
        {loyaltyPoints.toLocaleString("fa-IR")} امتیاز
      </span>
    </Link>
  );
}

export function MenuLoginTeaser({ slug }: { slug: string }) {
  return (
    <Link
      href={`/${slug}/account/login`}
      className="mx-4.5 mt-3.5 flex items-center justify-between gap-3 rounded-card-sm border border-brand/18 bg-brand/[0.06] p-3.5 md:mx-10"
    >
      <div className="text-right">
        <div className="text-[13.5px] font-medium">وارد شوید و {CASHBACK_PERCENT}٪ کش‌بک بگیرید</div>
        <div className="mt-0.5 text-[11.5px] font-light text-text-1">ورود سریع با شماره موبایل</div>
      </div>
      <span className="shrink-0 whitespace-nowrap rounded-[11px] bg-brand px-4 py-2 text-[13px] text-white">
        ورود
      </span>
    </Link>
  );
}
