import { cn } from "@/lib/utils";

const STATUS_MAP = {
  NEW: { label: "جدید", fg: "#2563EB", bg: "#EAF1FE" },
  PREPARING: { label: "در حال آماده‌سازی", fg: "#B7791F", bg: "#FCF3E3" },
  READY: { label: "آماده تحویل", fg: "#328C3D", bg: "#E5F0E6" },
  DELIVERED: { label: "تحویل شده", fg: "#8A8A8A", bg: "#F0F0F0" },
  CANCELED: { label: "لغو شده", fg: "#C15656", bg: "#FBECEC" },
} as const;

export type OrderStatusValue = keyof typeof STATUS_MAP;

export function OrderStatusBadge({ status, className }: { status: OrderStatusValue; className?: string }) {
  const s = STATUS_MAP[status];
  return (
    <span
      className={cn("inline-block whitespace-nowrap rounded-[9px] px-3 py-[5px] text-xs font-medium", className)}
      style={{ color: s.fg, background: s.bg }}
    >
      {s.label}
    </span>
  );
}
