import "server-only";
import { logger } from "@/lib/logger";
import * as menuRepository from "@/features/menu/repositories/menu-repository";
import { createOrderSchema } from "@/features/menu/services/order-schemas";
import {
  validateOrderDraft,
  estimatedTimeFor,
  computeOptionsExtra,
  computeServiceFee,
  computeTax,
  pickBestAutoDiscount,
  clampRedeemAmount,
  type CartLineForDiscount,
} from "@/features/menu/services/order-flow";
import { creditCashbackForOrder, getWalletBalance, redeemWalletForOrder } from "@/features/customer/services/wallet-service";

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
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Option prices are always resolved from the DB, never taken from the
  // client — the client only sends which option ids it picked.
  const optionIds = [...new Set(data.items.flatMap((i) => i.selectedOptionIds))];
  const options = optionIds.length > 0 ? await menuRepository.findOptionsByIds(optionIds) : [];
  const optionMap = new Map(options.map((o) => [o.id, o]));

  const resolvedItems = data.items.map((i) => {
    const product = productMap.get(i.productId);
    const basePrice = product?.price ?? 0;
    const selected = i.selectedOptionIds
      .map((id) => optionMap.get(id))
      .filter((o): o is NonNullable<typeof o> => !!o && o.group.productId === i.productId)
      .map((o) => ({ groupName: o.group.name, optionName: o.name, extraPrice: o.extraPrice }));
    return {
      productId: i.productId,
      categoryId: product?.categoryId ?? "",
      quantity: i.quantity,
      unitPrice: basePrice + computeOptionsExtra(selected),
      note: i.note,
      options: selected,
    };
  });

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // Automatic discount: the single best-matching active Discount for this
  // cart, if any — see discount-service.ts (admin CRUD) and order-flow.ts's
  // pickBestAutoDiscount (matching/selection logic).
  const discountLines: CartLineForDiscount[] = resolvedItems.map((i) => ({
    productId: i.productId,
    categoryId: i.categoryId,
    lineTotal: i.unitPrice * i.quantity,
  }));
  const autoDiscounts = await menuRepository.getActiveAutoDiscounts(business.id);
  const bestDiscount = pickBestAutoDiscount(
    discountLines,
    autoDiscounts.map((d) => ({
      id: d.id,
      name: d.name,
      percent: d.percent ?? 0,
      scope: d.scope ?? "ALL_MENU",
      categoryIds: d.categoryIds,
      productId: d.productId,
    }))
  );
  const discountAmount = bestDiscount?.amount ?? 0;

  const packagingFeeAmount = business.packagingFee;
  const serviceFeeAmount = computeServiceFee(subtotal, business.serviceFeePercent);
  const taxAmount = computeTax(subtotal, business.taxPercent);

  const payableBeforeRedeem = Math.max(
    0,
    subtotal + packagingFeeAmount + serviceFeeAmount + taxAmount - discountAmount
  );

  // Wallet redemption: the client's requested amount is only a suggestion —
  // it's clamped against the live wallet balance read here, never trusted.
  let walletRedeemedAmount = 0;
  if (customerAccountId && data.redeemAmount > 0) {
    const balance = await getWalletBalance(customerAccountId);
    walletRedeemedAmount = clampRedeemAmount(data.redeemAmount, balance, payableBeforeRedeem);
  }

  const totalPrice = payableBeforeRedeem - walletRedeemedAmount;

  const order = await menuRepository.createOrder({
    businessId: business.id,
    type: data.type,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    tableNumber: data.tableNumber,
    address: data.address,
    estimatedTime: estimatedTimeFor(data.type),
    totalPrice,
    subtotal,
    packagingFeeAmount,
    serviceFeeAmount,
    taxAmount,
    discountAmount: discountAmount > 0 ? discountAmount : undefined,
    discountName: discountAmount > 0 ? bestDiscount?.discount.name : undefined,
    walletRedeemedAmount: walletRedeemedAmount > 0 ? walletRedeemedAmount : undefined,
    customerAccountId,
    items: resolvedItems.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      note: i.note,
      options: i.options,
    })),
  });

  if (customerAccountId) {
    if (walletRedeemedAmount > 0) await redeemWalletForOrder(customerAccountId, order.id, walletRedeemedAmount);
    await creditCashbackForOrder(customerAccountId, business.id, order.id, totalPrice);
  }

  logger.info("order.created", {
    orderId: order.id,
    businessId: business.id,
    type: data.type,
    totalPrice,
    subtotal,
    discountAmount,
    walletRedeemedAmount,
    customerAccountId,
  });
  return { ok: true, orderId: order.id };
}
