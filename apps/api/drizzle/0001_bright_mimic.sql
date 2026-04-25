CREATE TYPE "public"."user_role" AS ENUM('USER', 'ROOT');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('NOT_DONE', 'DONE');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"password_changed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "employers" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"short_name" varchar(255) NOT NULL,
	"legal_address" varchar(500) NOT NULL,
	"actual_address" varchar(500) NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"registration_number" varchar(100) NOT NULL,
	"registration_date" timestamp NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"incoming_number" varchar(100),
	"outgoing_number" varchar(100),
	"employer_id" integer,
	"owner_id" integer NOT NULL,
	"executor_id" integer NOT NULL,
	"status" "document_status" DEFAULT 'NOT_DONE' NOT NULL,
	"due_date" timestamp NOT NULL,
	"completed_at" timestamp,
	"is_control" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "documents_registration_number_unique" UNIQUE("registration_number")
);
--> statement-breakpoint
CREATE TABLE "document_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer,
	"changed_by_id" integer NOT NULL,
	"action" varchar(100) NOT NULL,
	"changes" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_employer_id_employers_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."employers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_executor_id_users_id_fk" FOREIGN KEY ("executor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_audit_logs" ADD CONSTRAINT "document_audit_logs_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_audit_logs" ADD CONSTRAINT "document_audit_logs_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;