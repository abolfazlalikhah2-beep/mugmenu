/**
 * Turns a (usually Persian) post/category/tag title into a URL-safe slug.
 * Persian letters and digits are kept as-is (Persian slugs are normal
 * practice for Persian content sites) rather than transliterated to Latin —
 * unlike Business.slug, which is a short user-typed ASCII handle used for a
 * printed QR code, this is an auto-generated permalink for reading content.
 * Pure — no I/O — so it's cheap to unit test.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/‌/g, "") // ZWNJ ("نیم‌فاصله") joins the two halves of one word — drop it, don't treat as a separator
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
