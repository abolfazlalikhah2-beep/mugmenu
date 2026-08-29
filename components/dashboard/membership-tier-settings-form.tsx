"use client";

import { useActionState } from "react";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { Input } from "@/components/ui/input";
import { updateMembershipTierSettingsAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface MembershipTierSettingsFormValue {
  silverMinOrders: number;
  silverMinSpend: number;
  goldMinOrders: number;
  goldMinSpend: number;
  vipMinOrders: number;
  vipMinSpend: number;
}

const initialState: ActionState = {};

const TIERS: { key: "silver" | "gold" | "vip"; label: string; badgeClass: string }[] = [
  { key: "silver", label: "نقره‌ای", badgeClass: "bg-[#EDEDED] text-[#6B6B6B]" },
  { key: "gold", label: "طلایی", badgeClass: "bg-[#FBF0D8] text-[#B8860B]" },
  { key: "vip", label: "ویژه", badgeClass: "bg-[#E5F0E6] text-brand" },
];

export function MembershipTierSettingsForm({ settings }: { settings: MembershipTierSettingsFormValue }) {
  const [state, formAction, pending] = useActionState(updateMembershipTierSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-[560px] flex-col gap-[18px]">
      <SettingsCard
        title="سطوح عضویت باشگاه مشتریان"
        subtitle="مشتری با رسیدن به هر یک از دو آستانه (تعداد سفارش یا مبلغ خرید) به آن سطح می‌رسد"
      >
        {TIERS.map((tier) => (
          <div key={tier.key} className="flex flex-col gap-3 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_16px]">
            <span className={`w-fit rounded-[9px] px-3 py-[5px] text-xs font-medium ${tier.badgeClass}`}>
              {tier.label}
            </span>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                name={`${tier.key}MinOrders`}
                label="حداقل تعداد سفارش"
                type="number"
                min={0}
                dir="ltr"
                defaultValue={settings[`${tier.key}MinOrders` as keyof MembershipTierSettingsFormValue]}
                className="text-right"
              />
              <Input
                name={`${tier.key}MinSpend`}
                label="حداقل مبلغ خرید (تومان)"
                type="number"
                min={0}
                dir="ltr"
                defaultValue={settings[`${tier.key}MinSpend` as keyof MembershipTierSettingsFormValue]}
                className="text-right"
              />
            </div>
          </div>
        ))}
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
