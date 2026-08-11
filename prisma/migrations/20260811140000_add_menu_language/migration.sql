-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "askLanguageOnEntry" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bilingualMenuEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rememberCustomerLanguage" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "planExpiresAt" SET DEFAULT (now() + interval '30 days');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "nameEn" TEXT;
