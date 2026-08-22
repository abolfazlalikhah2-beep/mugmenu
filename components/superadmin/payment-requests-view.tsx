"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PaymentRequestRow } from "@/components/superadmin/payment-request-row";
import { PaymentRequestModal } from "@/components/superadmin/payment-request-modal";
import type { PaymentRequestRow as PaymentRequestRowData } from "@/features/payments/services/payment-service";

interface PlanOption {
  id: string;
  name: string;
}

const FILTERS: { label: string; status?: "PENDING" | "VERIFIED" | "REJECTED" }[] = [
  { label: "همه" },
  { label: "در انتظار", status: "PENDING" },
  { label: "تایید شده", status: "VERIFIED" },
  { label: "رد شده", status: "REJECTED" },
];

export function PaymentRequestsView({
  requests,
  plans,
  status,
}: {
  requests: PaymentRequestRowData[];
  plans: PlanOption[];
  status?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const opened = requests.find((r) => r.id === openId) ?? null;

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap gap-2.5">
        {FILTERS.map((f) => {
          const active = f.status === status || (!f.status && !status);
          const href = `/superadmin/payment-requests${f.status ? `?status=${f.status}` : ""}`;
          return (
            <Link
              key={f.label}
              href={href}
              className={cn(
                "flex h-10 items-center rounded-xl px-5 text-sm",
                active
                  ? "bg-brand font-medium text-white"
                  : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[22px] bg-card">
        <div className="hidden items-center gap-3 p-[14px_20px] text-xs font-light text-text-3 sm:grid" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr" }}>
          <span>کسب‌وکار</span>
          <span>مبلغ</span>
          <span>کارت مقصد</span>
          <span>تاریخ</span>
          <span className="text-left">وضعیت</span>
        </div>
        {requests.length === 0 && <div className="p-6 text-center text-sm text-text-3">درخواستی یافت نشد.</div>}
        {requests.map((r, i) => (
          <PaymentRequestRow key={r.id} request={r} index={i} onClick={() => setOpenId(r.id)} />
        ))}
      </div>

      {opened && <PaymentRequestModal request={opened} plans={plans} onClose={() => setOpenId(null)} />}
    </div>
  );
}
