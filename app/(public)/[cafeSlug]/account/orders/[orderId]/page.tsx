import { notFound } from "next/navigation";
import { requireCustomerSession } from "@/features/customer/services/customer-session-service";
import { getOrderDetail } from "@/features/customer/services/order-history-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { OrderDetailView } from "@/components/customer-account/order-detail-view";

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; orderId: string }>;
}) {
  const { cafeSlug, orderId } = await params;
  const { customerAccountId } = await requireCustomerSession(cafeSlug);
  const order = await getOrderDetail(customerAccountId, orderId);
  if (!order) notFound();

  return (
    <MenuPageShell>
      <TopBar title="جزئیات سفارش" backHref={`/${cafeSlug}/account/orders`} />
      <div className="bg-[#F7F8F7]">
        <OrderDetailView slug={cafeSlug} order={order} />
      </div>
    </MenuPageShell>
  );
}
