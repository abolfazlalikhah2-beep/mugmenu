"use client";

import { LeadCaptureRow, type LeadCaptureData } from "@/components/superadmin/lead-capture-row";

export function LeadsView({ leads }: { leads: LeadCaptureData[] }) {
  const unreadCount = leads.filter((l) => !l.isRead).length;

  return (
    <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="text-right">
        <div className="text-[17px] font-semibold">لیدهای ثبت‌شده</div>
        <div className="mt-1 text-xs font-light text-text-3">
          {leads.length.toLocaleString("fa-IR")} لید · {unreadCount.toLocaleString("fa-IR")} خوانده‌نشده
        </div>
      </div>
      <div className="flex flex-col">
        {leads.length === 0 && <div className="p-6 text-center text-sm text-text-3">لیدی ثبت نشده است.</div>}
        {leads.map((l, i) => (
          <LeadCaptureRow key={l.id} lead={l} isFirst={i === 0} />
        ))}
      </div>
    </div>
  );
}
