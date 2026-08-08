"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImageAction } from "@/features/uploads/routes/actions";
import type { UploadKind } from "@/features/uploads/services/upload-schemas";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploadField({
  kind,
  name,
  defaultUrl,
  label,
  helpText,
  className,
  boxClassName,
}: {
  kind: UploadKind;
  name: string;
  defaultUrl?: string | null;
  label?: string;
  helpText?: string;
  className?: string;
  boxClassName?: string;
}) {
  const [url, setUrl] = React.useState(defaultUrl ?? "");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("فقط تصاویر jpg، png یا webp مجاز است.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("حجم تصویر باید حداکثر ۵ مگابایت باشد.");
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.set("file", file);
    try {
      const result = await uploadImageAction(kind, formData);
      if (result.error) setError(result.error);
      else if (result.url) setUrl(result.url);
    } catch {
      setError("آپلود تصویر با خطا مواجه شد. دوباره تلاش کنید.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-right text-[13px] font-light text-text-4">{label}</label>}
      <div className="flex items-center gap-4.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#CFCFCF] bg-[#FAFBFA] disabled:opacity-70",
            boxClassName ?? "h-[88px] w-[88px]"
          )}
        >
          {url ? (
            <Image src={url} alt="" fill sizes="88px" className="object-cover" />
          ) : (
            <ImagePlus size={26} className="text-[#B8B8B8]" />
          )}
          {pending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <Loader2 size={22} className="animate-spin text-white" />
            </div>
          )}
        </button>
        <div className="text-right">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="text-[13px] font-medium text-brand disabled:opacity-60"
          >
            {url ? "تغییر تصویر" : "انتخاب تصویر"}
          </button>
          <div className="mt-1 text-xs font-light leading-[1.7] text-text-3">
            {helpText ?? "jpg، png یا webp، حداکثر ۵ مگابایت"}
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input type="hidden" name={name} value={url} />
      {error && <p className="text-right text-xs text-red-500">{error}</p>}
    </div>
  );
}
