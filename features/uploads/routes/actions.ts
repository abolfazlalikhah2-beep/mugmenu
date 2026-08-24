"use server";

import { logger } from "@/lib/logger";
import { requireSession, requireBusinessOwner } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
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
    const message = e instanceof Error ? e.message : String(e);
    logger.error("uploads.image_upload_failed", { businessId, kind: kindParsed.data, error: message });
    return { error: message || "آپلود تصویر با خطا مواجه شد." };
  }
}

/**
 * Onboarding's own logo field calls this instead of uploadImageAction: the
 * business doesn't exist yet at that point (see completeOnboarding, which
 * creates it from the whole form including this URL) so requireBusinessOwner
 * would redirect straight back to /onboarding before the file ever reached
 * S3 — being signed in is enough here, since the file only ever gets
 * attached to the business this same user is about to create. Namespaced
 * under the user's own id instead of a businessId, since none exists yet.
 */
export async function uploadOnboardingImageAction(kind: string, formData: FormData): Promise<UploadImageResult> {
  const session = await requireSession();
  const user = await findUserByPhone(session.phone);
  if (!user) return { error: "کاربر پیدا نشد." };

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
      businessId: user.id,
      buffer,
      contentType: fileParsed.data.type,
      extension: EXTENSION_BY_MIME_TYPE[fileParsed.data.type],
    });
    logger.info("uploads.onboarding_image_uploaded", { userId: user.id, kind: kindParsed.data });
    return { url };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.error("uploads.onboarding_image_upload_failed", { userId: user.id, kind: kindParsed.data, error: message });
    return { error: message || "آپلود تصویر با خطا مواجه شد." };
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
    const message = e instanceof Error ? e.message : String(e);
    logger.error("uploads.ticket_attachment_upload_failed", { businessId, error: message });
    return { error: message || "آپلود فایل با خطا مواجه شد." };
  }
}
