-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "cardType" TEXT NOT NULL DEFAULT 'credit',
ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "extractionNotes" TEXT,
ADD COLUMN     "fetchedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sourceUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Card_externalId_key" ON "Card"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_name_issuer_key" ON "Card"("name", "issuer");
