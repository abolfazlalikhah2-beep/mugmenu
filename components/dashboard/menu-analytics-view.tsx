import { Eye, TrendingUp } from "lucide-react";
import { ReportSummaryCard } from "@/components/dashboard/report-summary-card";
import { MenuVisitTrendChart } from "@/components/dashboard/menu-visit-trend-chart";
import { MenuVisitSourcesCard } from "@/components/dashboard/menu-visit-sources-card";
import { MenuVisitHourlyCard } from "@/components/dashboard/menu-visit-hourly-card";
import { MenuTopItemsTable } from "@/components/dashboard/menu-top-items-table";
import { MenuWeeklyVisitsCard } from "@/components/dashboard/menu-weekly-visits-card";
import type { MenuAnalyticsReport } from "@/features/dashboard/services/menu-analytics-service";

export function MenuAnalyticsView({ data }: { data: MenuAnalyticsReport }) {
  const { summary } = data;

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:gap-[18px]">
        <ReportSummaryCard
          icon={<Eye size={20} className="text-brand" />}
          label="بازدید امروز"
          value={summary.today.count.toLocaleString("fa-IR")}
          unit="بازدید"
          deltaPercent={summary.today.delta.deltaPercent}
          up={summary.today.delta.up}
          compareLabel="نسبت به دیروز"
        />
        <ReportSummaryCard
          icon={<Eye size={20} className="text-brand" />}
          label="بازدید هفته"
          value={summary.week.count.toLocaleString("fa-IR")}
          unit="بازدید"
          deltaPercent={summary.week.delta.deltaPercent}
          up={summary.week.delta.up}
          compareLabel="نسبت به هفته قبل"
        />
        <ReportSummaryCard
          icon={<Eye size={20} className="text-brand" />}
          label="بازدید ماه"
          value={summary.month.count.toLocaleString("fa-IR")}
          unit="بازدید"
          deltaPercent={summary.month.delta.deltaPercent}
          up={summary.month.delta.up}
          compareLabel="نسبت به ماه قبل"
        />
        <ReportSummaryCard
          icon={<TrendingUp size={20} className="text-brand" />}
          label="میانگین روزانه"
          value={summary.dailyAvg.count.toLocaleString("fa-IR")}
          unit="بازدید"
          deltaPercent={summary.dailyAvg.delta.deltaPercent}
          up={summary.dailyAvg.delta.up}
          compareLabel="نسبت به ماه قبل"
        />
      </div>

      <div className="grid grid-cols-1 gap-[16px] sm:gap-[22px] lg:grid-cols-[1.6fr_1fr]">
        <MenuVisitTrendChart points={data.trend14d} />
        <div className="flex flex-col gap-[16px] sm:gap-[22px]">
          <MenuVisitSourcesCard sources={data.sources} />
          <MenuVisitHourlyCard hourly={data.hourly} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[16px] sm:gap-[22px] lg:grid-cols-2">
        <MenuTopItemsTable items={data.topItems} />
        <MenuWeeklyVisitsCard weekly={data.weekly} />
      </div>
    </div>
  );
}
