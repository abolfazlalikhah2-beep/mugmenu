"use client";

import { ServerToggle } from "@/components/dashboard/server-toggle";
import { markLeadCaptureReadAction } from "@/features/leads/routes/actions";
import { cn } from "@/lib/utils";

export interface LeadCaptureData {
  id: string;
  phone: string;
  source: string;
  isRead: boolean;
  createdAt: Date;
}

export function LeadCaptureRow({ lead, isFirst }: { lead: LeadCaptureData; isFirst: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3.5",
        !isFirst && "border-t border-[#F4F4F4]",
        !lead.isRead && "bg-[#F9FBF9]"
      )}
    >
      <div dir="ltr" className="min-w-0 flex-1 text-right text-sm font-medium sm:text-[15px]">
        {lead.phone}
      </div>
      <span className="hidden shrink-0 rounded-[9px] bg-[#F0F0F0] px-3 py-1 text-xs font-light text-text-3 sm:block">
        {lead.source}
      </span>
      <span className="hidden shrink-0 text-xs font-light text-text-3 sm:block">
        {lead.createdAt.toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" })}
      </span>
      <ServerToggle initial={lead.isRead} action={(next) => markLeadCaptureReadAction(lead.id, next)} />
    </div>
  );
}
