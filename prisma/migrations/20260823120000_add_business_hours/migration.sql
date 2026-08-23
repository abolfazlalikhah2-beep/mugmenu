-- CreateTable
CREATE TABLE "BusinessHours" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "openTime" TEXT NOT NULL DEFAULT '09:00',
    "closeTime" TEXT NOT NULL DEFAULT '22:00',

    CONSTRAINT "BusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessHours_businessId_idx" ON "BusinessHours"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHours_businessId_dayOfWeek_key" ON "BusinessHours"("businessId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: 7 rows per existing business from the old single opening-hours
-- range, before it's dropped below. gen_random_uuid()::text is not a cuid,
-- but these ids are never referenced by anything other than the row's own
-- primary key, so the format mismatch is harmless.
INSERT INTO "BusinessHours" ("id", "businessId", "dayOfWeek", "isClosed", "openTime", "closeTime")
SELECT gen_random_uuid()::text, "Business"."id", "day"."dayOfWeek", false,
       COALESCE("Business"."openingHoursStart", '09:00'),
       COALESCE("Business"."openingHoursEnd", '22:00')
FROM "Business"
CROSS JOIN (SELECT generate_series(0, 6) AS "dayOfWeek") AS "day";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "openingHoursEnd",
DROP COLUMN "openingHoursStart",
ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');
