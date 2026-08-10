import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { ticketSchema, ticketMessageSchema } from "@/features/dashboard/services/dashboard-schemas";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import type { Session } from "@/features/auth/services/session-service";

export type ServiceResult = { ok: true } | { ok: false; error: string };
export type CreateTicketResult = { ok: true; ticketId: string } | { ok: false; error: string };

export function getTickets(businessId: string) {
  return repo.getTickets(businessId);
}

export async function getTicketDetail(businessId: string, ticketId: string) {
  const ticket = await repo.getTicketWithMessages(ticketId);
  if (!ticket || ticket.businessId !== businessId) return null;
  return ticket;
}

async function resolveAuthorName(session: Session): Promise<string> {
  const user = await findUserByPhone(session.phone);
  return user?.fullName ?? "کاربر";
}

export async function createTicket(
  businessId: string,
  session: Session,
  input: unknown
): Promise<CreateTicketResult> {
  const parsed = ticketSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const authorName = await resolveAuthorName(session);
  const ticket = await repo.createTicketWithMessage({
    businessId,
    subject: parsed.data.subject,
    category: parsed.data.category,
    authorType: "OWNER",
    authorName,
    text: parsed.data.text,
    attachmentUrl: parsed.data.attachmentUrl,
    attachmentName: parsed.data.attachmentName,
  });

  logger.info("dashboard.ticket_created", { businessId, ticketId: ticket.id });
  return { ok: true, ticketId: ticket.id };
}

export async function addTicketMessage(
  businessId: string,
  session: Session,
  ticketId: string,
  input: unknown
): Promise<ServiceResult> {
  const existing = await repo.getTicketWithMessages(ticketId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "تیکت پیدا نشد." };

  const parsed = ticketMessageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const authorName = await resolveAuthorName(session);
  // An owner replying to a ticket the support team already answered (or
  // closed) puts it back in the support queue instead of leaving it stuck
  // on ANSWERED/CLOSED forever.
  const reopenStatus = existing.status === "ANSWERED" || existing.status === "CLOSED" ? "OPEN" : undefined;
  await repo.addTicketMessage({
    ticketId,
    authorType: "OWNER",
    authorName,
    text: parsed.data.text,
    attachmentUrl: parsed.data.attachmentUrl,
    attachmentName: parsed.data.attachmentName,
    reopenStatus,
  });

  logger.info("dashboard.ticket_message_added", { businessId, ticketId });
  return { ok: true };
}
