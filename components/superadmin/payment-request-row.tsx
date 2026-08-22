import type { PaymentRequestStatus } from "@/lib/generated/prisma/enums";
import type { PaymentRequestRow as PaymentRequestRowData } from "@/features/payments/services/payment-service";

const STATUS_META: Record<PaymentRequestStatus, { label: string; fg: string; bg: string }> = {
  PENDING: { label: "در انتظار بررسی", fg: "#B7791F", bg: "#FCF3E3" },
  VERIFIED: { label: "تایید شده", fg: "#328C3D", bg: "#E5F0E6" },
  REJECTED: { label: "رد شده", fg: "#C15656", bg: "#FBECEC" },
};

export function PaymentRequestStatusBadge({ status }: { status: PaymentRequestStatus }) {
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

export function PaymentRequestRow({
  request,
  index,
  onClick,
}: {
  request: PaymentRequestRowData;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full items-center gap-3 p-[16px_20px] text-right text-sm hover:bg-[#FAFBFA]"
      style={{
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr",
        borderTop: index > 0 ? "1px solid #F4F4F4" : "none",
      }}
    >
      <span className="truncate font-medium">{request.storeName}</span>
      <span className="text-[13px] font-light text-[#777]">{request.amount.toLocaleString("fa-IR")} تومان</span>
      <span dir="ltr" className="text-right text-[13px] font-light text-text-3">
        {request.cardLabel}
      </span>
      <span className="text-xs font-light text-text-3">{request.createdAt.toLocaleDateString("fa-IR")}</span>
      <span className="flex justify-end">
        <PaymentRequestStatusBadge status={request.status} />
      </span>
    </button>
  );
}
