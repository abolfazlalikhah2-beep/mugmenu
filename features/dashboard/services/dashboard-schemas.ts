import { z } from "zod";
import { HERO_BG_KEYS } from "@/features/menu/utils/hero-background";

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
  // Only shown/enabled for menu-order/menu-advanced (domain.custom feature)
  // — see app/onboarding/page.tsx. No DNS/provisioning yet, just storage.
  customDomain: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
});

export const businessInfoSchema = z.object({
  name: z.string().trim().min(2, "نام مجموعه را کامل وارد کنید."),
  nameEn: z.string().trim().max(60).optional(),
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20),
  address: z.string().trim().min(3, "آدرس را کامل وارد کنید."),
});

const timeString = z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "قالب ساعت معتبر نیست.");

export const businessHoursSchema = z.object({
  days: z
    .array(
      z.object({
        dayOfWeek: z.coerce.number().int().min(0).max(6),
        isClosed: z.boolean(),
        openTime: timeString,
        closeTime: timeString,
      })
    )
    .length(7, "ساعت کاری هر ۷ روز هفته باید مشخص باشد."),
});

export const orderSettingsSchema = z.object({
  acceptsDineIn: z.boolean(),
  acceptsTakeaway: z.boolean(),
  acceptsDelivery: z.boolean(),
  prepTimeDineIn: z.coerce.number().int().min(1, "زمان آماده‌سازی باید حداقل ۱ دقیقه باشد.").max(240),
  prepTimeTakeaway: z.coerce.number().int().min(1, "زمان آماده‌سازی باید حداقل ۱ دقیقه باشد.").max(240),
  prepTimeDelivery: z.coerce.number().int().min(1, "زمان آماده‌سازی باید حداقل ۱ دقیقه باشد.").max(240),
});

export const menuAppearanceSchema = z.object({
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "کد رنگ معتبر نیست.")
    .transform((v) => v.toUpperCase()),
  logoUrl: optionalImageUrl,
  heroBgKey: z.enum(HERO_BG_KEYS),
  heroImageUrl: optionalImageUrl,
  heroOverlayOpacity: z.coerce.number().int().min(0).max(100),
});

export const languageSettingsSchema = z.object({
  bilingualMenuEnabled: z.boolean(),
  askLanguageOnEntry: z.boolean(),
  rememberCustomerLanguage: z.boolean(),
});

export const productTranslationSchema = z.object({
  nameEn: z.string().trim().max(120).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  descriptionEn: z.string().trim().max(1000).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
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
  serviceFeePercent: z.coerce.number().int().min(0, "درصد نمی‌تواند منفی باشد.").max(100, "درصد نمی‌تواند بیشتر از ۱۰۰ باشد."),
  taxPercent: z.coerce.number().int().min(0, "درصد نمی‌تواند منفی باشد.").max(100, "درصد نمی‌تواند بیشتر از ۱۰۰ باشد."),
});

export const productOptionSchema = z.object({
  name: z.string().trim().min(1, "نام گزینه را وارد کنید.").max(60),
  extraPrice: z.coerce.number().int().min(0, "قیمت اضافه نمی‌تواند منفی باشد.").default(0),
  isDefault: z.boolean().default(false),
});

export const productOptionGroupSchema = z.object({
  name: z.string().trim().min(1, "نام ویژگی را وارد کنید.").max(60),
  required: z.boolean().default(false),
  multiSelect: z.boolean().default(false),
  options: z.array(productOptionSchema).min(1, "حداقل یک گزینه اضافه کنید."),
});

export const productSchema = z.object({
  categoryId: z.string().min(1, "دسته‌بندی را انتخاب کنید."),
  name: z.string().trim().min(2, "نام محصول را کامل وارد کنید.").max(120),
  description: z.string().trim().max(1000).optional(),
  price: z.coerce.number().int().positive("قیمت باید عددی مثبت باشد."),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
  isActive: z.boolean(),
  imageUrl: optionalImageUrl,
  optionGroups: z.array(productOptionGroupSchema).optional().default([]),
  trackInventory: z.boolean().default(false),
  stock: z.coerce.number().int().min(0, "موجودی نمی‌تواند منفی باشد.").default(0),
  lowStockThreshold: z.coerce.number().int().min(0, "آستانه هشدار نمی‌تواند منفی باشد.").default(5),
});

