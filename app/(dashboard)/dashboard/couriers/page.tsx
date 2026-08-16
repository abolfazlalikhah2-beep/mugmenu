import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getCouriersPageData } from "@/features/dashboard/services/courier-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { CouriersView } from "@/components/dashboard/couriers-view";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";

export default async function CouriersPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, hasCouriers] = await Promise.all([
    getBusiness(businessId),
    businessHasFeature(businessId, "delivery.internal_riders"),
  ]);
  if (!business) return null;

  const data = hasCouriers ? await getCouriersPageData(businessId) : null;

  return (
    <>
      <Topbar title="پیک‌ها" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <UpgradeGate allowed={hasCouriers} title="مدیریت پیک‌های داخلی در پلن شما موجود نیست">
          {data && <CouriersView couriers={data.couriers} summary={data.summary} />}
        </UpgradeGate>
      </PanelContent>
    </>
  );
}
