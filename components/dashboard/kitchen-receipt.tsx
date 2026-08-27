"use client";

import { useEffect } from "react";
import { formatToman } from "@/features/menu/utils/money";

export interface KitchenReceiptData {
  id: string;
  orderNumber: number;
  createdAt: Date;
  type: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  customerName: string;
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
  business: { name: string; address: string | null; phone: string | null; logoUrl: string | null };
}

function saleMethodLabel(type: KitchenReceiptData["type"]) {
  if (type === "DINE_IN") return "روی میز";
  if (type === "TAKEAWAY") return "بیرون‌بر";
  return "ارسال با پیک";
}

function DashedLine() {
  return <div style={{ borderTop: "1px dashed #BBB", margin: "10px 0" }} />;
}

function SolidLine() {
  return <div style={{ borderTop: "1px solid #999", margin: "10px 0" }} />;
}

/** Right/left label-value pair — relies on the ancestor's dir="rtl" so the first child renders on the physical right. */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ fontSize: 11 }}>
      <span style={{ color: "#555" }}>{label}: </span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </span>
  );
}

function InfoRow({ right, left }: { right: string | { label: string; value: string }; left: { label: string; value: string } }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
      {typeof right === "string" ? <span style={{ fontSize: 11 }}>{right}</span> : <InfoField {...right} />}
      <InfoField {...left} />
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4 }}>
      <span style={{ color: "#555" }}>{label}</span>
      <span style={{ fontFamily: "Montserrat, sans-serif" }}>{value}</span>
    </div>
  );
}

/** 80mm print layout for the sales invoice — auto-triggers the browser print dialog on mount (see app/print/orders/[orderId]/page.tsx). */
export function KitchenReceipt({ order }: { order: KitchenReceiptData }) {
  useEffect(() => {
    const id = setTimeout(() => window.print(), 200);
    return () => clearTimeout(id);
  }, []);

  const itemCount = order.items.reduce((s, l) => s + l.quantity, 0);
  const issuedAt = `${order.createdAt.toLocaleDateString("fa-IR")} - ${order.createdAt.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;

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
        {/* 1. Header */}
        <div style={{ textAlign: "center" }}>
          {order.business.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- print view: raw <img>, no Next image pipeline
            <img
              src={order.business.logoUrl}
              alt=""
              style={{ maxWidth: 90, maxHeight: 90, objectFit: "contain", margin: "0 auto 8px" }}
            />
          )}
          <div style={{ fontSize: 16, fontWeight: 700 }}>{order.business.name}</div>
          {order.business.address && <div style={{ fontSize: 10.5, color: "#555", marginTop: 4 }}>{order.business.address}</div>}
          {order.business.phone && (
            <div style={{ fontSize: 10.5, color: "#555", marginTop: 2, fontFamily: "Montserrat, sans-serif" }}>
              {order.business.phone}
            </div>
          )}
        </div>
        <DashedLine />

        {/* 2. Order info */}
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700 }}>فاکتور فروش</div>
        <SolidLine />
        <InfoRow
          right={{ label: "کاربر", value: order.customerName }}
          left={{ label: "شماره فاکتور", value: order.orderNumber.toLocaleString("fa-IR") }}
        />
        <InfoRow right={{ label: "کد اقتصادی", value: "—" }} left={{ label: "شیوه فروش", value: saleMethodLabel(order.type) }} />
        <div style={{ marginTop: 5, fontSize: 11 }}>
          <span style={{ color: "#555" }}>زمان صدور: </span>
          <span style={{ fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>{issuedAt}</span>
        </div>
        {order.type === "DELIVERY" && order.address && (
          <div style={{ marginTop: 5, fontSize: 11 }}>
            <span style={{ color: "#555" }}>آدرس مشتری: </span>
            <span style={{ fontWeight: 600 }}>{order.address}</span>
          </div>
        )}
        <DashedLine />

        {/* 3. Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
          <thead>
            <tr style={{ color: "#555", fontWeight: 600 }}>
              <th style={{ textAlign: "right", fontWeight: 600, paddingBottom: 6, width: 18 }}>#</th>
              <th style={{ textAlign: "right", fontWeight: 600, paddingBottom: 6 }}>نام کالا</th>
              <th style={{ textAlign: "center", fontWeight: 600, paddingBottom: 6, width: 28 }}>مقدار</th>
              <th style={{ textAlign: "left", fontWeight: 600, paddingBottom: 6, width: 56 }}>قیمت</th>
              <th style={{ textAlign: "left", fontWeight: 600, paddingBottom: 6, width: 62 }}>بهای ردیف</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((line, i) => (
              <tr key={line.id} style={{ verticalAlign: "top" }}>
                <td style={{ paddingTop: 6 }}>{(i + 1).toLocaleString("fa-IR")}</td>
                <td style={{ paddingTop: 6, paddingInlineEnd: 4 }}>
                  <div style={{ fontWeight: 600 }}>{line.product.name}</div>
                  {line.options.map((o, oi) => (
                    <div key={oi} style={{ fontSize: 9.5, color: "#666", marginTop: 1 }}>
                      — {o.groupName}: {o.optionName}
                    </div>
                  ))}
                  {line.note && <div style={{ fontSize: 9.5, color: "#666", marginTop: 1 }}>★ {line.note}</div>}
                </td>
                <td style={{ paddingTop: 6, textAlign: "center" }}>{line.quantity.toLocaleString("fa-IR")}</td>
                <td style={{ paddingTop: 6, textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>{formatToman(line.unitPrice)}</td>
                <td style={{ paddingTop: 6, textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>
                  {formatToman(line.unitPrice * line.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DashedLine />

        {/* 4. Totals */}
        <TotalRow label="جمع اقلام کالا" value={itemCount.toLocaleString("fa-IR")} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, gap: 10 }}>
          <div style={{ flex: 1 }}>
            <TotalRow label="تخفیف کالا" value="0" />
            <TotalRow label="تخفیف فاکتور" value={formatToman(order.discountAmount ?? 0)} />
            <TotalRow label="مالیات و عوارض" value={formatToman(order.taxAmount ?? 0)} />
          </div>
          <div style={{ flex: 1 }}>
            <TotalRow label="هزینه سرویس" value={formatToman(order.serviceFeeAmount ?? 0)} />
            <TotalRow label="هزینه بسته‌بندی" value={formatToman(order.packagingFeeAmount ?? 0)} />
            <TotalRow label="هزینه ارسال" value="0" />
          </div>
        </div>
        <SolidLine />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>قابل پرداخت (تومان)</span>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "Montserrat, sans-serif" }}>
            {formatToman(order.totalPrice)}
          </span>
        </div>

        {/* 5. Footer */}
        <div style={{ textAlign: "center", fontSize: 10.5, color: "#555", lineHeight: 1.9, marginTop: 14 }}>
          از انتخاب شما سپاسگزاریم
        </div>
      </div>
    </>
  );
}
