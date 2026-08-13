import { z } from "zod";

export const orderLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(50),
  selectedOptionIds: z.array(z.string().min(1)).optional().default([]),
});

export const createOrderSchema = z.object({
  slug: z.string().min(1),
  type: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
  customerName: z.string().trim().min(1).max(120),
  customerPhone: z.string().trim().min(1).max(20),
  tableNumber: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
  items: z.array(orderLineSchema).min(1, "سبد خرید خالی است."),
});

export type CreateOrderSchemaInput = z.infer<typeof createOrderSchema>;
