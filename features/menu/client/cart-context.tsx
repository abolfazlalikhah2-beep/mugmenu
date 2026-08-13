"use client";

import * as React from "react";
import type { OrderType } from "@/features/menu/services/order-flow";
import type { ProductOptionGroupValue, SelectedCartOption } from "@/features/menu/utils/product-options";

export type { SelectedCartOption } from "@/features/menu/utils/product-options";

export interface CartItem {
  productId: string;
  /** Snapshot for client-side auto-discount preview on the cart page (CATEGORY-scope discounts) — see order-flow.ts's pickBestAutoDiscount. The server re-derives this itself at checkout, never trusting the client's copy. */
  categoryId?: string;
  name: string;
  /** Unit price already including the selected options' extra price. */
  price: number;
  qty: number;
  imageUrl?: string | null;
  selectedOptions?: SelectedCartOption[];
  /** Customer-entered free-text note for this line (e.g. "کباب کم‌نمک باشد"). */
  note?: string;
  /** Snapshot of the product's full option catalog at add-to-cart time, so "edit options" can re-render the picker without a server round trip. */
  productOptionGroups?: ProductOptionGroupValue[];
}

/** Two configurations of the same product (e.g. size large vs. small) are separate cart lines, identified by this instead of productId. */
function lineIdFor(item: Pick<CartItem, "productId" | "selectedOptions">) {
  const optionIds = (item.selectedOptions ?? []).map((o) => o.optionId).sort();
  return optionIds.length > 0 ? `${item.productId}::${optionIds.join(",")}` : item.productId;
}

interface CartContextValue {
  items: (CartItem & { lineId: string })[];
  orderType: OrderType;
  setOrderType: (t: OrderType) => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (lineId: string, qty: number) => void;
  removeItem: (lineId: string) => void;
  /** Replaces a line's selection/price/note in place (the cart's "ویرایش گزینه‌ها"). If the new selection matches another existing line, the two merge (quantities add). */
  updateItemOptions: (lineId: string, selectedOptions: SelectedCartOption[], price: number, note?: string) => void;
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
      const targetLineId = lineIdFor(item);
      const existing = prev.items.find((i) => lineIdFor(i) === targetLineId);
      const items = existing
        ? prev.items.map((i) => (lineIdFor(i) === targetLineId ? { ...i, qty: i.qty + qty } : i))
        : [...prev.items, { ...item, qty }];
      return { ...prev, items };
    });
  }, []);

  const setQty = React.useCallback((lineId: string, qty: number) => {
    setCart((prev) => ({
      ...prev,
      items:
        qty <= 0
          ? prev.items.filter((i) => lineIdFor(i) !== lineId)
          : prev.items.map((i) => (lineIdFor(i) === lineId ? { ...i, qty } : i)),
    }));
  }, []);

  const removeItem = React.useCallback((lineId: string) => {
    setCart((prev) => ({ ...prev, items: prev.items.filter((i) => lineIdFor(i) !== lineId) }));
  }, []);

  const updateItemOptions = React.useCallback(
    (lineId: string, selectedOptions: SelectedCartOption[], price: number, note?: string) => {
      setCart((prev) => {
        const existing = prev.items.find((i) => lineIdFor(i) === lineId);
        if (!existing) return prev;
        const updated: CartItem = { ...existing, selectedOptions, price, note };
        const newLineId = lineIdFor(updated);
        const withoutOld = prev.items.filter((i) => lineIdFor(i) !== lineId);
        const mergeTarget = withoutOld.find((i) => lineIdFor(i) === newLineId);
        const items = mergeTarget
          ? withoutOld.map((i) => (lineIdFor(i) === newLineId ? { ...i, qty: i.qty + updated.qty } : i))
          : [...withoutOld, updated];
        return { ...prev, items };
      });
    },
    []
  );

  const clear = React.useCallback(() => setCart((prev) => ({ ...prev, items: [] })), []);

  const setOrderType = React.useCallback(
    (t: OrderType) => setCart((prev) => ({ ...prev, orderType: t })),
    []
  );

  const itemsWithLineId = items.map((i) => ({ ...i, lineId: lineIdFor(i) }));
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: itemsWithLineId,
        orderType,
        setOrderType,
        addItem,
        setQty,
        removeItem,
        updateItemOptions,
        clear,
        total,
        count,
      }}
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
