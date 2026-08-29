import { z } from "zod";

export const SITE_SETTING_KEYS = [
  "site_name",
  "site_tagline",
  "contact_email",
  "contact_phone",
  "contact_address",
  "social_instagram",
  "social_telegram",
  "logo_url",
  "favicon_url",
  "hero_headline",
  "hero_subheadline",
] as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const siteSettingsSchema = z.object({
  site_name: optionalText(80),
  site_tagline: optionalText(160),
  contact_email: z.union([z.literal(""), z.string().trim().email("ایمیل معتبر نیست")]).optional().default(""),
  contact_phone: optionalText(30),
  contact_address: optionalText(500),
  social_instagram: optionalText(300),
  social_telegram: optionalText(300),
  logo_url: optionalText(500),
  favicon_url: optionalText(500),
  hero_headline: optionalText(160),
  hero_subheadline: optionalText(300),
});
