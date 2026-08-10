import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getOrders } from "@/features/customer/services/order-history-service";
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
  const orders = await getOrders(customerAccountId);

  return (
    <MenuPageShell>
      <TopBar title="تاریخچه سفارشات" backHref={`/${cafeSlug}/account`} />
      <div className="bg-[#F7F8F7]">
        <OrderHistoryView slug={cafeSlug} orders={orders} />
      </div>
    </MenuPageShell>
  );
}
