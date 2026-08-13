import { Trash2 } from "lucide-react";
import { toPersianDigits } from "@/features/menu/utils/money";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function Stepper({
  qty,
  onIncrement,
  onDecrement,
  size = 44,
  lang = "fa",
  /** Cart lines only: swap the minus icon for a trash icon at qty 1, signaling that decrementing removes the line. */
  showTrashAtOne = false,
}: {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: number;
  lang?: MenuLang;
  showTrashAtOne?: boolean;
}) {
  const t = menuCopy(lang);
  const trash = showTrashAtOne && qty === 1;
  return (
    <div
      className="flex items-center overflow-hidden rounded-xl border border-[#E3E3E3]"
      style={{ height: size }}
    >
      <button
        type="button"
        onClick={onIncrement}
        className="flex items-center justify-center bg-card text-xl text-brand"
        style={{ width: size, height: size }}
        aria-label={t.increaseQty}
      >
        +
      </button>
      <span className="w-10 text-center text-base font-medium">{toPersianDigits(qty, lang)}</span>
      <button
        type="button"
        onClick={onDecrement}
        className={"flex items-center justify-center bg-card " + (trash ? "text-[#C15656]" : "text-[22px] text-[#B0B0B0]")}
        style={{ width: size, height: size }}
        aria-label={trash ? t.delete : t.decreaseQty}
      >
        {trash ? <Trash2 size={Math.round(size * 0.36)} /> : "−"}
      </button>
    </div>
  );
}
