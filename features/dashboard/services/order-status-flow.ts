import type { OrderStatus } from "@/lib/generated/prisma/enums";

/** Pure — no I/O — the order lifecycle state machine used by the dashboard. */
const SEQUENCE: OrderStatus[] = ["NEW", "PREPARING", "READY", "DELIVERED"];

const LABELS: Record<OrderStatus, string> = {
  NEW: "ثبت شد",
  PREPARING: "در حال آماده‌سازی",
  READY: "آماده تحویل",
  DELIVERED: "تحویل شد",
  CANCELED: "لغو شد",
};

export function statusLabel(status: OrderStatus): string {
  return LABELS[status];
}

export function nextStatus(current: OrderStatus): OrderStatus | null {
  const idx = SEQUENCE.indexOf(current);
  if (idx === -1 || idx === SEQUENCE.length - 1) return null;
  return SEQUENCE[idx + 1];
}

export function canCancel(current: OrderStatus): boolean {
  return current !== "DELIVERED" && current !== "CANCELED";
}

export function isTerminal(current: OrderStatus): boolean {
  return current === "DELIVERED" || current === "CANCELED";
}

/** Ordered steps for a progress timeline UI, with a flag for whether each is reached. */
export function progressSteps(current: OrderStatus): { status: OrderStatus; label: string; reached: boolean }[] {
  const idx = current === "CANCELED" ? -1 : SEQUENCE.indexOf(current);
  return SEQUENCE.map((status, i) => ({
    status,
    label: LABELS[status],
    reached: idx >= 0 && i <= idx,
  }));
}
