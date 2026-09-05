import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopMenuItemRow } from "@/features/dashboard/services/menu-analytics-aggregation";

export function MenuTopItemsTable({ items }: { items: TopMenuItemRow[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-card p-[20px_18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[24px_26px]">
      <div>
        <div className="text-[15px] font-semibold sm:text-base">پرطرفدارترین آیتم‌ها</div>
        <div className="mt-0.5 text-xs font-light text-text-3">بیشترین بازدید صفحه آیتم در ۳۰ روز اخیر</div>
      </div>
      {items.length === 0 ? (
        <div className="p-6 text-center text-sm text-text-3">در این بازه بازدیدی از صفحه آیتم‌ها ثبت نشده است.</div>
      ) : (
        <div className="flex flex-col">
          {items.map((it, i) => (
            <div key={it.name} className={cn("flex items-center gap-3 py-3", i > 0 && "border-t border-[#F4F4F4]")}>
              <span className="font-mont w-4 shrink-0 text-xs font-semibold text-[#B7B7B7]">
                {(i + 1).toLocaleString("fa-IR")}
              </span>
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-[#F2F2F2]">
                {it.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- Liara's proxy 400s /_next/image
                  <img src={it.imageUrl} alt={it.name} className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{it.name}</span>
              <div className="flex shrink-0 items-center gap-1 text-xs text-text-3" title="بازدید">
                <Eye size={13} />
                <span className="font-mont">{it.views.toLocaleString("fa-IR")}</span>
              </div>
              <span className="font-mont w-10 shrink-0 text-left text-xs text-text-3" title="سفارش">
                {it.orders.toLocaleString("fa-IR")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
