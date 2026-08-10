"use client";

import { useActionState, useState } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/dashboard/toggle";
import { TICKET_CATEGORY_LABEL, type TicketCategoryValue } from "@/components/dashboard/ticket-row";
import { createTicketForCustomerAction, type ActionState } from "@/features/superadmin/routes/actions";
import type { TicketPriority } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS: TicketCategoryValue[] = ["TECHNICAL", "PAYMENT", "BILLING", "GENERAL"];
const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "LOW", label: "عادی" },
  { value: "MID", label: "متوسط" },
  { value: "HIGH", label: "فوری" },
];

export interface BusinessOption {
  id: string;
  name: string;
  ownerName: string | null;
}

const initialState: ActionState = {};

export function NewTicketForCustomerModal({
  businesses,
  initialBusinessId,
  onClose,
}: {
  businesses: BusinessOption[];
  initialBusinessId?: string;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(createTicketForCustomerAction, initialState);
  const [businessId, setBusinessId] = useState(initialBusinessId ?? businesses[0]?.id ?? "");
  const [priority, setPriority] = useState<TicketPriority>("MID");
  const [notifySms, setNotifySms] = useState(true);

  return (
    <ModalShell
      title="ایجاد تیکت برای مشتری"
      subtitle="تیکت از طرف تیم ماگ‌منو در پنل مشتری ثبت می‌شود"
      onClose={onClose}
      footer={
        <>
          <button
            type="submit"
            form="new-ticket-for-customer-form"
            disabled={pending || !businessId}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ارسال…" : "ثبت و ارسال تیکت"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[50px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
          >
            انصراف
          </button>
        </>
      }
    >
      <form id="new-ticket-for-customer-form" action={formAction} className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">مشتری</label>
          <select
            name="businessId"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            className="h-[50px] rounded-input border border-border-input px-[18px] text-right text-sm text-[#333] outline-none focus:border-brand"
          >
            {businesses.length === 0 && <option value="">مشتری‌ای ثبت نشده</option>}
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
                {b.ownerName ? ` · ${b.ownerName}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Input name="subject" label="موضوع" placeholder="مثلاً یادآوری تمدید اشتراک" required className="flex-1" />
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">دسته‌بندی</label>
            <select
              name="category"
              defaultValue="BILLING"
              className="h-[50px] rounded-input border border-border-input px-[18px] text-right text-sm text-[#333] outline-none focus:border-brand"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {TICKET_CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-right text-[13px] font-light text-text-4">اولویت</label>
          <input type="hidden" name="priority" value={priority} />
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={cn(
                  "flex h-[38px] items-center rounded-[10px] px-5 text-[13px]",
                  priority === p.value ? "bg-brand text-white" : "border-[0.3px] border-[#CECECE] bg-chip text-[#555]"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">متن پیام</label>
          <textarea
            name="text"
            rows={5}
            required
            placeholder="متن پیام برای مشتری…"
            className="min-h-[120px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-ink outline-none focus:border-brand placeholder:text-[#B7B7B7]"
          />
        </div>

        <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <span className="text-right">
            <span className="block text-sm font-medium">اطلاع‌رسانی پیامکی</span>
            <span className="mt-0.5 block text-xs font-light text-text-3">ارسال پیامک به شماره مدیر مجموعه</span>
          </span>
          <input type="hidden" name="notifySms" value={notifySms ? "on" : "off"} />
          <Toggle checked={notifySms} onChange={setNotifySms} />
        </label>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
