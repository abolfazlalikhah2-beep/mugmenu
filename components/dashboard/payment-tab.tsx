"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { SettingsCard, OrderModeRow } from "@/components/dashboard/settings-card";
import { updatePaymentSettingsAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface PaymentFormValue {
  acceptsOnlinePayment: boolean;
  acceptsCashPayment: boolean;
  packagingFee: number;
}

const initialState: ActionState = {};

export function PaymentTab({ business }: { business: PaymentFormValue }) {
  const [state, formAction, pending] = useActionState(updatePaymentSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-[560px] flex-col gap-[22px]">
      <SettingsCard title="پرداخت" subtitle="درگاه و روش تسویه">
        <div>
          <OrderModeRow
            name="acceptsOnlinePayment"
            label="پرداخت آنلاین"
            sub="اتصال به درگاه بانکی (به‌زودی)"
            defaultChecked={business.acceptsOnlinePayment}
          />
          <OrderModeRow
            name="acceptsCashPayment"
            label="پرداخت در محل"
            sub="نقدی یا کارت‌خوان"
            defaultChecked={business.acceptsCashPayment}
          />
        </div>
        <Input
          name="packagingFee"
          label="هزینه بسته‌بندی (تومان)"
          type="number"
          dir="ltr"
          className="text-right"
          defaultValue={business.packagingFee}
          min={0}
          required
        />
      </SettingsCard>

      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex h-[50px] items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60 md:w-fit md:self-start md:px-10"
      >
        {pending ? "در حال ذخیره…" : "ذخیره تنظیمات"}
      </button>
    </form>
  );
}
