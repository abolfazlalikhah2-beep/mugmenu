import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { getCartCheckoutContext } from "@/features/menu/services/menu-service";
import { getCustomerSession } from "@/features/customer/services/customer-session-service";
import { CartPageClient } from "@/components/menu/cart-page-client";

export const metadata: Metadata = { robots: { index: false, follow: false } };

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
  // Login is mandatory to place an order — a guest is sent to log in before
  // they ever see the checkout form, with `next` bringing them straight back
  // here afterward (see resolvePostLoginPath). The real enforcement is
  // server-side in order-service.ts's createOrder; this is just the UX so a
  // guest isn't left filling out a form that will be rejected at submit time.
  if (!session) {
    redirect(`/${cafeSlug}/account/login?next=${encodeURIComponent(`/${cafeSlug}/cart`)}`);
  }
  const checkout = await getCartCheckoutContext(cafeSlug, session.customerAccountId);
  return <CartPageClient lang={lang ?? "fa"} checkout={checkout} />;
}
