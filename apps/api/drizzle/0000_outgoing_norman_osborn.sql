CREATE TABLE "health_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
