"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/menu/category-icon";
import { ProductCard, type ProductCardData } from "@/components/menu/product-card";
import { ProductSearchModal } from "@/components/menu/product-search-modal";
import { menuCopy, itemCountLabel, type MenuLang } from "@/features/menu/utils/menu-language";

export interface CategoryData {
  id: string;
  name: string;
  icon: string | null;
}

/** Synthetic id for the "همه" (All) chip — not a real Category row, just clears the category filter. */
const ALL_ID = "__all__";

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
  const [searchOpen, setSearchOpen] = React.useState(false);
  const visible = activeId === ALL_ID ? products : products.filter((p) => p.categoryId === activeId);
  const t = menuCopy(lang);
  const activeCategoryName =
    activeId === ALL_ID ? t.allCategoriesLabel : (categories.find((c) => c.id === activeId)?.name ?? t.allCategoriesLabel);

  return (
    <>
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-2.5 md:px-6.5">
        <div className="flex flex-1 gap-2.5 overflow-x-auto md:flex-wrap md:overflow-visible">
          <button
            onClick={() => setActiveId(ALL_ID)}
            className={cn(
              "flex h-[38px] shrink-0 items-center gap-2.5 rounded-xl px-4 text-sm whitespace-nowrap",
              activeId === ALL_ID ? "bg-brand text-white" : "bg-chip text-[#666]"
            )}
          >
            {t.allCategoriesLabel}
          </button>
          {categories.map((c) => {
            const active = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "flex h-[38px] shrink-0 items-center gap-2.5 rounded-xl px-4 text-sm whitespace-nowrap",
                  active ? "bg-brand text-white" : "bg-chip text-[#666]"
                )}
              >
                <CategoryIcon icon={c.icon} size={17} className={active ? "text-white" : "text-[#8A8A8A]"} />
                {c.name}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          aria-label={t.searchButtonLabel}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-chip text-[#5A5A5A]"
        >
          <Search size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between px-4 pt-1 pb-2 md:px-6.5">
        <span className="text-base font-bold">{activeCategoryName}</span>
        <span className="text-xs font-light text-text-3">{itemCountLabel(lang, visible.length)}</span>
      </div>

      <div className="flex flex-col gap-3.5 bg-[#F4F5F4] p-4 md:grid md:grid-cols-2 md:gap-4.5 md:p-6.5">
        {visible.map((p) => (
          <ProductCard key={p.id} slug={slug} product={p} lang={lang} orderingEnabled={orderingEnabled} />
        ))}
      </div>
      {searchOpen && (
        <ProductSearchModal
          slug={slug}
          products={products}
          lang={lang}
          orderingEnabled={orderingEnabled}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}
