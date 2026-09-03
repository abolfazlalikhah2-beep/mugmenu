-- Manual production script for the plan replacement + ContactMessage/LeadCapture
-- change. Run this whole file once, by hand, in PGAdmin's query tool against the
-- production DB — the runner CMD does not run `prisma migrate deploy` (see
-- CLAUDE.md's "وضعیت Migration در پروداکشن" note), so every migration ships this way.
--
-- This is the DDL from local migrations
--   20260903142515_replace_plans_add_contact_lead
--   20260903142600_plan_slug_not_null
-- plus the data steps `npx prisma db seed` did locally (upsert the 4 new
-- plans + their PlanFeature rows, reassign existing businesses off the old
-- 3-tier plans by rough equivalence, delete the old plans), inlined as SQL
-- since there's no way to run the seed script against production directly.
--
-- Safe to run as one transaction; if anything fails, nothing is committed.

BEGIN;

-- ============================================================
-- 1. Schema: additive columns/tables (slug nullable for now --
--    tightened to NOT NULL + UNIQUE at the end, after step 3 below
--    has given every remaining Plan row a slug value).
-- ============================================================

ALTER TABLE "Plan" ADD COLUMN     "slug" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isOrderingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCashierEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marketingFeatures" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "ContactMessage" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "LeadCapture" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'homepage',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadCapture_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- 2. Insert the 4 new plans (فیروزه/یشم/اوپال/زمرد) and their
--    PlanFeature rows -- generated from
--    features/plans/feature-matrix.ts's PLAN_DEFS/FEATURE_MATRIX,
--    identical to what `npx prisma db seed` inserted locally.
-- ============================================================

INSERT INTO "Plan" ("id", "key", "slug", "name", "description", "monthlyPrice", "sixMonthPrice", "annualPrice", "isOrderingEnabled", "isCashierEnabled", "marketingFeatures", "sortOrder", "createdAt", "updatedAt")
VALUES (gen_random_uuid()::text, 'firuze', 'firuze', 'فیروزه', 'مناسب کافه‌ها و شروع رایگان', 490000, 2450000, 4700000, false, false, ARRAY['منوی دیجیتال عمومی', 'یک QR اختصاصی', 'تا ۳۰ آیتم منو', 'پشتیبانی ایمیلی']::TEXT[], 0, now(), now());
INSERT INTO "Plan" ("id", "key", "slug", "name", "description", "monthlyPrice", "sixMonthPrice", "annualPrice", "isOrderingEnabled", "isCashierEnabled", "marketingFeatures", "sortOrder", "createdAt", "updatedAt")
VALUES (gen_random_uuid()::text, 'yashm', 'yashm', 'یشم', 'مناسب رستوران‌هایی که سفارش‌گیری دستی دارند', 980000, 4900000, 9400000, false, true, ARRAY['همه امکانات فیروزه', 'صندوق فروشگاهی', 'ثبت سفارش دستی توسط صندوق', 'گزارش فروش پایه']::TEXT[], 1, now(), now());
INSERT INTO "Plan" ("id", "key", "slug", "name", "description", "monthlyPrice", "sixMonthPrice", "annualPrice", "isOrderingEnabled", "isCashierEnabled", "marketingFeatures", "sortOrder", "createdAt", "updatedAt")
VALUES (gen_random_uuid()::text, 'opal', 'opal', 'اوپال', 'مناسب رستوران‌های فعال با سفارش آنلاین', 1290000, 6450000, 12400000, true, true, ARRAY['همه امکانات یشم', 'سفارش آنلاین از منو', 'سه حالت سفارش هوشمند', 'QR نامحدود میز', 'اعلان لحظه‌ای سفارش']::TEXT[], 2, now(), now());
INSERT INTO "Plan" ("id", "key", "slug", "name", "description", "monthlyPrice", "sixMonthPrice", "annualPrice", "isOrderingEnabled", "isCashierEnabled", "marketingFeatures", "sortOrder", "createdAt", "updatedAt")
VALUES (gen_random_uuid()::text, 'zomorrod', 'zomorrod', 'زمرد', 'مناسب رستوران‌های بزرگ و پرحجم', 2200000, 11000000, 21000000, true, true, ARRAY['همه امکانات اوپال', 'گزارش‌گیری و آمار پیشرفته', 'خروجی اکسل از سفارش‌ها', 'باشگاه مشتریان', 'پشتیبانی ۲۴ ساعته']::TEXT[], 3, now(), now());

INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.core', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.core', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.core', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.core', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.profile', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.profile', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.profile', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.profile', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.multilang', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.multilang', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.multilang', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.multilang', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.custom_theme', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.custom_theme', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.custom_theme', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.custom_theme', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.qr_export', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.qr_export', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.qr_export', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.qr_export', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.reviews_display', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.reviews_display', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.reviews_display', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'menu.reviews_display', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'domain.subdomain', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'domain.subdomain', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'domain.subdomain', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'domain.subdomain', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'product.crud', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'product.crud', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'product.crud', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'product.crud', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'staff.roles', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'staff.roles', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'staff.roles', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'staff.roles', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'category.schedule', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'category.schedule', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'category.schedule', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'category.schedule', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.notes', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.notes', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.notes', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.notes', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'report.menu_visits', NULL FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'report.menu_visits', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'report.menu_visits', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'report.menu_visits', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'branch.count', '1' FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'branch.count', '1' FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'branch.count', '3' FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'branch.count', '3' FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'support.ticketing', 'ticketing' FROM "Plan" WHERE "key" = 'firuze';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'support.ticketing', 'ticketing' FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'support.ticketing', 'ticketing' FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'support.ticketing', 'ticketing+phone' FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.manual_entry', NULL FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.manual_entry', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.manual_entry', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'report.orders', 'basic' FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'report.orders', 'basic' FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'report.orders', 'advanced' FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'printer.connection', '2' FROM "Plan" WHERE "key" = 'yashm';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'printer.connection', '2' FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'printer.connection', 'unlimited' FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'domain.custom', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'domain.custom', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.three_mode', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'order.three_mode', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'product.variants', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'product.variants', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'product.inventory', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'product.inventory', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'discount.manual_auto', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'discount.manual_auto', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'review.submit_survey', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'review.submit_survey', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'customer.wallet_login', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'customer.wallet_login', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'payment.gateway', NULL FROM "Plan" WHERE "key" = 'opal';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'payment.gateway', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'loyalty.cashback', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'loyalty.birthday_message', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'loyalty.targeted_message', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'sms.panel', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'branch.multi_switcher', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'delivery.internal_riders', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'accounting.simple', NULL FROM "Plan" WHERE "key" = 'zomorrod';
INSERT INTO "PlanFeature" ("id", "planId", "featureKey", "limitValue")
SELECT gen_random_uuid()::text, "id", 'customer.export', NULL FROM "Plan" WHERE "key" = 'zomorrod';

-- ============================================================
-- 3. Reassign businesses off the old 3-tier plans by rough tier
--    equivalence (menu-display -> firuze, menu-order -> opal,
--    menu-advanced -> zomorrod), then delete the old plans.
--    PlanFeature rows for the deleted plans cascade-delete
--    automatically (Plan.features has onDelete: Cascade).
-- ============================================================

UPDATE "Business" SET "planId" = (SELECT "id" FROM "Plan" WHERE "key" = 'firuze')
WHERE "planId" = (SELECT "id" FROM "Plan" WHERE "key" = 'menu-display');

UPDATE "Business" SET "planId" = (SELECT "id" FROM "Plan" WHERE "key" = 'opal')
WHERE "planId" = (SELECT "id" FROM "Plan" WHERE "key" = 'menu-order');

UPDATE "Business" SET "planId" = (SELECT "id" FROM "Plan" WHERE "key" = 'zomorrod')
WHERE "planId" = (SELECT "id" FROM "Plan" WHERE "key" = 'menu-advanced');

DELETE FROM "Plan" WHERE "key" IN ('menu-display', 'menu-order', 'menu-advanced');

-- ============================================================
-- 4. Tighten Plan.slug now that every remaining row has one.
-- ============================================================

ALTER TABLE "Plan" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");

COMMIT;

-- ---- Sanity checks to run after commit ----
-- SELECT key, slug, name, "monthlyPrice", "isOrderingEnabled", "isCashierEnabled" FROM "Plan" ORDER BY "sortOrder";
-- SELECT key, count(*) FROM "Plan" p JOIN "Business" b ON b."planId" = p.id GROUP BY key;
-- SELECT count(*) FROM "Business" WHERE "planId" IS NULL; -- must be 0
