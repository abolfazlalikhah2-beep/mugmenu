import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getOrdersReport, getProductsReport } from "@/features/dashboard/services/report-service";
import { getMenuAnalyticsReport } from "@/features/dashboard/services/menu-analytics-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { ReportsView } from "@/components/dashboard/reports-view";

export default async function ReportsPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, ordersData, productsData, menuAnalyticsData] = await Promise.all([
    getBusiness(businessId),
    getOrdersReport(businessId),
    getProductsReport(businessId),
    getMenuAnalyticsReport(businessId),
  ]);
  if (!business) return null;

  return (
    <>
      <Topbar title="گزارش‌ها" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <ReportsView ordersData={ordersData} productsData={productsData} menuAnalyticsData={menuAnalyticsData} />
      </PanelContent>
    </>
  );
}
