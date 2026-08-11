import Link from "next/link";
import { Receipt } from "lucide-react";
import { OrderStatusBadge, type OrderStatusValue } from "@/components/dashboard/order-status-badge";
import { formatToman } from "@/features/menu/utils/money";
import { orderTypeLabel, type MenuLang } from "@/features/menu/utils/menu-language";

export interface CustomerOrderRowData {
  id: string;
  itemsSummary: string;
  dateLabel: string;
  type: string;
  tableNumber: string | null;
  totalPrice: number;
  status: OrderStatusValue;
}

export function CustomerOrderRow({
  slug,
  order,
  isFirst,
  lang = "fa",
}: {
  slug: string;
  order: CustomerOrderRowData;
  isFirst: boolean;
  lang?: MenuLang;
}) {
  const modeLabel = orderTypeLabel(lang, order.type as "DINE_IN" | "TAKEAWAY" | "DELIVERY", order.tableNumber);

  return (
    <Link
      href={`/${slug}/account/orders/${order.id}`}
      className={`flex items-center gap-3 py-3.5 ${isFirst ? "" : "border-t border-[#F4F4F4]"}`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-chip">
        <Receipt size={20} className="text-[#5A5A5A]" />
      </div>
      <div className={`min-w-0 flex-1 ${lang === "en" ? "text-left" : "text-right"}`}>
        <div className="truncate text-sm font-medium">{order.itemsSummary}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[11.5px] font-light text-text-3">{order.dateLabel}</span>
          <span className="rounded-lg border-[0.3px] border-border-chip bg-chip px-2 py-0.5 text-[11px] text-text-3">
            {modeLabel}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-left">
        <div className="text-[13.5px] font-semibold">
          {formatToman(order.totalPrice, lang)} {lang === "en" ? "T" : "ت"}
        </div>
        <div className="mt-1.5">
          <OrderStatusBadge status={order.status} lang={lang} />
        </div>
      </div>
    </Link>
  );
}
