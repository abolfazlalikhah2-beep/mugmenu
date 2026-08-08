import { notFound } from "next/navigation";
import { getCategoryBrowserData } from "@/features/menu/services/menu-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { CategoryBrowser } from "@/components/menu/category-browser";
import { CartFab } from "@/components/menu/cart-fab";
import { OrderTypeSync } from "@/components/menu/order-type-sync";

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

  return (
    <MenuPageShell>
      <OrderTypeSync type={type} />
      <TopBar title="منو" backHref={`/${cafeSlug}`} />
      <CategoryBrowser slug={cafeSlug} categories={data.categories} products={data.products} />
      <CartFab slug={cafeSlug} />
    </MenuPageShell>
  );
}
