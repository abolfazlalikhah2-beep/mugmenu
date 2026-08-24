import "server-only";
import { prisma } from "@/lib/db";
import type { PaymentRequestStatus } from "@/lib/generated/prisma/enums";

// ---------- Payment cards ----------

export function getAllPaymentCards() {
  return prisma.paymentCard.findMany({ orderBy: { createdAt: "desc" } });
}

export function getActivePaymentCards() {
  return prisma.paymentCard.findMany({ where: { isActive: true } });
}

export function getPaymentCardById(id: string) {
  return prisma.paymentCard.findUnique({ where: { id } });
}

export interface PaymentCardInput {
  bankName: string;
  cardNumber: string;
  accountNumber: string;
  holderName: string;
  isActive: boolean;
}

export function createPaymentCard(data: PaymentCardInput) {
  return prisma.paymentCard.create({ data });
}

export function updatePaymentCard(id: string, data: PaymentCardInput) {
  return prisma.paymentCard.update({ where: { id }, data });
}

export function setPaymentCardActive(id: string, isActive: boolean) {
  return prisma.paymentCard.update({ where: { id }, data: { isActive } });
}

export function deletePaymentCard(id: string) {
  return prisma.paymentCard.delete({ where: { id } });
}

// ---------- Payment requests ----------

export interface CreatePaymentRequestData {
  businessId: string;
  amount: number;
  assignedCardId: string;
  screenshotUrl: string;
}

export function createPaymentRequest(data: CreatePaymentRequestData) {
  return prisma.paymentRequest.create({ data });
}

export function getPaymentRequestsForBusiness(businessId: string, take = 10) {
  return prisma.paymentRequest.findMany({
    where: { businessId },
    include: { assignedCard: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function getAllPaymentRequests(filter?: { status?: PaymentRequestStatus }) {
  return prisma.paymentRequest.findMany({
    where: filter?.status ? { status: filter.status } : undefined,
    include: { business: { select: { id: true, name: true } }, assignedCard: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getPaymentRequestById(id: string) {
  return prisma.paymentRequest.findUnique({ where: { id } });
}

export interface UpdatePaymentRequestStatusData {
  status: PaymentRequestStatus;
  referenceNumber: string | null;
  notes: string | null;
  verifiedAt: Date;
}

export function updatePaymentRequestStatus(id: string, data: UpdatePaymentRequestStatusData) {
  return prisma.paymentRequest.update({ where: { id }, data });
}
