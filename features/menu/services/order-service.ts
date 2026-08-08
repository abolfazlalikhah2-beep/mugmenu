import "server-only";
import { logger } from "@/lib/logger";
import * as menuRepository from "@/features/menu/repositories/menu-repository";
import { createOrderSchema } from "@/features/menu/services/order-schemas";
import { validateOrderDraft, computeTotal, estimatedTimeFor } from "@/features/menu/services/order-flow";

export type CreateOrderResult = { ok: true; orderId: string } | { ok: false; error: string };

export async function createOrder(input: unknown): Promise<CreateOrderResult> {
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
    items: data.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: priceMap.get(i.productId) ?? 0,
    })),
  });

  logger.info("order.created", {
    orderId: order.id,
    businessId: business.id,
    type: data.type,
    totalPrice,
  });
  return { ok: true, orderId: order.id };
}
