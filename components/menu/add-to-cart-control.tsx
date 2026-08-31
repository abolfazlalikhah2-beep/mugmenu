"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/menu/stepper";
import { ProductOptionsForm } from "@/components/menu/product-options-form";
import { formatToman } from "@/features/menu/utils/money";
import { useCart } from "@/features/menu/client/cart-context";
import {
  defaultSelection,
  selectionToOptions,
  allRequiredGroupsSelected,
  toggleOptionSelection,
  type OptionSelection,
  type ProductOptionGroupValue,
} from "@/features/menu/utils/product-options";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function AddToCartControl({
  slug,
  productId,
  categoryId,
  name,
  price,
  imageUrl,
  optionGroups = [],
  outOfStock = false,
  lang = "fa",
}: {
  slug: string;
  productId: string;
  categoryId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  optionGroups?: ProductOptionGroupValue[];
  /** trackInventory && stock === 0 on the product — see order-service.ts, which blocks checkout the same way server-side. */
  outOfStock?: boolean;
  lang?: MenuLang;
}) {
  const [qty, setQty] = React.useState(1);
  const [selected, setSelected] = React.useState<OptionSelection>(() => defaultSelection(optionGroups));
  const [note, setNote] = React.useState("");
  const { addItem } = useCart();
  const router = useRouter();
  const t = menuCopy(lang);

  const selectedOptions = selectionToOptions(optionGroups, selected);
  const extraTotal = selectedOptions.reduce((sum, o) => sum + o.extraPrice, 0);
  const unitPrice = price + extraTotal;
  const canAdd = !outOfStock && allRequiredGroupsSelected(optionGroups, selected);

  return (
    <>
      <ProductOptionsForm
        optionGroups={optionGroups}
        selected={selected}
        onToggle={(groupId, optionId) => {
          const group = optionGroups.find((g) => g.id === groupId);
          if (!group) return;
          setSelected((prev) => toggleOptionSelection(prev, group, optionId));
        }}
        note={note}
        onNoteChange={setNote}
        lang={lang}
      />
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium">{t.quantity}</span>
        <div className={outOfStock ? "pointer-events-none opacity-45" : undefined}>
          <Stepper
            qty={qty}
            size={46}
            lang={lang}
            onIncrement={() => setQty((q) => q + 1)}
            onDecrement={() => setQty((q) => Math.max(1, q - 1))}
          />
        </div>
      </div>
      {outOfStock ? (
        <div className="mt-1 flex items-center gap-3">
          <div className="flex h-[52px] flex-1 cursor-not-allowed items-center justify-center gap-2.5 rounded-btn bg-[#F0F0F0] text-[15.5px] font-medium text-[#A7A7A7]">
            {t.outOfStockBar}
          </div>
          <button
            type="button"
            disabled
            className="flex h-[52px] w-[120px] shrink-0 cursor-not-allowed flex-col items-center justify-center rounded-btn border border-[#EAEAEA]"
          >
            <span className="text-[11px] text-text-3">{t.notifyMeLabel}</span>
            <span className="text-[12.5px] font-medium text-brand">{t.notifyMeSub}</span>
          </button>
        </div>
      ) : (
        <button
          disabled={!canAdd}
          onClick={() => {
            addItem(
              {
                productId,
                categoryId,
                name,
                price: unitPrice,
                imageUrl,
                selectedOptions,
                note: note.trim() || undefined,
                productOptionGroups: optionGroups,
              },
              qty
            );
            router.push(`/${slug}`);
          }}
          className="mt-1 flex h-[54px] items-center justify-center gap-2.5 rounded-btn bg-brand text-base text-white disabled:opacity-60"
        >
          <span>{t.addToCart}</span>
          <span className="text-sm opacity-85">
            ({formatToman(unitPrice * qty, lang)} {t.toman})
          </span>
        </button>
      )}
    </>
  );
}
