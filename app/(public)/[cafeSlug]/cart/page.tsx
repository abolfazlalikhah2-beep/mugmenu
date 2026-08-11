import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { CartPageClient } from "@/components/menu/cart-page-client";

export default async function CartPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  return <CartPageClient lang={lang} />;
}
