"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { ProductCard, type ProductCardData } from "@/components/dashboard/product-card";
import { ProductModal, type CategoryOption } from "@/components/dashboard/product-modal";

export function ProductsView({
  products,
  categories,
}: {
  products: ProductCardData[];
  categories: CategoryOption[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory && p.category.name !== activeCategory) return false;
      if (search.trim() && !p.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [products, activeCategory, search]);

  const categoryNames = useMemo(() => [...new Set(products.map((p) => p.category.name))], [products]);
  const editingProduct = modal !== "closed" && modal !== "create" ? products.find((p) => p.id === modal) : null;

  return (
    <div className="flex h-full flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              "flex h-10 items-center rounded-xl px-5 text-sm",
              activeCategory === null
                ? "bg-brand font-medium text-white"
                : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
            )}
          >
            همه
          </button>
          {categoryNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveCategory(name)}
              className={cn(
                "flex h-10 items-center rounded-xl px-5 text-sm",
                activeCategory === name
                  ? "bg-brand font-medium text-white"
                  : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5 rounded-[13px] bg-card px-4" style={{ height: 44, width: 300, boxShadow: "0px 4px 12px rgba(0,0,0,0.03)" }}>
          <Search size={18} className="text-[#B0B0B0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی محصول…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
          />
        </div>
        <PrimaryButton onClick={() => setModal("create")}>محصول جدید</PrimaryButton>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-card p-10 text-center text-sm text-text-3 shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          محصولی یافت نشد.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onEdit={() => setModal(p.id)} />
          ))}
        </div>
      )}

      {modal === "create" && (
        <ProductModal categories={categories} product={null} onClose={() => setModal("closed")} />
      )}
      {editingProduct && (
        <ProductModal
          categories={categories}
          product={{
            id: editingProduct.id,
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            discountPercent: editingProduct.discountPercent,
            categoryId: editingProduct.categoryId,
            isActive: editingProduct.isActive,
            imageUrl: editingProduct.imageUrl,
            optionGroups: editingProduct.optionGroups,
            trackInventory: editingProduct.trackInventory,
            stock: editingProduct.stock,
            lowStockThreshold: editingProduct.lowStockThreshold,
          }}
          onClose={() => setModal("closed")}
        />
      )}
    </div>
  );
}
