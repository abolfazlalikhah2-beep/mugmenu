import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getAccountProfile } from "@/features/customer/services/customer-auth-service";
import { getWalletAndLoyaltySummary } from "@/features/customer/services/wallet-service";
import { getOrders } from "@/features/customer/services/order-history-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { menuCopy } from "@/features/menu/utils/menu-language";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { AccountHeroHeader } from "@/components/customer-account/account-hero-header";
import { WalletCard } from "@/components/customer-account/wallet-card";
import { LoyaltyCard } from "@/components/customer-account/loyalty-card";
import { RecentOrdersCard } from "@/components/customer-account/recent-orders-card";
import { LogoutButton } from "@/components/customer-account/logout-button";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CustomerAccountPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);
  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);

  const [account, walletSummary, orders] = await Promise.all([
    getAccountProfile(customerAccountId),
    getWalletAndLoyaltySummary(customerAccountId),
    getOrders(customerAccountId, lang),
  ]);
  if (!account || !walletSummary) notFound();

  return (
    <MenuPageShell dir={t.dir}>
      <div className="bg-[#F7F8F7]">
        <AccountHeroHeader
          slug={cafeSlug}
          fullName={account.fullName}
          phone={account.phone}
          birthDate={account.birthDate ? account.birthDate.toISOString().slice(0, 10) : undefined}
          lang={lang}
        />
        <div className="-mt-[42px] flex flex-col gap-3.5 p-4">
          <WalletCard
            slug={cafeSlug}
            balance={walletSummary.walletBalance}
            cashbackPercent={walletSummary.cashbackPercent}
            lang={lang}
          />
          <LoyaltyCard
            points={walletSummary.loyaltyPoints}
            tier={walletSummary.tier}
            rewards={walletSummary.rewards}
            lang={lang}
          />
          <RecentOrdersCard slug={cafeSlug} orders={orders} lang={lang} />
          <Link
            href={`/${cafeSlug}/account/addresses`}
            className="flex items-center justify-between rounded-card-sm bg-card p-4.5 shadow-float"
          >
            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="text-text-2" />
              <span className="text-sm">{t.myAddresses}</span>
            </div>
            <ChevronLeft size={18} className="text-[#C7C7C7]" />
          </Link>
          <LogoutButton slug={cafeSlug} lang={lang} />
        </div>
      </div>
    </MenuPageShell>
  );
}
