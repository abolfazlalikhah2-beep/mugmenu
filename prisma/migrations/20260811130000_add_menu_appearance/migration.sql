-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "accentColor" TEXT NOT NULL DEFAULT '#328C3D',
ADD COLUMN     "heroBgKey" TEXT NOT NULL DEFAULT 'g1',
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "heroOverlayOpacity" INTEGER NOT NULL DEFAULT 45,
ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

