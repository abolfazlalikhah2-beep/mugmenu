import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { contactSchema } from "@/features/dashboard/services/dashboard-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export function getContacts(businessId: string, search?: string) {
  return repo.getContacts(businessId, search);
}

export async function createContact(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const duplicate = await repo.findContactByPhone(businessId, parsed.data.phone);
  if (duplicate) return { ok: false, error: "این شماره قبلاً در دفترچه ثبت شده است." };

  await repo.createContact({ businessId, ...parsed.data });
  logger.info("dashboard.contact_created", { businessId });
  return { ok: true };
}

export async function deleteContact(businessId: string, contactId: string): Promise<ServiceResult> {
  const existing = await repo.getContactForDelete(contactId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "مخاطب پیدا نشد." };

  await repo.deleteContact(contactId);
  logger.info("dashboard.contact_deleted", { businessId, contactId });
  return { ok: true };
}
