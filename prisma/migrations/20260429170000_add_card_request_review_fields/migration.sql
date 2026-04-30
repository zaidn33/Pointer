ALTER TABLE "CardRequest"
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "reviewedBy" TEXT,
ADD COLUMN "resolutionNotes" TEXT,
ADD COLUMN "resolvedCardId" TEXT;
