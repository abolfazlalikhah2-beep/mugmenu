"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Check, CreditCard, Landmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageUploadField } from "@/components/uploads/image-upload-field";
import { createPaymentRequestAction, type ActionState } from "@/features/payments/routes/actions";
import type { PlanPricing } from "@/features/payments/services/payment-service";

const initialState: ActionState = {};

const CYCLE_LABEL: Record<"SIX_MONTH" | "ANNUAL", string> = {
  SIX_MONTH: "۶ ماهه",
  ANNUAL: "سالانه",
};

/** Groups digits into 4s the way a physical card prints them — e.g. "6037 9975 1234 5678". */
function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.match(/.{1,4}/g)?.join("  ") ?? digits;
}

function BankCard({
  bankName,
  cardNumber,
  holderName,
  accountNumber,
}: {
  bankName: string;
  cardNumber: string;
  holderName: string;
  accountNumber: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div
        dir="ltr"
        className="relative flex aspect-[1.6/1] w-full flex-col justify-between overflow-hidden rounded-card-sm bg-[#0F7A3B] p-[20px_22px] text-white shadow-modal sm:p-[24px_26px]"
      >
        <Image
          src="/brand/green-gradient.png"
          alt=""
          fill
          sizes="(min-width: 640px) 400px, 90vw"
          className="pointer-events-none object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-wide">{bankName}</span>
          <Landmark size={22} className="opacity-85" />
        </div>

        <div className="relative text-center text-[19px] font-semibold tracking-[0.18em] sm:text-[22px]">
          {formatCardNumber(cardNumber)}
        </div>

        <div className="relative flex items-end justify-between">
          <div>
            <div className="text-[9px] font-light uppercase tracking-wider opacity-70">Card Holder</div>
            <div className="text-[13px] font-medium">{holderName}</div>
          </div>
          <span className="text-[11px] font-light opacity-70">پرداخت کارت به کارت</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-input bg-chip p-[12px_16px]">
        <span className="text-[13px] font-light text-text-3">شماره حساب</span>
        <span dir="ltr" className="text-[13px] font-medium text-ink">
          {accountNumber}
        </span>
      </div>
    </div>
  );
}

export function PaymentPageView({
  options,
  defaultBillingCycle,
  card,
}: {
  /** Exactly two entries: [SIX_MONTH pricing, ANNUAL pricing] for the business's own current plan. */
  options: [PlanPricing, PlanPricing];
  defaultBillingCycle: "SIX_MONTH" | "ANNUAL";
  card: { id: string; bankName: string; cardNumber: string; accountNumber: string; holderName: string } | null;
}) {
  const [state, formAction, pending] = useActionState(createPaymentRequestAction, initialState);
  const [billingCycle, setBillingCycle] = useState<"SIX_MONTH" | "ANNUAL">(defaultBillingCycle);
  const pricing = options.find((o) => o.billingCycle === billingCycle) ?? options[0];

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
          <div className="mt-0.5 text-[13px] font-light text-text-3">{pricing.planName}</div>
        </div>
      </div>

      <div className="flex rounded-2xl bg-[#F6F6F6] p-1">
        {options.map((o) => (
          <button
            key={o.billingCycle}
            type="button"
            onClick={() => setBillingCycle(o.billingCycle as "SIX_MONTH" | "ANNUAL")}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors",
              billingCycle === o.billingCycle ? "bg-white text-brand shadow-sm" : "text-text-3"
            )}
          >
            {CYCLE_LABEL[o.billingCycle as "SIX_MONTH" | "ANNUAL"]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-[#FAFBFA] p-[16px_18px]">
        <span className="text-[13px] font-light text-text-3">مبلغ قابل پرداخت</span>
        <span className="text-xl font-bold text-brand">{pricing.amount.toLocaleString("fa-IR")} تومان</span>
      </div>

      <BankCard
        bankName={card.bankName}
        cardNumber={card.cardNumber}
        holderName={card.holderName}
        accountNumber={card.accountNumber}
      />

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
        <ImageUploadField
          kind="payments"
          name="screenshotUrl"
          label="تصویر رسید پرداخت"
          helpText="اسکرین‌شات رسید انتقال وجه — jpg، png یا webp، حداکثر ۵ مگابایت"
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
