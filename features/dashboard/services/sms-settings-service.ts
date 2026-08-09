import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/dashboard/repositories/dashboard-repository";
import { smsSettingsSchema } from "@/features/dashboard/services/dashboard-schemas";
import { getSmsProvider } from "@/lib/sms/sms-provider";

export type ServiceResult = { ok: true } | { ok: false; error: string };
/**
 * A blank smsApiKey means "keep the key already on file" — the settings
 * form only shows a masked placeholder for an existing key, never the
 * real value, so re-submitting the form without retyping it must not
 * erase it.
 */
export async function updateSmsSettings(businessId: string, input: unknown): Promise<ServiceResult> {
  const parsed = smsSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const business = await repo.getBusinessById(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const apiKey = parsed.data.smsApiKey || business.smsApiKey;
  if (!apiKey) return { ok: false, error: "کلید API را وارد کنید." };

  const result = await getSmsProvider().testConnection({
    provider: parsed.data.smsProvider,
    username: parsed.data.smsUsername ?? null,
    apiKey,
    senderNumber: parsed.data.smsSenderNumber ?? null,
  });

  await repo.updateBusiness(businessId, {
    smsProvider: parsed.data.smsProvider,
    smsUsername: parsed.data.smsUsername,
    smsApiKey: apiKey,
    smsSenderNumber: parsed.data.smsSenderNumber,
    smsConnected: result.connected,
    smsCreditCount: result.credit,
  });

  logger.info("dashboard.sms_settings_updated", { businessId, connected: result.connected });
  return { ok: true };
}
