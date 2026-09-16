-- Normalize existing customDomain values (strip scheme/www/trailing slash,
-- lowercase) to match lib/subdomain.ts's normalizeCustomDomain(), which now
-- normalizes both the incoming request host (proxy.ts) and the value saved
-- from the onboarding form (dashboard-schemas.ts) — so any row saved before
-- that normalization existed still compares/matches correctly.
UPDATE "Business"
SET "customDomain" = NULLIF(
  regexp_replace(
    regexp_replace(
      regexp_replace(lower(trim("customDomain")), '^https?://', ''),
      '^www\.', ''
    ),
    '/+$', ''
  ),
  ''
)
WHERE "customDomain" IS NOT NULL;

-- Two businesses may have ended up with the same (or now-normalized-to-the-
-- same) customDomain before this constraint existed. Keep it on whichever
-- business registered it first and clear it from the rest, so the unique
-- index below doesn't fail against legacy data.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "customDomain" ORDER BY "createdAt") AS rn
  FROM "Business"
  WHERE "customDomain" IS NOT NULL
)
UPDATE "Business" b
SET "customDomain" = NULL
FROM ranked r
WHERE b.id = r.id AND r.rn > 1;

-- CreateIndex
CREATE UNIQUE INDEX "Business_customDomain_key" ON "Business"("customDomain");
