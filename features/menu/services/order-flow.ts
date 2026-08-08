/**
 * The three-state order flow (روی میز / بیرون‌بر / ارسال با پیک), as one
 * pure module — deliberately framework- and I/O-free so it's trivial to
 * unit test and safe to import from both server code and the client cart.
 */

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

const FIELD_LABELS: Record<keyof OrderDraftFields, string> = {
  customerName: "نام و نام خانوادگی",
  customerPhone: "شماره تماس",
  tableNumber: "شماره میز",
  address: "آدرس تحویل",
};

const REQUIRED_FIELDS: Record<OrderType, (keyof OrderDraftFields)[]> = {
  DINE_IN: ["customerName", "customerPhone", "tableNumber"],
  TAKEAWAY: ["customerName", "customerPhone"],
  DELIVERY: ["customerName", "customerPhone", "address"],
};

export function requiredFieldsFor(type: OrderType): (keyof OrderDraftFields)[] {
  return REQUIRED_FIELDS[type];
}

/** Returns a Persian error message for the first missing required field, or null if the draft is complete. */
export function validateOrderDraft(type: OrderType, fields: OrderDraftFields): string | null {
  for (const key of requiredFieldsFor(type)) {
    const value = fields[key];
    if (!value || !value.trim()) {
      return `${FIELD_LABELS[key]} را وارد کنید.`;
    }
  }
  return null;
}

export function computeTotal(lines: OrderLine[], priceByProductId: Map<string, number>): number {
  return lines.reduce((sum, l) => sum + (priceByProductId.get(l.productId) ?? 0) * l.quantity, 0);
}

/** System-shown estimate per type — not user-editable (see the cart UI). */
export function estimatedTimeFor(type: OrderType): string | undefined {
  switch (type) {
    case "TAKEAWAY":
      return "امروز · ۲۵ دقیقه دیگر آماده می‌شود";
    case "DELIVERY":
      return "۴۵ تا ۶۰ دقیقه";
    case "DINE_IN":
      return undefined;
  }
}
