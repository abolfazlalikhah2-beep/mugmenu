import "server-only";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { logger } from "@/lib/logger";

/**
 * SMS OTP provider is not chosen yet (see CLAUDE.md). Keep the send path
 * behind this interface so swapping in a real provider later doesn't touch
 * call sites.
 */
export interface OtpProvider {
  sendOtp(phone: string): Promise<{ success: boolean }>;
}

class MockOtpProvider implements OtpProvider {
  async sendOtp(phone: string): Promise<{ success: boolean }> {
    const code = Math.floor(1000 + Math.random() * 9000);
    logger.info("otp.mock_send", { phone, code });
    return { success: true };
  }
}

let provider: OtpProvider | null = null;

function getOtpProvider(): OtpProvider {
  if (!provider) provider = new MockOtpProvider();
  return provider;
}

const OTP_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 }; // 3 sends / 10 min / phone
// A second, coarser bucket per IP — the per-phone limit alone doesn't stop
// one client from cycling through many phone numbers to run up SMS cost.
const OTP_IP_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 }; // 10 sends / 10 min / IP

export class OtpRateLimitError extends Error {
  constructor() {
    super("تعداد درخواست‌های ارسال کد بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.");
    this.name = "OtpRateLimitError";
  }
}

export async function sendOtp(phone: string): Promise<{ success: boolean }> {
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
  return getOtpProvider().sendOtp(phone);
}
