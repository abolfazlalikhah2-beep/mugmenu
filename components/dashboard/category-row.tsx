"use client";

import { useTransition } from "react";
import { LayoutGrid, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Toggle } from "@/components/dashboard/toggle";
import {
  toggleCategoryActiveAction,
  deleteCategoryAction,
  moveCategoryAction,
} from "@/features/dashboard/routes/actions";

export interface CategoryRowData {
  id: string;
  name: string;
  isActive: boolean;
  _count: { products: number };
}

export function CategoryRow({
  category,
  isFirst,
  isLast,
  onEdit,
}: {
  category: CategoryRowData;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    startTransition(async () => {
      await toggleCategoryActiveAction(category.id, next);
    });
  }

  function handleDelete() {
    if (!confirm(`دسته «${category.name}» حذف شود؟`)) return;
    startTransition(async () => {
      await deleteCategoryAction(category.id);
    });
  }

  function handleMove(direction: "up" | "down") {
    startTransition(async () => {
      await moveCategoryAction(category.id, direction);
    });
  }

  return (
    <div className="grid grid-cols-[40px_2fr_1.2fr_1fr_1.1fr] items-center gap-2 border-t border-[#F4F4F4] p-[16px_18px] text-sm first:border-t-0">
      <div className="flex flex-col gap-0.5 text-[#C7C7C7]">
        <button type="button" onClick={() => handleMove("up")} disabled={pending || isFirst} className="disabled:opacity-30">
          <ChevronUp size={16} />
        </button>
        <button type="button" onClick={() => handleMove("down")} disabled={pending || isLast} className="disabled:opacity-30">
          <ChevronDown size={16} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#EAF3EB]">
          <LayoutGrid size={20} className="text-brand" />
        </div>
        <span className="font-medium">{category.name}</span>
      </div>
      <span className="font-light text-[#777]">{category._count.products.toLocaleString("fa-IR")} محصول</span>
      <span>
        <span
          className="inline-block rounded-[9px] px-3 py-[5px] text-xs font-medium"
          style={{
            color: category.isActive ? "#328C3D" : "#8A8A8A",
            background: category.isActive ? "#E5F0E6" : "#F0F0F0",
          }}
        >
          {category.isActive ? "فعال" : "غیرفعال"}
        </span>
      </span>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`ویرایش ${category.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#F4F5F4]"
        >
          <Pencil size={18} className="text-[#5A5A5A]" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label={`حذف ${category.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#FBECEC] disabled:opacity-60"
        >
          <Trash2 size={18} className="text-[#D06666]" />
        </button>
        <Toggle checked={category.isActive} onChange={handleToggle} disabled={pending} />
      </div>
    </div>
  );
}
