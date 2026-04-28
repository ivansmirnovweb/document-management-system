ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "about1" varchar(255);
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "about2" varchar(255);
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "outgoing_date" timestamp;
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "out_sender_employer_id" integer;
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "broadcast" varchar(255);

UPDATE "documents" SET "about1" = COALESCE("about1", "title") WHERE "about1" IS NULL;
UPDATE "documents" SET "about2" = COALESCE("about2", "about1") WHERE "about2" IS NULL;
UPDATE "documents" SET "out_sender_employer_id" = COALESCE("out_sender_employer_id", "employer_id") WHERE "out_sender_employer_id" IS NULL;
UPDATE "documents" SET "broadcast" = COALESCE("broadcast", '') WHERE "broadcast" IS NULL;

ALTER TABLE "documents" ALTER COLUMN "about1" SET NOT NULL;
ALTER TABLE "documents" ALTER COLUMN "broadcast" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "documents" ADD CONSTRAINT "documents_out_sender_employer_id_employers_id_fk"
  FOREIGN KEY ("out_sender_employer_id") REFERENCES "public"."employers"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
