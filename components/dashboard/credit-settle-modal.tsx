"use client";

import { useActionState, useEffect } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { CreditStatusBadge } from "@/components/dashboard/credit-row";
import { settleCreditRecordAction, type ActionState } from "@/features/credits/routes/actions";
import type { CreditRecordRow } from "@/features/credits/services/credit-service";

const initialState: ActionState = {};

export function CreditSettleModal({ record, onClose }: { record: CreditRecordRow; onClose: () => void }) {
  const action = settleCreditRecordAction.bind(null, record.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const isSettled = record.status === "PAID";

  return (
    <ModalShell
      title="تسویه نسیه"
      subtitle={`${record.customerName} · ${record.customerPhone}`}
      onClose={onClose}
      maxWidth={480}
      footer={
        !isSettled ? (
          <>
            <button
              type="submit"
              form="credit-settle-form"
              disabled={pending}
              className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
            >
              {pending ? "در حال ثبت…" : "ثبت دریافتی"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-[50px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
            >
              انصراف
            </button>
          </>
        ) : undefined
      }
    >
      <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
        <div className="text-right text-[13px] font-light text-text-3">
          تاریخ سفارش: <span className="font-medium text-ink">{record.orderDate.toLocaleDateString("fa-IR")}</span>
        </div>
        <CreditStatusBadge status={record.status} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl border border-[#F0F0F0] p-3">
          <div className="text-xs font-light text-text-3">مبلغ کل</div>
          <div className="mt-1 text-sm font-semibold">{record.amount.toLocaleString("fa-IR")}</div>
        </div>
        <div className="rounded-2xl border border-[#F0F0F0] p-3">
          <div className="text-xs font-light text-text-3">پرداخت‌شده</div>
          <div className="mt-1 text-sm font-semibold text-brand">{record.paidAmount.toLocaleString("fa-IR")}</div>
        </div>
        <div className="rounded-2xl border border-[#F0F0F0] p-3">
          <div className="text-xs font-light text-text-3">مانده</div>
          <div className="mt-1 text-sm font-semibold text-[#C15656]">{record.remaining.toLocaleString("fa-IR")}</div>
        </div>
      </div>

      {record.notes && (
        <div className="rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[12px_16px] text-right text-xs font-light leading-6 text-text-3">
          {record.notes}
        </div>
      )}

      {isSettled ? (
        <p className="text-center text-sm font-light text-text-3">این نسیه به‌طور کامل تسویه شده است.</p>
      ) : (
        <form id="credit-settle-form" action={formAction} className="flex flex-col gap-[18px]">
          <Input
            name="receivedAmount"
            label="مبلغ دریافتی"
            dir="ltr"
            className="w-full text-right"
            inputMode="numeric"
            placeholder={record.remaining.toLocaleString("fa-IR")}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">یادداشت (اختیاری)</label>
            <textarea
              name="notes"
              rows={2}
              className="min-h-[64px] rounded-input border border-border-input p-[10px_14px] text-right text-[13px] leading-[1.8] text-[#555] outline-none focus:border-brand"
            />
          </div>
          {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        </form>
      )}
    </ModalShell>
  );
}
