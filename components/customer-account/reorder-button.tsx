"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/features/menu/client/cart-context";

export interface ReorderItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export function ReorderButton({ slug, items }: { slug: string; items: ReorderItem[] }) {
  const router = useRouter();
  const { addItem } = useCart();

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
      سفارش مجدد
    </button>
  );
}
