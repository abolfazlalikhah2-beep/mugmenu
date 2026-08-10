import "server-only";
import * as repo from "@/features/customer/repositories/customer-repository";
import { formatRelativeDateTime } from "@/features/dashboard/utils/relative-date";
import { toPersianDigits } from "@/features/menu/utils/money";
import type { OrderStatus, OrderType } from "@/lib/generated/prisma/enums";

interface OrderItemLike {
  quantity: number;
  product: { name: string };
}

function summarizeItems(items: OrderItemLike[]): string {
  return items.map((i) => (i.quantity > 1 ? `${i.product.name} ×${toPersianDigits(i.quantity)}` : i.product.name)).join("، ");
}

function sumCashback(walletTransactions: { amount: number }[]): number {
  return walletTransactions.reduce((sum, t) => sum + t.amount, 0);
}

export interface CustomerOrderSummary {
  id: string;
  itemsSummary: string;
  dateLabel: string;
  type: OrderType;
  tableNumber: string | null;
  totalPrice: number;
  status: OrderStatus;
  cashbackEarned: number;
}

export async function getOrders(customerAccountId: string): Promise<CustomerOrderSummary[]> {
  const rows = await repo.getOrdersForCustomer(customerAccountId);
  return rows.map((o) => ({
    id: o.id,
    itemsSummary: summarizeItems(o.items),
    dateLabel: formatRelativeDateTime(o.createdAt),
    type: o.type,
    tableNumber: o.tableNumber,
    totalPrice: o.totalPrice,
    status: o.status,
    cashbackEarned: sumCashback(o.walletTransactions),
  }));
}

export interface CustomerOrderDetail {
  id: string;
  type: OrderType;
  tableNumber: string | null;
  address: string | null;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  totalPrice: number;
  packagingFee: number;
  cashbackEarned: number;
  items: { id: string; productId: string; name: string; imageUrl: string | null; quantity: number; unitPrice: number }[];
}

export async function getOrderDetail(customerAccountId: string, orderId: string): Promise<CustomerOrderDetail | null> {
  const order = await repo.getOrderForCustomer(orderId, customerAccountId);
  if (!order) return null;

  return {
    id: order.id,
    type: order.type,
    tableNumber: order.tableNumber,
    address: order.address,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    totalPrice: order.totalPrice,
    packagingFee: order.business.packagingFee,
    cashbackEarned: sumCashback(order.walletTransactions),
    items: order.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.product.name,
      imageUrl: i.product.imageUrl,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  };
}
