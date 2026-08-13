import { z } from "zod";

export const orderLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(50),
  selectedOptionIds: z.array(z.string().min(1)).optional().default([]),
  note: z.string().trim().max(300).optional(),
});

export const createOrderSchema = z.object({
  slug: z.string().min(1),
  type: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
  customerName: z.string().trim().min(1).max(120),
  customerPhone: z.string().trim().min(1).max(20),
  tableNumber: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
  items: z.array(orderLineSchema).min(1, "سبد خرید خالی است."),
  /** Amount of the logged-in customer's wallet balance they asked to spend on this order — clamped server-side against the live balance, never trusted as-is (see order-service.ts). Ignored for guest checkout. */
  redeemAmount: z.number().int().min(0).max(100_000_000).optional().default(0),
});

export type CreateOrderSchemaInput = z.infer<typeof createOrderSchema>;
