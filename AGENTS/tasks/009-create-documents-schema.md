# 009 — Create documents schema

## Goal

Add Phase 2 Drizzle schema for document records used in workflow lifecycle.

## Context

Documents are the core business entity and must support registration, ownership, execution, status tracking, control priority, archive behavior, and soft delete.

## Scope

- Create `documents` table and document status enum.
- Add owner, executor, employer references.
- Add lifecycle fields (`status`, `due_date`, `completed_at`, `is_control`, `deleted_at`).
- Export schema from index.

## Requirements

- Table name: `documents`.
- Required fields: `id`, `registration_number`, `registration_date`, `title`, `owner_id`, `executor_id`, `status`, `due_date`, `is_control`, `created_at`, `updated_at`.
- Optional fields: `description`, `incoming_number`, `outgoing_number`, `employer_id`, `completed_at`, `deleted_at`.
- `status` constrained to `NOT_DONE | DONE`.
- `registration_number` unique.

## Constraints

- Keep business logic out of schema (only data model and constraints).
- Keep soft delete represented by `deleted_at`.
- No broad changes outside DB schema area.

## Expected files

- `apps/api/src/db/schema/documents.ts`
- `apps/api/src/db/schema/index.ts`

## Definition of done

- `documents` schema exists and is exported.
- Required lifecycle and assignment columns are present.
- Migration generation includes documents table and enum.

## Result

Date: `2026-04-25`

Executed:

- Added `documents` table schema in `apps/api/src/db/schema/documents.ts`.
- Added `document_status` enum and unique registration number.
- Added owner/executor/employer references plus lifecycle fields.
- Exported documents schema from `apps/api/src/db/schema/index.ts`.

Observed:

- Core document workflow state is now represented in PostgreSQL schema.
