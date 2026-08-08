"use client";

import * as React from "react";
import type { OrderType } from "@/features/menu/services/order-flow";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string | null;
}

interface CartContextValue {
  items: CartItem[];
  orderType: OrderType;
  setOrderType: (t: OrderType) => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = React.createContext<CartContextValue | null>(null);

function storageKey(slug: string) {
  return `magmenu_cart_${slug}`;
}

export function CartProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [{ items, orderType }, setCart] = React.useState<{
    items: CartItem[];
    orderType: OrderType;
  }>({ items: [], orderType: "DINE_IN" });
  const loaded = React.useRef(false);

  React.useEffect(() => {
    // Cart starts empty so server and first client render match; this effect
    // syncs in the real value from localStorage right after mount (a client-
    // only external system react-hooks can't see during the render itself).
    const raw = window.localStorage.getItem(storageKey(slug));
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart({ items: parsed.items ?? [], orderType: parsed.orderType ?? "DINE_IN" });
      } catch {
        // ignore malformed local storage
      }
    }
    loaded.current = true;
  }, [slug]);

  React.useEffect(() => {
    if (!loaded.current) return;
    window.localStorage.setItem(storageKey(slug), JSON.stringify({ items, orderType }));
  }, [slug, items, orderType]);

  const addItem = React.useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId);
      const items = existing
        ? prev.items.map((i) =>
            i.productId === item.productId ? { ...i, qty: i.qty + qty } : i
          )
        : [...prev.items, { ...item, qty }];
      return { ...prev, items };
    });
  }, []);

  const setQty = React.useCallback((productId: string, qty: number) => {
    setCart((prev) => ({
      ...prev,
      items:
        qty <= 0
          ? prev.items.filter((i) => i.productId !== productId)
          : prev.items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    }));
  }, []);

  const removeItem = React.useCallback((productId: string) => {
    setCart((prev) => ({ ...prev, items: prev.items.filter((i) => i.productId !== productId) }));
  }, []);

  const clear = React.useCallback(() => setCart((prev) => ({ ...prev, items: [] })), []);

  const setOrderType = React.useCallback(
    (t: OrderType) => setCart((prev) => ({ ...prev, orderType: t })),
    []
  );

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, orderType, setOrderType, addItem, setQty, removeItem, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
