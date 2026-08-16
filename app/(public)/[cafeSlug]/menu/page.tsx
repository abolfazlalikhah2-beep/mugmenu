import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBrowserData } from "@/features/menu/services/menu-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { menuCopy } from "@/features/menu/utils/menu-language";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { CategoryBrowser } from "@/components/menu/category-browser";
import { CartFab } from "@/components/menu/cart-fab";
import { OrderTypeSync } from "@/components/menu/order-type-sync";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CategoryListPage({
  params,
  searchParams,
}: {
  params: Promise<{ cafeSlug: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { cafeSlug } = await params;
  const { type } = await searchParams;
  const data = await getCategoryBrowserData(cafeSlug);
  if (!data) notFound();

  const [lang, orderingEnabled] = await Promise.all([
    getMenuLangCookie(cafeSlug).then((l) => l ?? "fa"),
    businessHasFeature(data.business.id, "order.three_mode"),
  ]);
  const t = menuCopy(lang);

  return (
    <MenuPageShell dir={t.dir}>
      <OrderTypeSync type={type} />
      <TopBar title={t.menuTitle} backHref={`/${cafeSlug}`} />
      <CategoryBrowser
        slug={cafeSlug}
        categories={data.categories}
        products={data.products}
        lang={lang}
        orderingEnabled={orderingEnabled}
      />
      {orderingEnabled && <CartFab slug={cafeSlug} />}
    </MenuPageShell>
  );
}
