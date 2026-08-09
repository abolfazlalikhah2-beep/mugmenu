export function formatToman(n: number) {
  return n.toLocaleString("fa-IR");
}

export function toPersianDigits(n: number) {
  return n.toLocaleString("fa-IR");
}

/** Applies a product's discountPercent (if any) to its price, rounded to the nearest toman. */
export function computeDiscountedPrice(price: number, discountPercent?: number | null): number {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}
