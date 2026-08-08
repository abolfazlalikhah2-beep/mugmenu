"use client";

import { useActionState } from "react";
import { UtensilsCrossed, ShoppingBag, Bike } from "lucide-react";
import { OrderModeCard } from "@/components/dashboard/order-mode-card";
import { updateOrderSettingsAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface OrderSettingsFormValue {
  acceptsDineIn: boolean;
  acceptsTakeaway: boolean;
  acceptsDelivery: boolean;
  prepTimeDineIn: number;
  prepTimeTakeaway: number;
  prepTimeDelivery: number;
}

const initialState: ActionState = {};

export function OrderSettingsTab({ business }: { business: OrderSettingsFormValue }) {
  const [state, formAction, pending] = useActionState(updateOrderSettingsAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-[22px]">
      <div className="text-right">
        <div className="text-base font-medium text-[#555]">حالت‌های دریافت سفارش</div>
        <div className="mt-1 text-xs font-light leading-7 text-text-3">
          هر حالت را فعال یا غیرفعال کن و زمان آماده‌سازی پیش‌فرض آن را تعیین کن.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
        <OrderModeCard
          icon={UtensilsCrossed}
          name="acceptsDineIn"
          label="سرو روی میز"
          sub="ثبت سفارش با شماره میز"
          defaultOn={business.acceptsDineIn}
          prepName="prepTimeDineIn"
          defaultPrep={business.prepTimeDineIn}
        />
        <OrderModeCard
          icon={ShoppingBag}
          name="acceptsTakeaway"
          label="بیرون‌بر"
          sub="دریافت حضوری از مجموعه"
          defaultOn={business.acceptsTakeaway}
          prepName="prepTimeTakeaway"
          defaultPrep={business.prepTimeTakeaway}
        />
        <OrderModeCard
          icon={Bike}
          name="acceptsDelivery"
          label="ارسال با پیک"
          sub="تحویل درب منزل مشتری"
          defaultOn={business.acceptsDelivery}
          prepName="prepTimeDelivery"
          defaultPrep={business.prepTimeDelivery}
        />
      </div>

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
