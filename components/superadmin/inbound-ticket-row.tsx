import Link from "next/link";
import { MessageCircle, Calendar } from "lucide-react";
import { TicketStatusBadge, TICKET_CATEGORY_LABEL } from "@/components/dashboard/ticket-row";
import { formatTicketCode } from "@/features/dashboard/utils/ticket-code";
import { formatRelativeDateTime } from "@/features/dashboard/utils/relative-date";
import type { TicketPriority } from "@/lib/generated/prisma/enums";
import type { InboundTicketSummary } from "@/features/superadmin/services/ticket-service";

const PRIORITY_META: Record<TicketPriority, { label: string; fg: string; bg: string }> = {
  HIGH: { label: "فوری", fg: "#C15656", bg: "#FBECEC" },
  MID: { label: "متوسط", fg: "#B7791F", bg: "#FCF3E3" },
  LOW: { label: "عادی", fg: "#8A8A8A", bg: "#F4F5F4" },
};

export function PriorityTag({ priority }: { priority: TicketPriority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span
      className="inline-flex shrink-0 items-center whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium"
      style={{ color: meta.fg, background: meta.bg }}
    >
      {meta.label}
    </span>
  );
}

export function InboundTicketRow({ ticket, index }: { ticket: InboundTicketSummary; index: number }) {
  return (
    <Link
      href={`/superadmin/tickets/${ticket.id}`}
      className="grid items-center gap-3 py-4 text-sm hover:bg-[#FAFBFA] sm:px-3.5"
      style={{
        gridTemplateColumns: "2fr 1.4fr 0.8fr 1fr 1.1fr 1fr",
        borderTop: index > 0 ? "1px solid #F4F4F4" : "none",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#F4F5F4]">
          <MessageCircle size={20} className="text-[#5A5A5A]" />
        </div>
        <div className="min-w-0 text-right">
          <div className="truncate font-medium">{ticket.subject}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mont text-[11px] text-[#B0B0B0]">{formatTicketCode(ticket.ticketNumber)}</span>
            <span className="rounded-lg border-[0.3px] border-border-chip bg-chip px-2 py-0.5 text-[11px] text-text-3">
              {TICKET_CATEGORY_LABEL[ticket.category]}
            </span>
          </div>
        </div>
      </div>
      <div className="min-w-0 text-right">
        <div className="truncate text-[13px] font-medium">{ticket.storeName}</div>
        <div className="mt-0.5 truncate text-[11px] font-light text-text-3">{ticket.senderName}</div>
      </div>
      <PriorityTag priority={ticket.priority} />
      <div className="flex items-center gap-1.5 text-text-3">
        <Calendar size={15} className="text-[#9A9A9A]" />
        <span className="text-xs font-light">{formatRelativeDateTime(ticket.updatedAt)}</span>
      </div>
      <div className="flex items-center gap-2">
        {ticket.agentName ? (
          <>
            <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[#EAF3EB] text-xs font-semibold text-brand">
              {ticket.agentName.slice(0, 1)}
            </div>
            <span className="truncate text-xs font-light text-[#777]">{ticket.agentName}</span>
          </>
        ) : (
          <span className="text-xs font-light text-text-3">تخصیص‌نیافته</span>
        )}
      </div>
      <div className="flex justify-end">
        <TicketStatusBadge status={ticket.status} />
      </div>
    </Link>
  );
}
