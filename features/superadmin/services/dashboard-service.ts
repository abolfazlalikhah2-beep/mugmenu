import "server-only";
import * as repo from "@/features/superadmin/repositories/superadmin-repository";

const EXPIRING_SOON_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface BusinessByPlan {
  key: string;
  name: string;
  count: number;
}

export interface ExpiringBusiness {
  id: string;
  name: string;
  owner: string;
  expiresAt: Date;
  kind: "DEMO" | "PLAN";
}

export interface DashboardOverview {
  totalBusinesses: number;
  activeBusinesses: number;
  demoBusinesses: number;
  businessesByPlan: BusinessByPlan[];
  ordersLast30Days: number;
  revenueLast30Days: number;
  newBusinessesThisMonth: number;
  expiringSoon: ExpiringBusiness[];
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const last30Days = new Date(now.getTime() - 30 * DAY_MS);
  const soonBy = new Date(now.getTime() + EXPIRING_SOON_DAYS * DAY_MS);

  const [
    totalBusinesses,
    activeBusinesses,
    demoBusinesses,
    businessesByPlan,
    ordersLast30Days,
    revenueLast30Days,
    newBusinessesThisMonth,
    expiringSoonRaw,
  ] = await Promise.all([
    repo.countAllBusinesses(),
    repo.countBusinessesNotSuspended(),
    repo.countBusinessesOnDemo(now),
    repo.countBusinessesByPlan(),
    repo.countOrdersSince(last30Days),
    repo.sumOrderRevenueSince(last30Days),
    repo.countNewSubscriptionsThisMonth(monthStart),
    repo.getBusinessesExpiringSoon(now, soonBy),
  ]);

  const expiringSoon: ExpiringBusiness[] = expiringSoonRaw
    .map((b) => {
      const demoExpiringSoon = b.isDemoActive && b.demoExpiresAt !== null && b.demoExpiresAt <= soonBy && b.demoExpiresAt > now;
      return {
        id: b.id,
        name: b.name,
        owner: b.owners[0]?.fullName ?? "—",
        expiresAt: demoExpiringSoon && b.demoExpiresAt ? b.demoExpiresAt : b.planExpiresAt,
        kind: demoExpiringSoon ? ("DEMO" as const) : ("PLAN" as const),
      };
    })
    .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());

  return {
    totalBusinesses,
    activeBusinesses,
    demoBusinesses,
    businessesByPlan,
    ordersLast30Days,
    revenueLast30Days,
    newBusinessesThisMonth,
    expiringSoon,
  };
}
