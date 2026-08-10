"use server";

import { redirect } from "next/navigation";
import * as orderService from "@/features/menu/services/order-service";
import type { OrderType } from "@/features/menu/services/order-flow";
import { getCustomerSession } from "@/features/customer/services/customer-session-service";

export interface CreateOrderActionInput {
  slug: string;
  type: OrderType;
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  address?: string;
  items: { productId: string; quantity: number }[];
}

export interface CreateOrderActionState {
  error?: string;
}

export async function createOrderAction(
  input: CreateOrderActionInput
): Promise<CreateOrderActionState> {
  const customerSession = await getCustomerSession(input.slug);
  const result = await orderService.createOrder(input, customerSession?.customerAccountId);
  if (!result.ok) return { error: result.error };
  redirect(`/${input.slug}/receipt/${result.orderId}`);
}
