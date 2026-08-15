import { notFound } from "next/navigation";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getOrderDetail } from "@/features/dashboard/services/order-mgmt-service";
import { getActiveCouriers } from "@/features/dashboard/services/courier-service";
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

  const couriers =
    order.type === "DELIVERY"
      ? (await getActiveCouriers(businessId)).map((c) => ({
          id: c.id,
          name: c.name,
          vehicleType: c.vehicleType,
          busyCount: c._count.orders,
        }))
      : [];

  return (
    <>
      <Topbar title="جزئیات سفارش" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <OrderDetailCard order={order} couriers={couriers} />
      </PanelContent>
    </>
  );
}
