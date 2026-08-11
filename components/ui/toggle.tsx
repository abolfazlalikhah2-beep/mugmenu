"use client";

import { cn } from "@/lib/utils";

export function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors disabled:opacity-60",
        checked ? "bg-brand" : "bg-[#D6D6D6]"
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.2)] transition-all",
          checked ? "left-[3px]" : "left-[23px]"
        )}
      />
    </button>
  );
}
