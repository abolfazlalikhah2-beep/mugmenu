import { notFound } from "next/navigation";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getOrderDetail } from "@/features/dashboard/services/order-mgmt-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { OrderDetailCard } from "@/components/dashboard/order-detail-card";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const { businessId } = await requireBusinessOwner();
  const [business, order] = await Promise.all([
    getBusiness(businessId),
    getOrderDetail(businessId, orderId),
  ]);
  if (!business || !order) notFound();

  return (
    <>
      <Topbar title="جزئیات سفارش" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <OrderDetailCard order={order} />
      </PanelContent>
    </>
  );
}
