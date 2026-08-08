"use client";

import { cn } from "@/lib/utils";
import { useCart } from "@/features/menu/client/cart-context";
import type { OrderType } from "@/features/menu/services/order-flow";

const TABS: { value: OrderType; label: string }[] = [
  { value: "DINE_IN", label: "روی میز" },
  { value: "TAKEAWAY", label: "بیرون‌بر" },
  { value: "DELIVERY", label: "ارسال با پیک" },
];

export function DeliveryTabs() {
  const { orderType, setOrderType } = useCart();

  return (
    <div className="flex gap-1 rounded-input bg-chip p-1.5">
      {TABS.map((t) => {
        const active = t.value === orderType;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => setOrderType(t.value)}
            className={cn(
              "flex h-10 flex-1 items-center justify-center rounded-[10px] text-[13px]",
              active ? "bg-card font-medium text-brand shadow-float" : "font-light text-[#8A8A8A]"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export { TABS as DELIVERY_TABS };
