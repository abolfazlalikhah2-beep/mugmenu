-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

-- AlterTable
ALTER TABLE "PaymentRequest" ADD COLUMN     "screenshotUrl" TEXT;

