-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MENU_MANAGER', 'CASHIER');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "planExpiresAt" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '30 days'),
ADD COLUMN     "planMaxUsers" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "planName" TEXT NOT NULL DEFAULT 'اشتراک حرفه‌ای',
ADD COLUMN     "planPriceToman" INTEGER NOT NULL DEFAULT 390000,
ADD COLUMN     "planStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'OWNER';

