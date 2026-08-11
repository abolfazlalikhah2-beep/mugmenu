import type { MenuLang } from "@/features/menu/utils/menu-language";

export function formatToman(n: number, lang: MenuLang = "fa") {
  return n.toLocaleString(lang === "en" ? "en-US" : "fa-IR");
}

export function toPersianDigits(n: number, lang: MenuLang = "fa") {
  return n.toLocaleString(lang === "en" ? "en-US" : "fa-IR");
}

/** Applies a product's discountPercent (if any) to its price, rounded to the nearest toman. */
export function computeDiscountedPrice(price: number, discountPercent?: number | null): number {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}
