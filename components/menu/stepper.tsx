import { toPersianDigits } from "@/features/menu/utils/money";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function Stepper({
  qty,
  onIncrement,
  onDecrement,
  size = 44,
  lang = "fa",
}: {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: number;
  lang?: MenuLang;
}) {
  const t = menuCopy(lang);
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
        className="flex items-center justify-center bg-card text-[22px] text-[#B0B0B0]"
        style={{ width: size, height: size }}
        aria-label={t.decreaseQty}
      >
        −
      </button>
    </div>
  );
}
