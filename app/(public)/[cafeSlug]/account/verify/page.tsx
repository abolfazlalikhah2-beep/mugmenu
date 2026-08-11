import { notFound, redirect } from "next/navigation";
import { getBusinessBrand } from "@/features/customer/services/customer-auth-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { localizedName, menuCopy } from "@/features/menu/utils/menu-language";
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

  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);
  const businessName = localizedName(lang, business.name, business.nameEn);

  return (
    <MenuPageShell dir={t.dir}>
      <TopBar title={t.verifyTitle} backHref={`/${cafeSlug}/account/login`} />
      <CustomerVerifyForm slug={cafeSlug} businessName={businessName} phone={phone} lang={lang} />
    </MenuPageShell>
  );
}
