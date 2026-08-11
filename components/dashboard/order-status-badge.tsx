import { cn } from "@/lib/utils";
import { orderStatusLabel, type MenuLang } from "@/features/menu/utils/menu-language";

const STATUS_MAP = {
  NEW: { fg: "#2563EB", bg: "#EAF1FE" },
  PREPARING: { fg: "#B7791F", bg: "#FCF3E3" },
  READY: { fg: "#328C3D", bg: "#E5F0E6" },
  DELIVERED: { fg: "#8A8A8A", bg: "#F0F0F0" },
  CANCELED: { fg: "#C15656", bg: "#FBECEC" },
} as const;

export type OrderStatusValue = keyof typeof STATUS_MAP;

/** `lang` defaults to "fa" — the admin dashboard never passes it, only customer-facing order screens do. */
export function OrderStatusBadge({
  status,
  className,
  lang = "fa",
}: {
  status: OrderStatusValue;
  className?: string;
  lang?: MenuLang;
}) {
  const s = STATUS_MAP[status];
  return (
    <span
      className={cn("inline-block whitespace-nowrap rounded-[9px] px-3 py-[5px] text-xs font-medium", className)}
      style={{ color: s.fg, background: s.bg }}
    >
      {orderStatusLabel(lang, status)}
    </span>
  );
}
