import { Receipt, HandCoins, Banknote, CreditCard, UtensilsCrossed, ShoppingBag, Bike } from "lucide-react";
import { RangeSwitch } from "@/components/dashboard/range-switch";
import { CashStatCard } from "@/components/dashboard/cash-stat-card";
import { ProductReportRow } from "@/components/dashboard/product-report-row";
import { formatToman } from "@/features/menu/utils/money";
import type { ReportRange, PaymentMethod, OrderTypeValue } from "@/features/dashboard/services/report-aggregation";
import type { CashRegisterReport, CustomCashRegisterReport } from "@/features/dashboard/services/report-service";

const PAYMENT_LABEL: Record<PaymentMethod, { label: string; icon: typeof Banknote }> = {
  CASH: { label: "نقدی", icon: Banknote },
  CARD: { label: "کارتخوان", icon: CreditCard },
  CREDIT: { label: "نسیه", icon: HandCoins },
};

const ORDER_TYPE_LABEL: Record<OrderTypeValue, { label: string; icon: typeof UtensilsCrossed }> = {
  DINE_IN: { label: "روی میز", icon: UtensilsCrossed },
  TAKEAWAY: { label: "بیرون‌بر", icon: ShoppingBag },
  DELIVERY: { label: "ارسال", icon: Bike },
};

const PAYMENT_METHODS = Object.keys(PAYMENT_LABEL) as PaymentMethod[];
const ORDER_TYPES = Object.keys(ORDER_TYPE_LABEL) as OrderTypeValue[];

export function CashRegisterView({
  data,
  range,
  onRangeChange,
  customData,
  isCustomActive,
}: {
  data: CashRegisterReport;
  range: ReportRange;
  onRangeChange: (range: ReportRange) => void;
  customData: CustomCashRegisterReport | null;
  isCustomActive: boolean;
}) {
  const summary = isCustomActive && customData ? customData : data[range];
  const maxSold = summary.topProducts[0]?.sold ?? 1;

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-right">
          <div className="text-[15px] font-semibold sm:text-base">گزارش صندوق</div>
          <div className="mt-0.5 text-xs font-light text-text-3">فروش و روش‌های پرداخت در بازه انتخابی</div>
        </div>
        <RangeSwitch value={range} onChange={onRangeChange} disabled={isCustomActive} />
      </div>

      <div className="flex flex-col gap-3.5 sm:flex-row sm:gap-[22px]">
        <CashStatCard
          icon={<Receipt size={20} className="text-brand" />}
          label="کل فروش"
          value={formatToman(summary.totalSales.amount)}
          unit="تومان"
          note={`${summary.totalSales.count.toLocaleString("fa-IR")} سفارش`}
        />
        <CashStatCard
          icon={<HandCoins size={20} className="text-brand" />}
          label="مانده نسیه"
          value={formatToman(summary.creditOutstanding)}
          unit="تومان"
          note="مجموع نسیه‌های تسویه‌نشده"
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-[22px]">
        {PAYMENT_METHODS.map((method) => {
          const meta = PAYMENT_LABEL[method];
          const row = summary.byPaymentMethod[method];
          return (
            <CashStatCard
              key={method}
              icon={<meta.icon size={20} className="text-brand" />}
              label={meta.label}
              value={formatToman(row.amount)}
              unit="تومان"
              note={`${row.count.toLocaleString("fa-IR")} سفارش`}
            />
          );
        })}
      </div>

      <div className="rounded-[22px] bg-card p-[20px_22px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="mb-3 text-right text-[15px] font-semibold sm:text-base">تعداد سفارش به تفکیک نوع</div>
        <div className="grid grid-cols-3 gap-3">
          {ORDER_TYPES.map((type) => {
            const meta = ORDER_TYPE_LABEL[type];
            return (
              <div
                key={type}
                className="flex flex-col items-center gap-2 rounded-2xl border border-[#F0F0F0] p-[14px_10px]"
              >
                <meta.icon size={20} className="text-brand" />
                <span className="text-lg font-bold">{summary.byOrderType[type].toLocaleString("fa-IR")}</span>
                <span className="text-xs font-light text-text-3">{meta.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-2.5 text-right text-[15px] font-semibold sm:text-base">۵ محصول پرفروش</div>
        <div className="rounded-[22px] bg-card p-[8px_16px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[12px_20px]">
          {summary.topProducts.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-3">در این بازه فروشی ثبت نشده است.</div>
          ) : (
            summary.topProducts.map((p, i) => (
              <ProductReportRow key={p.name} product={p} rank={i} maxSold={maxSold} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
