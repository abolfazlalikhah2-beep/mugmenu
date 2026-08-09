"use client";

import { useActionState, useState } from "react";
import { Send, Users } from "lucide-react";
import { SmsMessageBox } from "@/components/dashboard/sms-message-box";
import type { ContactRowData } from "@/components/dashboard/contact-row";
import { sendBulkSmsAction, type SendSmsActionState } from "@/features/dashboard/routes/actions";
import { countSmsSegments } from "@/features/dashboard/utils/sms-length";
import { cn } from "@/lib/utils";

export interface AudienceCounts {
  ALL_CONTACTS: number;
  LOYAL_CUSTOMERS: number;
  RECENT_ORDERS: number;
}

type AudienceValue = "ALL_CONTACTS" | "LOYAL_CUSTOMERS" | "RECENT_ORDERS" | "MANUAL";

const AUDIENCES: { value: AudienceValue; label: string }[] = [
  { value: "ALL_CONTACTS", label: "همه مخاطبین" },
  { value: "LOYAL_CUSTOMERS", label: "مشتریان وفادار" },
  { value: "RECENT_ORDERS", label: "سفارش اخیر" },
  { value: "MANUAL", label: "دستی" },
];

const initialState: SendSmsActionState = {};

export function BulkSendTab({ contacts, counts }: { contacts: ContactRowData[]; counts: AudienceCounts }) {
  const [state, formAction, pending] = useActionState(sendBulkSmsAction, initialState);
  const [audience, setAudience] = useState<AudienceValue>("ALL_CONTACTS");
  const [manualIds, setManualIds] = useState<string[]>([]);
  const [text, setText] = useState("");

  // Reset the composer once a send succeeds. Done during render (not an
  // effect) per React's guidance for resetting state in response to a
  // changing value, comparing against the last-seen action result.
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) setText("");
  }

  const recipientCount = audience === "MANUAL" ? manualIds.length : counts[audience];
  const { segments } = countSmsSegments(text);

  function toggleManual(id: string) {
    setManualIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <form action={formAction} className="flex max-w-[560px] flex-col gap-[18px]">
      <input type="hidden" name="audience" value={audience} />
      {manualIds.map((id) => (
        <input key={id} type="hidden" name="manualContactIds" value={id} />
      ))}

      <div className="flex flex-col gap-5 rounded-[22px] bg-card p-[22px_20px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[28px_30px]">
        <div className="text-right text-base font-semibold sm:text-[17px]">ارسال دسته‌جمعی</div>

        <div className="flex flex-col gap-2.5">
          <label className="text-right text-[13px] font-light text-text-4">گیرندگان</label>
          <div className="flex h-12 items-center justify-between rounded-input border border-border-input px-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-brand" />
              <span className="text-sm text-ink">{AUDIENCES.find((a) => a.value === audience)?.label}</span>
            </div>
            <span className="rounded-lg bg-[#E5F0E6] px-2.5 py-1 text-[13px] font-medium text-brand">
              {recipientCount.toLocaleString("fa-IR")} نفر
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => {
              const active = a.value === audience;
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAudience(a.value)}
                  className={cn(
                    "flex h-[34px] items-center rounded-chip px-4 text-[13px]",
                    active ? "bg-brand font-medium text-white" : "border-[0.3px] border-border-chip bg-chip text-[#666]"
                  )}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        {audience === "MANUAL" && (
          <div className="flex max-h-[220px] flex-col gap-1 overflow-auto rounded-2xl border border-[#F0F0F0] p-2">
            {contacts.length === 0 && (
              <div className="p-4 text-center text-xs text-text-3">دفترچه شماره خالی است.</div>
            )}
            {contacts.map((c) => {
              const checked = manualIds.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl p-2.5",
                    checked && "bg-[#F3FAF4]"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleManual(c.id)}
                    className="h-4 w-4 accent-brand"
                  />
                  <div className="min-w-0 flex-1 text-right">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div dir="ltr" className="text-right text-xs font-light text-text-3">
                      {c.phone}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <SmsMessageBox name="text" value={text} onChange={setText} placeholder="متن پیام برای ارسال به همه مخاطبین…" />

        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right">
            <div className="text-[13px] font-medium">برآورد مصرف</div>
            <div className="mt-0.5 text-[11px] font-light text-text-3">
              {recipientCount.toLocaleString("fa-IR")} گیرنده × {segments.toLocaleString("fa-IR")} پیامک
            </div>
          </div>
          <span className="text-[15px] font-semibold text-brand">
            {(recipientCount * segments).toLocaleString("fa-IR")} پیامک
          </span>
        </div>
      </div>

      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && (
        <p className="text-right text-xs text-brand">
          پیامک برای {(state.sent ?? 0).toLocaleString("fa-IR")} گیرنده ارسال شد
          {state.failed ? ` (${state.failed.toLocaleString("fa-IR")} ناموفق)` : ""}.
        </p>
      )}
      <button
        type="submit"
        disabled={pending || recipientCount === 0 || !text.trim()}
        className="flex h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
      >
        <Send size={18} />
        {pending ? "در حال ارسال…" : "ارسال به همه"}
      </button>
    </form>
  );
}
