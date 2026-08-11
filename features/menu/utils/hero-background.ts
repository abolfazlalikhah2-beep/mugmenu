import { tintColor } from "@/features/menu/utils/theme-color";

/**
 * Preset keys for the public menu's entry-page hero (dashboard "ظاهر منو"
 * tab, from Admin Menu Appearance.dc.html). "photo" means Business.heroImageUrl
 * is used; the rest are fixed gradients ("g4" derives from the business's
 * own accent color so it always matches).
 */
export const HERO_BG_KEYS = ["photo", "g1", "g2", "g3", "g4"] as const;
export type HeroBgKey = (typeof HERO_BG_KEYS)[number];

type GradientKey = Exclude<HeroBgKey, "photo">;

export const HERO_BG_PRESETS: Record<GradientKey, { label: string; css: (accentColor: string) => string }> = {
  g1: { label: "گرادیانت گرم", css: () => "linear-gradient(135deg,#3B2A20 0%,#7A4A2B 100%)" },
  g2: { label: "گرادیانت شب", css: () => "linear-gradient(135deg,#12211B 0%,#2E4A3A 100%)" },
  g3: { label: "گرادیانت روشن", css: () => "linear-gradient(135deg,#F4EFE7 0%,#D9CFBE 100%)" },
  g4: {
    label: "گرادیانت برند",
    css: (accentColor) => `linear-gradient(135deg,${accentColor} 0%,${tintColor(accentColor, 0.55)} 100%)`,
  },
};

export type HeroBackground = { type: "image"; url: string } | { type: "css"; css: string };

const FALLBACK_CSS = "#2A2A2A";

/** Resolves what the entry-page hero should render behind — pure, no I/O. */
export function resolveHeroBackground(business: {
  heroBgKey: string;
  heroImageUrl: string | null;
  accentColor: string;
}): HeroBackground {
  if (business.heroBgKey === "photo") {
    return business.heroImageUrl ? { type: "image", url: business.heroImageUrl } : { type: "css", css: FALLBACK_CSS };
  }
  const preset = HERO_BG_PRESETS[business.heroBgKey as GradientKey];
  return { type: "css", css: preset ? preset.css(business.accentColor) : FALLBACK_CSS };
}
