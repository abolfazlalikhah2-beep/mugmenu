import { z } from "zod";

export const UPLOAD_KINDS = ["products", "categories", "logos", "hero", "tickets", "payments", "site-settings"] as const;
export type UploadKind = (typeof UPLOAD_KINDS)[number];

export const uploadKindSchema = z.enum(UPLOAD_KINDS);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const EXTENSION_BY_MIME_TYPE: Record<(typeof ALLOWED_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const imageFileSchema = z.object({
  type: z.enum(ALLOWED_IMAGE_TYPES, { message: "فقط تصاویر jpg، png یا webp مجاز است." }),
  size: z
    .number()
    .int()
    .positive("فایل انتخاب‌شده خالی است.")
    .max(MAX_IMAGE_BYTES, "حجم تصویر باید حداکثر ۵ مگابایت باشد."),
});

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const ALLOWED_ATTACHMENT_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

export const ATTACHMENT_EXTENSION_BY_MIME_TYPE: Record<(typeof ALLOWED_ATTACHMENT_TYPES)[number], string> = {
  ...EXTENSION_BY_MIME_TYPE,
  "application/pdf": "pdf",
};

/** Ticket attachments: image or PDF, unlike imageFileSchema above. */
export const attachmentFileSchema = z.object({
  type: z.enum(ALLOWED_ATTACHMENT_TYPES, { message: "فقط عکس یا PDF مجاز است." }),
  size: z
    .number()
    .int()
    .positive("فایل انتخاب‌شده خالی است.")
    .max(MAX_ATTACHMENT_BYTES, "حجم فایل باید حداکثر ۵ مگابایت باشد."),
});
