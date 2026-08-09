"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { TicketRow, type TicketRowData, type TicketStatusValue } from "@/components/dashboard/ticket-row";
import { NewTicketModal } from "@/components/dashboard/new-ticket-modal";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; status?: TicketStatusValue }[] = [
  { label: "همه" },
  { label: "باز", status: "OPEN" },
  { label: "در انتظار پاسخ", status: "PENDING" },
  { label: "بسته شده", status: "CLOSED" },
];

export function SupportView({ tickets }: { tickets: TicketRowData[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(0);
  const [modal, setModal] = useState(false);
  const activeStatus = FILTERS[filter].status;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (activeStatus && t.status !== activeStatus) return false;
      if (!q) return true;
      return t.subject.toLowerCase().includes(q) || String(t.ticketNumber).includes(q);
    });
  }, [tickets, search, activeStatus]);

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-right">
          <div className="text-[15px] font-semibold sm:text-base">تیکت‌های پشتیبانی</div>
          <div className="mt-0.5 text-xs font-light text-text-3">
            {tickets.length.toLocaleString("fa-IR")} تیکت
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-[44px] w-full items-center gap-2.5 rounded-[13px] bg-card px-4 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] sm:w-[280px]">
            <Search size={18} className="text-[#B0B0B0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی تیکت…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
            />
          </div>
          <PrimaryButton onClick={() => setModal(true)}>ثبت تیکت جدید</PrimaryButton>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilter(i)}
            className={cn(
              "flex h-[38px] items-center rounded-[11px] px-[18px] text-sm",
              filter === i
                ? "bg-brand font-medium text-white"
                : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1 rounded-[22px] bg-card p-[8px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[8px_20px]">
        {filtered.length === 0 && <div className="p-6 text-center text-sm text-text-3">تیکتی یافت نشد.</div>}
        {filtered.map((t, i) => (
          <TicketRow key={t.id} ticket={t} index={i} />
        ))}
      </div>

      {modal && <NewTicketModal onClose={() => setModal(false)} />}
    </div>
  );
}
