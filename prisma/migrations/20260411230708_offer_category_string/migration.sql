-- Preserve existing category values while renaming the scalar field.
ALTER TABLE "Offer" RENAME COLUMN "categoryId" TO "category";
