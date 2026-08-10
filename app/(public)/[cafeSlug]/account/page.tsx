import { notFound } from "next/navigation";
import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getAccountProfile } from "@/features/customer/services/customer-auth-service";
import { getWalletAndLoyaltySummary } from "@/features/customer/services/wallet-service";
import { getOrders } from "@/features/customer/services/order-history-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { AccountHeroHeader } from "@/components/customer-account/account-hero-header";
import { WalletCard } from "@/components/customer-account/wallet-card";
import { LoyaltyCard } from "@/components/customer-account/loyalty-card";
import { RecentOrdersCard } from "@/components/customer-account/recent-orders-card";
import { LogoutButton } from "@/components/customer-account/logout-button";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";

export default async function CustomerAccountPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);

  const [account, walletSummary, orders] = await Promise.all([
    getAccountProfile(customerAccountId),
    getWalletAndLoyaltySummary(customerAccountId),
    getOrders(customerAccountId),
  ]);
  if (!account || !walletSummary) notFound();

  return (
    <MenuPageShell>
      <div className="bg-[#F7F8F7]">
        <AccountHeroHeader slug={cafeSlug} fullName={account.fullName} phone={account.phone} />
        <div className="-mt-[42px] flex flex-col gap-3.5 p-4">
          <WalletCard slug={cafeSlug} balance={walletSummary.walletBalance} />
          <LoyaltyCard points={walletSummary.loyaltyPoints} tier={walletSummary.tier} rewards={walletSummary.rewards} />
          <RecentOrdersCard slug={cafeSlug} orders={orders} />
          <Link
            href={`/${cafeSlug}/account/addresses`}
            className="flex items-center justify-between rounded-card-sm bg-card p-4.5 shadow-float"
          >
            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="text-text-2" />
              <span className="text-sm">آدرس‌های من</span>
            </div>
            <ChevronLeft size={18} className="text-[#C7C7C7]" />
          </Link>
          <LogoutButton slug={cafeSlug} />
        </div>
      </div>
    </MenuPageShell>
  );
}
