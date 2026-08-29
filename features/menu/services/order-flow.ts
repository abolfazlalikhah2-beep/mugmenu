/**
 * The three-state order flow (روی میز / بیرون‌بر / ارسال با پیک), as one
 * pure module — deliberately framework- and I/O-free so it's trivial to
 * unit test and safe to import from both server code and the client cart.
 */

import type { MenuLang } from "@/features/menu/utils/menu-language";

export type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

export interface OrderDraftFields {
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  address?: string;
}

export interface OrderLine {
  productId: string;
  quantity: number;
}

const FIELD_LABELS: Record<MenuLang, Record<keyof OrderDraftFields, string>> = {
  fa: {
    customerName: "نام و نام خانوادگی",
    customerPhone: "شماره تماس",
    tableNumber: "شماره میز",
    address: "آدرس تحویل",
  },
  en: {
    customerName: "Full name",
    customerPhone: "Phone number",
    tableNumber: "Table number",
    address: "Delivery address",
  },
};

/** The field's display label — also used directly as an <Input label> outside this module (e.g. the cart page). */
export function fieldLabel(lang: MenuLang, key: keyof OrderDraftFields): string {
  return FIELD_LABELS[lang][key];
}

const REQUIRED_FIELDS: Record<OrderType, (keyof OrderDraftFields)[]> = {
  DINE_IN: ["customerName", "customerPhone", "tableNumber"],
  TAKEAWAY: ["customerName", "customerPhone"],
  DELIVERY: ["customerName", "customerPhone", "address"],
};

export function requiredFieldsFor(type: OrderType): (keyof OrderDraftFields)[] {
  return REQUIRED_FIELDS[type];
}

/** Returns an error message for the first missing required field, or null if the draft is complete. Defaults to Persian (see order-flow.test.ts). */
export function validateOrderDraft(type: OrderType, fields: OrderDraftFields, lang: MenuLang = "fa"): string | null {
  for (const key of requiredFieldsFor(type)) {
    const value = fields[key];
    if (!value || !value.trim()) {
      const label = fieldLabel(lang, key);
      return lang === "en" ? `Please enter ${label.toLowerCase()}.` : `${label} را وارد کنید.`;
    }
  }
  return null;
}

export interface OrderAcceptanceGate {
  isAcceptingOrders: boolean;
  acceptsDineIn: boolean;
  acceptsTakeaway: boolean;
  acceptsDelivery: boolean;
}

/**
 * Returns an error message if this business can't take a `type` order right
 * now, or null if it can — checked in order-service.ts's createOrder()
 * ahead of validateOrderDraft(). isAcceptingOrders (the owner's manual
 * "سفارش‌گیری" toggle, دشبورد "حساب کاربری") is a higher-level gate than any
 * single order-type flag, so it's checked first: a business can have
 * acceptsDineIn=true and still be closed for orders right now.
 */
export function orderAcceptanceError(business: OrderAcceptanceGate, type: OrderType): string | null {
  if (!business.isAcceptingOrders) return "این فروشگاه در حال حاضر سفارش نمی‌پذیرد.";

  const typeAccepted =
    (type === "DINE_IN" && business.acceptsDineIn) ||
    (type === "TAKEAWAY" && business.acceptsTakeaway) ||
    (type === "DELIVERY" && business.acceptsDelivery);
  if (!typeAccepted) return "این روش سفارش در حال حاضر برای این مجموعه فعال نیست.";

  return null;
}

export function computeTotal(lines: OrderLine[], priceByProductId: Map<string, number>): number {
  return lines.reduce((sum, l) => sum + (priceByProductId.get(l.productId) ?? 0) * l.quantity, 0);
}

/** A product option selected on a cart line, resolved server-side (see order-service.ts) — never trust a client-sent price. */
export interface SelectedProductOption {
  groupName: string;
  optionName: string;
  extraPrice: number;
}

export function computeOptionsExtra(selected: SelectedProductOption[]): number {
  return selected.reduce((sum, o) => sum + o.extraPrice, 0);
}

/** Business.serviceFeePercent applied to the order's subtotal (see order-service.ts). */
export function computeServiceFee(subtotal: number, percent: number): number {
  return Math.round((subtotal * percent) / 100);
}

/** Business.taxPercent applied to the order's subtotal. Same shape as computeServiceFee but a distinct concept, kept separate in case the base they're computed on ever diverges. */
export function computeTax(subtotal: number, percent: number): number {
  return Math.round((subtotal * percent) / 100);
}

export interface CartLineForDiscount {
  productId: string;
  categoryId: string;
  /** This line's pre-fee amount: (unit price incl. selected options) × quantity. */
  lineTotal: number;
}

export interface AutoDiscountDef {
  id: string;
  name: string;
  percent: number;
  scope: "ALL_MENU" | "CATEGORY" | "PRODUCT";
  categoryIds: string[];
  productId?: string | null;
}

function discountEligibleLines(
  lines: CartLineForDiscount[],
  discount: AutoDiscountDef
): CartLineForDiscount[] {
  switch (discount.scope) {
    case "ALL_MENU":
      return lines;
    case "CATEGORY":
      return lines.filter((l) => discount.categoryIds.includes(l.categoryId));
    case "PRODUCT":
      return lines.filter((l) => l.productId === discount.productId);
  }
}

export function computeAutoDiscountAmount(lines: CartLineForDiscount[], discount: AutoDiscountDef): number {
  const base = discountEligibleLines(lines, discount).reduce((sum, l) => sum + l.lineTotal, 0);
  return Math.round((base * discount.percent) / 100);
}

/** Picks the single best (largest-amount) matching automatic discount — discounts don't stack. Returns null when none apply. */
export function pickBestAutoDiscount(
  lines: CartLineForDiscount[],
  discounts: AutoDiscountDef[]
): { discount: AutoDiscountDef; amount: number } | null {
  let best: { discount: AutoDiscountDef; amount: number } | null = null;
  for (const discount of discounts) {
    const amount = computeAutoDiscountAmount(lines, discount);
    if (amount > 0 && (!best || amount > best.amount)) best = { discount, amount };
  }
  return best;
}

/** Caps a customer's requested wallet spend to what's actually available and payable — never trust the client's requested amount as-is (see order-service.ts). */
export function clampRedeemAmount(requested: number, walletBalance: number, payableBeforeRedeem: number): number {
  if (requested <= 0) return 0;
  return Math.min(requested, walletBalance, payableBeforeRedeem);
}

/** System-shown estimate per type — not user-editable (see the cart UI). Defaults to Persian (see order-flow.test.ts). */
export function estimatedTimeFor(type: OrderType, lang: MenuLang = "fa"): string | undefined {
  if (lang === "en") {
    switch (type) {
      case "TAKEAWAY":
        return "Today · ready in 25 minutes";
      case "DELIVERY":
        return "45–60 minutes";
      case "DINE_IN":
        return undefined;
    }
  }
  switch (type) {
    case "TAKEAWAY":
      return "امروز · ۲۵ دقیقه دیگر آماده می‌شود";
    case "DELIVERY":
      return "۴۵ تا ۶۰ دقیقه";
    case "DINE_IN":
      return undefined;
  }
}
