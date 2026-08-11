"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/menu/stepper";
import { formatToman } from "@/features/menu/utils/money";
import { useCart } from "@/features/menu/client/cart-context";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function AddToCartControl({
  slug,
  productId,
  name,
  price,
  imageUrl,
  lang = "fa",
}: {
  slug: string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  lang?: MenuLang;
}) {
  const [qty, setQty] = React.useState(1);
  const { addItem } = useCart();
  const router = useRouter();
  const t = menuCopy(lang);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium">{t.quantity}</span>
        <Stepper
          qty={qty}
          size={46}
          lang={lang}
          onIncrement={() => setQty((q) => q + 1)}
          onDecrement={() => setQty((q) => Math.max(1, q - 1))}
        />
      </div>
      <button
        onClick={() => {
          addItem({ productId, name, price, imageUrl }, qty);
          router.push(`/${slug}/menu`);
        }}
        className="mt-1 flex h-[54px] items-center justify-center gap-2.5 rounded-btn bg-brand text-base text-white"
      >
        <span>{t.addToCart}</span>
        <span className="text-sm opacity-85">
          ({formatToman(price * qty, lang)} {t.toman})
        </span>
      </button>
    </>
  );
}
