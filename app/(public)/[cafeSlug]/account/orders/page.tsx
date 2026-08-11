import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getOrders } from "@/features/customer/services/order-history-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { menuCopy } from "@/features/menu/utils/menu-language";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { OrderHistoryView } from "@/components/customer-account/order-history-view";

export default async function CustomerOrderHistoryPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);
  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);
  const orders = await getOrders(customerAccountId, lang);

  return (
    <MenuPageShell dir={t.dir}>
      <TopBar title={t.orderHistoryTitle} backHref={`/${cafeSlug}/account`} />
      <div className="bg-[#F7F8F7]">
        <OrderHistoryView slug={cafeSlug} orders={orders} lang={lang} />
      </div>
    </MenuPageShell>
  );
}
