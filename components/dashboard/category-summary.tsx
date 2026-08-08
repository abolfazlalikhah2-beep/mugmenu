import { ChevronDown } from "lucide-react";
import { formatToman } from "@/features/menu/utils/money";
import type { TopProduct } from "@/features/dashboard/services/stats-service";

export function CategorySummary({
  totalSales,
  topProducts,
}: {
  totalSales: number;
  topProducts: TopProduct[];
}) {
  return (
    <div className="flex h-full flex-col gap-4.5 rounded-[22px] bg-card p-6 shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">خلاصه فروش دسته</span>
        <div className="flex h-[34px] items-center gap-1.5 rounded-[11px] border border-[#E7E7E7] px-3.5 text-[13px] text-[#777]">
          همه
          <ChevronDown size={16} className="text-[#9A9A9A]" />
        </div>
      </div>
      <div className="text-right">
        <div className="mb-1.5 text-[13px] font-light text-text-3">کل فروش دسته</div>
        <div className="text-[26px] font-bold">
          {formatToman(totalSales)}
          <span className="mr-1.5 text-[13px] font-light text-text-3">تومان</span>
        </div>
      </div>
      <div className="h-px bg-[#F0F0F0]" />
      {topProducts.length === 0 ? (
        <div className="text-sm text-text-3">هنوز فروشی ثبت نشده است.</div>
      ) : (
        <>
          <div className="text-right text-[13px] font-medium text-[#777]">پرفروش‌ترین‌ها</div>
          <div className="flex flex-col gap-3.5">
            {topProducts.map((f) => (
              <div key={f.name} className="flex items-center gap-3">
                <div className="h-[46px] w-[46px] shrink-0 rounded-[13px] bg-[#F2F2F2]" />
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-sm font-medium">{f.name}</div>
                  <span className="mt-1 inline-block rounded-lg border-[0.3px] border-[#CECECE] bg-[#F6F6F6] px-2 text-[10px] text-[#777]">
                    {f.category}
                  </span>
                </div>
                <div className="shrink-0 text-left">
                  <div className="text-[13px] font-semibold text-brand">{formatToman(f.revenue)} ت</div>
                  <div className="mt-0.5 text-[11px] font-light text-text-3">
                    {formatToman(f.quantity)} سفارش
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
