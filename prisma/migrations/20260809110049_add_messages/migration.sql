-- CreateEnum
CREATE TYPE "SmsAudience" AS ENUM ('ALL_CONTACTS', 'LOYAL_CUSTOMERS', 'RECENT_ORDERS', 'MANUAL');

-- CreateEnum
CREATE TYPE "SmsMessageStatus" AS ENUM ('SENT', 'PARTIAL', 'FAILED', 'QUEUED');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "smsApiKey" TEXT,
ADD COLUMN     "smsConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smsCreditCount" INTEGER,
ADD COLUMN     "smsProvider" TEXT,
ADD COLUMN     "smsSenderNumber" TEXT,
ADD COLUMN     "smsUsername" TEXT;

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsMessage" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "audience" "SmsAudience",
    "recipientCount" INTEGER NOT NULL,
    "status" "SmsMessageStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_businessId_idx" ON "Contact"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_businessId_phone_key" ON "Contact"("businessId", "phone");

-- CreateIndex
CREATE INDEX "SmsMessage_businessId_idx" ON "SmsMessage"("businessId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsMessage" ADD CONSTRAINT "SmsMessage_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

