import { formatToman } from "@/features/menu/utils/money";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export interface OrderBillBreakdown {
  subtotal: number;
  packagingFeeAmount: number;
  serviceFeeAmount: number;
  taxAmount: number;
  discountAmount: number;
  discountName?: string | null;
  walletRedeemedAmount: number;
  total: number;
}

function Row({
  label,
  value,
  strong,
  green,
}: {
  label: string;
  value: string;
  strong?: boolean;
  green?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${strong ? "text-[15.5px]" : "text-[13.5px]"}`}>
      <span className={strong ? "font-semibold text-ink" : "font-normal text-[#7A7A7A]"}>{label}</span>
      <span
        className={`font-mont ${strong ? "text-lg font-bold" : "font-medium"} ${green ? "text-brand" : strong ? "text-ink" : "text-[#333]"}`}
      >
        {value}
      </span>
    </div>
  );
}

/** Subtotal → fees → discount → wallet redemption → total. Shared by the cart preview, admin order detail, and the public receipt. */
export function OrderBillSummary({
  breakdown,
  lang = "fa",
  totalLabel,
}: {
  breakdown: OrderBillBreakdown;
  lang?: MenuLang;
  /** Defaults to "amount payable"; the receipt passes "amount paid" instead. */
  totalLabel?: string;
}) {
  const t = menuCopy(lang);
  const fmt = (n: number) => `${formatToman(n, lang)} ${t.toman}`;

  return (
    <div className="flex flex-col gap-2.5">
      <Row label={t.subtotal} value={fmt(breakdown.subtotal)} />
      {breakdown.packagingFeeAmount > 0 && <Row label={t.packagingFeeLabel} value={fmt(breakdown.packagingFeeAmount)} />}
      {breakdown.serviceFeeAmount > 0 && <Row label={t.serviceFeeLabel} value={fmt(breakdown.serviceFeeAmount)} />}
      {breakdown.taxAmount > 0 && <Row label={t.taxLabel} value={fmt(breakdown.taxAmount)} />}
      {breakdown.discountAmount > 0 && (
        <Row label={breakdown.discountName ?? t.discountLineLabel} value={`−${fmt(breakdown.discountAmount)}`} green />
      )}
      {breakdown.walletRedeemedAmount > 0 && (
        <Row label={t.walletRedeemedLabel} value={`−${fmt(breakdown.walletRedeemedAmount)}`} green />
      )}
      <div className="h-px bg-[#F0F0F0]" />
      <Row label={totalLabel ?? t.amountDue} value={fmt(breakdown.total)} strong />
    </div>
  );
}
