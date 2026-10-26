UPDATE "menu_item"
SET "category" = 'Pastries'
WHERE LOWER("category") IN ('pastries/baking', 'cakes', 'custom cakes');

DELETE FROM "food_category"
WHERE LOWER("name") IN ('pastries/baking', 'cakes', 'custom cakes')
  AND NOT EXISTS (
    SELECT 1
    FROM "menu_item"
    WHERE LOWER("menu_item"."category") = LOWER("food_category"."name")
  );
