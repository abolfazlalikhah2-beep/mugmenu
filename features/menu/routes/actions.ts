"use server";

import { redirect } from "next/navigation";
import * as orderService from "@/features/menu/services/order-service";
import * as reviewService from "@/features/menu/services/review-service";
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

export interface SubmitReviewActionInput {
  orderId: string;
  rating: number;
  productIds: string[];
  tags: string[];
  comment?: string;
  anonymous: boolean;
}

export async function submitReviewAction(input: SubmitReviewActionInput) {
  return reviewService.submitReview(input);
}

export interface SubmitSurveyActionInput {
  orderId: string;
  taste: string;
  speed: string;
  packaging: string;
}

export async function submitSurveyAction(input: SubmitSurveyActionInput) {
  return reviewService.submitSurvey(input);
}
