"use client";

import { useActionState, useState } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { TicketAttachmentField, type TicketAttachment } from "@/components/dashboard/ticket-attachment-field";
import { TICKET_CATEGORY_LABEL, type TicketCategoryValue } from "@/components/dashboard/ticket-row";
import { createTicketAction, type ActionState } from "@/features/dashboard/routes/actions";

const CATEGORY_OPTIONS: TicketCategoryValue[] = ["TECHNICAL", "PAYMENT", "BILLING", "GENERAL"];

const initialState: ActionState = {};

export function NewTicketModal({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(createTicketAction, initialState);
  const [attachment, setAttachment] = useState<TicketAttachment | null>(null);

  return (
    <ModalShell
      title="ثبت تیکت جدید"
      subtitle="مشکل یا سوال خود را برای تیم پشتیبانی بنویسید"
      onClose={onClose}
      footer={
        <>
          <button
            type="submit"
            form="new-ticket-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ارسال…" : "ارسال تیکت"}
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
      <form id="new-ticket-form" action={formAction} className="flex flex-col gap-[18px]">
        <Input name="subject" label="موضوع" placeholder="مثلاً مشکل در چاپ QR روی میز" required />

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">دسته‌بندی</label>
          <select
            name="category"
            defaultValue="TECHNICAL"
            className="h-[50px] rounded-input border border-border-input px-[18px] text-right text-sm text-[#333] outline-none focus:border-brand"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {TICKET_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">متن پیام</label>
          <textarea
            name="text"
            rows={5}
            required
            placeholder="توضیح کامل مشکل، همراه با جزئیات و زمان وقوع…"
            className="min-h-[120px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-ink outline-none focus:border-brand placeholder:text-[#B7B7B7]"
          />
        </div>

        <TicketAttachmentField
          label="پیوست فایل"
          value={attachment}
          onChange={setAttachment}
          urlFieldName="attachmentUrl"
          nameFieldName="attachmentName"
        />

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
