-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_planId_fkey";

-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days'),
ALTER COLUMN "planId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
