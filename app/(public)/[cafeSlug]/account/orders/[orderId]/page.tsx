import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getOrderDetail } from "@/features/customer/services/order-history-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { menuCopy } from "@/features/menu/utils/menu-language";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { OrderDetailView } from "@/components/customer-account/order-detail-view";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; orderId: string }>;
}) {
  const { cafeSlug, orderId } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);
  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);
  const order = await getOrderDetail(customerAccountId, orderId, lang);
  if (!order) notFound();

  return (
    <MenuPageShell dir={t.dir}>
      <TopBar title={t.orderDetailsTitle} backHref={`/${cafeSlug}/account/orders`} />
      <div className="bg-[#F7F8F7]">
        <OrderDetailView slug={cafeSlug} order={order} lang={lang} />
      </div>
    </MenuPageShell>
  );
}
