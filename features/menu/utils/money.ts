import type { MenuLang } from "@/features/menu/utils/menu-language";

export function formatToman(n: number, lang: MenuLang = "fa") {
  return n.toLocaleString(lang === "en" ? "en-US" : "fa-IR");
}

export function toPersianDigits(n: number, lang: MenuLang = "fa") {
  return n.toLocaleString(lang === "en" ? "en-US" : "fa-IR");
}

const PERSIAN_DIGIT_MAP: Record<string, string> = Object.fromEntries(
  Array.from({ length: 10 }, (_, d) => [String(d), d.toLocaleString("fa-IR")])
);

/**
 * Converts every ASCII digit inside a string (e.g. a "09:00" time string) to
 * its Persian digit, leaving separators like ":" and "-" untouched. Unlike
 * toPersianDigits() above, this doesn't round-trip through Number, so
 * zero-padding ("09" -> "۰۹", not "۹") is preserved.
 */
export function toPersianDigitsInString(value: string, lang: MenuLang = "fa") {
  if (lang === "en") return value;
  return value.replace(/[0-9]/g, (d) => PERSIAN_DIGIT_MAP[d]);
}

/** Applies a product's discountPercent (if any) to its price, rounded to the nearest toman. */
export function computeDiscountedPrice(price: number, discountPercent?: number | null): number {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}
