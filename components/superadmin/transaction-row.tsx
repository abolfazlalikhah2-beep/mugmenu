import { Calendar } from "lucide-react";
import type { TransactionStatus } from "@/lib/generated/prisma/enums";
import type { FinanceTransactionRow } from "@/features/superadmin/services/finance-service";

const STATUS_META: Record<TransactionStatus, { label: string; fg: string; bg: string }> = {
  PAID: { label: "موفق", fg: "#328C3D", bg: "#E5F0E6" },
  PENDING: { label: "در انتظار", fg: "#B7791F", bg: "#FCF3E3" },
  FAILED: { label: "ناموفق", fg: "#C15656", bg: "#FBECEC" },
  REFUNDED: { label: "بازگشت وجه", fg: "#8A8A8A", bg: "#F0F0F0" },
};

export function PayStatusBadge({ status }: { status: TransactionStatus }) {
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

function dateLabel(d: Date) {
  return d.toLocaleDateString("fa-IR", { day: "2-digit", month: "long" }) +
    " · " +
    d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

export function TransactionRow({ tx, index }: { tx: FinanceTransactionRow; index: number }) {
  return (
    <div
      className="grid items-center gap-3 py-3.5 text-sm sm:px-3.5 sm:py-4"
      style={{
        gridTemplateColumns: "1.6fr 1.1fr 1fr 1fr auto",
        borderTop: index > 0 ? "1px solid #F4F4F4" : "none",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F5F4] text-[13px] font-semibold text-[#7A7A7A]">
          {tx.payerName.slice(0, 1)}
        </div>
        <div className="min-w-0 text-right">
          <div className="truncate font-medium">{tx.payerName}</div>
          <div className="mt-0.5 truncate text-[11px] font-light text-text-3">{tx.storeName}</div>
        </div>
      </div>
      <span className="font-medium">{tx.amount.toLocaleString("fa-IR")} تومان</span>
      <div className="flex items-center gap-1.5 text-text-3">
        <Calendar size={15} className="text-[#9A9A9A]" />
        <span className="text-xs font-light">{dateLabel(tx.createdAt)}</span>
      </div>
      <span className="text-xs font-light text-[#777]">{tx.planName}</span>
      <div className="flex justify-end">
        <PayStatusBadge status={tx.status} />
      </div>
    </div>
  );
}
