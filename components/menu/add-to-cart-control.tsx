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
  lang = "fa",
}: {
  slug: string;
  productId: string;
  categoryId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  optionGroups?: ProductOptionGroupValue[];
  lang?: MenuLang;
}) {
  const [qty, setQty] = React.useState(1);
  const [selected, setSelected] = React.useState<Record<string, string>>(() => defaultSelection(optionGroups));
  const [note, setNote] = React.useState("");
  const { addItem } = useCart();
  const router = useRouter();
  const t = menuCopy(lang);

  const selectedOptions = selectionToOptions(optionGroups, selected);
  const extraTotal = selectedOptions.reduce((sum, o) => sum + o.extraPrice, 0);
  const unitPrice = price + extraTotal;
  const canAdd = allRequiredGroupsSelected(optionGroups, selected);

  return (
    <>
      <ProductOptionsForm
        optionGroups={optionGroups}
        selected={selected}
        onSelect={(groupId, optionId) => setSelected((prev) => ({ ...prev, [groupId]: optionId }))}
        note={note}
        onNoteChange={setNote}
        lang={lang}
      />
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium">{t.quantity}</span>
        <Stepper
          qty={qty}
          size={46}
          lang={lang}
          onIncrement={() => setQty((q) => q + 1)}
          onDecrement={() => setQty((q) => Math.max(1, q - 1))}
        />
      </div>
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
          router.push(`/${slug}/menu`);
        }}
        className="mt-1 flex h-[54px] items-center justify-center gap-2.5 rounded-btn bg-brand text-base text-white disabled:opacity-60"
      >
        <span>{t.addToCart}</span>
        <span className="text-sm opacity-85">
          ({formatToman(unitPrice * qty, lang)} {t.toman})
        </span>
      </button>
    </>
  );
}
