"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SmsMessageBox } from "@/components/dashboard/sms-message-box";
import { sendSingleSmsAction, type SendSmsActionState } from "@/features/dashboard/routes/actions";

const initialState: SendSmsActionState = {};

export function SingleSendTab() {
  const [state, formAction, pending] = useActionState(sendSingleSmsAction, initialState);
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");

  // Reset the composer once a send succeeds. Done during render (not an
  // effect) per React's guidance for resetting state in response to a
  // changing value, comparing against the last-seen action result.
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) {
      setPhone("");
      setText("");
    }
  }

  return (
    <form action={formAction} className="flex max-w-[560px] flex-col gap-[18px]">
      <div className="flex flex-col gap-5 rounded-[22px] bg-card p-[22px_20px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[28px_30px]">
        <div className="text-right text-base font-semibold sm:text-[17px]">ارسال پیامک تکی</div>
        <Input
          name="phone"
          label="شماره گیرنده"
          placeholder="0912 000 0000"
          dir="ltr"
          className="text-right"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <SmsMessageBox name="text" value={text} onChange={setText} placeholder="متن پیام خود را بنویسید…" />
      </div>

      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && <p className="text-right text-xs text-brand">پیامک ارسال شد.</p>}
      <button
        type="submit"
        disabled={pending || !phone.trim() || !text.trim()}
        className="flex h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
      >
        <Send size={18} />
        {pending ? "در حال ارسال…" : "ارسال پیامک"}
      </button>
    </form>
  );
}
