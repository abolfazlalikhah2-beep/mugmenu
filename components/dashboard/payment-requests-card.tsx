import { Receipt } from "lucide-react";
import type { BusinessPaymentRequestRow } from "@/features/payments/services/payment-service";

const STATUS_META: Record<BusinessPaymentRequestRow["status"], { label: string; fg: string; bg: string }> = {
  PENDING: { label: "در انتظار بررسی", fg: "#B7791F", bg: "#FCF3E3" },
  VERIFIED: { label: "تایید شده", fg: "#328C3D", bg: "#E5F0E6" },
  REJECTED: { label: "رد شده", fg: "#C15656", bg: "#FBECEC" },
};

export function PaymentRequestsCard({ requests }: { requests: BusinessPaymentRequestRow[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F5F4]">
          <Receipt size={20} className="text-[#9A9A9A]" />
        </div>
        <div className="text-right">
          <div className="text-[15px] font-semibold">درخواست‌های پرداخت</div>
          <div className="text-xs font-light text-text-3">سابقه پرداخت‌های کارت‌به‌کارت شما</div>
        </div>
      </div>
      {requests.length === 0 ? (
        <p className="p-2 text-center text-xs font-light leading-7 text-text-3">
          هنوز درخواست پرداختی ثبت نکرده‌اید.
        </p>
      ) : (
        <div className="flex flex-col">
          {requests.map((r, i) => {
            const meta = STATUS_META[r.status];
            return (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 py-3"
                style={{ borderTop: i > 0 ? "1px solid #F4F4F4" : "none" }}
              >
                <div className="text-right">
                  <div className="text-sm font-medium">{r.amount.toLocaleString("fa-IR")} تومان</div>
                  <div className="mt-0.5 text-[11px] font-light text-text-3">
                    {r.createdAt.toLocaleDateString("fa-IR")} · {r.cardLabel}
                  </div>
                </div>
                <span
                  className="whitespace-nowrap rounded-[9px] px-2.5 py-[5px] text-[11px] font-medium"
                  style={{ color: meta.fg, background: meta.bg }}
                >
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
