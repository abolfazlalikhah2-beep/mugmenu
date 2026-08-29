import { notFound } from "next/navigation";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getCustomerDetail } from "@/features/dashboard/services/customer-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { CustomerDetailView } from "@/components/dashboard/customer-detail-view";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ phone: string }>;
}) {
  const { phone: encodedPhone } = await params;
  const phone = decodeURIComponent(encodedPhone);
  const { businessId } = await requireBusinessOwner();
  const [business, customer] = await Promise.all([getBusiness(businessId), getCustomerDetail(businessId, phone)]);
  if (!business || !customer) notFound();

  return (
    <>
      <Topbar title="جزئیات مشتری" businessName={business.name} />
      <PanelContent>
        <CustomerDetailView customer={customer} />
      </PanelContent>
    </>
  );
}
