import "server-only";
import { logger } from "@/lib/logger";

/**
 * No real payment gateway is chosen yet (phase 3, see CLAUDE.md). Keep
 * connection-testing behind this interface so swapping in a real one
 * (Zarinpal, Saman, ...) later doesn't touch call sites.
 */
export interface PaymentGateway {
  testConnection(credentials: {
    merchantId: string;
    apiKey: string;
    callbackUrl: string;
    sandbox: boolean;
  }): Promise<{ connected: boolean }>;
}

class MockPaymentGateway implements PaymentGateway {
  async testConnection(credentials: {
    merchantId: string;
    apiKey: string;
    callbackUrl: string;
    sandbox: boolean;
  }): Promise<{ connected: boolean }> {
    logger.info("payments.mock_test_connection", {
      merchantId: credentials.merchantId,
      callbackUrl: credentials.callbackUrl,
      sandbox: credentials.sandbox,
    });
    return { connected: true };
  }
}

let gateway: PaymentGateway | null = null;

export function getPaymentGateway(): PaymentGateway {
  if (!gateway) gateway = new MockPaymentGateway();
  return gateway;
}
