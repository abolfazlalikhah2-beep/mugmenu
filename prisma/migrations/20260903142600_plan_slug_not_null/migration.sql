-- Tightens Plan.slug now that the previous migration's `npx prisma db seed`
-- run has populated it for all 4 remaining plans.

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");
