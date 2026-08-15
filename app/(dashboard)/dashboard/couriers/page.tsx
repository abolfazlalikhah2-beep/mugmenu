import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getCouriersPageData } from "@/features/dashboard/services/courier-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { CouriersView } from "@/components/dashboard/couriers-view";

export default async function CouriersPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, { couriers, summary }] = await Promise.all([
    getBusiness(businessId),
    getCouriersPageData(businessId),
  ]);
  if (!business) return null;

  return (
    <>
      <Topbar title="پیک‌ها" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <CouriersView couriers={couriers} summary={summary} />
      </PanelContent>
    </>
  );
}
