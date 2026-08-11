"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Selectable chip shared by the review form's item/tag pickers and the survey's answer options. */
export function FeedbackChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-chip border px-3.5 text-[13px] transition-colors",
        selected ? "border-brand/30 bg-brand/10 text-brand" : "border-border-chip bg-chip text-[#666]"
      )}
    >
      {selected && <Check size={14} />}
      {children}
    </button>
  );
}
