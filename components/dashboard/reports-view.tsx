"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrdersReportView } from "@/components/dashboard/orders-report-view";
import { ProductsReportView } from "@/components/dashboard/products-report-view";
import { MenuAnalyticsView } from "@/components/dashboard/menu-analytics-view";
import { downloadCsv } from "@/features/dashboard/utils/csv-export";
import type { ReportRange } from "@/features/dashboard/services/report-aggregation";
import type { OrdersReport, ProductsReport } from "@/features/dashboard/services/report-service";
import type { MenuAnalyticsReport } from "@/features/dashboard/services/menu-analytics-service";

const TABS = ["گزارش سفارشات", "گزارش محصولات", "آمار بازدید منو"] as const;

const RANGE_FILE_LABEL: Record<ReportRange, string> = {
  daily: "روزانه",
  weekly: "هفتگی",
  monthly: "ماهانه",
};

export function ReportsView({
  ordersData,
  productsData,
  menuAnalyticsData,
}: {
  ordersData: OrdersReport;
  productsData: ProductsReport;
  menuAnalyticsData: MenuAnalyticsReport;
}) {
  const [tab, setTab] = useState<0 | 1 | 2>(0);
  const [ordersRange, setOrdersRange] = useState<ReportRange>("weekly");
  const [productsRange, setProductsRange] = useState<ReportRange>("monthly");

  function handleExport() {
    if (tab === 0) {
      const { chart } = ordersData[ordersRange];
      downloadCsv(
        `گزارش-سفارشات-${RANGE_FILE_LABEL[ordersRange]}.csv`,
        ["بازه", "تعداد سفارش", "مبلغ فروش (تومان)"],
        chart.map((b) => [b.label, b.count, b.revenue])
      );
    } else if (tab === 1) {
      const rows = productsData[productsRange];
      downloadCsv(
        `گزارش-محصولات-${RANGE_FILE_LABEL[productsRange]}.csv`,
        ["رتبه", "نام محصول", "دسته‌بندی", "تعداد فروش"],
        rows.map((p, i) => [i + 1, p.name, p.category, p.sold])
      );
    } else {
      downloadCsv(
        "آمار-بازدید-منو.csv",
        ["روز", "تعداد بازدید"],
        menuAnalyticsData.trend14d.map((p) => [p.label, p.count])
      );
    }
  }

  return (
    <div className="flex h-full flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-2xl bg-[#EDEFED] p-1 sm:gap-2.5 sm:bg-transparent sm:p-0">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(i as 0 | 1 | 2)}
              className={cn(
                "flex h-10 flex-1 items-center justify-center rounded-xl px-5 text-sm sm:flex-none",
                tab === i ? "bg-card font-medium text-brand sm:bg-[#EAF3EB]" : "font-normal text-[#8A8A8A]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex h-11 items-center gap-2 rounded-[13px] border border-[#DDD] bg-card px-5 text-sm font-medium text-brand"
        >
          <Download size={18} />
          خروجی اکسل
        </button>
      </div>

      {tab === 0 ? (
        <OrdersReportView data={ordersData} range={ordersRange} onRangeChange={setOrdersRange} />
      ) : tab === 1 ? (
        <ProductsReportView data={productsData} range={productsRange} onRangeChange={setProductsRange} />
      ) : (
        <MenuAnalyticsView data={menuAnalyticsData} />
      )}
    </div>
  );
}
