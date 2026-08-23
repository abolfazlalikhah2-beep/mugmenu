import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import {
  getOrdersReport,
  getProductsReport,
  getCashRegisterReport,
  getOrdersReportCustom,
  getProductsReportCustom,
  getCashRegisterReportCustom,
} from "@/features/dashboard/services/report-service";
import { getMenuAnalyticsReport, getMenuAnalyticsReportCustom } from "@/features/dashboard/services/menu-analytics-service";
import { parseDateRangeParams } from "@/features/dashboard/services/date-range-filter";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { ReportsView } from "@/components/dashboard/reports-view";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const customRange = parseDateRangeParams({ from, to });
  const { businessId } = await requireBusinessOwner();

  const [business, hasOrdersReport, productsData, menuAnalyticsData, cashRegisterData] = await Promise.all([
    getBusiness(businessId),
    businessHasFeature(businessId, "report.orders"),
    getProductsReport(businessId),
    getMenuAnalyticsReport(businessId),
    getCashRegisterReport(businessId),
  ]);
  if (!business) return null;

  const ordersData = hasOrdersReport ? await getOrdersReport(businessId) : null;

  const [ordersCustom, productsCustom, cashRegisterCustom, menuAnalyticsCustom] = customRange
    ? await Promise.all([
        hasOrdersReport ? getOrdersReportCustom(businessId, customRange) : null,
        getProductsReportCustom(businessId, customRange),
        getCashRegisterReportCustom(businessId, customRange),
        getMenuAnalyticsReportCustom(businessId, customRange),
      ])
    : [null, null, null, null];

  return (
    <>
      <Topbar title="گزارش‌ها" businessName={business.name} />
      <PanelContent>
        <ReportsView
          ordersData={ordersData}
          productsData={productsData}
          menuAnalyticsData={menuAnalyticsData}
          cashRegisterData={cashRegisterData}
          customRange={customRange}
          ordersCustom={ordersCustom}
          productsCustom={productsCustom}
          cashRegisterCustom={cashRegisterCustom}
          menuAnalyticsCustom={menuAnalyticsCustom}
        />
      </PanelContent>
    </>
  );
}
