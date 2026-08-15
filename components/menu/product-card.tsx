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
}: {
  slug: string;
  product: ProductCardData;
  lang?: MenuLang;
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
    <div className={"flex flex-col overflow-hidden rounded-card-sm border border-[#EEEEEE] bg-card" + (outOfStock ? " opacity-70" : "")}>
      <Link href={`/${slug}/item/${product.id}`} className="relative block">
        <MenuImage
          imageUrl={product.imageUrl}
          alt={name}
          label={name}
          className="h-[110px] w-full md:h-[140px]"
        />
        {outOfStock && (
          <span className="absolute top-2 right-2 rounded-lg bg-[#E5484D] px-2.5 py-[3px] text-[11px] font-medium text-white">
            {t.outOfStockBadge}
          </span>
        )}
      </Link>
      <div className={`flex flex-col gap-2 p-3.5 ${align}`}>
        <Link href={`/${slug}/item/${product.id}`} className="text-sm font-medium md:text-base">
          {name}
        </Link>
        {description && (
          <p className="m-0 h-9 overflow-hidden text-[11px] leading-[1.7] font-light text-text-3">
            {description}
          </p>
        )}
        <div className="mt-0.5 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 text-sm font-semibold md:text-base">
            <span>{formatToman(finalPrice, lang)}</span>
            <span className="text-[10px] font-light text-text-3">{t.toman}</span>
            {hasDiscount && (
              <span className="text-[10px] font-light text-[#B0B0B0] line-through">
                {formatToman(product.price, lang)}
              </span>
            )}
          </div>
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
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
