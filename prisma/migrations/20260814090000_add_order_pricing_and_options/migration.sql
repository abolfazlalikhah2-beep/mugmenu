-- AlterEnum
ALTER TYPE "WalletTransactionType" ADD VALUE 'REDEEMED';

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "serviceFeePercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "taxPercent" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountAmount" INTEGER,
ADD COLUMN     "discountName" TEXT,
ADD COLUMN     "packagingFeeAmount" INTEGER,
ADD COLUMN     "serviceFeeAmount" INTEGER,
ADD COLUMN     "subtotal" INTEGER,
ADD COLUMN     "taxAmount" INTEGER,
ADD COLUMN     "walletRedeemedAmount" INTEGER;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "selectedOptionsSummary",
ADD COLUMN     "note" TEXT;

-- CreateTable
CREATE TABLE "OrderItemOption" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "optionName" TEXT NOT NULL,
    "extraPrice" INTEGER NOT NULL,

    CONSTRAINT "OrderItemOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderItemOption_orderItemId_idx" ON "OrderItemOption"("orderItemId");

-- AddForeignKey
ALTER TABLE "OrderItemOption" ADD CONSTRAINT "OrderItemOption_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
