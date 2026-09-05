"use client";

import type { UploadImageResult } from "@/features/uploads/routes/actions";

/**
 * Drop-in replacement for uploadImageAction as the `action` prop of
 * ImageUploadField: same (kind, formData) => Promise<{url} | {error}>
 * signature, but uploads straight to S3 from the browser via a presigned
 * URL instead of going through a Server Action — see
 * app/api/upload/presign/route.ts for why (Liara's proxy 413s Server
 * Action bodies over ~1MB regardless of the configured bodySizeLimit).
 */
export async function presignedUploadAction(kind: string, formData: FormData): Promise<UploadImageResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "فایلی انتخاب نشده است." };

  let presignedUrl: string;
  let publicUrl: string;
  try {
    const res = await fetch("/api/upload/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type, kind }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "دریافت لینک آپلود با خطا مواجه شد." };
    presignedUrl = data.presignedUrl;
    publicUrl = data.publicUrl;
  } catch {
    return { error: "دریافت لینک آپلود با خطا مواجه شد. دوباره تلاش کنید." };
  }

  try {
    const putRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putRes.ok) return { error: "آپلود تصویر با خطا مواجه شد. دوباره تلاش کنید." };
  } catch {
    return { error: "آپلود تصویر با خطا مواجه شد. دوباره تلاش کنید." };
  }

  return { url: publicUrl };
}
