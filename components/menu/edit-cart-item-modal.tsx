"use client";

import * as React from "react";
import { X } from "lucide-react";
import { ProductOptionsForm } from "@/components/menu/product-options-form";
import { useCart, type CartItem } from "@/features/menu/client/cart-context";
import {
  defaultSelection,
  selectionToOptions,
  allRequiredGroupsSelected,
  toggleOptionSelection,
  type OptionSelection,
} from "@/features/menu/utils/product-options";
import { formatToman } from "@/features/menu/utils/money";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function EditCartItemModal({
  item,
  lang = "fa",
  onClose,
}: {
  item: CartItem & { lineId: string };
  lang?: MenuLang;
  onClose: () => void;
}) {
  const { updateItemOptions } = useCart();
  const t = menuCopy(lang);
  const align = lang === "en" ? "text-left" : "text-right";
  const groups = React.useMemo(() => item.productOptionGroups ?? [], [item.productOptionGroups]);

  const [selected, setSelected] = React.useState<OptionSelection>(() => {
    const fromLine: OptionSelection = {};
    for (const o of item.selectedOptions ?? []) {
      const group = groups.find((g) => g.options.some((opt) => opt.id === o.optionId));
      if (!group) continue;
      fromLine[group.id] = [...(fromLine[group.id] ?? []), o.optionId];
    }
    return Object.keys(fromLine).length > 0 ? fromLine : defaultSelection(groups);
  });
  const [note, setNote] = React.useState(item.note ?? "");

  const existingExtra = (item.selectedOptions ?? []).reduce((sum, o) => sum + o.extraPrice, 0);
  const basePrice = item.price - existingExtra;
  const selectedOptions = selectionToOptions(groups, selected);
  const extraTotal = selectedOptions.reduce((sum, o) => sum + o.extraPrice, 0);
  const unitPrice = basePrice + extraTotal;
  const canSave = allRequiredGroupsSelected(groups, selected);

  function handleSave() {
    updateItemOptions(item.lineId, selectedOptions, unitPrice, note.trim() || undefined);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center md:bg-black/16">
      <div className="relative h-full w-full overflow-y-auto bg-card md:h-auto md:max-h-[85vh] md:w-[560px] md:rounded-card md:shadow-modal">
        <div className="flex flex-col gap-4.5 p-6 pt-11 md:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="absolute top-6 left-5 text-[#969696] md:top-7 md:left-7"
          >
            <X size={26} strokeWidth={1.6} />
          </button>
          <span className={`text-lg font-semibold ${align}`}>{t.editOptionsLabel}</span>
          <div className="flex flex-col gap-5">
            <ProductOptionsForm
              optionGroups={groups}
              selected={selected}
              onToggle={(groupId, optionId) => {
                const group = groups.find((g) => g.id === groupId);
                if (!group) return;
                setSelected((prev) => toggleOptionSelection(prev, group, optionId));
              }}
              note={note}
              onNoteChange={setNote}
              lang={lang}
            />
          </div>
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="flex h-[52px] items-center justify-center gap-2 rounded-btn bg-brand text-base text-white disabled:opacity-60"
          >
            <span>{t.save}</span>
            <span className="text-sm opacity-85">
              ({formatToman(unitPrice, lang)} {t.toman})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
