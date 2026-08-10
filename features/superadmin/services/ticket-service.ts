import "server-only";
import { logger } from "@/lib/logger";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import type { Session } from "@/features/auth/services/session-service";
import type { TicketStatus } from "@/lib/generated/prisma/enums";
import { getSmsProvider } from "@/lib/sms/sms-provider";
import * as repo from "@/features/superadmin/repositories/superadmin-repository";
import { agentReplySchema, ticketForCustomerSchema } from "@/features/superadmin/services/superadmin-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };
export type CreateTicketResult = { ok: true; ticketId: string } | { ok: false; error: string };

export interface InboundTicketSummary {
  id: string;
  ticketNumber: number;
  subject: string;
  category: "TECHNICAL" | "PAYMENT" | "BILLING" | "GENERAL";
  status: "OPEN" | "PENDING" | "ANSWERED" | "CLOSED";
  priority: "HIGH" | "MID" | "LOW";
  storeName: string;
  senderName: string;
  agentName: string | null;
  updatedAt: Date;
}

export async function getInboundTickets(filter: {
  status?: TicketStatus;
  search?: string;
}): Promise<InboundTicketSummary[]> {
  const rows = await repo.getInboundTickets(filter);
  return rows.map((t) => ({
    id: t.id,
    ticketNumber: t.ticketNumber,
    subject: t.subject,
    category: t.category,
    status: t.status,
    priority: t.priority,
    storeName: t.business.name,
    senderName: t.business.owners[0]?.fullName ?? "—",
    agentName: t.assignedAgent?.fullName ?? null,
    updatedAt: t.updatedAt,
  }));
}

export async function getTicketDetail(ticketId: string) {
  return repo.getTicketForAgent(ticketId);
}

export type TicketDetail = NonNullable<Awaited<ReturnType<typeof getTicketDetail>>>;

async function resolveAgent(session: Session) {
  const user = await findUserByPhone(session.phone);
  return { id: user?.id ?? "", name: user?.fullName ?? "پشتیبانی ماگ‌منو" };
}

export async function addAgentReply(session: Session, ticketId: string, input: unknown): Promise<ServiceResult> {
  const ticket = await repo.getTicketForAgent(ticketId);
  if (!ticket) return { ok: false, error: "تیکت پیدا نشد." };

  const parsed = agentReplySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const agent = await resolveAgent(session);
  await repo.addAgentMessage({
    ticketId,
    authorName: agent.name,
    text: parsed.data.text,
    attachmentUrl: parsed.data.attachmentUrl,
    attachmentName: parsed.data.attachmentName,
    assignedAgentUserId: agent.id,
  });

  logger.info("superadmin.ticket_reply_added", { ticketId });
  return { ok: true };
}

export async function createTicketForCustomer(session: Session, input: unknown): Promise<CreateTicketResult> {
  const parsed = ticketForCustomerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const agent = await resolveAgent(session);
  const ticket = await repo.createTicketForCustomer({
    businessId: parsed.data.businessId,
    subject: parsed.data.subject,
    category: parsed.data.category,
    priority: parsed.data.priority,
    authorName: agent.name,
    text: parsed.data.text,
    assignedAgentUserId: agent.id,
  });

  if (parsed.data.notifySms) {
    const business = await repo.getBusinessDetail(parsed.data.businessId);
    const owner = business?.owners.find((u) => u.role === "OWNER") ?? business?.owners[0];
    if (owner) {
      await getSmsProvider().sendSms({
        phone: owner.phone,
        text: `تیکت جدید از تیم ماگ‌منو: ${parsed.data.subject}`,
      });
    }
  }

  logger.info("superadmin.ticket_created_for_customer", {
    businessId: parsed.data.businessId,
    ticketId: ticket.id,
    notifySms: parsed.data.notifySms,
  });
  return { ok: true, ticketId: ticket.id };
}
