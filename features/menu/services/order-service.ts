import "server-only";
import { logger } from "@/lib/logger";
import * as menuRepository from "@/features/menu/repositories/menu-repository";
import { createOrderSchema } from "@/features/menu/services/order-schemas";
import { validateOrderDraft, computeTotal, estimatedTimeFor } from "@/features/menu/services/order-flow";
import { creditCashbackForOrder } from "@/features/customer/services/wallet-service";

export type CreateOrderResult = { ok: true; orderId: string } | { ok: false; error: string };

/**
 * customerAccountId is resolved by the caller (features/menu/routes/actions.ts,
 * from the customer session cookie) — it's a trusted server-side value, not
 * part of the zod-validated client input, so it's a separate parameter.
 */
export async function createOrder(input: unknown, customerAccountId?: string): Promise<CreateOrderResult> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const fieldError = validateOrderDraft(data.type, data);
  if (fieldError) return { ok: false, error: fieldError };

  const business = await menuRepository.getBusiness(data.slug);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const products = await menuRepository.findProductsByIds(data.items.map((i) => i.productId));
  const priceMap = new Map(products.map((p) => [p.id, p.price]));
  const totalPrice = computeTotal(data.items, priceMap) + business.packagingFee;

  const order = await menuRepository.createOrder({
    businessId: business.id,
    type: data.type,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    tableNumber: data.tableNumber,
    address: data.address,
    estimatedTime: estimatedTimeFor(data.type),
    totalPrice,
    customerAccountId,
    items: data.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: priceMap.get(i.productId) ?? 0,
    })),
  });

  if (customerAccountId) await creditCashbackForOrder(customerAccountId, business.id, order.id, totalPrice);

  logger.info("order.created", {
    orderId: order.id,
    businessId: business.id,
    type: data.type,
    totalPrice,
    customerAccountId,
  });
  return { ok: true, orderId: order.id };
}
