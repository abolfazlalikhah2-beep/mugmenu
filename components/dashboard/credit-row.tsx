import type { CreditRecordRow } from "@/features/credits/services/credit-service";
import type { CreditStatus } from "@/lib/generated/prisma/enums";

const STATUS_META: Record<CreditStatus, { label: string; fg: string; bg: string }> = {
  UNPAID: { label: "تسویه‌نشده", fg: "#C15656", bg: "#FBECEC" },
  PARTIAL: { label: "تسویه جزئی", fg: "#B7791F", bg: "#FCF3E3" },
  PAID: { label: "تسویه‌شده", fg: "#328C3D", bg: "#E5F0E6" },
};

const CREDIT_ROW_COLUMNS = "1.4fr 1fr 1fr 1fr 1fr 1fr";

export function CreditStatusBadge({ status }: { status: CreditStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex shrink-0 items-center whitespace-nowrap rounded-[9px] px-3 py-[5px] text-xs font-medium"
      style={{ color: meta.fg, background: meta.bg }}
    >
      {meta.label}
    </span>
  );
}

export function CreditRowHeader() {
  return (
    <div
      className="hidden items-center gap-3 p-[14px_20px] text-xs font-light text-text-3 sm:grid"
      style={{ gridTemplateColumns: CREDIT_ROW_COLUMNS }}
    >
      <span>مشتری</span>
      <span>تاریخ سفارش</span>
      <span>مبلغ</span>
      <span>پرداخت‌شده</span>
      <span>مانده</span>
      <span className="text-left">وضعیت</span>
    </div>
  );
}

export function CreditRow({
  record,
  index,
  onClick,
}: {
  record: CreditRecordRow;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full items-center gap-3 p-[16px_20px] text-right text-sm hover:bg-[#FAFBFA]"
      style={{ gridTemplateColumns: CREDIT_ROW_COLUMNS, borderTop: index > 0 ? "1px solid #F4F4F4" : "none" }}
    >
      <div className="min-w-0 text-right">
        <div className="truncate font-medium">{record.customerName}</div>
        <div dir="ltr" className="mt-0.5 truncate text-right text-[11px] font-light text-text-3">
          {record.customerPhone}
        </div>
      </div>
      <span className="text-[13px] font-light text-text-3">{record.orderDate.toLocaleDateString("fa-IR")}</span>
      <span className="text-[13px] font-light text-[#777]">{record.amount.toLocaleString("fa-IR")} تومان</span>
      <span className="text-[13px] font-light text-[#777]">{record.paidAmount.toLocaleString("fa-IR")} تومان</span>
      <span className="text-[13px] font-semibold text-brand">{record.remaining.toLocaleString("fa-IR")} تومان</span>
      <span className="flex justify-end">
        <CreditStatusBadge status={record.status} />
      </span>
    </button>
  );
}
