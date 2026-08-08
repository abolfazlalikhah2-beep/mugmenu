"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/features/menu/client/cart-context";

export function CartFab({ slug }: { slug: string }) {
  const { count, total } = useCart();
  if (count === 0) return null;

  return (
    <Link
      href={`/${slug}/cart`}
      className="fixed bottom-5 left-1/2 z-40 flex h-14 w-[calc(100%-40px)] max-w-[400px] -translate-x-1/2 items-center justify-between rounded-btn bg-brand px-5 text-white shadow-modal"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-medium">
        {count}
      </span>
      <span className="flex items-center gap-2 text-[15px] font-medium">
        <ShoppingBag size={18} />
        مشاهده سبد خرید
      </span>
      <span className="text-sm font-medium" dir="ltr">
        {total.toLocaleString("fa-IR")}
      </span>
    </Link>
  );
}
