"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { countSmsSegments } from "@/features/dashboard/utils/sms-length";

const VARIABLES: { token: string; label: string }[] = [
  { token: "{نام مشتری}", label: "نام مشتری" },
  { token: "{نام مجموعه}", label: "نام مجموعه" },
  { token: "{کد پیگیری}", label: "کد پیگیری" },
];

export function SmsMessageBox({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { segments, charsPerSegment, length } = countSmsSegments(value);

  function insertVariable(token: string) {
    const el = ref.current;
    if (!el) {
      onChange(value + token);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + token + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1.5">
        <label className="text-right text-[13px] font-light text-text-4">متن پیام</label>
        <textarea
          ref={ref}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="min-h-[120px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-ink outline-none focus:border-brand placeholder:text-[#B7B7B7]"
        />
        <div className="flex items-center justify-between text-[11px] font-light text-text-3">
          <span>
            {segments.toLocaleString("fa-IR")} پیامک · {charsPerSegment.toLocaleString("fa-IR")} کاراکتر فارسی
          </span>
          <span dir="ltr">
            {length.toLocaleString("fa-IR")} / {charsPerSegment.toLocaleString("fa-IR")}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {VARIABLES.map((v) => (
          <button
            key={v.token}
            type="button"
            onClick={() => insertVariable(v.token)}
            className="flex h-8 items-center gap-1.5 rounded-chip border-[0.3px] border-border-chip bg-chip px-3 text-xs text-[#555]"
          >
            <Plus size={13} className="text-[#8A8A8A]" />
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
