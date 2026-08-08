"use client";

import { useTransition } from "react";
import { Zap, Pencil } from "lucide-react";
import { Toggle } from "@/components/dashboard/toggle";
import { toggleDiscountActiveAction } from "@/features/dashboard/routes/actions";

const COLUMNS = "1.8fr 1fr 1.6fr 1.4fr 1.2fr 1.2fr";

export interface AutoDiscountRowData {
  id: string;
  name: string;
  percent: number;
  scopeLabel: string;
  period: string;
  isActive: boolean;
}

export function AutoDiscountRow({
  discount,
  onEdit,
}: {
  discount: AutoDiscountRowData;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    startTransition(async () => {
      await toggleDiscountActiveAction(discount.id, next);
    });
  }

  return (
    <div
      className="grid min-w-[820px] items-center gap-2 border-t border-[#F4F4F4] p-[16px_18px] text-sm first:border-t-0"
      style={{ gridTemplateColumns: COLUMNS, opacity: discount.isActive ? 1 : 0.62 }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#FFF3E0]">
          <Zap size={18} className="text-[#E08600]" />
        </div>
        <span className="font-medium">{discount.name}</span>
      </div>
      <span className="text-lg font-bold text-brand">{discount.percent.toLocaleString("fa-IR")}٪</span>
      <span>
        <span className="inline-block w-fit rounded-[9px] bg-[#F1F1F1] px-3 py-[5px] text-xs font-medium text-[#555]">
          {discount.scopeLabel}
        </span>
      </span>
      <span className="text-[13px] font-light text-[#666]">{discount.period}</span>
      <span>
        <span
          className="inline-block w-fit rounded-[9px] px-3 py-[5px] text-xs font-medium"
          style={{
            color: discount.isActive ? "#328C3D" : "#8A8A8A",
            background: discount.isActive ? "#E5F0E6" : "#F0F0F0",
          }}
        >
          {discount.isActive ? "فعال" : "غیرفعال"}
        </span>
      </span>
      <div className="flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`ویرایش ${discount.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#F4F5F4]"
        >
          <Pencil size={18} className="text-[#5A5A5A]" />
        </button>
        <Toggle checked={discount.isActive} onChange={handleToggle} disabled={pending} />
      </div>
    </div>
  );
}
