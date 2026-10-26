UPDATE "user" AS legacy_admin
SET "email" = 'admin@jaisol'
WHERE legacy_admin."email" = 'admin@jaisol.local'
  AND NOT EXISTS (
    SELECT 1
    FROM "user" AS current_admin
    WHERE current_admin."email" = 'admin@jaisol'
  );
