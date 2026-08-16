import type { Metadata } from "next";
import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getWalletLedger, getWalletAndLoyaltySummary } from "@/features/customer/services/wallet-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { menuCopy } from "@/features/menu/utils/menu-language";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { WalletLedgerRow } from "@/components/customer-account/wallet-ledger-row";
import { formatToman } from "@/features/menu/utils/money";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CustomerWalletPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);
  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);
  const [ledger, summary] = await Promise.all([
    getWalletLedger(customerAccountId),
    getWalletAndLoyaltySummary(customerAccountId),
  ]);

  return (
    <MenuPageShell dir={t.dir}>
      <TopBar title={t.walletLedgerLink} backHref={`/${cafeSlug}/account`} />
      <div className="flex flex-col gap-3.5 bg-[#F7F8F7] p-4.5">
        <div className="rounded-card-sm bg-card p-4.5 text-center shadow-float">
          <div className="text-[13px] font-light text-text-3">{t.currentBalance}</div>
          <div className="mt-1 text-2xl font-semibold text-brand">
            {formatToman(summary?.walletBalance ?? 0, lang)} {t.toman}
          </div>
        </div>
        <div className="rounded-card-sm bg-card p-4.5 shadow-float">
          {ledger.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-3">{t.noTransactionsYet}</p>
          ) : (
            ledger.map((row, i) => <WalletLedgerRow key={row.id} transaction={row} isFirst={i === 0} lang={lang} />)
          )}
        </div>
      </div>
    </MenuPageShell>
  );
}
