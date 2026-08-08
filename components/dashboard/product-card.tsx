"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Toggle } from "@/components/dashboard/toggle";
import { formatToman } from "@/features/menu/utils/money";
import { toggleProductActiveAction, deleteProductAction } from "@/features/dashboard/routes/actions";

export interface ProductCardData {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  discountPercent: number | null;
  isActive: boolean;
  imageUrl: string | null;
  category: { name: string };
}

export function ProductCard({ product, onEdit }: { product: ProductCardData; onEdit: () => void }) {
  const [pending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    startTransition(async () => {
      await toggleProductActiveAction(product.id, next);
    });
  }

  function handleDelete() {
    if (!confirm(`«${product.name}» حذف شود؟`)) return;
    startTransition(async () => {
      await deleteProductAction(product.id);
    });
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]"
      style={{ opacity: product.isActive ? 1 : 0.72 }}
    >
      <div className="relative h-[150px] bg-[#F2F2F2]">
        {product.imageUrl && (
          <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
        )}
        <div className="absolute top-3 right-3">
          <span
            className="rounded-[9px] px-3 py-[5px] text-xs font-medium"
            style={{
              color: product.isActive ? "#328C3D" : "#8A8A8A",
              background: "rgba(255,255,255,.92)",
            }}
          >
            {product.isActive ? "فعال" : "غیرفعال"}
          </span>
        </div>
        {!!product.discountPercent && (
          <div className="absolute top-3 left-3">
            <span className="rounded-[9px] bg-[#E5484D] px-3 py-[5px] text-xs font-medium text-white">
              {product.discountPercent.toLocaleString("fa-IR")}٪ تخفیف
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2.5 p-[14px_16px_16px] text-right">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-base font-medium">{product.name}</span>
          <span className="shrink-0 rounded-lg border-[0.3px] border-[#CECECE] bg-[#F6F6F6] px-2.5 py-[3px] text-[11px] text-[#777]">
            {product.category.name}
          </span>
        </div>
        <div className="h-[34px] overflow-hidden text-xs font-light leading-[1.7] text-text-3">
          {product.description}
        </div>
        <div className="flex items-center justify-between border-t border-[#F4F4F4] pt-3">
          <div className="text-base font-semibold text-brand">
            {formatToman(product.price)}
            <span className="mr-1 text-[11px] font-light text-text-3">ت</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`ویرایش ${product.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#F4F5F4]"
            >
              <Pencil size={18} className="text-[#5A5A5A]" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              aria-label={`حذف ${product.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#FBECEC] disabled:opacity-60"
            >
              <Trash2 size={18} className="text-[#D06666]" />
            </button>
            <Toggle checked={product.isActive} onChange={handleToggle} disabled={pending} />
          </div>
        </div>
      </div>
    </div>
  );
}
