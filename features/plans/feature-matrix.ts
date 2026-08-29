/**
 * Single source of truth for what each of the 3 subscription tiers includes.
 * Only used to seed the PlanFeature table (see prisma/seed.ts) — every
 * runtime gating check reads PlanFeature from the DB, never this file, so
 * changing what a plan includes after launch is a data change (edit
 * PlanFeature rows), not a code release.
 */

export const PLAN_KEYS = ["menu-display", "menu-order", "menu-advanced"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

export const ANNUAL_MONTHS = 12;
export const ANNUAL_DISCOUNT = 0.8;
export const SIX_MONTH_MONTHS = 6;
export const SIX_MONTH_DISCOUNT = 0.9;

export function computeAnnualPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * ANNUAL_MONTHS * ANNUAL_DISCOUNT);
}

export function computeSixMonthPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * SIX_MONTH_MONTHS * SIX_MONTH_DISCOUNT);
}

export const PLAN_DEFS: Record<PlanKey, { name: string; monthlyPrice: number; sortOrder: number }> = {
  "menu-display": { name: "منو دیداری", monthlyPrice: 600_000, sortOrder: 0 },
  "menu-order": { name: "منو سفارش", monthlyPrice: 1_200_000, sortOrder: 1 },
  "menu-advanced": { name: "منو پیشرفته", monthlyPrice: 2_500_000, sortOrder: 2 },
};

export const FEATURE_KEYS = [
  // Always included in all 3 plans, no limit — not gated in code (always true).
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
  // menu-order + menu-advanced only.
  "domain.custom",
  "order.three_mode",
  "product.variants",
  "product.inventory",
  "discount.manual_auto",
  "order.manual_entry",
  "review.submit_survey",
  "report.orders",
  "loyalty.cashback",
  "customer.export",
  "customer.wallet_login",
  "payment.gateway",
  "printer.connection", // limit varies (2 vs unlimited), absent for menu-display
  // menu-advanced only.
  "loyalty.birthday_message",
  "loyalty.targeted_message",
  "sms.panel",
  "branch.multi_switcher",
  "delivery.internal_riders",
  "accounting.simple",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

const ALL_PLANS: Record<PlanKey, string | null> = {
  "menu-display": null,
  "menu-order": null,
  "menu-advanced": null,
};

const ORDER_AND_ADVANCED: Partial<Record<PlanKey, string | null>> = {
  "menu-order": null,
  "menu-advanced": null,
};

const ADVANCED_ONLY: Partial<Record<PlanKey, string | null>> = {
  "menu-advanced": null,
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
  "branch.count": { "menu-display": "1", "menu-order": "1", "menu-advanced": "3" },
  "support.ticketing": {
    "menu-display": "ticketing",
    "menu-order": "ticketing",
    "menu-advanced": "ticketing+phone",
  },

  "domain.custom": ORDER_AND_ADVANCED,
  "order.three_mode": ORDER_AND_ADVANCED,
  "product.variants": ORDER_AND_ADVANCED,
  "product.inventory": ORDER_AND_ADVANCED,
  "discount.manual_auto": ORDER_AND_ADVANCED,
  "order.manual_entry": ORDER_AND_ADVANCED,
  "review.submit_survey": ORDER_AND_ADVANCED,
  "report.orders": ORDER_AND_ADVANCED,
  "loyalty.cashback": ORDER_AND_ADVANCED,
  "customer.export": ORDER_AND_ADVANCED,
  "customer.wallet_login": ORDER_AND_ADVANCED,
  "payment.gateway": ORDER_AND_ADVANCED,
  "printer.connection": { "menu-order": "2", "menu-advanced": "unlimited" },

  // No Branch/accounting feature exists in the app yet — seeded for
  // future-readiness only, nothing gates on these today.
  "loyalty.birthday_message": ADVANCED_ONLY,
  "loyalty.targeted_message": ADVANCED_ONLY,
  "sms.panel": ADVANCED_ONLY,
  "branch.multi_switcher": ADVANCED_ONLY,
  "delivery.internal_riders": ADVANCED_ONLY,
  "accounting.simple": ADVANCED_ONLY,
};
