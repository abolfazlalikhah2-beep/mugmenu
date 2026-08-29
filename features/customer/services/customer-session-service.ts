import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { logger } from "@/lib/logger";

const SESSION_COOKIE = "magmenu_customer_session";
// Ordering now requires a logged-in session (see order-service.ts's
// createOrder), so this balances staying signed in across a typical week of
// repeat visits against a stale, unattended-device session lingering too
// long — re-verify by OTP after a week of inactivity.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set — see .env.example.");
  return new TextEncoder().encode(secret);
}

/**
 * Keyed by business slug, not businessId — a customer can be logged in to
 * more than one restaurant's account at once in the same browser (each
 * scan of a different QR code is its own tenant), and the route layer only
 * has the slug on hand without an extra DB lookup. Wallet/loyalty/orders
 * are still scoped by the resolved businessId once a page fetches the
 * customer account row itself.
 */
interface CustomerSessionPayload {
  accounts: Record<string, string>;
}

export interface CustomerSession {
  customerAccountId: string;
}

async function readPayload(): Promise<CustomerSessionPayload> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return { accounts: {} };
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const accounts = payload.accounts;
    if (accounts && typeof accounts === "object") return { accounts: accounts as Record<string, string> };
    return { accounts: {} };
  } catch (e) {
    logger.warn("customer_session.verify_failed", { error: e instanceof Error ? e.message : String(e) });
    return { accounts: {} };
  }
}

async function writePayload(payload: CustomerSessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getCustomerSession(slug: string): Promise<CustomerSession | null> {
  const { accounts } = await readPayload();
  const customerAccountId = accounts[slug];
  return customerAccountId ? { customerAccountId } : null;
}

/** Authorization, not just authentication — redirects to this business's login page if not signed in. */
export async function requireCustomerSession(slug: string): Promise<CustomerSession> {
  const session = await getCustomerSession(slug);
  if (!session) redirect(`/${slug}/account/login`);
  return session;
}

export async function setCustomerAccountForSlug(slug: string, customerAccountId: string) {
  const { accounts } = await readPayload();
  await writePayload({ accounts: { ...accounts, [slug]: customerAccountId } });
}

/** Logs the customer out of every restaurant they were signed in to, not just the current one — see the module comment. */
export async function clearCustomerSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
