"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/menu/stepper";
import { formatToman } from "@/features/menu/utils/money";
import { useCart, type SelectedCartOption } from "@/features/menu/client/cart-context";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export interface ProductOptionValue {
  id: string;
  name: string;
  extraPrice: number;
  isDefault: boolean;
}

export interface ProductOptionGroupValue {
  id: string;
  name: string;
  required: boolean;
  options: ProductOptionValue[];
}

function defaultSelection(groups: ProductOptionGroupValue[]): Record<string, string> {
  const entries: [string, string][] = [];
  for (const g of groups) {
    if (g.options.length === 0) continue;
    const def = g.options.find((o) => o.isDefault) ?? (g.required ? g.options[0] : undefined);
    if (def) entries.push([g.id, def.id]);
  }
  return Object.fromEntries(entries);
}

function OptionGroupPicker({
  group,
  selectedOptionId,
  onSelect,
  lang,
}: {
  group: ProductOptionGroupValue;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
  lang: MenuLang;
}) {
  const t = menuCopy(lang);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-medium">{group.name}</span>
        <span
          className={
            "rounded-lg px-2.5 py-[3px] text-[11px] font-medium " +
            (group.required ? "bg-[#E5F0E6] text-brand" : "bg-[#F2F2F2] text-[#8A8A8A]")
          }
        >
          {group.required ? t.optionRequired : t.optionOptional}
        </span>
        <span className="mr-auto text-[11.5px] text-text-3">{t.chooseOneOption}</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {group.options.map((o) => {
          const on = o.id === selectedOptionId;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelect(o.id)}
              className={
                "flex min-w-[104px] flex-col items-start gap-0.5 rounded-[14px] border px-3.5 py-2.5 text-start " +
                (on ? "border-[1.5px] border-brand bg-brand/[0.07]" : "border-[#E4E4E4] bg-card")
              }
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={
                    "h-4 w-4 shrink-0 rounded-full border-[1.5px] " +
                    (on ? "border-[5px] border-brand" : "border-[#D3D3D3]")
                  }
                />
                <span className={"text-sm " + (on ? "font-medium text-[#256B2C]" : "text-[#3A3A3A]")}>
                  {o.name}
                </span>
              </span>
              <span className={"pr-[23px] text-[11.5px] " + (o.extraPrice ? "text-brand" : "text-text-3")}>
                {o.extraPrice ? `+${formatToman(o.extraPrice, lang)} ${t.toman}` : t.noExtraCost}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AddToCartControl({
  slug,
  productId,
  name,
  price,
  imageUrl,
  optionGroups = [],
  lang = "fa",
}: {
  slug: string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  optionGroups?: ProductOptionGroupValue[];
  lang?: MenuLang;
}) {
  const [qty, setQty] = React.useState(1);
  const [selected, setSelected] = React.useState<Record<string, string>>(() => defaultSelection(optionGroups));
  const { addItem } = useCart();
  const router = useRouter();
  const t = menuCopy(lang);

  const selectedOptions: SelectedCartOption[] = optionGroups
    .map((g) => {
      const optionId = selected[g.id];
      const option = g.options.find((o) => o.id === optionId);
      return option
        ? { optionId: option.id, groupName: g.name, optionName: option.name, extraPrice: option.extraPrice }
        : null;
    })
    .filter((o): o is SelectedCartOption => o !== null);

  const extraTotal = selectedOptions.reduce((sum, o) => sum + o.extraPrice, 0);
  const unitPrice = price + extraTotal;
  const canAdd = optionGroups.every((g) => !g.required || !!selected[g.id]);

  return (
    <>
      {optionGroups
        .filter((g) => g.options.length > 0)
        .map((g) => (
          <OptionGroupPicker
            key={g.id}
            group={g}
            selectedOptionId={selected[g.id]}
            onSelect={(optionId) => setSelected((prev) => ({ ...prev, [g.id]: optionId }))}
            lang={lang}
          />
        ))}
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
          addItem({ productId, name, price: unitPrice, imageUrl, selectedOptions }, qty);
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
