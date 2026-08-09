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

export const businessInfoSchema = z.object({
  name: z.string().trim().min(2, "نام مجموعه را کامل وارد کنید."),
  nameEn: z.string().trim().max(60).optional(),
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20),
  address: z.string().trim().min(3, "آدرس را کامل وارد کنید."),
  openingHoursStart: z.string().trim().min(1, "ساعت شروع را وارد کنید."),
  openingHoursEnd: z.string().trim().min(1, "ساعت پایان را وارد کنید."),
});

export const orderSettingsSchema = z.object({
  acceptsDineIn: z.boolean(),
  acceptsTakeaway: z.boolean(),
  acceptsDelivery: z.boolean(),
  prepTimeDineIn: z.coerce.number().int().min(1, "زمان آماده‌سازی باید حداقل ۱ دقیقه باشد.").max(240),
  prepTimeTakeaway: z.coerce.number().int().min(1, "زمان آماده‌سازی باید حداقل ۱ دقیقه باشد.").max(240),
  prepTimeDelivery: z.coerce.number().int().min(1, "زمان آماده‌سازی باید حداقل ۱ دقیقه باشد.").max(240),
});

export const qrSettingsSchema = z.object({
  qrShowInfo: z.boolean(),
  qrShowHours: z.boolean(),
  qrShowLogo: z.boolean(),
});

export const staffUserSchema = z.object({
  fullName: z.string().trim().min(2, "نام و نام خانوادگی را کامل وارد کنید.").max(80),
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20),
  role: z.enum(["OWNER", "MENU_MANAGER", "CASHIER"]),
});

export const paymentSettingsSchema = z.object({
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

export const printerSchema = z.object({
  name: z.string().trim().min(2, "نام دستگاه را کامل وارد کنید.").max(80),
  model: z.string().trim().max(80).optional(),
  connectionType: z.enum(["NETWORK", "USB", "BLUETOOTH"]),
  ipAddress: z.string().trim().max(120).optional(),
  port: z.string().trim().max(20).optional(),
  paperSize: z.enum(["58mm", "80mm"]),
  copies: z.coerce
    .number()
    .int()
    .min(1, "تعداد کپی باید حداقل ۱ باشد.")
    .max(5, "تعداد کپی نمی‌تواند بیشتر از ۵ باشد."),
});

export const manualOrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(50),
});

export const manualOrderSchema = z.object({
  type: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
  customerName: z.string().trim().min(1, "نام مشتری را وارد کنید.").max(120),
  customerPhone: z.string().trim().min(1, "شماره موبایل را وارد کنید.").max(20),
  tableNumber: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
  items: z.array(manualOrderItemSchema).min(1, "حداقل یک آیتم انتخاب کنید."),
});

const optionalDate = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

export const discountCodeSchema = z.object({
  name: z.string().trim().min(2, "نام تخفیف را کامل وارد کنید.").max(80),
  code: z
    .string()
    .trim()
    .min(3, "کد تخفیف را وارد کنید.")
    .max(30)
    .regex(/^[A-Za-z0-9_-]+$/, "کد فقط می‌تواند شامل حروف/عدد انگلیسی، خط‌تیره و زیرخط باشد.")
    .transform((v) => v.toUpperCase()),
  description: z.string().trim().max(500).optional(),
  startDate: optionalDate,
  endDate: optionalDate,
  isActive: z.boolean(),
});

export const autoDiscountSchema = z
  .object({
    name: z.string().trim().min(2, "نام تخفیف را کامل وارد کنید.").max(80),
    percent: z.coerce.number().int().min(1, "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد.").max(100),
    scope: z.enum(["ALL_MENU", "CATEGORY", "PRODUCT"]),
    categoryIds: z.array(z.string().min(1)).optional().default([]),
    productId: z.string().trim().optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
    description: z.string().trim().max(500).optional(),
    startDate: optionalDate,
    endDate: optionalDate,
    isActive: z.boolean(),
  })
  .refine((d) => d.scope !== "CATEGORY" || d.categoryIds.length > 0, {
    message: "حداقل یک دسته را انتخاب کنید.",
    path: ["categoryIds"],
  })
  .refine((d) => d.scope !== "PRODUCT" || !!d.productId, {
    message: "یک محصول را انتخاب کنید.",
    path: ["productId"],
  });

export const smsSettingsSchema = z.object({
  smsProvider: z.string().trim().min(1, "سرویس‌دهنده را انتخاب کنید."),
  smsUsername: z.string().trim().max(80).optional(),
  // Blank means "keep the existing key" — see sms-settings-service.ts.
  smsApiKey: z.string().trim().max(200).optional(),
  smsSenderNumber: z.string().trim().max(20).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "نام مخاطب را کامل وارد کنید.").max(80),
  phone: z.string().trim().min(10, "شماره موبایل معتبر نیست.").max(20),
});

export const singleSmsSchema = z.object({
  phone: z.string().trim().min(10, "شماره گیرنده معتبر نیست.").max(20),
  text: z.string().trim().min(1, "متن پیام را وارد کنید.").max(670, "متن پیام بیش از حد مجاز طولانی است."),
});

export const bulkSmsSchema = z.object({
  audience: z.enum(["ALL_CONTACTS", "LOYAL_CUSTOMERS", "RECENT_ORDERS", "MANUAL"]),
  manualContactIds: z.array(z.string().min(1)).optional().default([]),
  text: z.string().trim().min(1, "متن پیام را وارد کنید.").max(670, "متن پیام بیش از حد مجاز طولانی است."),
});
