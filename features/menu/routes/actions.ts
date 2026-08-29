"use server";

import { revalidatePath } from "next/cache";
import * as orderService from "@/features/menu/services/order-service";
import * as reviewService from "@/features/menu/services/review-service";
import type { OrderType } from "@/features/menu/services/order-flow";
import { getCustomerSession } from "@/features/customer/services/customer-session-service";
import { setMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { isMenuLang } from "@/features/menu/utils/menu-language";

export interface CreateOrderActionInput {
  slug: string;
  type: OrderType;
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  address?: string;
  items: { productId: string; quantity: number; selectedOptionIds?: string[]; note?: string }[];
  redeemAmount?: number;
}

export interface CreateOrderActionState {
  error?: string;
  orderId?: string;
}

/**
 * Returns the new orderId rather than redirecting itself — redirect() inside
 * a Server Action invoked via a direct client `await` (not a <form action>)
 * throws a special NEXT_REDIRECT signal that a wrapping try/catch on the
 * caller can end up swallowing, which is exactly what silently broke both
 * the redirect AND the cart-clear that was supposed to run right after it
 * (see cart-page-client.tsx's handleSubmit). The client now owns clearing
 * the cart and navigating, in that order, once it has the orderId.
 */
export async function createOrderAction(
  input: CreateOrderActionInput
): Promise<CreateOrderActionState> {
  const customerSession = await getCustomerSession(input.slug);
  const result = await orderService.createOrder(input, customerSession?.customerAccountId);
  if (!result.ok) return { error: result.error };
  return { orderId: result.orderId };
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

export async function setMenuLanguageAction(slug: string, lang: string) {
  if (!isMenuLang(lang)) return;
  await setMenuLangCookie(slug, lang);
  revalidatePath(`/${slug}`);
}
