-- CreateTable
CREATE TABLE "CardRequest" (
    "id" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "issuer" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL DEFAULT 'wallet_request',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardRequest_status_idx" ON "CardRequest"("status");
