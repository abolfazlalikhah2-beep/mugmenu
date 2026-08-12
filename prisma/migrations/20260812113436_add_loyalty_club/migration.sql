-- AlterEnum
ALTER TYPE "SmsAudience" ADD VALUE 'LOYALTY_MEMBERS';

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "birthdayGiftAmount" INTEGER NOT NULL DEFAULT 50000,
ADD COLUMN     "birthdayMessageEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "birthdayMessageText" TEXT,
ADD COLUMN     "cashbackCapPerOrder" INTEGER NOT NULL DEFAULT 50000,
ADD COLUMN     "cashbackEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cashbackPercent" INTEGER NOT NULL DEFAULT 5;
