import type { Metadata } from "next";
import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getAddresses } from "@/features/customer/services/address-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { menuCopy } from "@/features/menu/utils/menu-language";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { AddressesView } from "@/components/customer-account/addresses-view";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CustomerAddressesPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);
  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);
  const addresses = await getAddresses(customerAccountId);

  return (
    <MenuPageShell dir={t.dir}>
      <TopBar title={t.myAddresses} backHref={`/${cafeSlug}/account`} />
      <div className="bg-[#F7F8F7]">
        <AddressesView slug={cafeSlug} addresses={addresses} lang={lang} />
      </div>
    </MenuPageShell>
  );
}
