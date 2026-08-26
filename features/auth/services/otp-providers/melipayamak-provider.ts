import "server-only";
import { logger } from "@/lib/logger";
import type { OtpProvider } from "@/features/auth/services/otp-service";

/**
 * Melipayamak's پترن (pattern-based) REST endpoint — sends a pre-approved
 * SMS template with the OTP code substituted in. Faster delivery and much
 * less likely to be spam-filtered than a plain-text SMS, which is why
 * Melipayamak (and most Iranian providers) recommend it specifically for
 * OTP codes. Melipayamak switched this endpoint to API-Key auth (an
 * `apikey` request header) and dropped username+password — MELIPAYAMAK_API_KEY
 * is that key. MELIPAYAMAK_BODY_ID still selects which approved pattern
 * (تنظیم‌شده در پنل) to use; that pattern's own template text is what
 * determines which sender line it goes out on, so no separate sender-line
 * env var is needed.
 */
const ENDPOINT = "https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber";

interface MelipayamakResponse {
  RetStatus: number;
  Value: string;
  StrRetStatus: string;
}

export class MelipayamakOtpProvider implements OtpProvider {
  constructor(
    private readonly apiKey: string,
    private readonly bodyId: string
  ) {}

  async sendOtp(phone: string, code: string): Promise<{ success: boolean }> {
    let res: Response;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: this.apiKey,
        },
        body: JSON.stringify({ to: phone, bodyId: this.bodyId, text: code }),
      });
    } catch (e) {
      logger.error("otp.melipayamak_request_failed", { phone, error: String(e) });
      return { success: false };
    }

    if (!res.ok) {
      logger.error("otp.melipayamak_http_error", { phone, status: res.status });
      return { success: false };
    }

    let data: MelipayamakResponse;
    try {
      data = await res.json();
    } catch {
      logger.error("otp.melipayamak_bad_response", { phone });
      return { success: false };
    }

    // RetStatus === 1 is Melipayamak's documented "sent" status; any other
    // value is a numeric error code in the same field (bad bodyId,
    // insufficient credit, blocked number, ...).
    if (data.RetStatus !== 1) {
      logger.error("otp.melipayamak_send_failed", { phone, retStatus: data.RetStatus, value: data.Value });
      return { success: false };
    }

    logger.info("otp.melipayamak_sent", { phone, recId: data.Value });
    return { success: true };
  }
}
