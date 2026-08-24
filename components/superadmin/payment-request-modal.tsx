"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PaymentRequestStatusBadge } from "@/components/superadmin/payment-request-row";
import { verifyPaymentRequestAction, type ActionState } from "@/features/payments/routes/actions";
import type { PaymentRequestRow } from "@/features/payments/services/payment-service";

interface PlanOption {
  id: string;
  name: string;
}

const initialState: ActionState = {};

export function PaymentRequestModal({
  request,
  plans,
  onClose,
}: {
  request: PaymentRequestRow;
  plans: PlanOption[];
  onClose: () => void;
}) {
  const action = verifyPaymentRequestAction.bind(null, request.id);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [decision, setDecision] = useState<"VERIFIED" | "REJECTED" | null>(null);
  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title="بررسی درخواست پرداخت"
      subtitle={`${request.storeName} · ${request.amount.toLocaleString("fa-IR")} تومان`}
      onClose={onClose}
      maxWidth={560}
      footer={
        <>
          <button
            type="submit"
            form="payment-request-form"
            disabled={pending || !decision}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
          >
            {pending ? "در حال ثبت…" : "ثبت نتیجه بررسی"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[50px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
          >
            انصراف
          </button>
        </>
      }
    >
      <form id="payment-request-form" action={formAction} className="flex flex-col gap-[18px]">
        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right text-[13px] font-light text-text-3">
            کارت مقصد: <span className="font-medium text-ink">{request.cardLabel}</span>
          </div>
          <PaymentRequestStatusBadge status={request.status} />
        </div>

        <Input
          name="referenceNumber"
          label="شماره پیگیری تراکنش"
          dir="ltr"
          className="text-right"
          defaultValue={request.referenceNumber ?? ""}
          placeholder="پس از بررسی صورت‌حساب بانکی وارد کنید"
          required
        />

        {request.screenshotUrl && (
          <div className="flex flex-col gap-2">
            <span className="text-right text-[13px] font-light text-text-4">تصویر رسید پرداخت</span>
            <a
              href={request.screenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block h-[280px] w-full overflow-hidden rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA]"
            >
              <Image
                src={request.screenshotUrl}
                alt="رسید پرداخت"
                fill
                sizes="560px"
                className="object-contain"
              />
            </a>
          </div>
        )}

        <input type="hidden" name="status" value={decision ?? ""} />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDecision("VERIFIED")}
            className={cn(
              "flex h-[46px] flex-1 items-center justify-center rounded-2xl border text-sm font-medium",
              decision === "VERIFIED" ? "border-brand bg-[#F3FAF4] text-brand" : "border-[#E5E5E5] text-[#777]"
            )}
          >
            تایید و فعال‌سازی پلن
          </button>
          <button
            type="button"
            onClick={() => setDecision("REJECTED")}
            className={cn(
              "flex h-[46px] flex-1 items-center justify-center rounded-2xl border text-sm font-medium",
              decision === "REJECTED" ? "border-[#C15656] bg-[#FBECEC] text-[#C15656]" : "border-[#E5E5E5] text-[#777]"
            )}
          >
            رد درخواست
          </button>
        </div>

        {decision === "VERIFIED" && (
          <div className="flex flex-col gap-4 rounded-2xl border border-[#F0F0F0] p-[16px_18px] sm:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-right text-[13px] font-light text-text-4">پلن جدید</label>
              <select
                name="newPlanId"
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="h-[46px] rounded-xl border border-border-input px-3.5 text-right text-sm outline-none focus:border-brand"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-right text-[13px] font-light text-text-4">دوره</label>
              <select
                name="billingCycle"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as "MONTHLY" | "ANNUAL")}
                className="h-[46px] rounded-xl border border-border-input px-3.5 text-right text-sm outline-none focus:border-brand"
              >
                <option value="MONTHLY">ماهانه</option>
                <option value="ANNUAL">سالانه</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">یادداشت (اختیاری)</label>
          <textarea
            name="notes"
            rows={2}
            defaultValue={request.notes ?? ""}
            className="min-h-[70px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-[#555] outline-none focus:border-brand"
          />
        </div>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
