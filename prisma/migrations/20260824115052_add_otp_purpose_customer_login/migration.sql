
-- AlterEnum
ALTER TYPE "OtpPurpose" ADD VALUE 'CUSTOMER_LOGIN';

-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

