"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/menu/category-icon";
import { ProductCard, type ProductCardData } from "@/components/menu/product-card";
import type { MenuLang } from "@/features/menu/utils/menu-language";

export interface CategoryData {
  id: string;
  name: string;
  icon: string | null;
}

export function CategoryBrowser({
  slug,
  categories,
  products,
  lang = "fa",
  orderingEnabled = true,
}: {
  slug: string;
  categories: CategoryData[];
  products: (ProductCardData & { categoryId: string })[];
  lang?: MenuLang;
  orderingEnabled?: boolean;
}) {
  const [activeId, setActiveId] = React.useState(categories[0]?.id);
  const visible = products.filter((p) => p.categoryId === activeId);

  return (
    <>
      <div className="flex gap-2.5 overflow-x-auto px-4 pt-4 md:flex-wrap md:overflow-visible md:px-6.5">
        {categories.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={cn(
                "flex h-[38px] shrink-0 items-center gap-2 rounded-card-sm px-4 text-sm whitespace-nowrap",
                active
                  ? "bg-brand text-white"
                  : "border-[0.3px] border-border-chip bg-chip text-[#666]"
              )}
            >
              <CategoryIcon icon={c.icon} size={17} className={active ? "text-white" : "text-[#8A8A8A]"} />
              {c.name}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 md:gap-4.5 md:p-6.5">
        {visible.map((p) => (
          <ProductCard key={p.id} slug={slug} product={p} lang={lang} orderingEnabled={orderingEnabled} />
        ))}
      </div>
    </>
  );
}
