"use client";

import * as React from "react";
import { useCart } from "@/features/menu/client/cart-context";
import type { OrderType } from "@/features/menu/services/order-flow";

const MAP: Record<string, OrderType> = {
  dine_in: "DINE_IN",
  takeaway: "TAKEAWAY",
};

export function OrderTypeSync({ type }: { type?: string }) {
  const { setOrderType } = useCart();
  React.useEffect(() => {
    if (type && MAP[type]) setOrderType(MAP[type]);
  }, [type, setOrderType]);
  return null;
}
