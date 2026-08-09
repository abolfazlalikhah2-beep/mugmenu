"use client";

import { ModalShell } from "@/components/dashboard/modal-shell";
import { STATUS_META, type SentMessageRowData } from "@/components/dashboard/sent-row";
import { formatRelativeDateTime } from "@/features/dashboard/utils/relative-date";

export function SentDetailModal({
  message,
  onClose,
}: {
  message: SentMessageRowData;
  onClose: () => void;
}) {
  const meta = STATUS_META[message.status];
  return (
    <ModalShell title="جزئیات پیامک" maxWidth={480} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="whitespace-pre-wrap rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-4 text-right text-sm leading-8">
          {message.text}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span
            className="rounded-[9px] px-3 py-1 text-xs font-medium"
            style={{ color: meta.fg, background: meta.bg }}
          >
            {meta.label}
          </span>
          <span className="text-text-3">وضعیت</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>{message.recipientCount.toLocaleString("fa-IR")} نفر</span>
          <span className="text-text-3">گیرندگان</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>{formatRelativeDateTime(message.createdAt)}</span>
          <span className="text-text-3">تاریخ ارسال</span>
        </div>
      </div>
    </ModalShell>
  );
}