const optionalTime = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

export const categorySchema = z.object({
  name: z.string().trim().min(2, "نام دسته را کامل وارد کنید.").max(60),
  icon: z.string().trim().max(30).optional(),
  isActive: z.boolean(),
  imageUrl: optionalImageUrl,
  scheduleEnabled: z.boolean().default(false),
  scheduleDays: z.array(z.coerce.number().int().min(0).max(6)).optional().default([]),
  scheduleStart: optionalTime,
  scheduleEnd: optionalTime,
});

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["NEW", "PREPARING", "READY", "DELIVERED", "CANCELED"]),
});

export const courierSchema = z.object({
  name: z.string().trim().min(2, "نام و نام خانوادگی را کامل وارد کنید.").max(80),
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20),
  vehicleType: z.enum(["MOTORCYCLE", "CAR"]),
  nationalCode: z.string().trim().max(20).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  coverageZones: z.array(z.string().trim().min(1)).optional().default([]),
  isActive: z.boolean(),
});

export const assignCourierSchema = z.object({
  orderId: z.string().min(1),
  // Empty string means "unassign" — see order-mgmt-service.ts's assignCourier.
  courierId: z.string().trim().optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
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
  paymentMethod: z.enum(["CASH", "CARD", "CREDIT"]),
  creditNote: z.string().trim().max(500).optional(),
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
  // LOYAL_CUSTOMERS intentionally omitted — superseded by LOYALTY_MEMBERS
  // (a real CustomerAccount-based audience, see loyalty-club-service.ts).
  // The enum value still exists on SmsAudience for historical SmsMessage
  // rows, it's just no longer a choosable target for new sends.
  audience: z.enum(["ALL_CONTACTS", "RECENT_ORDERS", "MANUAL", "LOYALTY_MEMBERS"]),
  manualContactIds: z.array(z.string().min(1)).optional().default([]),
  // Only meaningful when audience is LOYALTY_MEMBERS — see applyLoyaltyFilter.
  loyaltyFilter: z.enum(["ALL", "INACTIVE_30", "INACTIVE_90", "GOLD", "WALLET_100K"]).optional().default("ALL"),
  text: z.string().trim().min(1, "متن پیام را وارد کنید.").max(670, "متن پیام بیش از حد مجاز طولانی است."),
});

export const cashbackSettingsSchema = z.object({
  cashbackEnabled: z.boolean(),
  cashbackPercent: z.coerce
    .number()
    .int()
    .min(0, "درصد کش‌بک نمی‌تواند منفی باشد.")
    .max(20, "درصد کش‌بک نمی‌تواند بیش از ۲۰٪ باشد."),
  cashbackCapPerOrder: z.coerce.number().int().min(0, "سقف کش‌بک نمی‌تواند منفی باشد."),
});

export const birthdaySettingsSchema = z.object({
  birthdayMessageEnabled: z.boolean(),
  birthdayMessageText: z.string().trim().max(670, "متن پیام بیش از حد مجاز طولانی است.").optional(),
  birthdayGiftAmount: z.coerce.number().int().min(0, "مبلغ هدیه نمی‌تواند منفی باشد."),
});

export const birthdayTestSendSchema = z.object({
  phone: z.string().trim().min(10, "شماره گیرنده معتبر نیست.").max(20),
});

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

export const ticketSchema = z.object({
  subject: z.string().trim().min(3, "موضوع را کامل وارد کنید.").max(150),
  category: z.enum(["TECHNICAL", "PAYMENT", "BILLING", "GENERAL"]),
  text: z.string().trim().min(5, "متن پیام را کامل وارد کنید.").max(4000),
  attachmentUrl: optionalAttachmentUrl,
  attachmentName: optionalAttachmentName,
});

export const ticketMessageSchema = z.object({
  text: z.string().trim().min(1, "متن پیام را وارد کنید.").max(4000),
  attachmentUrl: optionalAttachmentUrl,
  attachmentName: optionalAttachmentName,
});
