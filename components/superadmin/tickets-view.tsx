import Link from "next/link";
import { Search } from "lucide-react";
import { InboundTicketRow } from "@/components/superadmin/inbound-ticket-row";
import type { InboundTicketSummary } from "@/features/superadmin/services/ticket-service";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; status?: "OPEN" | "PENDING" | "ANSWERED" | "CLOSED" }[] = [
  { label: "همه" },
  { label: "باز", status: "OPEN" },
  { label: "در انتظار پاسخ", status: "PENDING" },
  { label: "پاسخ داده شد", status: "ANSWERED" },
  { label: "بسته شده", status: "CLOSED" },
];

export function TicketsView({
  tickets,
  q,
  status,
}: {
  tickets: InboundTicketSummary[];
  q: string;
  status?: string;
}) {
  const openCount = tickets.filter((t) => t.status === "OPEN" || t.status === "PENDING").length;

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          {FILTERS.map((f) => {
            const active = f.status === status || (!f.status && !status);
            const href = `/superadmin/tickets?${new URLSearchParams({
              ...(q ? { q } : {}),
              ...(f.status ? { status: f.status } : {}),
            }).toString()}`;
            return (
              <Link
                key={f.label}
                href={href}
                className={cn(
                  "flex h-10 items-center rounded-xl px-5 text-sm",
                  active
                    ? "bg-brand font-medium text-white"
                    : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <form className="flex h-[42px] w-full items-center gap-2.5 rounded-[13px] bg-card px-4 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] sm:w-[320px]">
          {status && <input type="hidden" name="status" value={status} />}
          <Search size={18} className="text-[#B0B0B0]" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="جستجوی تیکت یا مشتری…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
          />
        </form>
      </div>

      <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-semibold">تیکت‌های دریافتی</span>
          <span className="text-xs font-light text-text-3">
            {openCount.toLocaleString("fa-IR")} تیکت باز از {tickets.length.toLocaleString("fa-IR")}
          </span>
        </div>
        <div className="flex flex-col">
          {tickets.length === 0 && <div className="p-6 text-center text-sm text-text-3">تیکتی یافت نشد.</div>}
          {tickets.map((t, i) => (
            <InboundTicketRow key={t.id} ticket={t} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
