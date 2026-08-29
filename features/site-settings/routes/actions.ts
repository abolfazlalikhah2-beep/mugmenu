"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import * as siteSettingService from "@/features/site-settings/services/site-setting-service";
import { SITE_SETTING_KEYS } from "@/features/site-settings/services/site-setting-schemas";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

export async function updateSiteSettingsAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();

  const input = Object.fromEntries(SITE_SETTING_KEYS.map((key) => [key, String(formData.get(key) ?? "")]));
  const result = await siteSettingService.updateSettings(input);
  if (!result.ok) return { error: result.error };

  revalidatePath("/superadmin/site-settings");
  return { ok: true };
}
