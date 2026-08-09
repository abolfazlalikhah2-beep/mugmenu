"use client";

import { useActionState, useState } from "react";
import { Calendar, Paperclip, Send } from "lucide-react";
import { TicketMessageBubble, type TicketMessageData } from "@/components/dashboard/ticket-message-bubble";
import {
  TicketStatusBadge,
  TICKET_CATEGORY_LABEL,
  type TicketCategoryValue,
  type TicketStatusValue,
} from "@/components/dashboard/ticket-row";
import { TicketAttachmentField, type TicketAttachment } from "@/components/dashboard/ticket-attachment-field";
import { formatTicketCode } from "@/features/dashboard/utils/ticket-code";
import { formatRelativeDateTime } from "@/features/dashboard/utils/relative-date";
import { addTicketMessageAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface TicketDetailData {
  id: string;
  ticketNumber: number;
  subject: string;
  category: TicketCategoryValue;
  status: TicketStatusValue;
  createdAt: Date;
  messages: TicketMessageData[];
}

const initialState: ActionState = {};

export function TicketDetailView({ ticket }: { ticket: TicketDetailData }) {
  const action = addTicketMessageAction.bind(null, ticket.id);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<TicketAttachment | null>(null);
  const [showAttach, setShowAttach] = useState(false);

  // Reset the reply box once a message is sent. Done during render (not an
  // effect) per React's guidance for resetting state in response to a
  // changing value, comparing against the last-seen action result.
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) {
      setText("");
      setAttachment(null);
      setShowAttach(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-[14px] md:gap-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-3.5 rounded-[22px] bg-card p-[18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] md:p-[22px_26px]">
        <div className="flex flex-col gap-2 text-right">
          <div className="text-[17px] font-semibold md:text-xl">{ticket.subject}</div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mont text-xs text-text-3">{formatTicketCode(ticket.ticketNumber)}</span>
            <span className="rounded-lg border-[0.3px] border-border-chip bg-chip px-2.5 py-1 text-[11px] text-[#666]">
              {TICKET_CATEGORY_LABEL[ticket.category]}
            </span>
            <span className="flex items-center gap-1.5 text-[#9F9F9F]">
              <Calendar size={14} className="text-[#9A9A9A]" />
              <span className="text-xs font-light">ایجاد: {formatRelativeDateTime(ticket.createdAt)}</span>
            </span>
          </div>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-auto rounded-[22px] bg-card p-4 shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] md:p-[24px_28px]">
        {ticket.messages.map((m) => (
          <TicketMessageBubble key={m.id} message={m} />
        ))}
      </div>

      <form
        action={formAction}
        className="flex flex-col gap-3 rounded-[22px] bg-card p-[14px_16px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] md:p-[16px_20px]"
      >
        <textarea
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="پاسخ خود را بنویسید…"
          className="min-h-[54px] rounded-2xl border border-[#E3E3E3] p-[12px_16px] text-right text-[13px] leading-[1.8] text-ink outline-none focus:border-brand placeholder:text-[#B7B7B7] md:min-h-[60px]"
        />
        {showAttach && (
          <TicketAttachmentField
            value={attachment}
            onChange={setAttachment}
            urlFieldName="attachmentUrl"
            nameFieldName="attachmentName"
            compact
          />
        )}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAttach((v) => !v)}
            aria-label="پیوست فایل"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#F4F5F4]"
          >
            <Paperclip size={20} className="text-[#5A5A5A]" />
          </button>
          <button
            type="submit"
            disabled={pending || !text.trim()}
            className="flex h-11 items-center gap-2 rounded-[13px] bg-brand px-6 text-sm font-medium text-white disabled:opacity-60"
          >
            <Send size={18} />
            {pending ? "در حال ارسال…" : "ارسال پاسخ"}
          </button>
        </div>
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </div>
  );
}
