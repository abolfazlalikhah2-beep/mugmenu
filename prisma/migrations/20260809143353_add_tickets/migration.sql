-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'PENDING', 'ANSWERED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('TECHNICAL', 'PAYMENT', 'BILLING', 'GENERAL');

-- CreateEnum
CREATE TYPE "TicketAuthorType" AS ENUM ('OWNER', 'AGENT');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "ticketNumber" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "category" "TicketCategory" NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorType" "TicketAuthorType" NOT NULL,
    "authorName" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "attachmentName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON "Ticket"("ticketNumber");

-- CreateIndex
CREATE INDEX "Ticket_businessId_idx" ON "Ticket"("businessId");

-- CreateIndex
CREATE INDEX "TicketMessage_ticketId_idx" ON "TicketMessage"("ticketId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

