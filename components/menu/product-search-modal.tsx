"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/menu/product-card";
import { menuCopy, searchResultsCountLabel, type MenuLang } from "@/features/menu/utils/menu-language";

export function ProductSearchModal({
  slug,
  products,
  lang = "fa",
  orderingEnabled = true,
  onClose,
}: {
  slug: string;
  products: ProductCardData[];
  lang?: MenuLang;
  orderingEnabled?: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const t = menuCopy(lang);
  const trimmed = query.trim();
  const q = trimmed.toLowerCase();
  const results = q
    ? products.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center md:bg-black/20">
      <div className="flex h-full w-full flex-col overflow-hidden bg-card md:h-auto md:max-h-[85vh] md:w-[640px] md:rounded-card md:shadow-modal">
        <div className="flex items-center gap-3 border-b border-[#F0F0F0] p-4 md:p-5.5">
          <div className="flex h-12 flex-1 items-center gap-2.5 rounded-input bg-chip px-4">
            <Search size={20} className="shrink-0 text-[#9A9A9A]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-sm text-[#333] outline-none placeholder:text-text-3"
            />
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-[#F4F5F4] text-[#8A8A8A]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 md:p-5.5">
          {q && (
            <p className="m-0 text-right text-[13px] font-light text-text-3">
              {searchResultsCountLabel(lang, results.length, trimmed)}
            </p>
          )}
          {q && results.length === 0 && (
            <p className="m-0 py-8 text-center text-sm text-text-3">{t.searchNoResults}</p>
          )}
          {results.map((p) => (
            <ProductCard key={p.id} slug={slug} product={p} lang={lang} orderingEnabled={orderingEnabled} />
          ))}
        </div>
      </div>
    </div>
  );
}
