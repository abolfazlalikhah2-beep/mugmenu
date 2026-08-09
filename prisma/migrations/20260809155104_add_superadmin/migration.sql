-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('OWNER', 'ADMIN', 'SUPPORT', 'FINANCE', 'VIEWER');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('HIGH', 'MID', 'LOW');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PAID', 'PENDING', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "isSuspended" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "assignedAgentUserId" TEXT,
ADD COLUMN     "priority" "TicketPriority" NOT NULL DEFAULT 'MID';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "platformRole" "PlatformRole",
ADD COLUMN     "platformTeam" TEXT;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "planName" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL,
    "gatewayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "zarinpalMerchantId" TEXT,
    "zarinpalApiKey" TEXT,
    "zarinpalCallbackUrl" TEXT,
    "zarinpalSandbox" BOOLEAN NOT NULL DEFAULT true,
    "zarinpalConnected" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_businessId_idx" ON "Transaction"("businessId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedAgentUserId_fkey" FOREIGN KEY ("assignedAgentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

