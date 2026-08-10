import Link from "next/link";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { OrderStatusTimeline } from "@/components/customer-account/order-status-timeline";
import { ReorderButton } from "@/components/customer-account/reorder-button";
import { MenuImage } from "@/components/menu/menu-image";
import { formatToman } from "@/features/menu/utils/money";
import type { CustomerOrderDetail } from "@/features/customer/services/order-history-service";

const TYPE_LABEL: Record<string, string> = {
  DINE_IN: "روی میز",
  TAKEAWAY: "بیرون‌بر",
  DELIVERY: "ارسال با پیک",
};

function dateTimeLabel(d: Date) {
  return d.toLocaleString("fa-IR", { dateStyle: "long", timeStyle: "short" });
}

function SummaryLine({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-[15px] font-semibold" : "text-[13px] font-light text-[#777]"}>{label}</span>
      <span className={bold ? "text-base font-semibold text-brand" : "text-[13.5px] text-text-1"}>{value}</span>
    </div>
  );
}

export function OrderDetailView({ slug, order }: { slug: string; order: CustomerOrderDetail }) {
  const modeLabel = order.type === "DINE_IN" && order.tableNumber ? `روی میز ${order.tableNumber}` : TYPE_LABEL[order.type];
  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="flex flex-col gap-3 p-4.5">
      <div className="flex items-center justify-between rounded-card-sm bg-card p-4.5 shadow-float">
        <div>
          <div className="text-[15px] font-semibold">سفارش #{order.id.slice(-8)}</div>
          <div className="mt-1 text-xs font-light text-text-3">
            {dateTimeLabel(order.createdAt)} · {modeLabel}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-card-sm bg-card p-4.5 shadow-float">
        <div className="mb-3.5 text-sm font-semibold">وضعیت سفارش</div>
        <OrderStatusTimeline
          status={order.status}
          createdAtLabel={dateTimeLabel(order.createdAt)}
          updatedAtLabel={dateTimeLabel(order.updatedAt)}
        />
      </div>

      <div className="rounded-card-sm bg-card p-4.5 shadow-float">
        <div className="mb-3 text-sm font-semibold">اقلام سفارش</div>
        {order.items.map((i, idx) => (
          <div key={i.id} className={`flex items-center gap-3 py-3 ${idx ? "border-t border-[#F4F4F4]" : ""}`}>
            <MenuImage imageUrl={i.imageUrl} alt={i.name} className="h-11 w-11 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{i.name}</div>
              <div className="mt-0.5 text-[11.5px] font-light text-text-3">تعداد: {i.quantity.toLocaleString("fa-IR")}</div>
            </div>
            <span className="text-[13.5px] font-semibold">{formatToman(i.unitPrice * i.quantity)} ت</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 rounded-card-sm bg-card p-4.5 shadow-float">
        <SummaryLine label="جمع اقلام" value={`${formatToman(subtotal)} تومان`} />
        <SummaryLine label="مالیات و بسته‌بندی" value={`${formatToman(order.packagingFee)} تومان`} />
        <div className="h-px bg-[#F0F0F0]" />
        <SummaryLine label="مبلغ پرداخت‌شده" value={`${formatToman(order.totalPrice)} تومان`} bold />
        {order.cashbackEarned > 0 && (
          <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-3">
            <span className="text-[12.5px] font-light text-text-1">کش‌بک این سفارش</span>
            <span className="text-[13px] font-semibold text-brand">+ {formatToman(order.cashbackEarned)} تومان</span>
          </div>
        )}
      </div>

      <div className="flex gap-2.5">
        <ReorderButton
          slug={slug}
          items={order.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.unitPrice,
            imageUrl: i.imageUrl,
            quantity: i.quantity,
          }))}
        />
        <Link
          href={`/${slug}/receipt/${order.id}`}
          className="flex h-[50px] w-[130px] items-center justify-center rounded-btn border border-border-input bg-card text-[15px] text-text-1"
        >
          دریافت فاکتور
        </Link>
      </div>
    </div>
  );
}
