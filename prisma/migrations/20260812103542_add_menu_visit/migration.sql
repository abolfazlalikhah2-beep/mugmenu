-- CreateEnum
CREATE TYPE "VisitSource" AS ENUM ('QR', 'LINK', 'DIRECT');

-- CreateTable
CREATE TABLE "MenuVisit" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "productId" TEXT,
    "source" "VisitSource",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MenuVisit_businessId_createdAt_idx" ON "MenuVisit"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "MenuVisit_businessId_productId_createdAt_idx" ON "MenuVisit"("businessId", "productId", "createdAt");

-- AddForeignKey
ALTER TABLE "MenuVisit" ADD CONSTRAINT "MenuVisit_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuVisit" ADD CONSTRAINT "MenuVisit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
