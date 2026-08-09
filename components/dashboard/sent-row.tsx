"use client";

import { MessageCircle, Calendar } from "lucide-react";
import { formatRelativeDateTime } from "@/features/dashboard/utils/relative-date";
import { cn } from "@/lib/utils";

export type SentMessageStatus = "SENT" | "PARTIAL" | "FAILED" | "QUEUED";

export interface SentMessageRowData {
  id: string;
  text: string;
  recipientCount: number;
  status: SentMessageStatus;
  createdAt: Date;
}

export const STATUS_META: Record<SentMessageStatus, { label: string; fg: string; bg: string }> = {
  SENT: { label: "ارسال شد", fg: "#328C3D", bg: "#E5F0E6" },
  PARTIAL: { label: "ارسال ناقص", fg: "#B7791F", bg: "#FCF3E3" },
  FAILED: { label: "ناموفق", fg: "#C0392B", bg: "#FBECEC" },
  QUEUED: { label: "در صف", fg: "#2563EB", bg: "#EAF1FE" },
};

export function SentRow({
  message,
  index,
  onDetails,
}: {
  message: SentMessageRowData;
  index: number;
  onDetails: () => void;
}) {
  const meta = STATUS_META[message.status];
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3.5 sm:gap-4 sm:px-3.5 sm:py-4",
        index > 0 && "border-t border-[#F4F4F4]"
      )}
    >
      <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#F4F5F4] sm:h-[46px] sm:w-[46px]">
        <MessageCircle size={20} className="text-[#5A5A5A]" />
      </div>
      <div className="min-w-0 flex-1 text-right">
        <div className="truncate text-sm font-medium sm:text-[15px]">{message.text}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-text-3">
          <span className="flex items-center gap-1">
            <Calendar size={13} className="text-[#9A9A9A]" />
            {formatRelativeDateTime(message.createdAt)}
          </span>
          <span>·</span>
          <span>{message.recipientCount.toLocaleString("fa-IR")} گیرنده</span>
          <span
            className="rounded-[9px] px-2.5 py-1 font-medium sm:hidden"
            style={{ color: meta.fg, background: meta.bg }}
          >
            {meta.label}
          </span>
        </div>
      </div>
      <span
        className="hidden shrink-0 rounded-[9px] px-3 py-[5px] text-xs font-medium sm:block"
        style={{ color: meta.fg, background: meta.bg }}
      >
        {meta.label}
      </span>
      <button
        type="button"
        onClick={onDetails}
        className="flex h-9 shrink-0 items-center rounded-[11px] bg-[#F4F5F4] px-4 text-[13px] text-[#5A5A5A]"
      >
        جزئیات
      </button>
    </div>
  );
}
