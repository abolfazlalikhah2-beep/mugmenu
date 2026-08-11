/**
 * Small hex color helpers for the per-business accent theme (see
 * hero-background.ts and app/(public)/[cafeSlug]/layout.tsx, which sets
 * --color-brand/--color-brand-hover from Business.accentColor). Pure, no I/O.
 */

export function isValidHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** e.g. tintColor("#328C3D", 0.1) -> "rgba(50,140,61,0.1)" — for soft tinted backgrounds/badges. */
export function tintColor(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Darkens a hex color for hover states (mirrors the shipped #328C3D -> #25682D pair). */
export function darkenColor(hex: string, amount = 0.22): string {
  const { r, g, b } = hexToRgb(hex);
  const scale = (c: number) => Math.max(0, Math.round(c * (1 - amount)));
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(scale(r))}${toHex(scale(g))}${toHex(scale(b))}`;
}
