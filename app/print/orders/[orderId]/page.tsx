import { notFound } from "next/navigation";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getOrderDetail } from "@/features/dashboard/services/order-mgmt-service";
import { KitchenReceipt } from "@/components/dashboard/kitchen-receipt";

// Deliberately outside app/(dashboard) — that group's layout.tsx renders the
// sidebar/topbar shell, which a full-bleed 80mm print ticket must not have.
export default async function OrderPrintPage({
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
    <KitchenReceipt
      order={{
        ...order,
        business: { name: business.name, address: business.address, phone: business.phone },
      }}
    />
  );
}
