/**
 * Pure — no I/O — per-customer loyalty/engagement stats for the customer
 * detail view (dashboard "مشتریان" › clicking a row). `orders` must be
 * sorted ascending by createdAt, same convention as aggregate-customers.ts.
 */

export interface CustomerDetailOrderRecord {
  createdAt: Date;
  totalPrice: number;
  items: { quantity: number; product: { name: string } }[];
}

export interface FavoriteItem {
  name: string;
  quantity: number;
}

export interface CustomerDetailStats {
  orderCount: number;
  totalSpend: number;
  averageOrderValue: number;
  firstOrderAt: Date;
  lastOrderAt: Date;
  daysSinceLastOrder: number;
  /** Rounded to one decimal — lifetime order count divided by months since the first order (minimum 1 month, so a brand-new customer isn't divided by ~0). */
  ordersPerMonth: number;
  /** Top 3 most-ordered products by total quantity, most first. */
  favoriteItems: FavoriteItem[];
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_MONTH = 30;

export function computeCustomerDetailStats(
  orders: CustomerDetailOrderRecord[],
  now = new Date()
): CustomerDetailStats | null {
  if (orders.length === 0) return null;

  const orderCount = orders.length;
  const totalSpend = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const averageOrderValue = Math.round(totalSpend / orderCount);
  const firstOrderAt = orders[0].createdAt;
  const lastOrderAt = orders[orders.length - 1].createdAt;
  const daysSinceLastOrder = Math.max(0, Math.floor((now.getTime() - lastOrderAt.getTime()) / MS_PER_DAY));

  const monthsSinceFirst = Math.max(1, (now.getTime() - firstOrderAt.getTime()) / (MS_PER_DAY * DAYS_PER_MONTH));
  const ordersPerMonth = Math.round((orderCount / monthsSinceFirst) * 10) / 10;

  const quantityByProduct = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      quantityByProduct.set(item.product.name, (quantityByProduct.get(item.product.name) ?? 0) + item.quantity);
    }
  }
  const favoriteItems = [...quantityByProduct.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, quantity]) => ({ name, quantity }));

  return {
    orderCount,
    totalSpend,
    averageOrderValue,
    firstOrderAt,
    lastOrderAt,
    daysSinceLastOrder,
    ordersPerMonth,
    favoriteItems,
  };
}
