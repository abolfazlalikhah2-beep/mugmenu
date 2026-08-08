import { RangeSwitch } from "@/components/dashboard/range-switch";
import { ProductReportRow } from "@/components/dashboard/product-report-row";
import type { ReportRange } from "@/features/dashboard/services/report-aggregation";
import type { ProductsReport } from "@/features/dashboard/services/report-service";

export function ProductsReportView({
  data,
  range,
  onRangeChange,
}: {
  data: ProductsReport;
  range: ReportRange;
  onRangeChange: (range: ReportRange) => void;
}) {
  const rows = data[range];
  const maxSold = rows[0]?.sold ?? 1;

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-right">
          <div className="text-[15px] font-semibold sm:text-base">پرفروش‌ترین محصولات</div>
          <div className="mt-0.5 text-xs font-light text-text-3">بر اساس تعداد فروش در بازه انتخابی</div>
        </div>
        <RangeSwitch value={range} onChange={onRangeChange} />
      </div>

      <div className="rounded-[22px] bg-card p-[8px_16px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[12px_20px]">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-3">در این بازه فروشی ثبت نشده است.</div>
        ) : (
          rows.map((p, i) => <ProductReportRow key={p.name} product={p} rank={i} maxSold={maxSold} />)
        )}
      </div>
    </div>
  );
}
