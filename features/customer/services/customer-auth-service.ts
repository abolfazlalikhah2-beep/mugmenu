import "server-only";
import { logger } from "@/lib/logger";
import { sendOtp as sendOtpSms, OtpRateLimitError } from "@/features/auth/services/otp-service";
import * as repo from "@/features/customer/repositories/customer-repository";
import { setCustomerAccountForSlug, clearCustomerSession } from "@/features/customer/services/customer-session-service";
import { sendOtpSchema, verifyOtpSchema } from "@/features/customer/services/customer-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export function getBusinessBrand(slug: string) {
  return repo.findBusinessBySlug(slug);
}

export function getAccountProfile(customerAccountId: string) {
  return repo.getAccountById(customerAccountId);
}

export async function sendOtp(input: unknown): Promise<ServiceResult> {
  const parsed = sendOtpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  try {
    await sendOtpSms(parsed.data.phone);
  } catch (e) {
    if (e instanceof OtpRateLimitError) return { ok: false, error: e.message };
    throw e;
  }
  return { ok: true };
}

export async function verifyOtp(input: unknown): Promise<ServiceResult> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { slug, phone } = parsed.data;

  const business = await repo.findBusinessBySlug(slug);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  // TODO: check `code` against the OTP the provider actually sent, once a
  // real SMS provider is connected — same stub as
  // features/auth/services/auth-service.ts's verifyOtp.
  let account = await repo.findAccountByPhone(business.id, phone);
  if (!account) {
    account = await repo.createAccount({ businessId: business.id, phone, fullName: "مشتری" });
    logger.info("customer.account_created", { businessId: business.id });
  }

  await setCustomerAccountForSlug(slug, account.id);
  logger.info("customer.logged_in", { businessId: business.id, customerAccountId: account.id });
  return { ok: true };
}

export async function logout() {
  await clearCustomerSession();
}
