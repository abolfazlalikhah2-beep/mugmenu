/**
 * Single source of truth for what each of the 4 subscription tiers includes.
 * Only used to seed the PlanFeature table (see prisma/seed.ts) — every
 * runtime gating check reads PlanFeature from the DB, never this file, so
 * changing what a plan includes after launch is a data change (edit
 * PlanFeature rows), not a code release.
 */

export const PLAN_KEYS = ["firuze", "yashm", "opal", "zomorrod"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

export interface PlanDef {
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  sixMonthPrice: number;
  annualPrice: number;
  sortOrder: number;
  isOrderingEnabled: boolean;
  isCashierEnabled: boolean;
  marketingFeatures: string[];
}

// Prices are fixed per tier (not derived from a monthly-price formula) so
// changing one tier's discount doesn't silently move another's.
export const PLAN_DEFS: Record<PlanKey, PlanDef> = {
  firuze: {
    name: "فیروزه",
    slug: "firuze",
    description: "مناسب کافه‌ها و شروع رایگان",
    monthlyPrice: 490_000,
    sixMonthPrice: 2_450_000,
    annualPrice: 4_700_000,
    sortOrder: 0,
    isOrderingEnabled: false,
    isCashierEnabled: false,
    marketingFeatures: ["منوی دیجیتال عمومی", "یک QR اختصاصی", "تا ۳۰ آیتم منو", "پشتیبانی ایمیلی"],
  },
  yashm: {
    name: "یشم",
    slug: "yashm",
    description: "مناسب رستوران‌هایی که سفارش‌گیری دستی دارند",
    monthlyPrice: 980_000,
    sixMonthPrice: 4_900_000,
    annualPrice: 9_400_000,
    sortOrder: 1,
    isOrderingEnabled: false,
    isCashierEnabled: true,
    marketingFeatures: ["همه امکانات فیروزه", "صندوق فروشگاهی", "ثبت سفارش دستی توسط صندوق", "گزارش فروش پایه"],
  },
  opal: {
    name: "اوپال",
    slug: "opal",
    description: "مناسب رستوران‌های فعال با سفارش آنلاین",
    monthlyPrice: 1_290_000,
    sixMonthPrice: 6_450_000,
    annualPrice: 12_400_000,
    sortOrder: 2,
    isOrderingEnabled: true,
    isCashierEnabled: true,
    marketingFeatures: ["همه امکانات یشم", "سفارش آنلاین از منو", "سه حالت سفارش هوشمند", "QR نامحدود میز", "اعلان لحظه‌ای سفارش"],
  },
  zomorrod: {
    name: "زمرد",
    slug: "zomorrod",
    description: "مناسب رستوران‌های بزرگ و پرحجم",
    monthlyPrice: 2_200_000,
    sixMonthPrice: 11_000_000,
    annualPrice: 21_000_000,
    sortOrder: 3,
    isOrderingEnabled: true,
    isCashierEnabled: true,
    marketingFeatures: [
      "همه امکانات اوپال",
      "گزارش‌گیری و آمار پیشرفته",
      "خروجی اکسل از سفارش‌ها",
      "باشگاه مشتریان",
      "پشتیبانی ۲۴ ساعته",
    ],
  },
};

export const FEATURE_KEYS = [
  // Always included in all 4 plans, no limit — not gated in code (always true).
  "menu.core",
  "menu.profile",
  "menu.multilang",
  "menu.custom_theme",
  "menu.qr_export",
  "menu.reviews_display",
  "domain.subdomain",
  "product.crud",
  "staff.roles",
  "category.schedule",
  "order.notes",
  "report.menu_visits",
  // Always included, limit varies by plan.
  "branch.count",
  "support.ticketing",
  // isCashierEnabled plans (yashm, opal, zomorrod).
  "order.manual_entry",
  "report.orders",
  "printer.connection", // limit varies, absent for firuze
  // isOrderingEnabled plans (opal, zomorrod).
  "domain.custom",
  "order.three_mode",
  "product.variants",
  "product.inventory",
  "discount.manual_auto",
  "review.submit_survey",
  "customer.wallet_login",
  "payment.gateway",
  // zomorrod only.
  "loyalty.cashback",
  "loyalty.birthday_message",
  "loyalty.targeted_message",
  "sms.panel",
  "branch.multi_switcher",
  "delivery.internal_riders",
  "accounting.simple",
  "customer.export",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

const ALL_PLANS: Record<PlanKey, string | null> = {
  firuze: null,
  yashm: null,
  opal: null,
  zomorrod: null,
};

const CASHIER_UP: Partial<Record<PlanKey, string | null>> = {
  yashm: null,
  opal: null,
  zomorrod: null,
};

const ORDERING_UP: Partial<Record<PlanKey, string | null>> = {
  opal: null,
  zomorrod: null,
};

const ADVANCED_ONLY: Partial<Record<PlanKey, string | null>> = {
  zomorrod: null,
};

/**
 * featureKey -> which plans include it, and each plan's limitValue (null =
 * plain boolean feature). A plan key missing from the inner record means
 * that plan does NOT include the feature.
 */
export const FEATURE_MATRIX: Record<FeatureKey, Partial<Record<PlanKey, string | null>>> = {
  "menu.core": ALL_PLANS,
  "menu.profile": ALL_PLANS,
  "menu.multilang": ALL_PLANS,
  "menu.custom_theme": ALL_PLANS,
  "menu.qr_export": ALL_PLANS,
  "menu.reviews_display": ALL_PLANS,
  "domain.subdomain": ALL_PLANS,
  "product.crud": ALL_PLANS,
  "staff.roles": ALL_PLANS,
  "category.schedule": ALL_PLANS,
  "order.notes": ALL_PLANS,
  "report.menu_visits": ALL_PLANS,

  // No Branch model / multi-location UI exists in the app yet — this only
  // seeds the limit for when that feature is built.
  "branch.count": { firuze: "1", yashm: "1", opal: "3", zomorrod: "3" },
  "support.ticketing": {
    firuze: "ticketing",
    yashm: "ticketing",
    opal: "ticketing",
    zomorrod: "ticketing+phone",
  },

  "order.manual_entry": CASHIER_UP,
  "report.orders": { yashm: "basic", opal: "basic", zomorrod: "advanced" },
  "printer.connection": { yashm: "2", opal: "2", zomorrod: "unlimited" },

  "domain.custom": ORDERING_UP,
  "order.three_mode": ORDERING_UP,
  "product.variants": ORDERING_UP,
  "product.inventory": ORDERING_UP,
  "discount.manual_auto": ORDERING_UP,
  "review.submit_survey": ORDERING_UP,
  "customer.wallet_login": ORDERING_UP,
  "payment.gateway": ORDERING_UP,

  // No Branch/accounting feature exists in the app yet — seeded for
  // future-readiness only, nothing gates on these today.
  "loyalty.cashback": ADVANCED_ONLY,
  "loyalty.birthday_message": ADVANCED_ONLY,
  "loyalty.targeted_message": ADVANCED_ONLY,
  "sms.panel": ADVANCED_ONLY,
  "branch.multi_switcher": ADVANCED_ONLY,
  "delivery.internal_riders": ADVANCED_ONLY,
  "accounting.simple": ADVANCED_ONLY,
  "customer.export": ADVANCED_ONLY,
};
