-- AlterTable
ALTER TABLE "Business" DROP COLUMN "openingHours",
ADD COLUMN     "acceptsCashPayment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "acceptsDelivery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsDineIn" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "acceptsOnlinePayment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsTakeaway" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "openingHoursEnd" TEXT,
ADD COLUMN     "openingHoursStart" TEXT;

