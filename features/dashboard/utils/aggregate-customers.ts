export interface CustomerOrderRecord {
  customerName: string;
  customerPhone: string;
  createdAt: Date;
}

export interface CustomerSummary {
  name: string;
  phone: string;
  firstOrderAt: Date;
  orderCount: number;
}

/**
 * Pure, I/O-free aggregation: no Customer table exists, so the customer list
 * is derived from order history. `orders` must be sorted ascending by
 * createdAt so the first occurrence per phone is the first order date and
 * the last occurrence's name is the customer's most recently used name.
 */
export function aggregateCustomers(orders: CustomerOrderRecord[]): CustomerSummary[] {
  const byPhone = new Map<string, CustomerSummary>();
  for (const o of orders) {
    const existing = byPhone.get(o.customerPhone);
    if (existing) {
      existing.orderCount += 1;
      existing.name = o.customerName;
    } else {
      byPhone.set(o.customerPhone, {
        name: o.customerName,
        phone: o.customerPhone,
        firstOrderAt: o.createdAt,
        orderCount: 1,
      });
    }
  }
  return [...byPhone.values()].sort((a, b) => b.orderCount - a.orderCount);
}
