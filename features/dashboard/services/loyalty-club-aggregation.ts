import { computeDelta, type StatDelta } from "@/features/dashboard/services/stat-delta";
import { startOfDay, addDays, startOfMonth, addMonths } from "@/features/dashboard/services/date-utils";
import { computeLoyaltyTier } from "@/features/customer/services/loyalty";
import type { TrendPoint } from "@/features/dashboard/services/menu-analytics-aggregation";

export interface MemberPoint {
  createdAt: Date;
}

export interface CashbackPoint {
  createdAt: Date;
  amount: number;
}

export type LoyaltyFilter = "ALL" | "INACTIVE_30" | "INACTIVE_90" | "GOLD" | "WALLET_100K";

export interface LoyaltyMemberRow {
  id: string;
  name: string;
  phone: string;
  joinedAt: Date;
  orderCount: number;
  lastOrderAt: Date | null;
  walletBalance: number;
  loyaltyPoints: number;
}

/** Shape of dashboard-repository.ts's getLoyaltyMembers() rows — spelled out structurally (not imported) to keep this module free of Prisma/I-O dependencies. */
export interface RawLoyaltyMember {
  id: string;
  fullName: string;
  phone: string;
  createdAt: Date;
  walletBalance: number;
  loyaltyPoints: number;
  _count: { orders: number };
  orders: { createdAt: Date }[];
}

/** Shared by loyalty-club-service.ts (dashboard tables) and sms-service.ts (LOYALTY_MEMBERS audience resolution) so both read the same real member shape. */
export function toLoyaltyMemberRow(m: RawLoyaltyMember): LoyaltyMemberRow {
  return {
    id: m.id,
    name: m.fullName,
    phone: m.phone,
    joinedAt: m.createdAt,
    orderCount: m._count.orders,
    lastOrderAt: m.orders[0]?.createdAt ?? null,
    walletBalance: m.walletBalance,
    loyaltyPoints: m.loyaltyPoints,
  };
}

export interface MemberSummary {
  totalCount: number;
  newThisMonth: number;
  delta: StatDelta;
}

/** Total members + new-signups-this-month vs. last month, for the loyalty dashboard's stat card. */
export function summarizeMembers(members: MemberPoint[], now = new Date()): MemberSummary {
  const monthStart = startOfMonth(now);
  const prevMonthStart = addMonths(monthStart, -1);

  const newThisMonth = members.filter((m) => m.createdAt >= monthStart).length;
  const newLastMonth = members.filter((m) => m.createdAt >= prevMonthStart && m.createdAt < monthStart).length;

  return {
    totalCount: members.length,
    newThisMonth,
    delta: computeDelta(newThisMonth, newLastMonth),
  };
}

/** Cumulative member count by month, oldest first — for the 12-month growth line chart. */
export function memberGrowthTrend(members: MemberPoint[], now = new Date(), months = 12): TrendPoint[] {
  const start = addMonths(startOfMonth(now), -(months - 1));
  let cumulative = members.filter((m) => m.createdAt < start).length;

  return Array.from({ length: months }, (_, i) => {
    const monthStart = addMonths(start, i);
    const monthEnd = addMonths(monthStart, 1);
    cumulative += members.filter((m) => m.createdAt >= monthStart && m.createdAt < monthEnd).length;
    return { label: monthStart.toLocaleDateString("fa-IR", { month: "long" }), count: cumulative };
  });
}

/** Cashback paid per month, oldest first — for the trailing-6-month bar list. */
export function cashbackTrend(ledger: CashbackPoint[], now = new Date(), months = 6): TrendPoint[] {
  const start = addMonths(startOfMonth(now), -(months - 1));

  return Array.from({ length: months }, (_, i) => {
    const monthStart = addMonths(start, i);
    const monthEnd = addMonths(monthStart, 1);
    const sum = ledger
      .filter((w) => w.createdAt >= monthStart && w.createdAt < monthEnd)
      .reduce((total, w) => total + w.amount, 0);
    return { label: monthStart.toLocaleDateString("fa-IR", { month: "long" }), count: sum };
  });
}

/** Quick segments for the "ارسال پیام به اعضا" tab — all real CustomerAccount data, no birthDate-based filter (doesn't exist yet). */
export function applyLoyaltyFilter(
  members: LoyaltyMemberRow[],
  filter: LoyaltyFilter,
  now = new Date()
): LoyaltyMemberRow[] {
  switch (filter) {
    case "INACTIVE_30": {
      const cutoff = addDays(startOfDay(now), -30);
      return members.filter((m) => !m.lastOrderAt || m.lastOrderAt < cutoff);
    }
    case "INACTIVE_90": {
      const cutoff = addDays(startOfDay(now), -90);
      return members.filter((m) => !m.lastOrderAt || m.lastOrderAt < cutoff);
    }
    case "GOLD":
      return members.filter((m) => computeLoyaltyTier(m.loyaltyPoints).tier === "GOLD");
    case "WALLET_100K":
      return members.filter((m) => m.walletBalance >= 100000);
    default:
      return members;
  }
}
