import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession, type Session } from "@/features/auth/services/session-service";

/** Authentication only — any logged-in user. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * Authorization, not just authentication: the caller must be signed in AND
 * own a business. Every dashboard route should call this (or scope a query
 * by the returned businessId) rather than only checking "is logged in".
 */
export async function requireBusinessOwner(): Promise<{ session: Session; businessId: string }> {
  const session = await requireSession();
  const user = await prisma.user.findUnique({ where: { phone: session.phone } });
  if (!user?.businessId) redirect("/onboarding");
  return { session, businessId: user.businessId };
}

/**
 * Owner-role authorization for account/billing and team-management pages —
 * every business member passes requireBusinessOwner(), but only the OWNER
 * role should see billing or add/edit other staff accounts.
 */
export async function requireOwnerRole(): Promise<{ session: Session; businessId: string; userId: string }> {
  const { session, businessId } = await requireBusinessOwner();
  const user = await prisma.user.findUnique({ where: { phone: session.phone } });
  if (!user || user.role !== "OWNER") redirect("/dashboard");
  return { session, businessId, userId: user.id };
}
