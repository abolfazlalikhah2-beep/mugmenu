-- Additive schema changes only. `slug` is added nullable/without its
-- unique constraint here because the 3 old Plan rows (menu-display/
-- menu-order/menu-advanced) still exist at this point and have no slug
-- value yet -- `npx prisma db seed` (run right after this migration)
-- populates the 4 new plans' slugs and deletes the old rows. A follow-up
-- migration then tightens slug to NOT NULL + UNIQUE.
-- See features/plans/feature-matrix.ts for the new plan definitions.

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "slug" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isOrderingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCashierEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marketingFeatures" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "LeadCapture" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'homepage',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadCapture_pkey" PRIMARY KEY ("id")
);
