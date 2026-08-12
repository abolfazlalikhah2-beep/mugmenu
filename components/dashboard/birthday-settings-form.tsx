"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { FormToggle } from "@/components/dashboard/form-toggle";
import { Input } from "@/components/ui/input";
import { SmsMessageBox, type SmsTemplateVariable } from "@/components/dashboard/sms-message-box";
import {
  updateBirthdaySettingsAction,
  sendBirthdayTestAction,
  type ActionState,
  type SendSmsActionState,
} from "@/features/dashboard/routes/actions";

export interface BirthdaySettingsFormValue {
  birthdayMessageEnabled: boolean;
  birthdayMessageText: string;
  birthdayGiftAmount: number;
}

const initialState: ActionState = {};
const initialSendState: SendSmsActionState = {};

const BIRTHDAY_VARIABLES: SmsTemplateVariable[] = [
  { token: "{نام مشتری}", label: "نام مشتری" },
  { token: "{نام مجموعه}", label: "نام مجموعه" },
  { token: "{مبلغ اعتبار}", label: "مبلغ اعتبار" },
];

export function BirthdaySettingsForm({ settings }: { settings: BirthdaySettingsFormValue }) {
  const [state, formAction, pending] = useActionState(updateBirthdaySettingsAction, initialState);
  const [text, setText] = useState(settings.birthdayMessageText);

  const [sendState, sendAction, sendPending] = useActionState(sendBirthdayTestAction, initialSendState);
  const [testPhone, setTestPhone] = useState("");

  return (
    <div className="flex max-w-[560px] flex-col gap-[22px]">
      <form action={formAction} className="flex flex-col gap-[18px]">
        <SettingsCard title="پیام تبریک تولد" subtitle="متن و هدیه تولد را اینجا تنظیم کنید">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[16px_18px]">
            <div className="text-right">
              <div className="text-[15px] font-semibold">فعال بودن پیام تولد</div>
              <div className="mt-0.5 text-xs font-light text-text-3">
                هنوز ارسال خودکار روزانه پیاده‌سازی نشده — فقط متن ذخیره می‌شود و می‌توانید آزمایشی ارسال کنید
              </div>
            </div>
            <FormToggle name="birthdayMessageEnabled" defaultChecked={settings.birthdayMessageEnabled} />
          </div>

          <SmsMessageBox
            name="birthdayMessageText"
            value={text}
            onChange={setText}
            placeholder="مثلاً: {نام مشتری} عزیز، تولدت مبارک! {مبلغ اعتبار} تومان به کیف‌پول شما اضافه شد."
            variables={BIRTHDAY_VARIABLES}
          />

          <Input
            name="birthdayGiftAmount"
            label="مبلغ هدیه تولد (تومان)"
            type="number"
            min={0}
            dir="ltr"
            defaultValue={settings.birthdayGiftAmount}
            className="text-right"
          />
        </SettingsCard>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        {state.ok && <p className="text-right text-xs text-brand">پیام ذخیره شد.</p>}
        <div>
          <button
            type="submit"
            disabled={pending}
            className="flex h-[50px] items-center justify-center rounded-2xl bg-brand px-10 text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره پیام"}
          </button>
        </div>
      </form>

      <form
        action={sendAction}
        className="flex flex-col gap-3 rounded-[22px] bg-card p-[20px_18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[24px_26px]"
      >
        <div className="text-right">
          <div className="text-[15px] font-semibold">ارسال آزمایشی</div>
          <div className="mt-0.5 text-xs font-light text-text-3">پیام ذخیره‌شده را برای یک شماره تست ارسال کنید</div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="tel"
            name="phone"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
            className="h-12 flex-1 rounded-input border border-border-input px-4 text-right text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={sendPending || !testPhone.trim()}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#EAEAEA] px-6 text-sm font-medium text-[#5F5F5F] disabled:opacity-60"
          >
            <Send size={16} />
            {sendPending ? "در حال ارسال…" : "ارسال آزمایشی"}
          </button>
        </div>
        {sendState.error && <p className="text-right text-xs text-red-500">{sendState.error}</p>}
        {sendState.ok && <p className="text-right text-xs text-brand">پیام آزمایشی ارسال شد.</p>}
      </form>
    </div>
  );
}
