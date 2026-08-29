"use client";

import { useEffect, useMemo } from "react";
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

/** Random 5-digit number (10000-99999) shown as the invoice number on the print — deliberately not order.orderNumber (see task requirements). */
function randomInvoiceNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

const PERSIAN_TO_LATIN_DIGITS: Record<string, string> = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

/** Forces any Persian/Arabic-Indic digits in a raw text field (e.g. a stored phone number) to Latin — every number on this receipt must print as 0-9. */
function toLatinDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (d) => PERSIAN_TO_LATIN_DIGITS[d] ?? d);
}

const border = "1.5px solid #000";

function Section({ children }: { children: React.ReactNode }) {
  return <div style={{ border, borderTop: "none", padding: "2px 6px" }}>{children}</div>;
}

function InfoRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: strong ? 12 : 10, marginTop: 0 }}>
      <span style={{ color: strong ? "#000" : "#333", fontWeight: strong ? 700 : 400 }}>{label}:</span>
      <span style={{ fontWeight: strong ? 800 : 700 }}>{value}</span>
    </div>
  );
}

function TotalRow({ label, value, big, strong }: { label: string; value: string; big?: boolean; strong?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: big ? 13 : strong ? 11 : 10,
        fontWeight: big ? 800 : strong ? 700 : 400,
        marginTop: big || strong ? 1 : 0,
      }}
    >
      <span style={{ color: big || strong ? "#000" : "#333" }}>{label}</span>
      <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: big || strong ? 800 : 700 }}>{value}</span>
    </div>
  );
}

/**
 * Bordered POS invoice layout for an 80mm thermal roll. Most 80mm thermal
 * printers only address ~72mm of the 80mm paper (the rest is a fixed
 * unprintable strip baked into the hardware, not a CSS margin) — declaring
 * `@page` wider than that addressable width is what was clipping content on
 * one side regardless of how the div's own padding was tuned. So `@page` and
 * the content div both use the real printable width (72mm), and the 2mm
 * left/right padding + 5mm top/bottom padding are carved out of that same
 * 72mm via box-sizing:border-box, landing content at exactly the printable
 * width with no bleed and no wasted space. Printed silently on mount; direct
 * dialog-free printing is a browser/OS setting
 * (Chrome `--kiosk-printing`), not something a web page can force —
 * window.print() is the closest a page can get; see
 * app/print/orders/[orderId]/page.tsx for the trigger flow.
 */
