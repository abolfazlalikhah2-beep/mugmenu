import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getItemDetailData } from "@/features/menu/services/menu-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { MenuImage } from "@/components/menu/menu-image";
import { StarIcon } from "@/components/ui/rating";
import { formatToman, computeDiscountedPrice } from "@/features/menu/utils/money";
import { AddToCartControl } from "@/components/menu/add-to-cart-control";
import { CartFab } from "@/components/menu/cart-fab";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; itemId: string }>;
}) {
  const { cafeSlug, itemId } = await params;
  const data = await getItemDetailData(itemId);
  if (!data) notFound();
  const { product, rating } = data;
  const hasDiscount = !!product.discountPercent;
  const finalPrice = computeDiscountedPrice(product.price, product.discountPercent);

  return (
    <MenuPageShell>
      <div className="relative h-[230px] w-full md:h-[280px]">
        <MenuImage
          imageUrl={product.imageUrl}
          alt={product.name}
          label="عکس بزرگ آیتم"
          className="h-full w-full"
        />
        <Link
          href={`/${cafeSlug}/menu`}
          className="absolute top-4 left-4 flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-black/28 text-white backdrop-blur-sm"
        >
          <ChevronRight size={22} />
        </Link>
      </div>
      <div className="flex flex-col gap-4 p-5 text-right md:p-10">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[22px] font-semibold md:text-[26px]">{product.name}</span>
          {rating && (
            <Link
              href={`/${cafeSlug}/item/${itemId}/reviews`}
              className="flex h-8 items-center gap-1.5 rounded-chip border-[0.3px] border-border-chip bg-chip px-3"
            >
              <span className="text-[13px] text-text-2">{rating}</span>
              <StarIcon size={13} />
            </Link>
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-2 text-[15px] font-semibold text-brand">
          <span>{formatToman(finalPrice)} تومان</span>
          {hasDiscount && (
            <>
              <span className="text-xs font-light text-[#B0B0B0] line-through">
                {formatToman(product.price)}
              </span>
              <span className="rounded-lg bg-[#E5484D] px-2.5 py-[3px] text-[11px] font-semibold text-white">
                {product.discountPercent!.toLocaleString("fa-IR")}٪ تخفیف
              </span>
            </>
          )}
        </div>
        {product.description && (
          <p className="m-0 text-justify text-sm leading-[2] font-light text-text-1">
            {product.description}
          </p>
        )}
        <div className="h-px bg-[#F0F0F0]" />
        <AddToCartControl
          slug={cafeSlug}
          productId={product.id}
          name={product.name}
          price={finalPrice}
          imageUrl={product.imageUrl}
        />
      </div>
      <CartFab slug={cafeSlug} />
    </MenuPageShell>
  );
}
