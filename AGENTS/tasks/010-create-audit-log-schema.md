# 010 — Create audit log schema

## Goal

Add Phase 2 Drizzle schema for document audit history.

## Context

The backend must track who changed a document, when it was changed, and what changed.

## Scope

- Create `document_audit_logs` table.
- Add links to changed actor and document.
- Add action and JSON payload for change details.
- Export schema from index.

## Requirements

- Table name: `document_audit_logs`.
- Required fields: `id`, `changed_by_id`, `action`, `changes`, `created_at`.
- Optional field: `document_id` (nullable for resilient history on hard-delete).
- `changes` must be stored as JSONB.

## Constraints

- Keep schema simple and append-only friendly.
- No audit service/controller implementation in this task.
- Avoid over-modeling; keep payload generic JSONB.

## Expected files

- `apps/api/src/db/schema/document-audit-logs.ts`
- `apps/api/src/db/schema/index.ts`

## Definition of done

- Audit log table exists and is exported.
- Actor/document links and change payload field exist.
- Migration generation includes audit table and FKs.

## Result

Date: `2026-04-25`

Executed:

- Added `document_audit_logs` schema in `apps/api/src/db/schema/document-audit-logs.ts`.
- Added `changed_by_id`, nullable `document_id`, `action`, `changes`, `created_at`.
- Added FK behavior to keep logs durable during document hard delete.
- Exported audit log schema from `apps/api/src/db/schema/index.ts`.

Observed:

- Audit persistence now supports who/when/what tracking for document lifecycle operations.
