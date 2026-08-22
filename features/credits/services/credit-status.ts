import type { CreditStatus } from "@/lib/generated/prisma/enums";

/** Pure — no I/O — trivial to unit test. A credit is PAID once the running total reaches (or exceeds) the order amount, otherwise PARTIAL as soon as anything has been received. */
export function computeCreditStatus(amount: number, paidAmount: number): CreditStatus {
  return paidAmount >= amount ? "PAID" : "PARTIAL";
}
