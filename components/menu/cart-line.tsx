"use client";

import { MenuImage } from "@/components/menu/menu-image";
import { Stepper } from "@/components/menu/stepper";
import { formatToman } from "@/features/menu/utils/money";
import { useCart, type CartItem } from "@/features/menu/client/cart-context";

export function CartLine({ item }: { item: CartItem }) {
  const { setQty } = useCart();

  return (
    <div className="flex items-center gap-3.5 border-b border-[#F2F2F2] py-3.5">
      <MenuImage imageUrl={item.imageUrl} alt={item.name} className="h-[58px] w-[58px] shrink-0 rounded-2xl" />
      <div className="flex-1 text-right">
        <div className="text-[15px] font-medium">{item.name}</div>
        <div className="mt-1 text-[13px] font-semibold text-brand">
          {formatToman(item.price)} تومان
        </div>
      </div>
      <Stepper
        qty={item.qty}
        size={36}
        onIncrement={() => setQty(item.productId, item.qty + 1)}
        onDecrement={() => setQty(item.productId, item.qty - 1)}
      />
    </div>
  );
}
