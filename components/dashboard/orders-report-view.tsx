import { Receipt, Wallet, TrendingUp } from "lucide-react";
import { OrdersReportChart } from "@/components/dashboard/orders-report-chart";
import { ReportSummaryCard } from "@/components/dashboard/report-summary-card";
import { formatToman } from "@/features/menu/utils/money";
import { RANGE_DELTA_LABEL, type ReportRange } from "@/features/dashboard/services/report-aggregation";
import type { OrdersReport } from "@/features/dashboard/services/report-service";

export function OrdersReportView({
  data,
  range,
  onRangeChange,
}: {
  data: OrdersReport;
  range: ReportRange;
  onRangeChange: (range: ReportRange) => void;
}) {
  const { chart, summary } = data[range];

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <OrdersReportChart buckets={chart} range={range} onRangeChange={onRangeChange} />
      <div className="flex flex-col gap-3.5 sm:flex-row sm:gap-[22px]">
        <ReportSummaryCard
          icon={<Receipt size={20} className="text-brand" />}
          label="تعداد کل سفارش"
          value={summary.count.toLocaleString("fa-IR")}
          unit="سفارش"
          deltaPercent={summary.countDelta.deltaPercent}
          up={summary.countDelta.up}
          compareLabel={RANGE_DELTA_LABEL[range]}
        />
        <ReportSummaryCard
          icon={<Wallet size={20} className="text-brand" />}
          label="مبلغ کل فروش"
          value={formatToman(summary.revenue)}
          unit="تومان"
          deltaPercent={summary.revenueDelta.deltaPercent}
          up={summary.revenueDelta.up}
          compareLabel={RANGE_DELTA_LABEL[range]}
        />
        <ReportSummaryCard
          icon={<TrendingUp size={20} className="text-brand" />}
          label="میانگین هر سفارش"
          value={formatToman(summary.avgOrder)}
          unit="تومان"
          deltaPercent={summary.avgOrderDelta.deltaPercent}
          up={summary.avgOrderDelta.up}
          compareLabel={RANGE_DELTA_LABEL[range]}
        />
      </div>
    </div>
  );
}
