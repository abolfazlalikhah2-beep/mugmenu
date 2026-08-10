import { notFound, redirect } from "next/navigation";
import { getBusinessBrand } from "@/features/customer/services/customer-auth-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { CustomerVerifyForm } from "@/components/customer-account/customer-verify-form";

export default async function CustomerVerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ cafeSlug: string }>;
  searchParams: Promise<{ phone?: string }>;
}) {
  const { cafeSlug } = await params;
  const { phone } = await searchParams;
  if (!phone) redirect(`/${cafeSlug}/account/login`);

  const business = await getBusinessBrand(cafeSlug);
  if (!business) notFound();

  return (
    <MenuPageShell>
      <TopBar title="تایید شماره" backHref={`/${cafeSlug}/account/login`} />
      <CustomerVerifyForm slug={cafeSlug} businessName={business.name} phone={phone} />
    </MenuPageShell>
  );
}
