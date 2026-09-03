import "server-only";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import * as contactMessageRepository from "@/features/contact/repositories/contact-message-repository";
import { contactMessageSchema } from "@/features/contact/services/contact-schemas";

export type ContactServiceResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

// Anonymous public form, no OTP/session gate — cap submissions per IP so it
// can't be used to spam the ContactMessage table.
const CONTACT_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 };

export async function submitContactMessage(input: unknown): Promise<ContactServiceResult> {
  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: parsed.error.issues[0].message, fieldErrors };
  }

  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`contact:${ip}`, CONTACT_LIMIT);
  if (!allowed) {
    logger.warn("contact.rate_limited", { ip });
    return { ok: false, error: "تعداد پیام‌های ارسالی بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const { name, phone, email, message } = parsed.data;
  await contactMessageRepository.createContactMessage({
    name,
    phone,
    email: email || undefined,
    message,
  });
  logger.info("contact.submitted", { phone });
  return { ok: true };
}

export function getContactMessages() {
  return contactMessageRepository.getContactMessages();
}

export function setContactMessageRead(id: string, isRead: boolean) {
  return contactMessageRepository.markContactMessageRead(id, isRead);
}
