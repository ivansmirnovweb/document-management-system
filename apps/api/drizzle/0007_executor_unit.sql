ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "unit" varchar(100);

UPDATE "users"
SET "unit" = CASE
  WHEN "role" = 'ROOT' THEN 'Администрация'
  ELSE COALESCE(NULLIF("unit", ''), 'Канцелярия')
END
WHERE "unit" IS NULL OR "unit" = '';

ALTER TABLE "users" ALTER COLUMN "unit" SET NOT NULL;
