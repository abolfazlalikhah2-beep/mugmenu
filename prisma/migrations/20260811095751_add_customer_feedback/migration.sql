-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "OrderSurvey" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "taste" TEXT NOT NULL,
    "speed" TEXT NOT NULL,
    "packaging" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderSurvey_orderId_key" ON "OrderSurvey"("orderId");

-- CreateIndex
CREATE INDEX "Review_orderId_idx" ON "Review"("orderId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSurvey" ADD CONSTRAINT "OrderSurvey_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

