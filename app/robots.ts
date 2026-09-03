import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

/**
 * Indexing strategy: only the site root and each restaurant's root page
 * (`/[cafeSlug]`) are indexable — every sub-page (menu, cart, item detail,
 * account, receipt, ...) is disallowed here. robots.txt only supports `*`
 * (any sequence) and `$` (end of URL), not regex character classes, so
 * "single path segment" is expressed as: allow the root, then disallow any
 * path that has a second segment (`/*​/`) — that also covers routes outside
 * `[cafeSlug]` (e.g. `/dashboard/...`) since they too have a segment after
 * their own root, keeping this one rule instead of enumerating every route.
 *
 * This same rule set stays correct now that firuze-tier businesses are
 * also reachable at `{slug}.{ROOT_DOMAIN}` (see proxy.ts/lib/subdomain.ts):
 * robots.txt is fetched per-origin, so a business subdomain gets its own
 * copy of this exact file (same route, different host) — its root "/" is
 * the allowed page there too, with no code change needed. The canonical
 * per-business URL (root domain path vs. subdomain vs. custom domain) is
 * only decided by getMenuUrl(), which is what actually goes into sitemap.xml.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/$",
      disallow: "/*/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
