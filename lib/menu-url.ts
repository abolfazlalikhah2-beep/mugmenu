import { getRootDomain } from "@/lib/subdomain";

export interface MenuUrlBusiness {
  slug: string;
  /** Plan key ("menu-display" | "menu-order" | "menu-advanced") — kept as a plain string here rather than importing PlanKey from features/plans, since lib/ must not depend on features/ (see CLAUDE.md's folder structure). */
  planKey: string | null;
  customDomain?: string | null;
}

/**
 * Single source of truth for a business's canonical public menu URL — used
 * for QR codes, dashboard/superadmin "view menu" links, and SEO canonical/
 * sitemap URLs, so none of them can drift from proxy.ts's routing rules:
 *   - menu-display: the wildcard subdomain (once DNS for *.{ROOT_DOMAIN}
 *     is configured; until then this URL simply won't resolve yet, but
 *     path-based access at the fallback URL below still works).
 *   - menu-order / menu-advanced with a customDomain set: that domain.
 *   - everything else (no customDomain yet, or DNS not configured): the
 *     root-domain path fallback, which always works today.
 */
export function getMenuUrl(business: MenuUrlBusiness): string {
  const rootDomain = getRootDomain();

  if (business.planKey === "menu-display") {
    return `https://${business.slug}.${rootDomain}`;
  }
  if ((business.planKey === "menu-order" || business.planKey === "menu-advanced") && business.customDomain) {
    return `https://${business.customDomain}`;
  }
  return `https://${rootDomain}/${business.slug}`;
}
