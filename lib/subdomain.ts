/**
 * Pure hostname/pathname logic behind proxy.ts's subdomain routing —
 * dependency-free (no NextRequest) so it's trivially unit-testable.
 */

const LIARA_DEFAULT_SUFFIX = ".liara.run";

function hostOnly(value: string): string {
  return value.split(":")[0].trim().toLowerCase();
}

/** Wildcard subdomain root — see .env.example for local dev overrides. */
export function getRootDomain(): string {
  return (process.env.ROOT_DOMAIN || "serwapp.ir").trim().toLowerCase();
}

/**
 * Returns the business slug for `{slug}.{rootDomain}` (or the dev-mode
 * `{slug}.localhost` / `{slug}.localhost:PORT` equivalent when rootDomain
 * is set to "localhost"), or null for the bare root domain, its "www"
 * alias, a multi-level subdomain, or any host that isn't a direct
 * subdomain of rootDomain at all (unrelated/custom domains — see
 * isAppHost and the middleware's customDomain lookup for those).
 */
export function extractSlugFromHost(hostname: string, rootDomain: string): string | null {
  const host = hostOnly(hostname);
  const root = hostOnly(rootDomain);
  if (!host || !root) return null;

  const suffix = `.${root}`;
  if (!host.endsWith(suffix)) return null;

  const sub = host.slice(0, -suffix.length);
  if (!sub || sub === "www" || sub.includes(".")) return null;
  return sub;
}

/**
 * True for hosts that must keep serving the app itself (dashboard, auth,
 * public menu path fallback, metadata routes) rather than being resolved
 * as a business subdomain or looked up as a custom domain: the bare root
 * domain, its "www" alias, Liara's auto-generated *.liara.run domain (what
 * a deploy is reachable on before a custom domain/DNS is configured), and
 * bare localhost in dev.
 */
export function isAppHost(hostname: string, rootDomain: string): boolean {
  const host = hostOnly(hostname);
  const root = hostOnly(rootDomain);
  if (!host) return true;
  if (host === root || host === `www.${root}`) return true;
  if (host.endsWith(LIARA_DEFAULT_SUFFIX)) return true;
  if (host === "localhost" || host === "127.0.0.1") return true;
  return false;
}

/**
 * Rewrites `/some/path` to `/{slug}/some/path` — but leaves the pathname
 * alone if it's already prefixed with the slug. Every in-app link under
 * `app/(public)/[cafeSlug]` is hardcoded as `/${slug}/...` regardless of
 * how the current page was reached, so clicking one from a page served via
 * subdomain/custom-domain routing lands back here on an already-prefixed
 * path; passing it through unchanged (instead of prefixing it a second
 * time into `/{slug}/{slug}/...`) is what lets every existing menu
 * component's hrefs keep working with no changes of their own.
 */
export function buildSlugPathname(pathname: string, slug: string): string {
  const prefix = `/${slug}`;
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return pathname;
  return pathname === "/" ? prefix : `${prefix}${pathname}`;
}
