ALTER TABLE "order" ADD COLUMN "allergies" TEXT;

CREATE TABLE "food_category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "food_category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "food_category_name_key" ON "food_category"("name");

UPDATE "menu_item"
SET "category" = 'Pastries/Baking'
WHERE LOWER("category") IN ('cakes', 'custom cakes');

INSERT INTO "food_category" ("id", "name")
SELECT 'category_' || md5(category), category
FROM (
    SELECT DISTINCT "category" AS category FROM "menu_item"
    UNION SELECT 'Mains'
    UNION SELECT 'Starters'
    UNION SELECT 'Pastries'
    UNION SELECT 'Pastries/Baking'
    UNION SELECT 'Drinks'
    UNION SELECT 'Sides'
    UNION SELECT 'Meat'
) AS categories
ON CONFLICT ("name") DO NOTHING;
