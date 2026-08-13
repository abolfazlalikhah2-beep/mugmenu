"use client";

import { formatToman } from "@/features/menu/utils/money";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";
import type { ProductOptionGroupValue } from "@/features/menu/utils/product-options";

export function OptionGroupPicker({
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

/** Option-group radio chips + the per-item order note field — used by both AddToCartControl (item page) and EditCartItemModal (cart). */
export function ProductOptionsForm({
  optionGroups,
  selected,
  onSelect,
  note,
  onNoteChange,
  lang,
}: {
  optionGroups: ProductOptionGroupValue[];
  selected: Record<string, string>;
  onSelect: (groupId: string, optionId: string) => void;
  note: string;
  onNoteChange: (note: string) => void;
  lang: MenuLang;
}) {
  const t = menuCopy(lang);
  return (
    <>
      {optionGroups
        .filter((g) => g.options.length > 0)
        .map((g) => (
          <OptionGroupPicker
            key={g.id}
            group={g}
            selectedOptionId={selected[g.id]}
            onSelect={(optionId) => onSelect(g.id, optionId)}
            lang={lang}
          />
        ))}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-light text-text-4">{t.orderNoteLabel}</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={t.orderNotePlaceholder}
          rows={2}
          dir={lang === "en" ? "ltr" : "rtl"}
          className="min-h-[56px] rounded-input border border-border-input p-[10px_14px] text-sm text-ink outline-none focus:border-brand"
          style={{ textAlign: lang === "en" ? "left" : "right" }}
        />
      </div>
    </>
  );
}
