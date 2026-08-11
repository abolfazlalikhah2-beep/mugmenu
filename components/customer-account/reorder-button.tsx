"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/features/menu/client/cart-context";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export interface ReorderItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export function ReorderButton({
  slug,
  items,
  lang = "fa",
}: {
  slug: string;
  items: ReorderItem[];
  lang?: MenuLang;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const t = menuCopy(lang);

  function handleReorder() {
    for (const item of items) {
      addItem({ productId: item.productId, name: item.name, price: item.price, imageUrl: item.imageUrl }, item.quantity);
    }
    router.push(`/${slug}/cart`);
  }

  return (
    <button
      type="button"
      onClick={handleReorder}
      className="flex h-[50px] flex-1 items-center justify-center rounded-btn bg-brand text-[15px] text-white"
    >
      {t.reorder}
    </button>
  );
}
