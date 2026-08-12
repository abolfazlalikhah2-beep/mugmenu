import "server-only";
import { prisma } from "@/lib/db";
import type { WalletTransactionType } from "@/lib/generated/prisma/enums";

export function findBusinessBySlug(slug: string) {
  return prisma.business.findUnique({ where: { slug } });
}

export function getBusinessCashbackSettings(businessId: string) {
  return prisma.business.findUnique({
    where: { id: businessId },
    select: { cashbackEnabled: true, cashbackPercent: true, cashbackCapPerOrder: true },
  });
}

// ---------- Accounts ----------

export function findAccountByPhone(businessId: string, phone: string) {
  return prisma.customerAccount.findUnique({ where: { businessId_phone: { businessId, phone } } });
}

export function getAccountById(id: string) {
  return prisma.customerAccount.findUnique({ where: { id } });
}

export function createAccount(data: { businessId: string; phone: string; fullName: string }) {
  return prisma.customerAccount.create({ data });
}

export function updateAccountName(id: string, fullName: string) {
  return prisma.customerAccount.update({ where: { id }, data: { fullName } });
}

// ---------- Wallet ----------

export interface CreditWalletData {
  customerAccountId: string;
  orderId?: string;
  type: WalletTransactionType;
  amount: number;
  note?: string;
}

/** Ledger entry + running balance update in one transaction. */
export function creditWallet(data: CreditWalletData) {
  const { customerAccountId, ...rest } = data;
  return prisma.$transaction([
    prisma.walletTransaction.create({ data: { customerAccountId, ...rest } }),
    prisma.customerAccount.update({
      where: { id: customerAccountId },
      data: { walletBalance: { increment: data.amount } },
    }),
  ]);
}

export function incrementLoyaltyPoints(customerAccountId: string, points: number) {
  return prisma.customerAccount.update({
    where: { id: customerAccountId },
    data: { loyaltyPoints: { increment: points } },
  });
}

export function getWalletTransactions(customerAccountId: string, take = 20) {
  return prisma.walletTransaction.findMany({
    where: { customerAccountId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

// ---------- Addresses ----------

export function getAddresses(customerAccountId: string) {
  return prisma.customerAddress.findMany({
    where: { customerAccountId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
}

export function getAddressById(id: string) {
  return prisma.customerAddress.findUnique({ where: { id } });
}

export function countAddresses(customerAccountId: string) {
  return prisma.customerAddress.count({ where: { customerAccountId } });
}

export interface AddressInput {
  customerAccountId: string;
  title: string;
  text: string;
  phone: string;
  isDefault: boolean;
}

export async function createAddress(data: AddressInput) {
  if (data.isDefault) await unsetOtherDefaults(data.customerAccountId);
  return prisma.customerAddress.create({ data });
}

export async function updateAddress(id: string, data: Omit<AddressInput, "customerAccountId">) {
  if (data.isDefault) {
    const existing = await prisma.customerAddress.findUnique({ where: { id } });
    if (existing) await unsetOtherDefaults(existing.customerAccountId, id);
  }
  return prisma.customerAddress.update({ where: { id }, data });
}

export function deleteAddress(id: string) {
  return prisma.customerAddress.delete({ where: { id } });
}

async function unsetOtherDefaults(customerAccountId: string, excludeId?: string) {
  await prisma.customerAddress.updateMany({
    where: { customerAccountId, isDefault: true, ...(excludeId ? { id: { not: excludeId } } : {}) },
    data: { isDefault: false },
  });
}

export function setAddressDefault(id: string, customerAccountId: string) {
  return prisma.$transaction([
    prisma.customerAddress.updateMany({ where: { customerAccountId }, data: { isDefault: false } }),
    prisma.customerAddress.update({ where: { id }, data: { isDefault: true } }),
  ]);
}

// ---------- Orders (customer-facing) ----------

export function getOrdersForCustomer(customerAccountId: string) {
  return prisma.order.findMany({
    where: { customerAccountId },
    include: {
      items: { include: { product: true } },
      walletTransactions: { where: { type: "CASHBACK_EARNED" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getOrderForCustomer(orderId: string, customerAccountId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, customerAccountId },
    include: {
      items: { include: { product: true } },
      business: true,
      walletTransactions: { where: { type: "CASHBACK_EARNED" } },
    },
  });
}
