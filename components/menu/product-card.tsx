"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { MenuImage } from "@/components/menu/menu-image";
import { formatToman } from "@/features/menu/utils/money";
import { useCart } from "@/features/menu/client/cart-context";

export interface ProductCardData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}

export function ProductCard({
  slug,
  product,
}: {
  slug: string;
  product: ProductCardData;
}) {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col overflow-hidden rounded-card-sm border border-[#EEEEEE] bg-card">
      <Link href={`/${slug}/item/${product.id}`}>
        <MenuImage
          imageUrl={product.imageUrl}
          alt={product.name}
          label={product.name}
          className="h-[110px] w-full md:h-[140px]"
        />
      </Link>
      <div className="flex flex-col gap-2 p-3.5 text-right">
        <Link href={`/${slug}/item/${product.id}`} className="text-sm font-medium md:text-base">
          {product.name}
        </Link>
        {product.description && (
          <p className="m-0 h-9 overflow-hidden text-[11px] leading-[1.7] font-light text-text-3">
            {product.description}
          </p>
        )}
        <div className="mt-0.5 flex items-center justify-between">
          <div className="text-sm font-semibold md:text-base">
            {formatToman(product.price)}
            <span className="mr-1 text-[10px] font-light text-text-3">تومان</span>
          </div>
          <button
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              })
            }
            aria-label={`افزودن ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
