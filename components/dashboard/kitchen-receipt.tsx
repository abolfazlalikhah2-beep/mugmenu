"use client";

import { useEffect } from "react";
import { formatToman } from "@/features/menu/utils/money";

export interface KitchenReceiptData {
  id: string;
  createdAt: Date;
  type: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  tableNumber: string | null;
  address: string | null;
  totalPrice: number;
  subtotal: number | null;
  packagingFeeAmount: number | null;
  serviceFeeAmount: number | null;
  taxAmount: number | null;
  discountAmount: number | null;
  discountName: string | null;
  walletRedeemedAmount: number | null;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    note: string | null;
    options: { groupName: string; optionName: string; extraPrice: number }[];
    product: { name: string };
  }[];
  business: { name: string; address: string | null; phone: string | null };
}

function typeContext(order: Pick<KitchenReceiptData, "type" | "tableNumber" | "address">) {
  if (order.type === "DINE_IN") return `میز ${order.tableNumber ?? "—"}`;
  if (order.type === "TAKEAWAY") return "بیرون‌بر";
  return order.address ?? "ارسال با پیک";
}

function Dash() {
  return <div style={{ borderTop: "1px dashed #BBB", margin: "10px 0" }} />;
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: strong ? 13 : 11.5,
        fontWeight: strong ? 700 : 400,
        marginTop: strong ? 6 : 3,
      }}
    >
      <span>{label}</span>
      <span style={{ fontFamily: "Montserrat, sans-serif" }}>{value}</span>
    </div>
  );
}

/** 80mm thermal-ticket layout for the kitchen — auto-triggers the browser print dialog on mount (see app/print/orders/[orderId]/page.tsx). */
export function KitchenReceipt({ order }: { order: KitchenReceiptData }) {
  useEffect(() => {
    const id = setTimeout(() => window.print(), 200);
    return () => clearTimeout(id);
  }, []);

  const sub = order.subtotal ?? order.items.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const date = order.createdAt.toLocaleDateString("fa-IR");
  const time = order.createdAt.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        @page { size: 80mm auto; margin: 0; }
        @media print { body { background: #fff !important; } }
      `}</style>
      <div
        style={{
          width: 302,
          margin: "0 auto",
          padding: "18px 16px",
          fontFamily: "'Vazirmatn', sans-serif",
          color: "#111",
          direction: "rtl",
          background: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{order.business.name}</div>
          {(order.business.address || order.business.phone) && (
            <div style={{ fontSize: 10.5, color: "#555", marginTop: 4 }}>
              {[order.business.address, order.business.phone].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        <Dash />
        <Row label={`سفارش #${order.id.slice(-5).toUpperCase()}`} value={typeContext(order)} />
        <Row label={date} value={time} />
        <Dash />
        {order.items.map((line) => (
          <div key={line.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
              <span>
                {line.quantity.toLocaleString("fa-IR")} × {line.product.name}
              </span>
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>{formatToman(line.unitPrice * line.quantity)}</span>
            </div>
            {line.options.map((o, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10.5,
                  color: "#555",
                  marginTop: 2,
                  paddingRight: 10,
                }}
              >
                <span>
                  — {o.groupName}: {o.optionName}
                </span>
                <span style={{ fontFamily: "Montserrat, sans-serif" }}>{o.extraPrice ? `+${formatToman(o.extraPrice)}` : ""}</span>
              </div>
            ))}
            {line.note && (
              <div style={{ fontSize: 10.5, marginTop: 3, paddingRight: 10, fontWeight: 600 }}>★ {line.note}</div>
            )}
          </div>
        ))}
        <Dash />
        <Row label="جمع اقلام" value={formatToman(sub)} />
        {!!order.packagingFeeAmount && <Row label="بسته‌بندی" value={formatToman(order.packagingFeeAmount)} />}
        {!!order.serviceFeeAmount && <Row label="حق سرویس" value={formatToman(order.serviceFeeAmount)} />}
        {!!order.taxAmount && <Row label="مالیات" value={formatToman(order.taxAmount)} />}
        {!!order.discountAmount && (
          <Row label={order.discountName ?? "تخفیف"} value={`−${formatToman(order.discountAmount)}`} />
        )}
        {!!order.walletRedeemedAmount && (
          <Row label="استفاده از کیف‌پول" value={`−${formatToman(order.walletRedeemedAmount)}`} />
        )}
        <Dash />
        <Row label="قابل پرداخت" value={`${formatToman(order.totalPrice)} تومان`} strong />
        <Dash />
        <div style={{ textAlign: "center", fontSize: 10.5, color: "#555", lineHeight: 1.9 }}>
          از انتخاب شما سپاسگزاریم
        </div>
      </div>
    </>
  );
}
