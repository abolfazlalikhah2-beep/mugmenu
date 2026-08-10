"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Toggle } from "@/components/dashboard/toggle";
import { updateGatewaySettingsAction, type ActionState } from "@/features/superadmin/routes/actions";

export interface GatewaySettingsFormValue {
  zarinpalMerchantId: string;
  zarinpalCallbackUrl: string;
  zarinpalSandbox: boolean;
  hasApiKey: boolean;
}

const initialState: ActionState = {};

export function GatewaySettingsForm({ settings }: { settings: GatewaySettingsFormValue }) {
  const [state, formAction, pending] = useActionState(updateGatewaySettingsAction, initialState);
  const [sandbox, setSandbox] = useState(settings.zarinpalSandbox);

  return (
    <form action={formAction} className="flex flex-col gap-[14px]">
      <Input
        name="zarinpalMerchantId"
        label="مرچنت کد"
        dir="ltr"
        defaultValue={settings.zarinpalMerchantId}
        className="text-right"
      />
      <div className="flex flex-col gap-4 sm:flex-row">
        <PasswordInput
          name="zarinpalApiKey"
          label="کلید API"
          dir="ltr"
          placeholder={settings.hasApiKey ? "••••••••••••" : ""}
          className="flex-1 text-right"
        />
        <Input
          name="zarinpalCallbackUrl"
          label="آدرس بازگشت"
          dir="ltr"
          defaultValue={settings.zarinpalCallbackUrl}
          className="flex-1 text-right"
        />
      </div>
      {settings.hasApiKey && (
        <p className="text-right text-[11px] font-light text-text-3">
          برای تغییر کلید مقدار جدید وارد کنید؛ برای حفظ کلید فعلی خالی بگذارید.
        </p>
      )}
      <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
        <span className="text-right">
          <span className="block text-sm font-medium">حالت آزمایشی (Sandbox)</span>
          <span className="mt-0.5 block text-xs font-light text-text-3">تراکنش واقعی ثبت نمی‌شود</span>
        </span>
        <input type="hidden" name="zarinpalSandbox" value={sandbox ? "on" : "off"} />
        <Toggle checked={sandbox} onChange={setSandbox} />
      </label>
      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره و اتصال تست شد.</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex h-[50px] items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
      >
        {pending ? "در حال تست اتصال…" : "ذخیره و تست اتصال"}
      </button>
    </form>
  );
}
