-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "demoExpiresAt" TIMESTAMP(3),
ADD COLUMN     "isDemoActive" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

