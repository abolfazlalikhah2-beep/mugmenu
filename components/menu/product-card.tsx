"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { MenuImage } from "@/components/menu/menu-image";
import { formatToman, computeDiscountedPrice } from "@/features/menu/utils/money";
import { useCart } from "@/features/menu/client/cart-context";
import { localizedName, localizedText, menuCopy, addAriaLabel, type MenuLang } from "@/features/menu/utils/menu-language";

export interface ProductCardData {
  id: string;
  name: string;
  nameEn?: string | null;
  description: string | null;
  descriptionEn?: string | null;
  price: number;
  imageUrl: string | null;
  discountPercent?: number | null;
  trackInventory?: boolean;
  stock?: number;
}

export function ProductCard({
  slug,
  product,
  lang = "fa",
  orderingEnabled = true,
}: {
  slug: string;
  product: ProductCardData;
  lang?: MenuLang;
  orderingEnabled?: boolean;
}) {
  const { addItem } = useCart();
  const hasDiscount = !!product.discountPercent;
  const finalPrice = computeDiscountedPrice(product.price, product.discountPercent);
  const outOfStock = !!product.trackInventory && (product.stock ?? 0) <= 0;
  const t = menuCopy(lang);
  const name = localizedName(lang, product.name, product.nameEn);
  const description = localizedText(lang, product.description, product.descriptionEn);
  const align = lang === "en" ? "text-left" : "text-right";

  return (
    <div className={"flex items-center gap-4 rounded-card-sm bg-card p-3.5 shadow-float" + (outOfStock ? " opacity-70" : "")}>
      <Link href={`/${slug}/item/${product.id}`} className="relative block h-22 w-22 shrink-0 overflow-hidden rounded-2xl">
        <MenuImage
          imageUrl={product.imageUrl}
          alt={name}
          label={name}
          className={"h-full w-full" + (outOfStock ? " grayscale" : "")}
          sizes="88px"
        />
        {hasDiscount && (
          <span className="absolute top-0 right-0 rounded-bl-[10px] bg-[#E5484D] px-2 py-[3px] text-[10px] font-semibold text-white">
            {product.discountPercent}٪
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/30">
            <span className="rounded-lg bg-black/55 px-2 py-[3px] text-[11px] font-semibold text-white">
              {t.outOfStockBadge}
            </span>
          </span>
        )}
      </Link>
      <div className={`flex min-w-0 flex-1 flex-col gap-1.5 ${align}`}>
        <Link href={`/${slug}/item/${product.id}`} className="text-base font-semibold">
          {name}
        </Link>
        {description && (
          <p className="m-0 line-clamp-2 text-[11px] leading-[1.7] font-light text-text-3">{description}</p>
        )}
        <div className="mt-0.5 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 text-base font-bold">
            <span className="text-brand">{formatToman(finalPrice, lang)}</span>
            <span className="text-[11px] font-light text-text-3">{t.toman}</span>
            {hasDiscount && (
              <span className="text-[11px] font-light text-[#B0B0B0] line-through">
                {formatToman(product.price, lang)}
              </span>
            )}
          </div>
          {orderingEnabled && (
            <button
              onClick={() =>
                addItem({
                  productId: product.id,
                  name,
                  price: finalPrice,
                  imageUrl: product.imageUrl,
                })
              }
              disabled={outOfStock}
              aria-label={addAriaLabel(lang, name)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-brand text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
