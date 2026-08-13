import "server-only";
import { logger } from "@/lib/logger";
import * as menuRepository from "@/features/menu/repositories/menu-repository";
import { createOrderSchema } from "@/features/menu/services/order-schemas";
import {
  validateOrderDraft,
  estimatedTimeFor,
  computeOptionsExtra,
  summarizeSelectedOptions,
} from "@/features/menu/services/order-flow";
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

  // Option prices are always resolved from the DB, never taken from the
  // client — the client only sends which option ids it picked.
  const optionIds = [...new Set(data.items.flatMap((i) => i.selectedOptionIds))];
  const options = optionIds.length > 0 ? await menuRepository.findOptionsByIds(optionIds) : [];
  const optionMap = new Map(options.map((o) => [o.id, o]));

  const resolvedItems = data.items.map((i) => {
    const basePrice = priceMap.get(i.productId) ?? 0;
    const selected = i.selectedOptionIds
      .map((id) => optionMap.get(id))
      .filter((o): o is NonNullable<typeof o> => !!o && o.group.productId === i.productId)
      .map((o) => ({ groupName: o.group.name, optionName: o.name, extraPrice: o.extraPrice }));
    return {
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: basePrice + computeOptionsExtra(selected),
      selectedOptionsSummary: summarizeSelectedOptions(selected),
    };
  });

  const totalPrice = resolvedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) + business.packagingFee;

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
    items: resolvedItems,
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
