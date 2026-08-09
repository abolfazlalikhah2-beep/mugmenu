-- CreateEnum
CREATE TYPE "PrinterConnectionType" AS ENUM ('NETWORK', 'USB', 'BLUETOOTH');

-- CreateTable
CREATE TABLE "Printer" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "connectionType" "PrinterConnectionType" NOT NULL DEFAULT 'NETWORK',
    "ipAddress" TEXT,
    "port" TEXT,
    "paperSize" TEXT NOT NULL DEFAULT '80mm',
    "copies" INTEGER NOT NULL DEFAULT 1,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "lastTestedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Printer_businessId_idx" ON "Printer"("businessId");

-- AddForeignKey
ALTER TABLE "Printer" ADD CONSTRAINT "Printer_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

