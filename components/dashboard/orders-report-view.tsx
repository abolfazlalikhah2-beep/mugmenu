import { Receipt, Wallet, TrendingUp } from "lucide-react";
import { OrdersReportChart } from "@/components/dashboard/orders-report-chart";
import { ReportSummaryCard } from "@/components/dashboard/report-summary-card";
import { formatToman } from "@/features/menu/utils/money";
import { RANGE_DELTA_LABEL, type ReportRange } from "@/features/dashboard/services/report-aggregation";
import type { OrdersReport, CustomOrdersReport } from "@/features/dashboard/services/report-service";

export function OrdersReportView({
  data,
  range,
  onRangeChange,
  customData,
  isCustomActive,
}: {
  data: OrdersReport;
  range: ReportRange;
  onRangeChange: (range: ReportRange) => void;
  customData: CustomOrdersReport | null;
  isCustomActive: boolean;
}) {
  const usingCustom = isCustomActive && customData !== null;
  const chart = usingCustom ? customData.chart : data[range].chart;
  const summary = usingCustom ? customData.summary : data[range].summary;
  const fullSummary = usingCustom ? null : data[range].summary;

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <OrdersReportChart buckets={chart} range={range} onRangeChange={onRangeChange} disabled={isCustomActive} />
      <div className="flex flex-col gap-3.5 sm:flex-row sm:gap-[22px]">
        <ReportSummaryCard
          icon={<Receipt size={20} className="text-brand" />}
          label="تعداد کل سفارش"
          value={summary.count.toLocaleString("fa-IR")}
          unit="سفارش"
          deltaPercent={fullSummary?.countDelta.deltaPercent}
          up={fullSummary?.countDelta.up}
          compareLabel={fullSummary ? RANGE_DELTA_LABEL[range] : undefined}
        />
        <ReportSummaryCard
          icon={<Wallet size={20} className="text-brand" />}
          label="مبلغ کل فروش"
          value={formatToman(summary.revenue)}
          unit="تومان"
          deltaPercent={fullSummary?.revenueDelta.deltaPercent}
          up={fullSummary?.revenueDelta.up}
          compareLabel={fullSummary ? RANGE_DELTA_LABEL[range] : undefined}
        />
        <ReportSummaryCard
          icon={<TrendingUp size={20} className="text-brand" />}
          label="میانگین هر سفارش"
          value={formatToman(summary.avgOrder)}
          unit="تومان"
          deltaPercent={fullSummary?.avgOrderDelta.deltaPercent}
          up={fullSummary?.avgOrderDelta.up}
          compareLabel={fullSummary ? RANGE_DELTA_LABEL[range] : undefined}
        />
      </div>
    </div>
  );
}
