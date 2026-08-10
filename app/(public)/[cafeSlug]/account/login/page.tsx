import { notFound } from "next/navigation";
import { getBusinessBrand } from "@/features/customer/services/customer-auth-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { CustomerLoginForm } from "@/components/customer-account/customer-login-form";

export default async function CustomerLoginPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const business = await getBusinessBrand(cafeSlug);
  if (!business) notFound();

  return (
    <MenuPageShell>
      <CustomerLoginForm slug={cafeSlug} businessName={business.name} />
    </MenuPageShell>
  );
}
