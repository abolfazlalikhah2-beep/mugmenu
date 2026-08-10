import { z } from "zod";

const optionalAttachmentUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

const optionalAttachmentName = z
  .string()
  .trim()
  .max(200)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

export const gatewaySettingsSchema = z.object({
  zarinpalMerchantId: z.string().trim().max(100).optional(),
  // Blank means "keep the existing key" — see finance-service.ts.
  zarinpalApiKey: z.string().trim().max(200).optional(),
  zarinpalCallbackUrl: z.string().trim().max(300).optional(),
  zarinpalSandbox: z.boolean(),
});

export const teamUserSchema = z.object({
  fullName: z.string().trim().min(2, "نام و نام خانوادگی را کامل وارد کنید.").max(80),
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20),
  platformRole: z.enum(["OWNER", "ADMIN", "SUPPORT", "FINANCE", "VIEWER"]),
  platformTeam: z.string().trim().max(60).optional(),
});

export const ticketForCustomerSchema = z.object({
  businessId: z.string().min(1, "مشتری را انتخاب کنید."),
  subject: z.string().trim().min(3, "موضوع را کامل وارد کنید.").max(150),
  category: z.enum(["TECHNICAL", "PAYMENT", "BILLING", "GENERAL"]),
  priority: z.enum(["HIGH", "MID", "LOW"]),
  text: z.string().trim().min(5, "متن پیام را کامل وارد کنید.").max(4000),
  notifySms: z.boolean(),
});

export const agentReplySchema = z.object({
  text: z.string().trim().min(1, "متن پیام را وارد کنید.").max(4000),
  attachmentUrl: optionalAttachmentUrl,
  attachmentName: optionalAttachmentName,
});
