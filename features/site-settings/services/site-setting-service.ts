import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/site-settings/repositories/site-setting-repository";
import { SITE_SETTING_KEYS, siteSettingsSchema, type SiteSettingKey } from "@/features/site-settings/services/site-setting-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };
export type SiteSettingsValue = Record<SiteSettingKey, string>;

export async function getSettings(): Promise<SiteSettingsValue> {
  const rows = await repo.getAllSettings();
  const byKey = new Map(rows.map((row) => [row.key, row.value]));
  return Object.fromEntries(SITE_SETTING_KEYS.map((key) => [key, byKey.get(key) ?? ""])) as SiteSettingsValue;
}

export async function updateSettings(input: unknown): Promise<ServiceResult> {
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await Promise.all(SITE_SETTING_KEYS.map((key) => repo.setSetting(key, parsed.data[key])));
  logger.info("site_settings.updated");
  return { ok: true };
}
