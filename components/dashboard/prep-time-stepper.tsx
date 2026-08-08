"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function PrepTimeStepper({
  name,
  defaultValue,
  min = 5,
  max = 180,
  step = 5,
  disabled,
}: {
  name: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div
      className={cn(
        "flex h-[46px] items-center overflow-hidden rounded-xl border",
        disabled ? "border-[#EAEAEA]" : "border-border-input"
      )}
    >
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setValue((v) => Math.min(max, v + step))}
        disabled={disabled}
        aria-label="افزایش زمان"
        className={cn(
          "flex h-full w-11 items-center justify-center text-[22px]",
          disabled ? "text-[#C7C7C7]" : "text-brand"
        )}
      >
        +
      </button>
      <div className="flex w-16 flex-col items-center leading-none">
        <span className="text-lg font-semibold">{value.toLocaleString("fa-IR")}</span>
        <span className="mt-0.5 text-[10px] font-light text-text-3">دقیقه</span>
      </div>
      <button
        type="button"
        onClick={() => setValue((v) => Math.max(min, v - step))}
        disabled={disabled}
        aria-label="کاهش زمان"
        className="flex h-full w-11 items-center justify-center text-2xl text-[#B0B0B0]"
      >
        −
      </button>
    </div>
  );
}
