import "server-only";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { logger } from "@/lib/logger";
import * as otpRepository from "@/features/auth/repositories/otp-repository";
import { MelipayamakOtpProvider } from "@/features/auth/services/otp-providers/melipayamak-provider";
import type { OtpPurpose } from "@/lib/generated/prisma/enums";

/**
 * Keep the send path behind this interface so swapping providers doesn't
 * touch call sites — see otp-providers/melipayamak-provider.ts for the real
 * one used in production.
 */
export interface OtpProvider {
  sendOtp(phone: string, code: string): Promise<{ success: boolean }>;
}

class MockOtpProvider implements OtpProvider {
  async sendOtp(phone: string, code: string): Promise<{ success: boolean }> {
    logger.info("otp.mock_send", { phone, code });
    return { success: true };
  }
}

function getOtpProvider(): OtpProvider {
  const { MELIPAYAMAK_USERNAME, MELIPAYAMAK_PASSWORD, MELIPAYAMAK_BODY_ID } = process.env;
  // Only send real SMS when Melipayamak is actually configured (production);
  // local dev keeps logging the code via MockOtpProvider by default.
  // Re-read env vars and construct fresh on every call (no cached singleton)
  // so a config change takes effect without a process restart.
  const provider =
    MELIPAYAMAK_USERNAME && MELIPAYAMAK_PASSWORD && MELIPAYAMAK_BODY_ID
      ? new MelipayamakOtpProvider(MELIPAYAMAK_USERNAME, MELIPAYAMAK_PASSWORD, MELIPAYAMAK_BODY_ID)
      : new MockOtpProvider();
  logger.info("otp.provider", { type: provider instanceof MelipayamakOtpProvider ? "real" : "mock" });
  return provider;
}

const OTP_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 }; // 3 sends / 10 min / phone
// A second, coarser bucket per IP — the per-phone limit alone doesn't stop
// one client from cycling through many phone numbers to run up SMS cost.
const OTP_IP_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 }; // 10 sends / 10 min / IP
// Codes are only 4 digits (10,000 possibilities) — cap verify attempts per
// phone+purpose so they can't be brute-forced before OTP_TTL_MS expiry.
const OTP_VERIFY_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
const OTP_TTL_MS = 5 * 60 * 1000;

export class OtpRateLimitError extends Error {
  constructor() {
    super("تعداد درخواست‌های ارسال کد بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.");
    this.name = "OtpRateLimitError";
  }
}

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function sendOtp(phone: string, purpose: OtpPurpose): Promise<{ success: boolean }> {
  const ip = await getClientIp();
  const { allowed: phoneAllowed } = checkRateLimit(`otp:${phone}`, OTP_LIMIT);
  if (!phoneAllowed) {
    logger.warn("otp.rate_limited", { phone });
    throw new OtpRateLimitError();
  }
  const { allowed: ipAllowed } = checkRateLimit(`otp-ip:${ip}`, OTP_IP_LIMIT);
  if (!ipAllowed) {
    logger.warn("otp.ip_rate_limited", { ip });
    throw new OtpRateLimitError();
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  await otpRepository.createOtp({ phone, purpose, codeHash, expiresAt: new Date(Date.now() + OTP_TTL_MS) });
  return getOtpProvider().sendOtp(phone, code);
}

export async function verifyOtp(phone: string, purpose: OtpPurpose, code: string): Promise<boolean> {
  const { allowed } = checkRateLimit(`otp-verify:${phone}:${purpose}`, OTP_VERIFY_LIMIT);
  if (!allowed) {
    logger.warn("otp.verify_rate_limited", { phone, purpose });
    return false;
  }

  const record = await otpRepository.findLatestActiveOtp(phone, purpose);
  if (!record || record.expiresAt < new Date()) {
    logger.info("otp.verify_no_active_code", { phone, purpose });
    return false;
  }

  const matches = await bcrypt.compare(code, record.codeHash);
  if (!matches) {
    logger.info("otp.verify_mismatch", { phone, purpose });
    return false;
  }

  await otpRepository.consumeOtp(record.id);
  return true;
}
