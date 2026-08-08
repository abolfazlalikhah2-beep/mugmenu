import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { logger } from "@/lib/logger";

const SESSION_COOKIE = "magmenu_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set — see .env.example.");
  return new TextEncoder().encode(secret);
}

export interface Session {
  phone: string;
}

/**
 * Signed (JWT) session cookie — no database-backed session table yet (see
 * CLAUDE.md), but the cookie itself can't be forged or edited client-side
 * the way a plain JSON cookie could.
 */
export async function createSession(phone: string) {
  const token = await new SignJWT({ phone } satisfies Session)
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

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.phone !== "string") return null;
    return { phone: payload.phone };
  } catch (e) {
    logger.warn("session.verify_failed", { error: e instanceof Error ? e.message : String(e) });
    return null;
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
