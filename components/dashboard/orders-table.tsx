import type { ReactNode } from "react";
import Link from "next/link";
import { OrderStatusBadge, type OrderStatusValue } from "@/components/dashboard/order-status-badge";
import { formatToman } from "@/features/menu/utils/money";

export interface OrderRow {
  id: string;
  customerName: string;
  totalPrice: number;
  status: OrderStatusValue;
  createdAt: Date;
  items: { quantity: number; product: { name: string } }[];
}

const COLUMNS = "1.2fr 1.6fr 2fr 1.3fr 1.4fr 1fr";

function itemsSummary(items: OrderRow["items"]) {
  return items.map((i) => `${i.quantity.toLocaleString("fa-IR")}× ${i.product.name}`).join("، ");
}

function timeLabel(d: Date) {
  return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

function shortCode(id: string) {
  return `#${id.slice(-5).toUpperCase()}`;
}

export function OrdersTable({ orders, header }: { orders: OrderRow[]; header: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-[22px] bg-card p-[22px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      {header}
      <div className="grid gap-2 p-[6px_8px] text-sm font-light text-[#A0A0A0]" style={{ gridTemplateColumns: COLUMNS }}>
        {["کد", "مشتری", "آیتم‌ها", "مبلغ", "وضعیت", "زمان"].map((h) => (
          <span key={h} className="text-right">
            {h}
          </span>
        ))}
      </div>
      {orders.length === 0 && <div className="p-6 text-center text-sm text-text-3">سفارشی ثبت نشده است.</div>}
      {orders.map((o) => (
        <Link
          key={o.id}
          href={`/dashboard/orders/${o.id}`}
          className="grid items-center gap-2 border-t border-[#F4F4F4] p-[14px_8px] text-sm hover:bg-[#FAFBFA]"
          style={{ gridTemplateColumns: COLUMNS }}
        >
          <span dir="ltr" className="text-right font-mono text-[13px] text-[#666]">
            {shortCode(o.id)}
          </span>
          <span className="text-right font-medium">{o.customerName}</span>
          <span className="truncate text-right font-light text-[#777]">{itemsSummary(o.items)}</span>
          <span className="text-right font-semibold text-brand">{formatToman(o.totalPrice)} ت</span>
          <span className="text-right">
            <OrderStatusBadge status={o.status} />
          </span>
          <span className="text-right text-[13px] font-light text-[#9A9A9A]">{timeLabel(o.createdAt)}</span>
        </Link>
      ))}
    </div>
  );
}
