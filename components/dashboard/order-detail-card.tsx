"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Phone, Printer } from "lucide-react";
import { OrderStatusBadge, type OrderStatusValue } from "@/components/dashboard/order-status-badge";
import { CourierAssignControl, type AssignableCourier } from "@/components/dashboard/courier-assign-control";
import { formatToman } from "@/features/menu/utils/money";
import { nextStatus, canCancel, statusLabel, progressSteps } from "@/features/dashboard/services/order-status-flow";
import { updateOrderStatusAction } from "@/features/dashboard/routes/actions";

export interface OrderDetail {
  id: string;
  orderNumber: number;
  type: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  status: OrderStatusValue;
  customerName: string;
  customerPhone: string;
  tableNumber: string | null;
  address: string | null;
  estimatedTime: string | null;
  totalPrice: number;
  createdAt: Date;
  // Nullable bill breakdown snapshot — null on orders placed before this
  // breakdown existed (see Order's schema comment). null means "fall back
  // to the plain جمع اقلام/مبلغ کل block", not "zero fee was charged".
  subtotal: number | null;
  packagingFeeAmount: number | null;
  serviceFeeAmount: number | null;
  taxAmount: number | null;
  discountAmount: number | null;
  discountName: string | null;
  walletRedeemedAmount: number | null;
  courier: { id: string; name: string } | null;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    note: string | null;
    options: { groupName: string; optionName: string; extraPrice: number }[];
    product: { name: string };
  }[];
}

function typeContext(order: OrderDetail) {
  if (order.type === "DINE_IN") return `روی میز ${order.tableNumber ?? "—"}`;
  if (order.type === "TAKEAWAY") return `بیرون‌بر · تحویل ${order.estimatedTime ?? "—"}`;
  return `ارسال با پیک · ${order.address ?? "—"}`;
}

