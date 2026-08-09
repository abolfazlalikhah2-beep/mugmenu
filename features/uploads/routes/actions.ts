"use server";

import { logger } from "@/lib/logger";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { uploadImage } from "@/features/uploads/services/storage-service";
import {
  uploadKindSchema,
  imageFileSchema,
  attachmentFileSchema,
  EXTENSION_BY_MIME_TYPE,
  ATTACHMENT_EXTENSION_BY_MIME_TYPE,
} from "@/features/uploads/services/upload-schemas";

export interface UploadImageResult {
  url?: string;
  error?: string;
}

export async function uploadImageAction(kind: string, formData: FormData): Promise<UploadImageResult> {
  const { businessId } = await requireBusinessOwner();

  const kindParsed = uploadKindSchema.safeParse(kind);
  if (!kindParsed.success) return { error: "نوع فایل نامعتبر است." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "فایلی انتخاب نشده است." };

  const fileParsed = imageFileSchema.safeParse({ type: file.type, size: file.size });
  if (!fileParsed.success) return { error: fileParsed.error.issues[0].message };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage({
      kind: kindParsed.data,
      businessId,
      buffer,
      contentType: fileParsed.data.type,
      extension: EXTENSION_BY_MIME_TYPE[fileParsed.data.type],
    });
    logger.info("uploads.image_uploaded", { businessId, kind: kindParsed.data });
    return { url };
  } catch (e) {
    logger.error("uploads.image_upload_failed", {
      businessId,
      kind: kindParsed.data,
      error: e instanceof Error ? e.message : String(e),
    });
    return { error: e instanceof Error ? e.message : "آپلود تصویر با خطا مواجه شد." };
  }
}

export async function uploadTicketAttachmentAction(formData: FormData): Promise<UploadImageResult> {
  const { businessId } = await requireBusinessOwner();

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "فایلی انتخاب نشده است." };

  const fileParsed = attachmentFileSchema.safeParse({ type: file.type, size: file.size });
  if (!fileParsed.success) return { error: fileParsed.error.issues[0].message };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage({
      kind: "tickets",
      businessId,
      buffer,
      contentType: fileParsed.data.type,
      extension: ATTACHMENT_EXTENSION_BY_MIME_TYPE[fileParsed.data.type],
    });
    logger.info("uploads.ticket_attachment_uploaded", { businessId });
    return { url };
  } catch (e) {
    logger.error("uploads.ticket_attachment_upload_failed", {
      businessId,
      error: e instanceof Error ? e.message : String(e),
    });
    return { error: e instanceof Error ? e.message : "آپلود فایل با خطا مواجه شد." };
  }
}
