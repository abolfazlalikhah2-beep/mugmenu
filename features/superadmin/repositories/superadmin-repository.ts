import "server-only";
import { prisma } from "@/lib/db";
import type {
  PlatformRole,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TransactionStatus,
} from "@/lib/generated/prisma/enums";

const OWNER_INCLUDE = { owners: { where: { role: "OWNER" as const }, take: 1 } };
const HAS_PAID_TX_INCLUDE = {
  transactions: { where: { status: "PAID" as const }, take: 1, select: { id: true } },
};

// ---------- Businesses (customers) ----------

export function getBusinessesForList(search?: string) {
  return prisma.business.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { owners: { some: { fullName: { contains: search, mode: "insensitive" } } } },
            { owners: { some: { phone: { contains: search } } } },
          ],
        }
      : undefined,
    include: { ...OWNER_INCLUDE, ...HAS_PAID_TX_INCLUDE, plan: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getBusinessesForPicker() {
  return prisma.business.findMany({
    select: { id: true, name: true, owners: { where: { role: "OWNER" }, take: 1, select: { fullName: true } } },
    orderBy: { name: "asc" },
  });
}

export function getBusinessDetail(businessId: string) {
  return prisma.business.findUnique({
    where: { id: businessId },
    include: { owners: { orderBy: { createdAt: "asc" } }, ...HAS_PAID_TX_INCLUDE, plan: true },
  });
}

export async function getBusinessActivitySummary(businessId: string) {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [productCount, ordersThisMonth, openTicketCount] = await Promise.all([
    prisma.product.count({ where: { businessId } }),
    prisma.order.count({ where: { businessId, createdAt: { gte: monthStart } } }),
    prisma.ticket.count({ where: { businessId, status: { in: ["OPEN", "PENDING"] } } }),
  ]);
  return { productCount, ordersThisMonth, openTicketCount };
}

export function getPaymentsForBusiness(businessId: string, take = 4) {
  return prisma.transaction.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function setBusinessSuspended(businessId: string, isSuspended: boolean) {
  return prisma.business.update({ where: { id: businessId }, data: { isSuspended } });
}

export function renewSubscriptionManually(businessId: string, amount: number, planName: string) {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 30);

  return prisma.$transaction([
    prisma.business.update({
      where: { id: businessId },
      data: { planStartedAt: now, planExpiresAt: expiresAt },
    }),
    prisma.transaction.create({ data: { businessId, amount, planName, status: "PAID" } }),
  ]);
}

// ---------- Finance ----------

export async function sumTransactionAmount(status: TransactionStatus, range: { gte: Date; lt?: Date }) {
  const result = await prisma.transaction.aggregate({
    where: { status, createdAt: range },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

export function countActiveSubscriptions(now: Date) {
  return prisma.business.count({ where: { isSuspended: false, planExpiresAt: { gt: now } } });
}

export function countNewSubscriptionsThisMonth(monthStart: Date) {
  return prisma.business.count({ where: { createdAt: { gte: monthStart } } });
}

export function countFailedTransactions(range: { gte: Date }) {
  return prisma.transaction.count({ where: { status: "FAILED", createdAt: range } });
}

export function getTransactionsForFinance(take = 30) {
  return prisma.transaction.findMany({
    include: { business: { include: OWNER_INCLUDE } },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function getPlatformSettings() {
  return prisma.platformSettings.findFirst();
}

export async function getOrCreatePlatformSettings() {
  const existing = await prisma.platformSettings.findFirst();
  if (existing) return existing;
  return prisma.platformSettings.create({ data: {} });
}

export function updatePlatformSettings(id: string, data: Record<string, unknown>) {
  return prisma.platformSettings.update({ where: { id }, data });
}

// ---------- Team users (super admin staff) ----------

export function getTeamUsers() {
  return prisma.user.findMany({ where: { isSuperAdmin: true }, orderBy: { createdAt: "asc" } });
}

export function getTeamUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function createTeamUser(data: {
  phone: string;
  fullName: string;
  passwordHash: string;
  platformRole: PlatformRole;
  platformTeam?: string;
}) {
  return prisma.user.create({ data: { ...data, isSuperAdmin: true } });
}

export function updateTeamUser(
  id: string,
  data: { fullName?: string; phone?: string; platformRole?: PlatformRole; platformTeam?: string }
) {
  return prisma.user.update({ where: { id }, data });
}

export function setTeamUserActive(id: string, isActive: boolean) {
  return prisma.user.update({ where: { id }, data: { isActive } });
}

// ---------- Tickets (all businesses) ----------

export function getInboundTickets(filter: { status?: TicketStatus; search?: string }) {
  return prisma.ticket.findMany({
    where: {
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.search
        ? {
            OR: [
              { subject: { contains: filter.search, mode: "insensitive" } },
              { business: { name: { contains: filter.search, mode: "insensitive" } } },
              { business: { owners: { some: { fullName: { contains: filter.search, mode: "insensitive" } } } } },
            ],
          }
        : {}),
    },
    include: {
      business: { select: { name: true, owners: { where: { role: "OWNER" }, take: 1, select: { fullName: true } } } },
      assignedAgent: { select: { fullName: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getTicketForAgent(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      business: { select: { id: true, name: true, owners: { where: { role: "OWNER" }, take: 1 } } },
      assignedAgent: { select: { fullName: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

export function setTicketStatus(id: string, status: TicketStatus, assignedAgentUserId?: string) {
  return prisma.ticket.update({
    where: { id },
    data: { status, ...(assignedAgentUserId ? { assignedAgentUserId } : {}) },
  });
}

export interface AddAgentMessageData {
  ticketId: string;
  authorName: string;
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  assignedAgentUserId: string;
}

export function addAgentMessage(data: AddAgentMessageData) {
  const { ticketId, authorName, text, attachmentUrl, attachmentName, assignedAgentUserId } = data;
  return prisma.$transaction([
    prisma.ticketMessage.create({
      data: { ticketId, authorType: "AGENT", authorName, text, attachmentUrl, attachmentName },
    }),
    prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "ANSWERED", assignedAgentUserId, updatedAt: new Date() },
    }),
  ]);
}

export interface CreateTicketForCustomerData {
  businessId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  authorName: string;
  text: string;
  assignedAgentUserId: string;
}

export function createTicketForCustomer(data: CreateTicketForCustomerData) {
  const { businessId, subject, category, priority, authorName, text, assignedAgentUserId } = data;
  return prisma.ticket.create({
    data: {
      businessId,
      subject,
      category,
      priority,
      status: "ANSWERED",
      assignedAgentUserId,
      messages: { create: { authorType: "AGENT", authorName, text } },
    },
  });
}
