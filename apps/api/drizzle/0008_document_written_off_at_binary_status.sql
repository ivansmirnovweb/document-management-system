ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "written_off_at" timestamp;
UPDATE "documents" SET "status"='DONE', "written_off_at"=COALESCE("completed_at", NOW()) WHERE "status"='WRITTEN_OFF';
