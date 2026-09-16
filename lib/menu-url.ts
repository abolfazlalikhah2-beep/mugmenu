import { getRootDomain } from "@/lib/subdomain";

export interface MenuUrlBusiness {
  slug: string;
  /** Plan key ("firuze" | "yashm" | "opal" | "zomorrod") — kept as a plain string here rather than importing PlanKey from features/plans, since lib/ must not depend on features/ (see CLAUDE.md's folder structure). */
  planKey: string | null;
  customDomain?: string | null;
}

/**
 * Single source of truth for a business's canonical public menu URL — used
 * for QR codes, dashboard/superadmin "view menu" links, and SEO canonical/
 * sitemap URLs, so none of them can drift from proxy.ts's routing rules:
 *   - firuze: the wildcard subdomain (once DNS for *.{ROOT_DOMAIN} is
 *     configured; until then this URL simply won't resolve yet, but
 *     path-based access at the fallback URL below still works).
 *   - opal / zomorrod (the ordering-enabled tiers, see domain.custom in
 *     feature-matrix.ts) with a customDomain set: that domain.
 *   - everything else (no customDomain yet, or DNS not configured): the
 *     root-domain path fallback, which always works today.
 */
export function getMenuUrl(business: MenuUrlBusiness): string {
  const rootDomain = getRootDomain();

  if (business.planKey === "firuze") {
    return `https://${business.slug}.${rootDomain}`;
  }
  if ((business.planKey === "opal" || business.planKey === "zomorrod") && business.customDomain) {
    return `https://${business.customDomain}`;
  }
  return `https://${rootDomain}/${business.slug}`;
}

/** The root-domain path URL, regardless of plan/customDomain — always resolves today, unlike the firuze subdomain (pending wildcard DNS) or a customDomain (pending its own DNS/SSL setup). */
export function getDefaultMenuUrl(slug: string): string {
  return `https://${getRootDomain()}/${slug}`;
}

export interface QrUrlEntry {
  url: string;
  label: string | null;
}

/**
 * QR codes for the dashboard's QR tab. Unlike getMenuUrl (one canonical URL,
 * used for SEO/sitemap/"view menu" links), a printed QR code needs to keep
 * working even after a custom domain is added or changed, so this always
 * includes the default path URL and adds the customDomain as a second entry
 * when one is set — never a single either/or choice between them.
 */
export function getQrUrls(business: { slug: string; customDomain?: string | null }): QrUrlEntry[] {
  const entries: QrUrlEntry[] = [
    { url: getDefaultMenuUrl(business.slug), label: business.customDomain ? "لینک پیش‌فرض" : null },
  ];
  if (business.customDomain) {
    entries.push({ url: `https://${business.customDomain}`, label: "دامنه اختصاصی" });
  }
  return entries;
}
