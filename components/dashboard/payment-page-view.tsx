"use client";

import { useActionState, useState } from "react";
import { Copy, Check, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createPaymentRequestAction, type ActionState } from "@/features/payments/routes/actions";
import type { PlanPricing } from "@/features/payments/services/payment-service";

const initialState: ActionState = {};

function CopyField({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-right text-[13px] font-light text-text-4">{label}</span>
      <div className="flex h-[50px] items-center gap-2 rounded-input border border-border-input ps-[18px] pe-2">
        <span dir={ltr ? "ltr" : undefined} className="min-w-0 flex-1 truncate text-right text-sm">
          {value}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-chip"
          aria-label={`کپی ${label}`}
        >
          {copied ? <Check size={16} className="text-brand" /> : <Copy size={16} className="text-[#5A5A5A]" />}
        </button>
      </div>
    </div>
  );
}

export function PaymentPageView({
  pricing,
  card,
}: {
  pricing: PlanPricing;
  card: { id: string; bankName: string; cardNumber: string; accountNumber: string; holderName: string } | null;
}) {
  const [state, formAction, pending] = useActionState(createPaymentRequestAction, initialState);

  if (state.ok) {
    return (
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-4 rounded-card bg-card p-[40px_28px] text-center shadow-modal">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3EB]">
          <Check size={26} className="text-brand" />
        </div>
        <div className="text-lg font-semibold">درخواست پرداخت شما ثبت شد</div>
        <p className="text-sm font-light leading-8 text-text-3">
          درخواست پرداخت شما ثبت شد. پس از تایید توسط تیم پشتیبانی، اشتراک شما فعال خواهد شد.
        </p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="mx-auto max-w-[560px] rounded-card bg-card p-[32px_28px] text-center text-sm text-text-3 shadow-modal">
        در حال حاضر کارتی برای دریافت پرداخت فعال نیست. لطفاً با پشتیبانی تماس بگیرید.
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-5 rounded-card bg-card p-[28px_26px] shadow-modal sm:p-[36px]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3EB]">
          <CreditCard size={22} className="text-brand" />
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">پرداخت کارت به کارت</div>
          <div className="mt-0.5 text-[13px] font-light text-text-3">
            {pricing.planName} · {pricing.billingCycle === "ANNUAL" ? "سالانه" : "ماهانه"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-[#FAFBFA] p-[16px_18px]">
        <span className="text-[13px] font-light text-text-3">مبلغ قابل پرداخت</span>
        <span className="text-xl font-bold text-brand">{pricing.amount.toLocaleString("fa-IR")} تومان</span>
      </div>

      <CopyField label="نام صاحب حساب" value={card.holderName} />
      <CopyField label="بانک" value={card.bankName} />
      <CopyField label="شماره کارت" value={card.cardNumber} ltr />
      <CopyField label="شماره حساب" value={card.accountNumber} ltr />

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="amount" value={pricing.amount} />
        <input type="hidden" name="assignedCardId" value={card.id} />
        <Input
          name="referenceNumber"
          label="شماره پیگیری تراکنش"
          dir="ltr"
          className="text-right"
          placeholder="پس از واریز وارد کنید"
          required
        />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="flex h-[50px] items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
        >
          {pending ? "در حال ثبت…" : "ثبت درخواست پرداخت"}
        </button>
      </form>
    </div>
  );
}
