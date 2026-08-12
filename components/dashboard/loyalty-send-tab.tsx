"use client";

import { useActionState, useState } from "react";
import { Send, Users } from "lucide-react";
import { SmsMessageBox } from "@/components/dashboard/sms-message-box";
import { sendBulkSmsAction, type SendSmsActionState } from "@/features/dashboard/routes/actions";
import { countSmsSegments } from "@/features/dashboard/utils/sms-length";
import type { LoyaltyFilter } from "@/features/dashboard/services/loyalty-club-aggregation";
import { cn } from "@/lib/utils";

const FILTERS: { value: LoyaltyFilter; label: string }[] = [
  { value: "ALL", label: "همه اعضا" },
  { value: "INACTIVE_30", label: "بدون خرید در ۳۰ روز" },
  { value: "INACTIVE_90", label: "بدون خرید در ۹۰ روز" },
  { value: "GOLD", label: "سطح طلایی" },
  { value: "WALLET_100K", label: "کیف‌پول بالای ۱۰۰ هزار" },
];

const initialState: SendSmsActionState = {};

export function LoyaltySendTab({ counts }: { counts: Record<LoyaltyFilter, number> }) {
  const [state, formAction, pending] = useActionState(sendBulkSmsAction, initialState);
  const [filter, setFilter] = useState<LoyaltyFilter>("ALL");
  const [text, setText] = useState("");

  // Reset the composer once a send succeeds — same pattern as bulk-send-tab.tsx.
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) setText("");
  }

  const recipientCount = counts[filter];
  const { segments } = countSmsSegments(text);

  return (
    <form action={formAction} className="flex max-w-[560px] flex-col gap-[18px]">
      <input type="hidden" name="audience" value="LOYALTY_MEMBERS" />
      <input type="hidden" name="loyaltyFilter" value={filter} />

      <div className="flex flex-col gap-5 rounded-[22px] bg-card p-[22px_20px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[28px_30px]">
        <div className="text-right text-base font-semibold sm:text-[17px]">ارسال پیام به اعضای باشگاه</div>

        <div className="flex flex-col gap-2.5">
          <label className="text-right text-[13px] font-light text-text-4">گیرندگان</label>
          <div className="flex h-12 items-center justify-between rounded-input border border-border-input px-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-brand" />
              <span className="text-sm text-ink">{FILTERS.find((f) => f.value === filter)?.label}</span>
            </div>
            <span className="rounded-lg bg-[#E5F0E6] px-2.5 py-1 text-[13px] font-medium text-brand">
              {recipientCount.toLocaleString("fa-IR")} نفر
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f.value === filter;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "flex h-[34px] items-center rounded-chip px-4 text-[13px]",
                    active ? "bg-brand font-medium text-white" : "border-[0.3px] border-border-chip bg-chip text-[#666]"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <SmsMessageBox name="text" value={text} onChange={setText} placeholder="متن پیام برای اعضای باشگاه…" />

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
        {pending ? "در حال ارسال…" : "ارسال به اعضا"}
      </button>
    </form>
  );
}
