import "server-only";
import { logger } from "@/lib/logger";

/**
 * No real printer driver/agent is chosen yet (phase 3, see CLAUDE.md). Keep
 * the test-print path behind this interface so swapping in a real one
 * (network ESC/POS, a local print agent, etc.) later doesn't touch call
 * sites.
 */
export interface ReceiptPrinterProvider {
  testPrint(target: {
    id: string;
    name: string;
    connectionType: "NETWORK" | "USB" | "BLUETOOTH";
    ipAddress: string | null;
    port: string | null;
  }): Promise<{ success: boolean }>;
}

class MockReceiptPrinterProvider implements ReceiptPrinterProvider {
  async testPrint(target: {
    id: string;
    name: string;
    connectionType: "NETWORK" | "USB" | "BLUETOOTH";
    ipAddress: string | null;
    port: string | null;
  }): Promise<{ success: boolean }> {
    logger.info("printer.mock_test_print", {
      printerId: target.id,
      name: target.name,
      connectionType: target.connectionType,
      ipAddress: target.ipAddress,
      port: target.port,
    });
    return { success: true };
  }
}

let provider: ReceiptPrinterProvider | null = null;

export function getReceiptPrinterProvider(): ReceiptPrinterProvider {
  if (!provider) provider = new MockReceiptPrinterProvider();
  return provider;
}
