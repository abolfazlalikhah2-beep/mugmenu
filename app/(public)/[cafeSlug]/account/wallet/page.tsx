import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getWalletLedger, getWalletAndLoyaltySummary } from "@/features/customer/services/wallet-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { WalletLedgerRow } from "@/components/customer-account/wallet-ledger-row";
import { formatToman } from "@/features/menu/utils/money";

export default async function CustomerWalletPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);
  const [ledger, summary] = await Promise.all([
    getWalletLedger(customerAccountId),
    getWalletAndLoyaltySummary(customerAccountId),
  ]);

  return (
    <MenuPageShell>
      <TopBar title="گردش کیف پول" backHref={`/${cafeSlug}/account`} />
      <div className="flex flex-col gap-3.5 bg-[#F7F8F7] p-4.5">
        <div className="rounded-card-sm bg-card p-4.5 text-center shadow-float">
          <div className="text-[13px] font-light text-text-3">موجودی فعلی</div>
          <div className="mt-1 text-2xl font-semibold text-brand">
            {formatToman(summary?.walletBalance ?? 0)} تومان
          </div>
        </div>
        <div className="rounded-card-sm bg-card p-4.5 shadow-float">
          {ledger.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-3">هنوز تراکنشی ثبت نشده است.</p>
          ) : (
            ledger.map((t, i) => <WalletLedgerRow key={t.id} transaction={t} isFirst={i === 0} />)
          )}
        </div>
      </div>
    </MenuPageShell>
  );
}