export function OrderDetailCard({ order, couriers = [] }: { order: OrderDetail; couriers?: AssignableCourier[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const upcoming = nextStatus(order.status);
  const sub = order.items.reduce((acc, l) => acc + l.quantity * l.unitPrice, 0);
  const steps = progressSteps(order.status);

  function handleAdvance() {
    if (!upcoming) return;
    startTransition(async () => {
      await updateOrderStatusAction(order.id, upcoming);
      router.refresh();
    });
  }

  function handleCancel() {
    startTransition(async () => {
      await updateOrderStatusAction(order.id, "CANCELED");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-5 rounded-card bg-card p-6 shadow-modal md:p-8">
      <div className="flex items-start justify-between gap-3 border-b border-[#F0F0F0] pb-4">
        <div className="text-right">
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-semibold">سفارش</span>
            <span dir="ltr" className="font-mont text-base text-[#666]">
              #{order.orderNumber.toLocaleString("fa-IR")}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="mt-1.5 text-[13px] font-light text-text-3">
            {typeContext(order)} · {order.createdAt.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        <Link
          href={`/print/orders/${order.id}`}
          target="_blank"
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#EAEAEA] px-3.5 text-[13px] text-[#5F5F5F]"
        >
          <Printer size={16} />
          چاپ رسید
        </Link>
      </div>

      <div className="flex items-center gap-3.5 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#E5F0E6]">
          <User size={22} className="text-brand" />
        </div>
        <div className="flex-1 text-right">
          <div className="text-[15px] font-medium">{order.customerName}</div>
          <div dir="ltr" className="mt-0.5 text-right text-xs font-light text-text-3">
            {order.customerPhone}
          </div>
        </div>
        <a
          href={`tel:${order.customerPhone}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7E7E7] bg-card"
        >
          <Phone size={18} className="text-brand" />
        </a>
      </div>

      {order.type === "DELIVERY" && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <span className="text-sm font-medium text-[#555]">پیک تحویل</span>
          <CourierAssignControl orderId={order.id} currentCourier={order.courier} couriers={couriers} />
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        <div className="mb-2 text-right text-sm font-medium text-[#555]">اقلام سفارش</div>
        {order.items.map((line, i) => (
          <div
            key={line.id}
            className={"flex items-center justify-between py-3" + (i ? " border-t border-[#F4F4F4]" : "")}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-[#EAF3EB] text-[13px] font-semibold text-brand">
                {line.quantity.toLocaleString("fa-IR")}
              </span>
              <div>
                <span className="text-[15px]">{line.product.name}</span>
                {line.options.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {line.options.map((o, oi) => (
                      <span
                        key={oi}
                        className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-[#F6F6F6] px-2 py-1 text-[11px] text-text-2"
                      >
                        <span className="text-text-3">{o.groupName}:</span>
                        <span className="font-medium text-[#3A3A3A]">{o.optionName}</span>
                        {o.extraPrice > 0 && (
                          <span className="font-mont text-[10px] text-brand">+{formatToman(o.extraPrice)}</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
                {line.note && (
                  <div className="mt-1 w-fit rounded-lg bg-[#FDF7E6] px-2 py-1 text-[11px] text-[#9F7A2B]">
                    ★ {line.note}
                  </div>
                )}
              </div>
            </div>
            <span className="text-sm font-semibold text-brand">{formatToman(line.quantity * line.unitPrice)} ت</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[16px_18px]">
        {order.serviceFeeAmount !== null ? (
          <>
            <div className="flex justify-between">
              <span className="text-[13px] font-light text-[#777]">جمع اقلام</span>
              <span className="text-sm">{formatToman(order.subtotal ?? sub)} تومان</span>
            </div>
            {!!order.packagingFeeAmount && (
              <div className="flex justify-between">
                <span className="text-[13px] font-light text-[#777]">بسته‌بندی</span>
                <span className="text-sm">{formatToman(order.packagingFeeAmount)} تومان</span>
              </div>
            )}
            {!!order.serviceFeeAmount && (
              <div className="flex justify-between">
                <span className="text-[13px] font-light text-[#777]">حق سرویس</span>
                <span className="text-sm">{formatToman(order.serviceFeeAmount)} تومان</span>
              </div>
            )}
            {!!order.taxAmount && (
              <div className="flex justify-between">
                <span className="text-[13px] font-light text-[#777]">مالیات</span>
                <span className="text-sm">{formatToman(order.taxAmount)} تومان</span>
              </div>
            )}
            {!!order.discountAmount && (
              <div className="flex justify-between">
                <span className="text-[13px] font-light text-[#777]">{order.discountName ?? "تخفیف"}</span>
                <span className="text-sm text-brand">−{formatToman(order.discountAmount)} تومان</span>
              </div>
            )}
            {!!order.walletRedeemedAmount && (
              <div className="flex justify-between">
                <span className="text-[13px] font-light text-[#777]">استفاده از کیف‌پول</span>
                <span className="text-sm text-brand">−{formatToman(order.walletRedeemedAmount)} تومان</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-between">
            <span className="text-[13px] font-light text-[#777]">جمع اقلام</span>
            <span className="text-sm">{formatToman(sub)} تومان</span>
          </div>
        )}
        <div className="h-px bg-[#EEE]" />
        <div className="flex justify-between">
          <span className="text-[15px] font-semibold text-brand">مبلغ کل</span>
          <span className="text-base font-semibold">{formatToman(order.totalPrice)} تومان</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-right text-sm font-medium text-[#555]">روند سفارش</div>
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div key={s.status} className="flex items-center gap-3 py-2">
              <div className="flex flex-col items-center">
                <div
                  className={"h-3.5 w-3.5 rounded-full " + (s.reached ? "bg-brand" : "bg-[#E3E3E3]")}
                  style={
                    s.status === order.status
                      ? { boxShadow: "0 0 0 3px #CDE6D0" }
                      : undefined
                  }
                />
                {i < steps.length - 1 && (
                  <div className={"h-[22px] w-0.5 " + (s.reached ? "bg-brand" : "bg-[#E9E9E9]")} />
                )}
              </div>
              <span className={"text-sm " + (s.reached ? "font-medium text-ink" : "text-[#B0B0B0]")}>{s.label}</span>
            </div>
          ))}
          {order.status === "CANCELED" && (
            <div className="flex items-center gap-3 py-2">
              <div className="h-3.5 w-3.5 rounded-full bg-[#C15656]" />
              <span className="text-sm font-medium text-[#C15656]">{statusLabel("CANCELED")}</span>
            </div>
          )}
        </div>
      </div>

      {order.status !== "CANCELED" && order.status !== "DELIVERED" && (
        <div className="flex gap-3 border-t border-[#F0F0F0] pt-4">
          {upcoming && (
            <button
              type="button"
              disabled={pending}
              onClick={handleAdvance}
              className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-[15px] font-medium text-white disabled:opacity-60"
            >
              تغییر وضعیت به «{statusLabel(upcoming)}»
            </button>
          )}
          {canCancel(order.status) && (
            <button
              type="button"
              disabled={pending}
              onClick={handleCancel}
              className="flex h-[50px] w-[110px] items-center justify-center rounded-2xl border border-[#F0C9CB] bg-[#FBECEC] text-[15px] text-[#D06666] disabled:opacity-60"
            >
              لغو سفارش
            </button>
          )}
        </div>
      )}
    </div>
  );
}
