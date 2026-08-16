"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { MenuImage } from "@/components/menu/menu-image";
import { Stepper } from "@/components/menu/stepper";
import { OrderLineTags, OrderLineNote } from "@/components/menu/order-line-tags";
import { EditCartItemModal } from "@/components/menu/edit-cart-item-modal";
import { formatToman } from "@/features/menu/utils/money";
import { useCart, type CartItem } from "@/features/menu/client/cart-context";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function CartLine({ item, lang = "fa" }: { item: CartItem & { lineId: string }; lang?: MenuLang }) {
  const { setQty } = useCart();
  const t = menuCopy(lang);
  const [editing, setEditing] = React.useState(false);
  const editable = (item.productOptionGroups ?? []).some((g) => g.options.length > 0);

  return (
    <div className="flex flex-col gap-2.5 border-b border-[#F2F2F2] py-3.5">
      <div className="flex items-center gap-3.5">
        <MenuImage
          imageUrl={item.imageUrl}
          alt={item.name}
          className="h-[58px] w-[58px] shrink-0 rounded-2xl"
          sizes="58px"
        />
        <div className={lang === "en" ? "flex-1 text-left" : "flex-1 text-right"}>
          <div className="text-[15px] font-medium">{item.name}</div>
          <OrderLineTags options={item.selectedOptions ?? []} lang={lang} />
          <OrderLineNote note={item.note} />
          <div className="mt-1 text-[13px] font-semibold text-brand">
            {formatToman(item.price, lang)} {t.toman}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2.5">
        <Stepper
          qty={item.qty}
          size={36}
          lang={lang}
          showTrashAtOne
          onIncrement={() => setQty(item.lineId, item.qty + 1)}
          onDecrement={() => setQty(item.lineId, item.qty - 1)}
        />
        {editable && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-8 items-center gap-1.5 rounded-[11px] border border-[#EAEAEA] px-2.5 text-xs text-[#5F5F5F]"
          >
            <Pencil size={13} />
            <span>{t.editOptionsLabel}</span>
          </button>
        )}
      </div>
      {editing && <EditCartItemModal item={item} lang={lang} onClose={() => setEditing(false)} />}
    </div>
  );
}
