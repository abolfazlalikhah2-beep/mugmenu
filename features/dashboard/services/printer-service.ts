import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { printerSchema } from "@/features/dashboard/services/dashboard-schemas";
import { getReceiptPrinterProvider } from "@/lib/printing/receipt-printer-provider";
import type { Printer } from "@/lib/generated/prisma/client";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export function getPrinters(businessId: string) {
  return repo.getPrinters(businessId);
}

async function testAndPersist(printer: Printer) {
  const result = await getReceiptPrinterProvider().testPrint({
    id: printer.id,
    name: printer.name,
    connectionType: printer.connectionType,
    ipAddress: printer.ipAddress,
    port: printer.port,
  });
  await repo.setPrinterTestResult(printer.id, result.success);
}

export async function createPrinter(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = printerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const printer = await repo.createPrinter({ businessId, ...parsed.data });
  await testAndPersist(printer);
  logger.info("dashboard.printer_created", { businessId, printerId: printer.id });
  return { ok: true };
}

export async function updatePrinter(
  businessId: string,
  printerId: string,
  input: unknown
): Promise<ServiceResult> {
  const parsed = printerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await repo.getPrinterForEdit(printerId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "پرینتر پیدا نشد." };

  const printer = await repo.updatePrinter(printerId, parsed.data);
  await testAndPersist(printer);
  logger.info("dashboard.printer_updated", { businessId, printerId });
  return { ok: true };
}

export async function testPrinter(businessId: string, printerId: string): Promise<ServiceResult> {
  const existing = await repo.getPrinterForEdit(printerId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "پرینتر پیدا نشد." };

  await testAndPersist(existing);
  logger.info("dashboard.printer_tested", { businessId, printerId });
  return { ok: true };
}
