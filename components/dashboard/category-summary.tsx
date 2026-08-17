"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatToman } from "@/features/menu/utils/money";
import type { TopProduct, CategoryBreakdown } from "@/features/dashboard/services/stats-service";

export function CategorySummary({
  totalSales,
  topProducts,
  categories,
}: {
  totalSales: number;
  topProducts: TopProduct[];
  categories: CategoryBreakdown[];
}) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const filteredProducts = activeCategory
    ? topProducts.filter((p) => p.category === activeCategory)
    : topProducts;

  return (
    <div className="flex h-full flex-col gap-4.5 rounded-[22px] bg-card p-6 shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">خلاصه فروش دسته</span>
        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            disabled={categories.length === 0}
            className="flex h-[34px] items-center gap-1.5 rounded-[11px] border border-[#E7E7E7] px-3.5 text-[13px] text-[#777] disabled:opacity-60"
          >
            {activeCategory ?? "همه"}
            <ChevronDown
              size={16}
              className={cn("text-[#9A9A9A] transition-transform", open && "rotate-180")}
            />
          </button>
          {open && categories.length > 0 && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-10 w-48 overflow-hidden rounded-[14px] border border-[#EAEAEA] bg-card py-1.5 shadow-modal">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-3.5 py-2 text-[13px] transition-colors hover:bg-[#F6F6F6]",
                  !activeCategory && "font-medium text-brand"
                )}
              >
                همه دسته‌ها
              </button>
              {categories.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setActiveCategory(c.name);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3.5 py-2 text-[13px] transition-colors hover:bg-[#F6F6F6]",
                    activeCategory === c.name && "font-medium text-brand"
                  )}
                >
                  <span>{c.name}</span>
                  <span className="text-[11px] font-light text-text-3">{formatToman(c.revenue)} ت</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="mb-1.5 text-[13px] font-light text-text-3">کل فروش دسته</div>
        <div className="text-[26px] font-bold">
          {formatToman(totalSales)}
          <span className="mr-1.5 text-[13px] font-light text-text-3">تومان</span>
        </div>
      </div>
      <div className="h-px bg-[#F0F0F0]" />
      {filteredProducts.length === 0 ? (
        <div className="text-sm text-text-3">هنوز فروشی ثبت نشده است.</div>
      ) : (
        <>
          <div className="text-right text-[13px] font-medium text-[#777]">پرفروش‌ترین‌ها</div>
          <div className="flex flex-col gap-3.5">
            {filteredProducts.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-3 rounded-xl transition-colors hover:bg-[#F8F9F8]"
              >
                <div className="h-[46px] w-[46px] shrink-0 rounded-[13px] bg-[#F2F2F2]" />
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-sm font-medium">{f.name}</div>
                  <span className="mt-1 inline-block rounded-lg border-[0.3px] border-[#CECECE] bg-[#F6F6F6] px-2 text-[10px] text-[#777]">
                    {f.category}
                  </span>
                </div>
                <div className="shrink-0 text-left">
                  <div className="text-[13px] font-semibold text-brand">{formatToman(f.revenue)} ت</div>
                  <div className="mt-0.5 text-[11px] font-light text-text-3">
                    {formatToman(f.quantity)} سفارش
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
