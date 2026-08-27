"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Printer, X } from "lucide-react";
import { OrderStatusBadge, type OrderStatusValue } from "@/components/dashboard/order-status-badge";
import { formatToman } from "@/features/menu/utils/money";
import { bulkUpdateOrderStatusAction } from "@/features/dashboard/routes/actions";
import { cn } from "@/lib/utils";

export interface OrderRow {
  id: string;
  orderNumber: number;
  customerName: string;
  totalPrice: number;
  status: OrderStatusValue;
  createdAt: Date;
  items: { quantity: number; product: { name: string } }[];
}

const COLUMNS = "28px 1.2fr 1.6fr 2fr 1.3fr 1.4fr 1fr 34px";

// Curated set of targets for bulk re-status — mirrors the lifecycle in
// features/dashboard/services/order-status-flow.ts, minus NEW (nothing gets
// bulk-reset back to "just placed").
const BULK_TARGETS: { status: OrderStatusValue; label: string }[] = [
  { status: "PREPARING", label: "در حال آماده‌سازی" },
  { status: "READY", label: "آماده تحویل" },
  { status: "DELIVERED", label: "تحویل شد" },
  { status: "CANCELED", label: "لغو شد" },
];

function itemsSummary(items: OrderRow["items"]) {
  return items.map((i) => `${i.quantity.toLocaleString("fa-IR")}× ${i.product.name}`).join("، ");
}

function timeLabel(d: Date) {
  return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

function shortCode(orderNumber: number) {
  return `#${orderNumber.toLocaleString("fa-IR")}`;
}

function RowCheckbox({
  checked,
  onChange,
  label,
  indeterminate,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  indeterminate?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="h-4 w-4 accent-brand"
    />
  );
}

export function OrdersTable({ orders, header }: { orders: OrderRow[]; header: ReactNode }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  // Selection can only ever reference ids from the currently rendered page —
  // drop stale ones when the list changes (filter/search, or after a bulk
  // action revalidates and some rows disappear from the active tab). Adjusted
  // during render (React's recommended pattern for derived state), not in an
  // effect, to avoid an extra cascading render.
  const [prevOrders, setPrevOrders] = useState(orders);
  if (orders !== prevOrders) {
    setPrevOrders(orders);
    setSelected((prev) => prev.filter((id) => orders.some((o) => o.id === id)));
  }

  const allSelected = orders.length > 0 && selected.length === orders.length;
  const someSelected = selected.length > 0 && !allSelected;

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? orders.map((o) => o.id) : []);
  }

  function applyBulkStatus(status: OrderStatusValue) {
    const ids = selected;
    if (ids.length === 0) return;
    startTransition(async () => {
      await bulkUpdateOrderStatusAction(ids, status);
      setSelected([]);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-[22px] bg-card p-[22px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      {header}
      <div className="grid items-center gap-2 p-[6px_8px] text-sm font-light text-[#A0A0A0]" style={{ gridTemplateColumns: COLUMNS }}>
        <RowCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} label="انتخاب همه سفارشات" />
        {["کد", "مشتری", "آیتم‌ها", "مبلغ", "وضعیت", "زمان"].map((h) => (
          <span key={h} className="text-right">
            {h}
          </span>
        ))}
        <span />
      </div>
      {orders.length === 0 && <div className="p-6 text-center text-sm text-text-3">سفارشی ثبت نشده است.</div>}
      {orders.map((o) => {
        const checked = selected.includes(o.id);
        return (
          <div
            key={o.id}
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/dashboard/orders/${o.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/dashboard/orders/${o.id}`);
            }}
            className={cn(
              "grid cursor-pointer items-center gap-2 border-t border-[#F4F4F4] p-[14px_8px] text-sm hover:bg-[#FAFBFA]",
              checked && "bg-[#F3FAF4]"
            )}
            style={{ gridTemplateColumns: COLUMNS }}
          >
            <RowCheckbox checked={checked} onChange={(c) => toggleOne(o.id, c)} label={`انتخاب سفارش ${shortCode(o.orderNumber)}`} />
            <span dir="ltr" className="text-right font-mono text-[13px] text-[#666]">
              {shortCode(o.orderNumber)}
            </span>
            <span className="text-right font-medium">{o.customerName}</span>
            <span className="truncate text-right font-light text-[#777]">{itemsSummary(o.items)}</span>
            <span className="text-right font-semibold text-brand">{formatToman(o.totalPrice)} ت</span>
            <span className="text-right">
              <OrderStatusBadge status={o.status} />
            </span>
            <span className="text-right text-[13px] font-light text-[#9A9A9A]">{timeLabel(o.createdAt)}</span>
            <Link
              href={`/print/orders/${o.id}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              title="چاپ سریع"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A9A9A] hover:bg-[#F0F0F0] hover:text-brand"
            >
              <Printer size={16} />
            </Link>
          </div>
        );
      })}

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#1E1E1E] p-[10px_16px] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <span className="text-[13px] font-medium text-white">
              {selected.length.toLocaleString("fa-IR")} سفارش انتخاب شد
            </span>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex flex-wrap items-center gap-2">
              {BULK_TARGETS.map((t) => (
                <button
                  key={t.status}
                  type="button"
                  disabled={pending}
                  onClick={() => applyBulkStatus(t.status)}
                  className="flex h-9 items-center rounded-xl bg-white/10 px-3.5 text-[13px] text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => setSelected([])}
              title="لغو انتخاب"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
