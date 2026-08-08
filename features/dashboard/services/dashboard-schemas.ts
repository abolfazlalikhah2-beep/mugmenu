import { z } from "zod";

const optionalImageUrl = z
  .string()
  .trim()
  .url("آدرس تصویر نامعتبر است.")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

export const onboardingSchema = z.object({
  name: z.string().trim().min(2, "نام مجموعه را کامل وارد کنید."),
  nameEn: z.string().trim().max(60).optional(),
  slug: z
    .string()
    .trim()
    .min(3, "شناسه باید حداقل ۳ کاراکتر باشد.")
    .max(40)
    .regex(/^[a-z0-9_-]+$/, "شناسه فقط می‌تواند شامل حروف انگلیسی کوچک، عدد، خط تیره و زیرخط باشد."),
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20),
  address: z.string().trim().min(3, "آدرس را کامل وارد کنید."),
  description: z.string().trim().max(2000).optional(),
  logoUrl: optionalImageUrl,
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2, "نام مجموعه را کامل وارد کنید."),
  nameEn: z.string().trim().max(60).optional(),
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20),
  address: z.string().trim().min(3, "آدرس را کامل وارد کنید."),
  openingHoursStart: z.string().trim().min(1, "ساعت شروع را وارد کنید."),
  openingHoursEnd: z.string().trim().min(1, "ساعت پایان را وارد کنید."),
  acceptsDineIn: z.boolean(),
  acceptsTakeaway: z.boolean(),
  acceptsDelivery: z.boolean(),
  acceptsOnlinePayment: z.boolean(),
  acceptsCashPayment: z.boolean(),
  packagingFee: z.coerce.number().int().min(0, "هزینه بسته‌بندی نمی‌تواند منفی باشد."),
});

export const productSchema = z.object({
  categoryId: z.string().min(1, "دسته‌بندی را انتخاب کنید."),
  name: z.string().trim().min(2, "نام محصول را کامل وارد کنید.").max(120),
  description: z.string().trim().max(1000).optional(),
  price: z.coerce.number().int().positive("قیمت باید عددی مثبت باشد."),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
  isActive: z.boolean(),
  imageUrl: optionalImageUrl,
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "نام دسته را کامل وارد کنید.").max(60),
  icon: z.string().trim().max(30).optional(),
  isActive: z.boolean(),
  imageUrl: optionalImageUrl,
});

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["NEW", "PREPARING", "READY", "DELIVERED", "CANCELED"]),
});
