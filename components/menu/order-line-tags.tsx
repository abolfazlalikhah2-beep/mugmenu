import { Pencil } from "lucide-react";
import { formatToman } from "@/features/menu/utils/money";
import type { MenuLang } from "@/features/menu/utils/menu-language";

export interface OrderLineTagOption {
  groupName: string;
  optionName: string;
  extraPrice: number;
}

export function OrderLineTags({ options, lang = "fa" }: { options: OrderLineTagOption[]; lang?: MenuLang }) {
  if (options.length === 0) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {options.map((o, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-[#F6F6F6] px-2 py-1 text-[11px] text-text-2"
        >
          <span className="text-text-3">{o.groupName}:</span>
          <span className="font-medium text-[#3A3A3A]">{o.optionName}</span>
          {o.extraPrice > 0 && (
            <span className="font-mont text-[10px] text-brand">+{formatToman(o.extraPrice, lang)}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function OrderLineNote({ note }: { note: string | null | undefined }) {
  if (!note) return null;
  return (
    <div className="mt-1.5 flex w-fit items-center gap-1.5 rounded-lg bg-[#FDF7E6] px-2 py-1 text-[11px] text-[#9F7A2B]">
      <Pencil size={11} />
      <span>{note}</span>
    </div>
  );
}
