-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('CODE', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "DiscountScope" AS ENUM ('ALL_MENU', 'CATEGORY', 'PRODUCT');

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "percent" INTEGER,
    "scope" "DiscountScope",
    "categoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "productId" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Discount_businessId_idx" ON "Discount"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_businessId_code_key" ON "Discount"("businessId", "code");

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

