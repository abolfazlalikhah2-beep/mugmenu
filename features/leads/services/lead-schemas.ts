import { z } from "zod";

export const leadCaptureSchema = z.object({
  // Loose on purpose, same as auth's phone field — a contact identifier, not a billing field.
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20, "شماره تماس معتبر نیست."),
  source: z.string().trim().min(1).max(60).optional(),
});

export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
