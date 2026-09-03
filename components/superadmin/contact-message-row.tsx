"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ServerToggle } from "@/components/dashboard/server-toggle";
import { markContactMessageReadAction } from "@/features/contact/routes/actions";
import { cn } from "@/lib/utils";

export interface ContactMessageData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export function ContactMessageRow({ contact, isFirst }: { contact: ContactMessageData; isFirst: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn("flex flex-col gap-2.5 py-3.5", !isFirst && "border-t border-[#F4F4F4]", !contact.isRead && "bg-[#F9FBF9]")}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F4F5F4] text-base font-semibold text-[#7A7A7A]">
          {contact.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="truncate text-sm font-medium sm:text-[15px]">{contact.name}</div>
          <div dir="ltr" className="mt-0.5 text-right text-xs font-light text-text-3">
            {contact.phone}
            {contact.email ? ` · ${contact.email}` : ""}
          </div>
        </div>
        <span className="hidden shrink-0 text-xs font-light text-text-3 sm:block">
          {contact.createdAt.toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" })}
        </span>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label="نمایش پیام"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#F4F5F4]"
        >
          <ChevronDown size={18} className={cn("text-[#5A5A5A] transition-transform", expanded && "rotate-180")} />
        </button>
        <ServerToggle initial={contact.isRead} action={(next) => markContactMessageReadAction(contact.id, next)} />
      </div>
      {expanded && (
        <div className="rounded-[14px] bg-[#F6F6F6] p-3.5 text-right text-sm font-light leading-7 text-ink">
          {contact.message}
        </div>
      )}
    </div>
  );
}
