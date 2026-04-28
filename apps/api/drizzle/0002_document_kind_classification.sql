DO $$ BEGIN
 CREATE TYPE "public"."document_kind" AS ENUM('INCOMING', 'OUTGOING', 'INTERNAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "kind" "document_kind";

UPDATE "documents"
SET "kind" = CASE
  WHEN "incoming_number" IS NOT NULL THEN 'INCOMING'::"document_kind"
  WHEN "outgoing_number" IS NOT NULL THEN 'OUTGOING'::"document_kind"
  ELSE 'INTERNAL'::"document_kind"
END
WHERE "kind" IS NULL;

ALTER TABLE "documents" ALTER COLUMN "kind" SET NOT NULL;

ALTER TABLE "documents" DROP CONSTRAINT IF EXISTS "documents_kind_numbers_check";
ALTER TABLE "documents"
ADD CONSTRAINT "documents_kind_numbers_check"
CHECK (
  ("kind" = 'INCOMING'::"document_kind" AND "incoming_number" IS NOT NULL AND "outgoing_number" IS NULL)
  OR ("kind" = 'OUTGOING'::"document_kind" AND "outgoing_number" IS NOT NULL AND "incoming_number" IS NULL)
  OR ("kind" = 'INTERNAL'::"document_kind" AND "incoming_number" IS NULL AND "outgoing_number" IS NULL)
);
