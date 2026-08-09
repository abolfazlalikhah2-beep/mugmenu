"use client";

import * as React from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { uploadTicketAttachmentAction } from "@/features/uploads/routes/actions";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export interface TicketAttachment {
  url: string;
  name: string;
}

export function TicketAttachmentField({
  value,
  onChange,
  urlFieldName,
  nameFieldName,
  label,
  compact,
}: {
  value: TicketAttachment | null;
  onChange: (v: TicketAttachment | null) => void;
  urlFieldName: string;
  nameFieldName: string;
  label?: string;
  compact?: boolean;
}) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("فقط عکس یا PDF مجاز است.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("حجم فایل باید حداکثر ۵ مگابایت باشد.");
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.set("file", file);
    try {
      const result = await uploadTicketAttachmentAction(formData);
      if (result.error) setError(result.error);
      else if (result.url) onChange({ url: result.url, name: file.name });
    } catch {
      setError("آپلود فایل با خطا مواجه شد. دوباره تلاش کنید.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-right text-[13px] font-light text-text-4">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[10px_14px]">
          <FileText size={18} className="shrink-0 text-brand" />
          <span className="min-w-0 flex-1 truncate text-right text-[13px] text-[#555]">{value.name}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="حذف پیوست"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F0F0F0]"
          >
            <X size={14} className="text-[#8A8A8A]" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#CFCFCF] bg-[#FAFBFA] disabled:opacity-70",
            compact ? "p-3" : "p-[18px]"
          )}
        >
          {pending ? (
            <Loader2 size={22} className="animate-spin text-brand" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3EB]">
              <Upload size={20} className="text-brand" />
            </div>
          )}
          <span className="text-[13px] font-medium text-brand">انتخاب فایل یا کشیدن به این‌جا</span>
          <span className="text-[11px] font-light text-text-3">عکس یا PDF · حداکثر ۵ مگابایت</span>
        </button>
      )}
      <input type="hidden" name={urlFieldName} value={value?.url ?? ""} />
      <input type="hidden" name={nameFieldName} value={value?.name ?? ""} />
      {error && <p className="text-right text-xs text-red-500">{error}</p>}
    </div>
  );
}
