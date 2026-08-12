"use client";

import { useActionState } from "react";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { FormToggle } from "@/components/dashboard/form-toggle";
import { Input } from "@/components/ui/input";
import { updateCashbackSettingsAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface CashbackSettingsFormValue {
  cashbackEnabled: boolean;
  cashbackPercent: number;
  cashbackCapPerOrder: number;
}

const initialState: ActionState = {};

export function CashbackSettingsForm({ settings }: { settings: CashbackSettingsFormValue }) {
  const [state, formAction, pending] = useActionState(updateCashbackSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-[560px] flex-col gap-[18px]">
      <SettingsCard title="تنظیمات کش‌بک" subtitle="درصدی از هر خرید به کیف‌پول عضو باشگاه برمی‌گردد">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[16px_18px]">
          <div className="text-right">
            <div className="text-[15px] font-semibold">فعال بودن کش‌بک</div>
            <div className="mt-0.5 text-xs font-light text-text-3">با خاموش کردن، کش‌بک جدید ثبت نمی‌شود</div>
          </div>
          <FormToggle name="cashbackEnabled" defaultChecked={settings.cashbackEnabled} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            name="cashbackPercent"
            label="درصد بازگشت وجه از هر خرید"
            type="number"
            min={0}
            max={20}
            dir="ltr"
            defaultValue={settings.cashbackPercent}
            className="text-right"
          />
          <Input
            name="cashbackCapPerOrder"
            label="سقف کش‌بک هر خرید (تومان)"
            type="number"
            min={0}
            dir="ltr"
            defaultValue={settings.cashbackCapPerOrder}
            className="text-right"
          />
        </div>

        <div className="rounded-[15px] border border-dashed border-[#E4E4E4] bg-[#FAFBFA] p-[14px_16px] text-[13px] leading-[1.9] text-[#5F5F5F]">
          خرید ۴۰۰٬۰۰۰ تومانی با درصد فعلی ← کش‌بک به کیف‌پول عضو اضافه می‌شود، تا سقف تعیین‌شده در بالا.
        </div>
      </SettingsCard>

      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="flex h-[50px] items-center justify-center rounded-2xl bg-brand px-10 text-base text-white disabled:opacity-60"
        >
          {pending ? "در حال ذخیره…" : "ذخیره تنظیمات"}
        </button>
      </div>
    </form>
  );
}
