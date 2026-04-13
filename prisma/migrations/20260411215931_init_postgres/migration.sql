-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "annualFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rewardProgram" TEXT,
    "baseEarnRate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardCategoryRule" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardCategoryRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryCategory" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantAlias" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardMerchantBenefit" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "bonusType" TEXT NOT NULL,
    "bonusValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardMerchantBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cardId" TEXT,
    "merchantId" TEXT,
    "categoryId" TEXT,
    "bonusType" TEXT NOT NULL,
    "bonusValue" DOUBLE PRECISION NOT NULL,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardCategoryRule_cardId_category_key" ON "CardCategoryRule"("cardId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_name_key" ON "Merchant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantAlias_alias_key" ON "MerchantAlias"("alias");

-- CreateIndex
CREATE INDEX "MerchantAlias_alias_idx" ON "MerchantAlias"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "CardMerchantBenefit_cardId_merchantId_key" ON "CardMerchantBenefit"("cardId", "merchantId");

-- CreateIndex
CREATE INDEX "Offer_merchantId_idx" ON "Offer"("merchantId");

-- CreateIndex
CREATE INDEX "Offer_cardId_idx" ON "Offer"("cardId");

-- AddForeignKey
ALTER TABLE "CardCategoryRule" ADD CONSTRAINT "CardCategoryRule_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantAlias" ADD CONSTRAINT "MerchantAlias_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardMerchantBenefit" ADD CONSTRAINT "CardMerchantBenefit_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardMerchantBenefit" ADD CONSTRAINT "CardMerchantBenefit_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
