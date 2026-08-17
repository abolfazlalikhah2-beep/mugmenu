import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort client IP for rate limiting. Trusts x-forwarded-for/x-real-ip
 * because this app only ever runs behind a reverse proxy (Liara/Docker) that
 * sets them — there's no direct-to-Node exposure to spoof from. Falls back
 * to a constant key ("unknown") if neither header is present, which just
 * means those requests share one bucket rather than going unlimited.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
