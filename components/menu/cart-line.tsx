"use client";

import { MenuImage } from "@/components/menu/menu-image";
import { Stepper } from "@/components/menu/stepper";
import { formatToman } from "@/features/menu/utils/money";
import { useCart, type CartItem } from "@/features/menu/client/cart-context";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function CartLine({ item, lang = "fa" }: { item: CartItem & { lineId: string }; lang?: MenuLang }) {
  const { setQty } = useCart();
  const t = menuCopy(lang);

  return (
    <div className="flex items-center gap-3.5 border-b border-[#F2F2F2] py-3.5">
      <MenuImage imageUrl={item.imageUrl} alt={item.name} className="h-[58px] w-[58px] shrink-0 rounded-2xl" />
      <div className={lang === "en" ? "flex-1 text-left" : "flex-1 text-right"}>
        <div className="text-[15px] font-medium">{item.name}</div>
        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <div className="mt-0.5 text-xs font-light text-text-3">
            {item.selectedOptions.map((o) => o.optionName).join("، ")}
          </div>
        )}
        <div className="mt-1 text-[13px] font-semibold text-brand">
          {formatToman(item.price, lang)} {t.toman}
        </div>
      </div>
      <Stepper
        qty={item.qty}
        size={36}
        lang={lang}
        onIncrement={() => setQty(item.lineId, item.qty + 1)}
        onDecrement={() => setQty(item.lineId, item.qty - 1)}
      />
    </div>
  );
}
