import "server-only";
import { prisma } from "@/lib/db";
import type { CreditStatus } from "@/lib/generated/prisma/enums";

export interface CreateCreditRecordData {
  businessId: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  notes?: string;
}

export function createCreditRecord(data: CreateCreditRecordData) {
  return prisma.creditRecord.create({ data });
}

/** `dateRange` bounds the underlying order's createdAt (the "تاریخ سفارش" column shown to the user), not the credit record's own createdAt. */
export function getCreditRecords(
  businessId: string,
  status?: CreditStatus,
  dateRange?: { gte: Date; lte: Date }
) {
  return prisma.creditRecord.findMany({
    where: {
      businessId,
      ...(status ? { status } : {}),
      ...(dateRange ? { order: { createdAt: dateRange } } : {}),
    },
    include: { order: { select: { createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getCreditRecordById(id: string) {
  return prisma.creditRecord.findUnique({
    where: { id },
    include: {
      order: {
        select: {
          id: true,
          createdAt: true,
          type: true,
          items: { include: { product: { select: { name: true } } } },
        },
      },
    },
  });
}

export interface SettleCreditRecordData {
  paidAmount: number;
  status: CreditStatus;
  notes: string | null;
  settledAt: Date | null;
}

export function updateCreditRecord(id: string, data: SettleCreditRecordData) {
  return prisma.creditRecord.update({ where: { id }, data });
}

export function getOutstandingCreditForRange(businessId: string, range: { gte: Date; lt: Date }) {
  return prisma.creditRecord.findMany({
    where: { businessId, status: { in: ["UNPAID", "PARTIAL"] }, createdAt: range },
    select: { amount: true, paidAmount: true },
  });
}
