-- AlterEnum
ALTER TYPE "BillingCycle" ADD VALUE 'SIX_MONTH';

-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "sixMonthPrice" INTEGER NOT NULL DEFAULT 0;

