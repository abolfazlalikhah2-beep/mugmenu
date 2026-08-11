import Link from "next/link";
import { Wallet } from "lucide-react";
import { formatToman } from "@/features/menu/utils/money";
import { CASHBACK_PERCENT } from "@/features/customer/services/loyalty";
import { menuCopy, cashbackNoteLabel, type MenuLang } from "@/features/menu/utils/menu-language";

export function WalletCard({ slug, balance, lang = "fa" }: { slug: string; balance: number; lang?: MenuLang }) {
  const t = menuCopy(lang);
  return (
    <div className="flex flex-col gap-4 rounded-card-sm bg-card p-4.5 shadow-float">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-brand/10">
            <Wallet size={20} className="text-brand" />
          </div>
          <div>
            <div className="text-[13px] font-light text-text-3">{t.walletBalanceCashback}</div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-xl font-semibold">{formatToman(balance, lang)}</span>
              <span className="text-xs font-light text-text-3">{t.toman}</span>
            </div>
          </div>
        </div>
        <span className="rounded-[9px] bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand">{t.usable}</span>
      </div>
      <Link
        href={`/${slug}/account/wallet`}
        className="flex h-11 items-center justify-center rounded-[13px] border border-border-input bg-card text-sm text-text-1"
      >
        {t.walletLedgerLink}
      </Link>
      <div className="flex items-center gap-2 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
        <span className="text-xs font-light text-text-1">{cashbackNoteLabel(lang, CASHBACK_PERCENT)}</span>
      </div>
    </div>
  );
}
