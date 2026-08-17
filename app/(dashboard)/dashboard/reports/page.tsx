import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getOrdersReport, getProductsReport } from "@/features/dashboard/services/report-service";
import { getMenuAnalyticsReport } from "@/features/dashboard/services/menu-analytics-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { ReportsView } from "@/components/dashboard/reports-view";

export default async function ReportsPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, hasOrdersReport, productsData, menuAnalyticsData] = await Promise.all([
    getBusiness(businessId),
    businessHasFeature(businessId, "report.orders"),
    getProductsReport(businessId),
    getMenuAnalyticsReport(businessId),
  ]);
  if (!business) return null;

  const ordersData = hasOrdersReport ? await getOrdersReport(businessId) : null;

  return (
    <>
      <Topbar title="گزارش‌ها" businessName={business.name} />
      <PanelContent>
        <ReportsView ordersData={ordersData} productsData={productsData} menuAnalyticsData={menuAnalyticsData} />
      </PanelContent>
    </>
  );
}
