"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { updateSmsSettingsAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface SmsSettingsFormValue {
  smsProvider: string;
  smsUsername: string;
  smsSenderNumber: string;
  hasApiKey: boolean;
  smsConnected: boolean;
  smsCreditCount: number | null;
}

const PROVIDERS = [
  { value: "kavenegar", label: "کاوه‌نگار" },
  { value: "melipayamak", label: "ملی‌پیامک" },
  { value: "farazsms", label: "فراز اس‌ام‌اس" },
  { value: "other", label: "سایر" },
];

const initialState: ActionState = {};

export function SmsSettingsTab({ settings }: { settings: SmsSettingsFormValue }) {
  const [state, formAction, pending] = useActionState(updateSmsSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-[560px] flex-col gap-[18px]">
      <div className="flex flex-col gap-5 rounded-[22px] bg-card p-[22px_20px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[28px_30px]">
        <div className="text-right text-base font-semibold sm:text-[17px]">اتصال به پنل پیامکی</div>

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">سرویس‌دهنده</label>
          <select
            name="smsProvider"
            defaultValue={settings.smsProvider || PROVIDERS[0].value}
            className="h-[50px] rounded-input border border-border-input px-[18px] text-right text-sm text-[#333] outline-none focus:border-brand"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            name="smsUsername"
            label="نام کاربری"
            dir="ltr"
            defaultValue={settings.smsUsername}
            className="flex-1 text-right"
          />
          <Input
            name="smsSenderNumber"
            label="شماره فرستنده"
            dir="ltr"
            defaultValue={settings.smsSenderNumber}
            className="flex-1 text-right"
          />
        </div>

        <div className="flex flex-col gap-2">
          <PasswordInput
            name="smsApiKey"
            label="رمز / کلید API"
            dir="ltr"
            placeholder={settings.hasApiKey ? "••••••••••••••••••••••••" : ""}
            className="text-right"
          />
          {settings.hasApiKey && (
            <p className="text-right text-[11px] font-light text-text-3">
              برای تغییر کلید مقدار جدید وارد کنید؛ برای حفظ کلید فعلی خالی بگذارید.
            </p>
          )}
        </div>

        <div
          className="flex items-center gap-2.5 rounded-2xl border p-[12px_16px]"
          style={{
            background: settings.smsConnected ? "#F3FAF4" : "#FAFBFA",
            borderColor: settings.smsConnected ? "#CDE6D0" : "#F0F0F0",
          }}
        >
          <span className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: settings.smsConnected ? "rgba(16,211,123,0.22)" : "rgba(159,159,159,0.2)" }}
            />
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ background: settings.smsConnected ? "#10D37B" : "#9F9F9F" }}
            />
          </span>
          <span
            className="text-[13px] font-medium"
            style={{ color: settings.smsConnected ? "#1E8E4E" : "#8A8A8A" }}
          >
            {settings.smsConnected
              ? `اتصال برقرار است${settings.smsCreditCount != null ? ` · اعتبار: ${settings.smsCreditCount.toLocaleString("fa-IR")} پیامک` : ""}`
              : "هنوز اتصالی تست نشده است"}
          </span>
        </div>
      </div>

      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره و اتصال تست شد.</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex h-[52px] items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60 md:w-fit md:self-start md:px-10"
      >
        {pending ? "در حال تست اتصال…" : "ذخیره و تست اتصال"}
      </button>
    </form>
  );
}
