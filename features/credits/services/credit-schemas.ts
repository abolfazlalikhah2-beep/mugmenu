import { z } from "zod";

export const settleCreditSchema = z.object({
  receivedAmount: z.coerce.number().int().positive("مبلغ دریافتی باید بزرگ‌تر از صفر باشد."),
  notes: z.string().trim().max(500).optional(),
});
