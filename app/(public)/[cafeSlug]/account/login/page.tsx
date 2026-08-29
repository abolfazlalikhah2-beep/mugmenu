import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusinessBrand } from "@/features/customer/services/customer-auth-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { localizedName, menuCopy } from "@/features/menu/utils/menu-language";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { CustomerLoginForm } from "@/components/customer-account/customer-login-form";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CustomerLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ cafeSlug: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { cafeSlug } = await params;
  const { next } = await searchParams;
  const business = await getBusinessBrand(cafeSlug);
  if (!business) notFound();

  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);
  const businessName = localizedName(lang, business.name, business.nameEn);

  return (
    <MenuPageShell dir={t.dir}>
      <CustomerLoginForm slug={cafeSlug} businessName={businessName} lang={lang} next={next} />
    </MenuPageShell>
  );
}
