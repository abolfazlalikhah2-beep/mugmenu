import "server-only";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import * as leadRepository from "@/features/leads/repositories/lead-repository";
import { leadCaptureSchema } from "@/features/leads/services/lead-schemas";

export type LeadServiceResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };

// Anonymous public capture, no OTP/session gate — cap submissions per IP so it can't spam the LeadCapture table.
const LEAD_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

export async function submitLeadCapture(input: unknown): Promise<LeadServiceResult> {
  const parsed = leadCaptureSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: parsed.error.issues[0].message, fieldErrors };
  }

  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`lead:${ip}`, LEAD_LIMIT);
  if (!allowed) {
    logger.warn("lead.rate_limited", { ip });
    return { ok: false, error: "تعداد درخواست‌های ارسالی بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const { phone, source } = parsed.data;
  await leadRepository.createLeadCapture({ phone, source });
  logger.info("lead.submitted", { phone, source: source ?? "homepage" });
  return { ok: true };
}

export function getLeadCaptures() {
  return leadRepository.getLeadCaptures();
}

export function setLeadCaptureRead(id: string, isRead: boolean) {
  return leadRepository.markLeadCaptureRead(id, isRead);
}
