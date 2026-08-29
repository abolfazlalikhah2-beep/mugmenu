-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "goldMinOrders" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "goldMinSpend" INTEGER NOT NULL DEFAULT 3000000,
ADD COLUMN     "lastInvoiceCounter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastInvoiceDate" DATE,
ADD COLUMN     "silverMinOrders" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "silverMinSpend" INTEGER NOT NULL DEFAULT 1000000,
ADD COLUMN     "vipMinOrders" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "vipMinSpend" INTEGER NOT NULL DEFAULT 7000000,
ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

-- AlterTable
ALTER TABLE "CustomerAccount" ADD COLUMN     "birthDate" DATE;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "receiptInvoiceNumber" TEXT;

