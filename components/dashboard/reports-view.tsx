"use client";

import { useState } from "react";
import { Download, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrdersReportView } from "@/components/dashboard/orders-report-view";
import { ProductsReportView } from "@/components/dashboard/products-report-view";
import { MenuAnalyticsView } from "@/components/dashboard/menu-analytics-view";
import { CashRegisterView } from "@/components/dashboard/cash-register-view";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import { downloadCsv } from "@/features/dashboard/utils/csv-export";
import type { ReportRange } from "@/features/dashboard/services/report-aggregation";
import type { OrdersReport, ProductsReport, CashRegisterReport } from "@/features/dashboard/services/report-service";
import type { MenuAnalyticsReport } from "@/features/dashboard/services/menu-analytics-service";

const TABS = ["گزارش سفارشات", "گزارش محصولات", "آمار بازدید منو", "گزارش صندوق"] as const;

const RANGE_FILE_LABEL: Record<ReportRange, string> = {
  daily: "روزانه",
  weekly: "هفتگی",
  monthly: "ماهانه",
};

export function ReportsView({
  ordersData,
  productsData,
  menuAnalyticsData,
  cashRegisterData,
}: {
  ordersData: OrdersReport | null;
  productsData: ProductsReport;
  menuAnalyticsData: MenuAnalyticsReport;
  cashRegisterData: CashRegisterReport;
}) {
  const [tab, setTab] = useState<0 | 1 | 2 | 3>(0);
  const [ordersRange, setOrdersRange] = useState<ReportRange>("weekly");
  const [productsRange, setProductsRange] = useState<ReportRange>("monthly");
  const [cashRegisterRange, setCashRegisterRange] = useState<ReportRange>("weekly");
  const exportAllowed = tab !== 0 || ordersData !== null;

  function handleExport() {
    if (!exportAllowed) return;
    if (tab === 0 && ordersData) {
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
    } else if (tab === 3) {
      const summary = cashRegisterData[cashRegisterRange];
      downloadCsv(
        `گزارش-صندوق-${RANGE_FILE_LABEL[cashRegisterRange]}.csv`,
        ["روش پرداخت", "تعداد سفارش", "مبلغ (تومان)"],
        (["CASH", "CARD", "CREDIT"] as const).map((m) => [
          m === "CASH" ? "نقدی" : m === "CARD" ? "کارتخوان" : "نسیه",
          summary.byPaymentMethod[m].count,
          summary.byPaymentMethod[m].amount,
        ])
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
              onClick={() => setTab(i as 0 | 1 | 2 | 3)}
              className={cn(
                "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl px-5 text-sm sm:flex-none",
                tab === i ? "bg-card font-medium text-brand sm:bg-[#EAF3EB]" : "font-normal text-[#8A8A8A]"
              )}
            >
              {t}
              {i === 0 && ordersData === null && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-[#9A9A9A]">
                  <Lock size={9} />
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={!exportAllowed}
          className="flex h-11 items-center gap-2 rounded-[13px] border border-[#DDD] bg-card px-5 text-sm font-medium text-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={18} />
          خروجی اکسل
        </button>
      </div>

      {tab === 0 ? (
        <UpgradeGate allowed={ordersData !== null} title="گزارش سفارشات در پلن شما موجود نیست">
          {ordersData && <OrdersReportView data={ordersData} range={ordersRange} onRangeChange={setOrdersRange} />}
        </UpgradeGate>
      ) : tab === 1 ? (
        <ProductsReportView data={productsData} range={productsRange} onRangeChange={setProductsRange} />
      ) : tab === 2 ? (
        <MenuAnalyticsView data={menuAnalyticsData} />
      ) : (
        <CashRegisterView data={cashRegisterData} range={cashRegisterRange} onRangeChange={setCashRegisterRange} />
      )}
    </div>
  );
}
