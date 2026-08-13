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

/** Human-readable snapshot stored on OrderItem.selectedOptionsSummary, e.g. "سایز: بزرگ، نوع نان: سنگک". Undefined when nothing was selected. */
export function summarizeSelectedOptions(selected: SelectedProductOption[]): string | undefined {
  if (selected.length === 0) return undefined;
  return selected.map((o) => `${o.groupName}: ${o.optionName}`).join("، ");
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
