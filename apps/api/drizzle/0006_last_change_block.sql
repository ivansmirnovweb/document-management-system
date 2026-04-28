ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "last_changed_at" timestamp;
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "last_changed_by_id" integer;

UPDATE "documents" SET "last_changed_at" = COALESCE("last_changed_at", "updated_at") WHERE "last_changed_at" IS NULL;
UPDATE "documents" SET "last_changed_by_id" = COALESCE("last_changed_by_id", "owner_id") WHERE "last_changed_by_id" IS NULL;

ALTER TABLE "documents" ALTER COLUMN "last_changed_at" SET NOT NULL;
ALTER TABLE "documents" ALTER COLUMN "last_changed_by_id" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "documents" ADD CONSTRAINT "documents_last_changed_by_id_users_id_fk"
  FOREIGN KEY ("last_changed_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
