-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "scheduleDays" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "scheduleEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduleEnd" TEXT,
ADD COLUMN     "scheduleStart" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trackInventory" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductOptionGroup" ADD COLUMN     "multiSelect" BOOLEAN NOT NULL DEFAULT false;
