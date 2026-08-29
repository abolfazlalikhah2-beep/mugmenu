export interface CustomerOrderRecord {
  customerName: string;
  customerPhone: string;
  createdAt: Date;
  totalPrice: number;
}

export interface CustomerSummary {
  name: string;
  phone: string;
  firstOrderAt: Date;
  lastOrderAt: Date;
  orderCount: number;
  totalSpend: number;
}

/**
 * Pure, I/O-free aggregation: no Customer table exists, so the customer list
 * is derived from order history. `orders` must be sorted ascending by
 * createdAt so the first occurrence per phone is the first order date, the
 * last occurrence's createdAt is the last order date, and the last
 * occurrence's name is the customer's most recently used name.
 */
export function aggregateCustomers(orders: CustomerOrderRecord[]): CustomerSummary[] {
  const byPhone = new Map<string, CustomerSummary>();
  for (const o of orders) {
    const existing = byPhone.get(o.customerPhone);
    if (existing) {
      existing.orderCount += 1;
      existing.name = o.customerName;
      existing.lastOrderAt = o.createdAt;
      existing.totalSpend += o.totalPrice;
    } else {
      byPhone.set(o.customerPhone, {
        name: o.customerName,
        phone: o.customerPhone,
        firstOrderAt: o.createdAt,
        lastOrderAt: o.createdAt,
        orderCount: 1,
        totalSpend: o.totalPrice,
      });
    }
  }
  return [...byPhone.values()].sort((a, b) => b.orderCount - a.orderCount);
}
