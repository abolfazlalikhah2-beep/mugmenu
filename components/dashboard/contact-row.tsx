"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteContactAction } from "@/features/dashboard/routes/actions";
import { cn } from "@/lib/utils";

export interface ContactRowData {
  id: string;
  name: string;
  phone: string;
}

export function ContactRow({ contact, index }: { contact: ContactRowData; index: number }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`مخاطب «${contact.name}» حذف شود؟`)) return;
    startTransition(async () => {
      await deleteContactAction(contact.id);
    });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3 sm:gap-4 sm:px-3.5 sm:py-3.5",
        index > 0 && "border-t border-[#F4F4F4]"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F0E6] text-sm font-semibold text-brand sm:h-11 sm:w-11 sm:text-[15px]">
        {contact.name.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1 text-right">
        <div className="truncate text-sm font-medium sm:text-[15px]">{contact.name}</div>
        <div dir="ltr" className="mt-0.5 text-right text-xs font-light text-text-3">
          {contact.phone}
        </div>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        aria-label={`حذف ${contact.name}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#FBECEC] disabled:opacity-60"
      >
        <Trash2 size={18} className="text-[#D06666]" />
      </button>
    </div>
  );
}
