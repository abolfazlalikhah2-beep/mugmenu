-- Seed the 3 fixed subscription tiers from features/plans/feature-matrix.ts's
-- PLAN_DEFS (monthlyPrice/sortOrder) + computeSixMonthPrice/computeAnnualPrice
-- (the same formulas prisma/seed.ts uses). Runs as a real migration, not
-- prisma/seed.ts, for the same reason as the PlanFeature seed migration
-- (20260829130000_seed_plan_features, which joins on Plan.key and is a
-- no-op without these rows already existing) — only `prisma migrate deploy`
-- runs on deploy, prisma/seed.ts never does. Idempotent (ON CONFLICT DO
-- UPDATE) so a database that already has these rows just gets them
-- refreshed to match the current prices, and a brand-new database gets
-- bootstrapped with no manual seed step.
INSERT INTO "Plan" ("id", "key", "name", "monthlyPrice", "sixMonthPrice", "annualPrice", "sortOrder", "createdAt", "updatedAt")
VALUES
  (md5(random()::text || clock_timestamp()::text), 'menu-display', 'منو دیداری', 600000, 3240000, 5760000, 0, now(), now()),
  (md5(random()::text || clock_timestamp()::text), 'menu-order', 'منو سفارش', 1200000, 6480000, 11520000, 1, now(), now()),
  (md5(random()::text || clock_timestamp()::text), 'menu-advanced', 'منو پیشرفته', 2500000, 13500000, 24000000, 2, now(), now())
ON CONFLICT ("key") DO UPDATE SET
  "name" = EXCLUDED."name",
  "monthlyPrice" = EXCLUDED."monthlyPrice",
  "sixMonthPrice" = EXCLUDED."sixMonthPrice",
  "annualPrice" = EXCLUDED."annualPrice",
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = now();
