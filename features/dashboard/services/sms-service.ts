import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { singleSmsSchema, bulkSmsSchema } from "@/features/dashboard/services/dashboard-schemas";
import { aggregateCustomers, type CustomerOrderRecord } from "@/features/dashboard/utils/aggregate-customers";
import { renderSmsTemplate } from "@/features/dashboard/utils/sms-template";
import { getSmsProvider } from "@/lib/sms/sms-provider";
import type { SmsAudience, SmsMessageStatus } from "@/lib/generated/prisma/enums";

export type ServiceResult = { ok: true } | { ok: false; error: string };
export type SendSmsResult = { ok: true; sent: number; failed: number } | { ok: false; error: string };

const LOYAL_ORDER_THRESHOLD = 3;
const RECENT_ORDER_DAYS = 30;

export interface AudienceRecipient {
  phone: string;
  name: string;
}

function recentSince() {
  return new Date(Date.now() - RECENT_ORDER_DAYS * 24 * 60 * 60 * 1000);
}

function loyalCustomers(orders: CustomerOrderRecord[]): AudienceRecipient[] {
  return aggregateCustomers(orders)
    .filter((c) => c.orderCount >= LOYAL_ORDER_THRESHOLD)
    .map((c) => ({ phone: c.phone, name: c.name }));
}

function recentCustomers(orders: CustomerOrderRecord[], since: Date): AudienceRecipient[] {
  return aggregateCustomers(orders.filter((o) => o.createdAt >= since)).map((c) => ({
    phone: c.phone,
    name: c.name,
  }));
}

async function resolveAudience(
  businessId: string,
  audience: SmsAudience,
  manualContactIds: string[]
): Promise<AudienceRecipient[]> {
  if (audience === "ALL_CONTACTS") {
    const contacts = await repo.getContacts(businessId);
    return contacts.map((c) => ({ phone: c.phone, name: c.name }));
  }
  if (audience === "MANUAL") {
    const contacts = await repo.getContactsByIds(businessId, manualContactIds);
    return contacts.map((c) => ({ phone: c.phone, name: c.name }));
  }

  const orders = await repo.getCustomerOrders(businessId);
  return audience === "LOYAL_CUSTOMERS" ? loyalCustomers(orders) : recentCustomers(orders, recentSince());
}

export async function getAudienceCounts(businessId: string) {
  const [contacts, orders] = await Promise.all([
    repo.getContacts(businessId),
    repo.getCustomerOrders(businessId),
  ]);
  return {
    ALL_CONTACTS: contacts.length,
    LOYAL_CUSTOMERS: loyalCustomers(orders).length,
    RECENT_ORDERS: recentCustomers(orders, recentSince()).length,
  };
}

export async function sendSingleSms(businessId: string, input: unknown): Promise<SendSmsResult> {
  const parsed = singleSmsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const business = await repo.getBusinessById(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const text = renderSmsTemplate(parsed.data.text, { businessName: business.name });
  const result = await getSmsProvider().sendSms({ phone: parsed.data.phone, text });

  await repo.createSmsMessage({
    businessId,
    text: parsed.data.text,
    recipientCount: 1,
    status: result.success ? "SENT" : "FAILED",
  });

  logger.info("dashboard.sms_single_sent", { businessId, success: result.success });
  return result.success ? { ok: true, sent: 1, failed: 0 } : { ok: false, error: "ارسال پیامک ناموفق بود." };
}

export async function sendBulkSms(businessId: string, input: unknown): Promise<SendSmsResult> {
  const parsed = bulkSmsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const business = await repo.getBusinessById(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const recipients = await resolveAudience(businessId, parsed.data.audience, parsed.data.manualContactIds);
  if (recipients.length === 0) return { ok: false, error: "گیرنده‌ای برای این گروه یافت نشد." };

  const provider = getSmsProvider();
  let sent = 0;
  for (const recipient of recipients) {
    const text = renderSmsTemplate(parsed.data.text, {
      customerName: recipient.name,
      businessName: business.name,
    });
    const result = await provider.sendSms({ phone: recipient.phone, text });
    if (result.success) sent += 1;
  }

  const failed = recipients.length - sent;
  const status: SmsMessageStatus = failed === 0 ? "SENT" : sent === 0 ? "FAILED" : "PARTIAL";

  await repo.createSmsMessage({
    businessId,
    text: parsed.data.text,
    audience: parsed.data.audience,
    recipientCount: recipients.length,
    status,
  });

  logger.info("dashboard.sms_bulk_sent", { businessId, audience: parsed.data.audience, sent, failed });
  return { ok: true, sent, failed };
}

export function getSentMessages(businessId: string, status?: SmsMessageStatus) {
  return repo.getSmsMessages(businessId, status);
}
