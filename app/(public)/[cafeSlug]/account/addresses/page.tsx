import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getAddresses } from "@/features/customer/services/address-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { AddressesView } from "@/components/customer-account/addresses-view";

export default async function CustomerAddressesPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);
  const addresses = await getAddresses(customerAccountId);

  return (
    <MenuPageShell>
      <TopBar title="آدرس‌های من" backHref={`/${cafeSlug}/account`} />
      <div className="bg-[#F7F8F7]">
        <AddressesView slug={cafeSlug} addresses={addresses} />
      </div>
    </MenuPageShell>
  );
}
