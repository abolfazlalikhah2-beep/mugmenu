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
