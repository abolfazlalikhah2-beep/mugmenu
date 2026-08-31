"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/menu/category-icon";
import { ProductCard, type ProductCardData } from "@/components/menu/product-card";
import { ProductSearchModal } from "@/components/menu/product-search-modal";
import { useCart } from "@/features/menu/client/cart-context";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

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
  const { count } = useCart();
  const visible = activeId === ALL_ID ? products : products.filter((p) => p.categoryId === activeId);
  const t = menuCopy(lang);
  const activeCategoryName =
    activeId === ALL_ID ? t.allCategoriesLabel : (categories.find((c) => c.id === activeId)?.name ?? t.allCategoriesLabel);

  return (
    <>
      <div className="flex items-center justify-between border-t border-[#F0F0F0] bg-card px-4 py-3.5 md:px-6.5">
        <Link
          href={`/${slug}/cart`}
          aria-label={t.cartTitle}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white"
        >
          <ShoppingCart size={20} />
          {count > 0 && (
            <span className="absolute -top-1.5 -left-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-card bg-[#E5484D] px-1 text-[11px] font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
        <span className="flex-1 truncate px-2 text-center text-base font-semibold">{activeCategoryName}</span>
        <div className="h-11 w-11 shrink-0" />
      </div>

      <div className="flex items-center gap-2.5 bg-card px-4 pt-3 pb-4 md:px-6.5">
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
