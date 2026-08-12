import Link from "next/link";
import { Wallet } from "lucide-react";
import { formatToman } from "@/features/menu/utils/money";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function MenuWalletTeaser({
  slug,
  walletBalance,
  loyaltyPoints,
  lang = "fa",
}: {
  slug: string;
  walletBalance: number;
  loyaltyPoints: number;
  lang?: MenuLang;
}) {
  const t = menuCopy(lang);
  return (
    <Link
      href={`/${slug}/account`}
      className="mx-4.5 mt-3.5 flex items-center justify-between rounded-card-sm border border-[#EFEFEF] p-3.5 md:mx-10"
    >
      <div className="flex items-center gap-2.5">
        <Wallet size={20} className="text-brand" />
        <div>
          <div className={`text-[12.5px] font-light text-text-3 ${lang === "en" ? "font-mont" : ""}`}>
            {t.walletLabel}
          </div>
          <div className="mt-0.5 text-[15px] font-semibold" dir="ltr">
            {lang === "en"
              ? `${walletBalance.toLocaleString("en-US")} Toman`
              : `${formatToman(walletBalance)} تومان`}
          </div>
        </div>
      </div>
      <span className={`rounded-[9px] bg-brand/10 px-3 py-1.5 text-[12.5px] text-brand ${lang === "en" ? "font-mont" : ""}`}>
        {lang === "en" ? `${loyaltyPoints.toLocaleString("en-US")} ${t.points}` : `${loyaltyPoints.toLocaleString("fa-IR")} امتیاز`}
      </span>
    </Link>
  );
}

export function MenuLoginTeaser({
  slug,
  cashbackPercent,
  lang = "fa",
}: {
  slug: string;
  cashbackPercent: number;
  lang?: MenuLang;
}) {
  const t = menuCopy(lang);
  const align = lang === "en" ? "text-left" : "text-right";
  return (
    <Link
      href={`/${slug}/account/login`}
      className="mx-4.5 mt-3.5 flex items-center justify-between gap-3 rounded-card-sm border border-brand/18 bg-brand/[0.06] p-3.5 md:mx-10"
    >
      <div className={`${align} ${lang === "en" ? "font-mont" : ""}`}>
        <div className="text-[13.5px] font-medium">
          {lang === "en" ? `Sign in and get ${cashbackPercent}% cashback` : `وارد شوید و ${cashbackPercent}٪ کش‌بک بگیرید`}
        </div>
        <div className="mt-0.5 text-[11.5px] font-light text-text-1">{t.loginTeaserSub}</div>
      </div>
      <span className="shrink-0 whitespace-nowrap rounded-[11px] bg-brand px-4 py-2 text-[13px] text-white">
        {t.login}
      </span>
    </Link>
  );
}
