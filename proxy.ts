import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractSlugFromHost, isAppHost, buildSlugPathname, getRootDomain } from "@/lib/subdomain";
import { findSlugByCustomDomain } from "@/features/menu/services/menu-service";

// Served identically on every host (see app/robots.ts's and app/sitemap.ts's
// own comments on why that's correct) — never slug-rewritten.
const PLATFORM_PATHS = new Set(["/robots.txt", "/sitemap.xml"]);

function rewriteToSlug(request: NextRequest, slug: string, headers: Headers): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = buildSlugPathname(url.pathname, slug);
  return NextResponse.rewrite(url, { request: { headers } });
}

/**
 * Subdomain (and future custom-domain) routing for the public menu — see
 * CLAUDE.md and lib/subdomain.ts for the full design. DNS for the wildcard
 * `*.{ROOT_DOMAIN}` isn't live yet, so none of this fires in production
 * until it is; every branch below falls through to Next's normal routing
 * (dashboard/auth/path-based `/[cafeSlug]`) when nothing matches, so
 * existing path-based access is never at risk.
 */
async function resolveSubdomainRewrite(request: NextRequest, headers: Headers): Promise<NextResponse | null> {
  if (PLATFORM_PATHS.has(request.nextUrl.pathname)) return null;

  const host = request.headers.get("host") ?? "";
  const rootDomain = getRootDomain();

  const hostSlug = extractSlugFromHost(host, rootDomain);
  if (hostSlug) return rewriteToSlug(request, hostSlug, headers);

  if (isAppHost(host, rootDomain)) {
    // Dev-only escape hatch: simulate `{slug}.localhost` on plain
    // `localhost:3000` via a query param, for testing without editing the
    // hosts file (see .env.example).
    const previewSlug =
      process.env.NODE_ENV === "development" && host.split(":")[0] === "localhost"
        ? request.nextUrl.searchParams.get("preview")
        : null;
    return previewSlug ? rewriteToSlug(request, previewSlug, headers) : null;
  }

  // Not the app host and not a recognized slug-subdomain: might be a
  // opal/zomorrod business's connected custom domain.
  try {
    const business = await findSlugByCustomDomain(host.split(":")[0]);
    if (business) return rewriteToSlug(request, business.slug, headers);
  } catch {
    // DB unreachable — degrade to normal routing rather than 500 every
    // request to a host we don't otherwise recognize.
  }
  return null;
}

// Stamps every request with an id so lib/logger.ts can correlate every log
// line touched by one request (Server Components, Route Handlers, and
// Server Actions all see the same header).
export async function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set("x-request-id", requestId);

  const rewritten = await resolveSubdomainRewrite(request, headers);
  const response = rewritten ?? NextResponse.next({ request: { headers } });
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
