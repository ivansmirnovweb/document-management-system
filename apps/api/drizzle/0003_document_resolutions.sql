CREATE TABLE IF NOT EXISTS "document_resolutions" (
  "id" serial PRIMARY KEY NOT NULL,
  "document_id" integer NOT NULL,
  "author_id" integer NOT NULL,
  "text" text NOT NULL,
  "resolution_date" timestamp NOT NULL,
  "due_date" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE "document_resolutions" ADD CONSTRAINT "document_resolutions_document_id_documents_id_fk"
  FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "document_resolutions" ADD CONSTRAINT "document_resolutions_author_id_users_id_fk"
  FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