export function KitchenReceipt({ order }: { order: KitchenReceiptData }) {
  const invoiceNumber = useMemo(() => randomInvoiceNumber(), []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.print();
    });
    const closeAfterPrint = () => window.close();
    window.addEventListener("afterprint", closeAfterPrint);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("afterprint", closeAfterPrint);
    };
  }, []);

  const itemCount = order.items.reduce((s, l) => s + l.quantity, 0);
  const issuedAt = `${order.createdAt.toLocaleDateString("fa-IR-u-nu-latn")} - ${order.createdAt.toLocaleTimeString("fa-IR-u-nu-latn", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <>
      <style>{`
        @page { size: 72mm auto; margin: 0; }
        @media print {
          html, body { background: #fff !important; }
        }
        .receipt-table { width: 100%; border-collapse: collapse; font-size: 9.5px; }
        .receipt-table th, .receipt-table td { border: 1px solid #000; padding: 1px 2px; }
        .receipt-table thead th { background: #EFEFEF; font-weight: 700; font-size: 9.5px; }
      `}</style>
      <div
        style={{
          width: "72mm",
          boxSizing: "border-box",
          margin: "0 auto",
          padding: "5mm 2mm",
          fontFamily: "'Vazirmatn', sans-serif",
          color: "#000",
          direction: "rtl",
          background: "#fff",
        }}
      >
        {/* 1. Logo + business header */}
        <div style={{ border, textAlign: "center", padding: "3px 6px" }}>
          {order.business.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- print view: raw <img>, no Next image pipeline
            <img
              src={order.business.logoUrl}
              alt=""
              style={{ maxWidth: 46, maxHeight: 46, objectFit: "contain", margin: "0 auto 1px" }}
            />
          )}
          <div style={{ fontSize: 15, fontWeight: 800 }}>{order.business.name}</div>
          {order.business.address && (
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#222", marginTop: 1 }}>{order.business.address}</div>
          )}
          {order.business.phone && (
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#222", marginTop: 0, fontFamily: "Montserrat, sans-serif" }}>
              {toLatinDigits(order.business.phone)}
            </div>
          )}
        </div>

        {/* 2. Order info */}
        <Section>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, marginBottom: 1 }}>فاکتور فروش</div>
          <InfoRow label="شماره فاکتور" value={String(invoiceNumber)} strong />
          <InfoRow label="نام مشتری" value={order.customerName} strong />
          <InfoRow label="شیوه فروش" value={saleMethodLabel(order.type)} strong />
          {order.type === "DINE_IN" && order.tableNumber && <InfoRow label="شماره میز" value={order.tableNumber} />}
          <InfoRow label="زمان صدور" value={issuedAt} strong />
          {order.type === "DELIVERY" && order.address && <InfoRow label="آدرس مشتری" value={order.address} />}
        </Section>

        {/* 3. Items table */}
        <div style={{ border, borderTop: "none" }}>
          <table className="receipt-table">
            <thead>
              <tr>
                <th style={{ width: 20 }}>ردیف</th>
                <th style={{ textAlign: "right" }}>نام کالا</th>
                <th style={{ width: 28 }}>تعداد</th>
                <th style={{ width: 46 }}>قیمت</th>
                <th style={{ width: 50 }}>جمع</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((line, i) => (
                <tr key={line.id} style={{ verticalAlign: "top" }}>
                  <td style={{ textAlign: "center" }}>{i + 1}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>{line.product.name}</div>
                    {line.options.map((o, oi) => (
                      <div key={oi} style={{ fontSize: 8, color: "#444", marginTop: 0 }}>
                        — {o.groupName}: {o.optionName}
                      </div>
                    ))}
                    {line.note && <div style={{ fontSize: 8, color: "#444", marginTop: 0 }}>★ {line.note}</div>}
                  </td>
                  <td style={{ textAlign: "center" }}>{line.quantity}</td>
                  <td style={{ textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>{formatToman(line.unitPrice, "en")}</td>
                  <td style={{ textAlign: "left", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                    {formatToman(line.unitPrice * line.quantity, "en")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Totals */}
        <Section>
          <TotalRow label="جمع اقلام کالا" value={String(itemCount)} strong />
          <TotalRow label="تخفیف فاکتور" value={formatToman(order.discountAmount ?? 0, "en")} strong />
          <TotalRow label="مالیات و عوارض" value={formatToman(order.taxAmount ?? 0, "en")} strong />
          <TotalRow label="هزینه سرویس" value={formatToman(order.serviceFeeAmount ?? 0, "en")} strong />
          <TotalRow label="هزینه بسته‌بندی" value={formatToman(order.packagingFeeAmount ?? 0, "en")} strong />
          <div style={{ borderTop: "1.5px solid #000", marginTop: 1, paddingTop: 1 }}>
            <TotalRow label="قابل پرداخت (تومان)" value={formatToman(order.totalPrice, "en")} big />
          </div>
        </Section>

        {/* 5. Payment / footer */}
        <div style={{ border, borderTop: "none", textAlign: "center", padding: "4px 8px 4px", fontSize: 10, fontWeight: 700 }}>
          از خرید شما سپاسگزاریم
        </div>

        {/* 6. Credit line */}
        <div dir="ltr" style={{ marginTop: "5mm", textAlign: "center", fontSize: 10, color: "#000", fontWeight: 700 }}>
          Powered by <span style={{ fontWeight: 800 }}>serwapp.com</span>
        </div>
      </div>
    </>
  );
}
