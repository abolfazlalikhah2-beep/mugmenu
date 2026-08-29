import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBrowserData } from "@/features/menu/services/menu-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { menuCopy, localizedName } from "@/features/menu/utils/menu-language";
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

  const [lang, canOrderFeature] = await Promise.all([
    getMenuLangCookie(cafeSlug).then((l) => l ?? "fa"),
    businessHasFeature(data.business.id, "order.three_mode"),
  ]);
  // Same gate as the entry page: plan feature AND the owner's manual
  // "سفارش‌گیری" toggle both have to allow ordering.
  const orderingEnabled = canOrderFeature && data.business.isAcceptingOrders;
  const t = menuCopy(lang);

  return (
    <MenuPageShell dir={t.dir}>
      <OrderTypeSync type={type} />
      <TopBar
        title={t.menuTitle(localizedName(lang, data.business.name, data.business.nameEn))}
        backHref={`/${cafeSlug}`}
      />
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
