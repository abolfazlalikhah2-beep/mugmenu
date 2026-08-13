import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { getCartCheckoutContext } from "@/features/menu/services/menu-service";
import { getCustomerSession } from "@/features/customer/services/customer-session-service";
import { CartPageClient } from "@/components/menu/cart-page-client";

export default async function CartPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const [lang, session] = await Promise.all([
    getMenuLangCookie(cafeSlug),
    getCustomerSession(cafeSlug),
  ]);
  const checkout = await getCartCheckoutContext(cafeSlug, session?.customerAccountId);
  return <CartPageClient lang={lang ?? "fa"} checkout={checkout} />;
}
