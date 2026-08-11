"use client";

import { cn } from "@/lib/utils";
import { useCart } from "@/features/menu/client/cart-context";
import type { OrderType } from "@/features/menu/services/order-flow";
import { orderTypeLabel, type MenuLang } from "@/features/menu/utils/menu-language";

const TAB_VALUES: OrderType[] = ["DINE_IN", "TAKEAWAY", "DELIVERY"];

export function DeliveryTabs({ lang = "fa" }: { lang?: MenuLang }) {
  const { orderType, setOrderType } = useCart();

  return (
    <div className="flex gap-1 rounded-input bg-chip p-1.5">
      {TAB_VALUES.map((value) => {
        const active = value === orderType;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setOrderType(value)}
            className={cn(
              "flex h-10 flex-1 items-center justify-center rounded-[10px] text-[13px]",
              active ? "bg-card font-medium text-brand shadow-float" : "font-light text-[#8A8A8A]"
            )}
          >
            {orderTypeLabel(lang, value)}
          </button>
        );
      })}
    </div>
  );
}

export { TAB_VALUES as DELIVERY_TAB_VALUES };
