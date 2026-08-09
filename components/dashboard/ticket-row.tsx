import Link from "next/link";
import { MessageCircle, Calendar } from "lucide-react";
import { formatTicketCode } from "@/features/dashboard/utils/ticket-code";
import { formatRelativeDateTime } from "@/features/dashboard/utils/relative-date";
import { cn } from "@/lib/utils";

export type TicketStatusValue = "OPEN" | "PENDING" | "ANSWERED" | "CLOSED";
export type TicketCategoryValue = "TECHNICAL" | "PAYMENT" | "BILLING" | "GENERAL";

export const TICKET_STATUS_META: Record<TicketStatusValue, { label: string; fg: string; bg: string }> = {
  OPEN: { label: "باز", fg: "#2563EB", bg: "#EAF1FE" },
  PENDING: { label: "در انتظار پاسخ", fg: "#B7791F", bg: "#FCF3E3" },
  ANSWERED: { label: "پاسخ داده شد", fg: "#328C3D", bg: "#E5F0E6" },
  CLOSED: { label: "بسته شده", fg: "#8A8A8A", bg: "#F0F0F0" },
};

export const TICKET_CATEGORY_LABEL: Record<TicketCategoryValue, string> = {
  TECHNICAL: "فنی / باگ",
  PAYMENT: "پرداخت",
  BILLING: "صورتحساب",
  GENERAL: "عمومی",
};

export function TicketStatusBadge({ status }: { status: TicketStatusValue }) {
  const meta = TICKET_STATUS_META[status];
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-[9px] px-3 py-[5px] text-xs font-medium"
      style={{ color: meta.fg, background: meta.bg }}
    >
      {meta.label}
    </span>
  );
}

export interface TicketRowData {
  id: string;
  ticketNumber: number;
  subject: string;
  category: TicketCategoryValue;
  status: TicketStatusValue;
  updatedAt: Date;
}

export function TicketRow({ ticket, index }: { ticket: TicketRowData; index: number }) {
  return (
    <Link
      href={`/dashboard/support/${ticket.id}`}
      className={cn(
        "flex items-center gap-3 py-3.5 hover:bg-[#FAFBFA] sm:gap-4 sm:px-3.5 sm:py-4",
        index > 0 && "border-t border-[#F4F4F4]"
      )}
    >
      <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#F4F5F4] sm:h-[46px] sm:w-[46px]">
        <MessageCircle size={20} className="text-[#5A5A5A]" />
      </div>
      <div className="min-w-0 flex-1 text-right">
        <div className="truncate text-sm font-medium sm:text-[15px]">{ticket.subject}</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-text-3">
          <span className="rounded-lg border-[0.3px] border-border-chip bg-chip px-2.5 py-1">
            {TICKET_CATEGORY_LABEL[ticket.category]}
          </span>
          <span className="font-mont text-[#B0B0B0]">{formatTicketCode(ticket.ticketNumber)}</span>
          <span className="sm:hidden">
            <TicketStatusBadge status={ticket.status} />
          </span>
        </div>
      </div>
      <div className="hidden w-[150px] shrink-0 items-center gap-1.5 text-[#9F9F9F] sm:flex">
        <Calendar size={15} className="text-[#9A9A9A]" />
        <span className="text-xs font-light">{formatRelativeDateTime(ticket.updatedAt)}</span>
      </div>
      <span className="hidden sm:block">
        <TicketStatusBadge status={ticket.status} />
      </span>
    </Link>
  );
}
