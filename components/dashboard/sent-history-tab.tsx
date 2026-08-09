"use client";

import { useMemo, useState } from "react";
import { SentRow, type SentMessageRowData, type SentMessageStatus } from "@/components/dashboard/sent-row";
import { SentDetailModal } from "@/components/dashboard/sent-detail-modal";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; status?: SentMessageStatus }[] = [
  { label: "همه" },
  { label: "ارسال شد", status: "SENT" },
  { label: "ناموفق", status: "FAILED" },
  { label: "در صف", status: "QUEUED" },
];

export function SentHistoryTab({ messages }: { messages: SentMessageRowData[] }) {
  const [filter, setFilter] = useState(0);
  const [detail, setDetail] = useState<SentMessageRowData | null>(null);
  const activeStatus = FILTERS[filter].status;

  const filtered = useMemo(
    () => (activeStatus ? messages.filter((m) => m.status === activeStatus) : messages),
    [messages, activeStatus]
  );

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
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
        {filtered.length === 0 && <div className="p-6 text-center text-sm text-text-3">پیامکی یافت نشد.</div>}
        {filtered.map((m, i) => (
          <SentRow key={m.id} message={m} index={i} onDetails={() => setDetail(m)} />
        ))}
      </div>

      {detail && <SentDetailModal message={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
