import "server-only";
import { logger } from "@/lib/logger";

/**
 * No real SMS panel provider is chosen yet (phase 3, see CLAUDE.md). Keep
 * connection-testing and sending behind this interface so swapping in a
 * real one (Kavenegar, Melipayamak, ...) later doesn't touch call sites.
 */
export interface SmsProvider {
  testConnection(credentials: {
    provider: string;
    username: string | null;
    apiKey: string;
    senderNumber: string | null;
  }): Promise<{ connected: boolean; credit: number }>;

  sendSms(target: { phone: string; text: string }): Promise<{ success: boolean }>;
}

class MockSmsProvider implements SmsProvider {
  async testConnection(credentials: {
    provider: string;
    username: string | null;
    apiKey: string;
    senderNumber: string | null;
  }): Promise<{ connected: boolean; credit: number }> {
    logger.info("sms.mock_test_connection", {
      provider: credentials.provider,
      username: credentials.username,
      senderNumber: credentials.senderNumber,
    });
    return { connected: true, credit: 4200 };
  }

  async sendSms(target: { phone: string; text: string }): Promise<{ success: boolean }> {
    logger.info("sms.mock_send", { phone: target.phone, textLength: target.text.length });
    return { success: true };
  }
}

let provider: SmsProvider | null = null;

export function getSmsProvider(): SmsProvider {
  if (!provider) provider = new MockSmsProvider();
  return provider;
}
