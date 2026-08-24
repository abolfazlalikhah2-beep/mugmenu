-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

