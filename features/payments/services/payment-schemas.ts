import { z } from "zod";

export const paymentCardSchema = z.object({
  holderName: z.string().trim().min(2, "نام صاحب کارت را کامل وارد کنید.").max(100),
  bankName: z.string().trim().min(2, "نام بانک را وارد کنید.").max(60),
  cardNumber: z.string().trim().min(12, "شماره کارت معتبر نیست.").max(24),
  accountNumber: z.string().trim().min(4, "شماره حساب معتبر نیست.").max(40),
  isActive: z.boolean(),
});

export const createPaymentRequestSchema = z.object({
  amount: z.coerce.number().int().positive("مبلغ نامعتبر است."),
  assignedCardId: z.string().min(1, "کارت مقصد نامعتبر است."),
  referenceNumber: z.string().trim().min(1, "شماره پیگیری تراکنش را وارد کنید.").max(60),
});

export const verifyPaymentRequestSchema = z
  .object({
    referenceNumber: z.string().trim().min(1, "شماره پیگیری را وارد کنید.").max(60),
    status: z.enum(["VERIFIED", "REJECTED"]),
    notes: z.string().trim().max(500).optional(),
    newPlanId: z.string().optional(),
    billingCycle: z.enum(["MONTHLY", "ANNUAL"]).optional(),
  })
  .refine((data) => data.status !== "VERIFIED" || !!data.newPlanId, {
    message: "برای تایید، پلن جدید را انتخاب کنید.",
    path: ["newPlanId"],
  });
