const DAY_MS = 24 * 60 * 60 * 1000;

export interface PlanStatus {
  daysRemaining: number;
  totalDays: number;
  progressPercent: number;
  isExpired: boolean;
}

/** Pure — no I/O — so the billing-cycle math is trivial to unit test. */
export function computePlanStatus(startedAt: Date, expiresAt: Date, now = new Date()): PlanStatus {
  const totalMs = expiresAt.getTime() - startedAt.getTime();
  const elapsedMs = now.getTime() - startedAt.getTime();
  const remainingMs = expiresAt.getTime() - now.getTime();

  const totalDays = Math.max(1, Math.round(totalMs / DAY_MS));
  const daysRemaining = Math.max(0, Math.ceil(remainingMs / DAY_MS));
  const progressPercent = totalMs > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100)) : 100;

  return { daysRemaining, totalDays, progressPercent, isExpired: remainingMs <= 0 };
}
