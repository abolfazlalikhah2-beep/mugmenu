import { toPersianDigits } from "@/features/menu/utils/money";

export function Stepper({
  qty,
  onIncrement,
  onDecrement,
  size = 44,
}: {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: number;
}) {
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
        aria-label="افزایش تعداد"
      >
        +
      </button>
      <span className="w-10 text-center text-base font-medium">{toPersianDigits(qty)}</span>
      <button
        type="button"
        onClick={onDecrement}
        className="flex items-center justify-center bg-card text-[22px] text-[#B0B0B0]"
        style={{ width: size, height: size }}
        aria-label="کاهش تعداد"
      >
        −
      </button>
    </div>
  );
}
