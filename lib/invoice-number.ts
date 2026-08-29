import "server-only";
import { prisma } from "@/lib/db";

/**
 * Atomically advances a business's daily receipt-invoice counter and
 * returns the new value, zero-padded to 3 digits ("001".."999"). A single
 * UPDATE...RETURNING (not a read-then-write) so concurrent orders for the
 * same business never race onto the same number. Resets to 1 whenever
 * Business.lastInvoiceDate isn't today, and wraps 999 back to 1 rather than
 * growing past 3 digits — see Business.lastInvoiceCounter's schema comment.
 */
export async function nextDailyInvoiceNumber(businessId: string): Promise<string> {
  const rows = await prisma.$queryRaw<{ counter: number }[]>`
    UPDATE "Business"
    SET "lastInvoiceCounter" = CASE
          WHEN "lastInvoiceDate" IS DISTINCT FROM CURRENT_DATE THEN 1
          WHEN "lastInvoiceCounter" >= 999 THEN 1
          ELSE "lastInvoiceCounter" + 1
        END,
        "lastInvoiceDate" = CURRENT_DATE
    WHERE id = ${businessId}
    RETURNING "lastInvoiceCounter" AS counter
  `;
  const counter = rows[0]?.counter ?? 1;
  return String(counter).padStart(3, "0");
}
