# 011 — Create db relations

## Goal

Define Drizzle relations between users, employers, documents, and audit logs.

## Context

Explicit relations are needed for predictable joins and typed query composition in later backend modules.

## Scope

- Add relation mappings:
  - `documents.owner_id -> users.id`
  - `documents.executor_id -> users.id`
  - `documents.employer_id -> employers.id`
  - `document_audit_logs.changed_by_id -> users.id`
  - `document_audit_logs.document_id -> documents.id`
- Export relation definitions through schema index.

## Requirements

- Use `relations(...)` from Drizzle.
- Distinguish owner and executor relations by relation names.
- Keep `document_id` relation nullable-aware.

## Constraints

- Relation layer only, no service-level query changes.
- Keep relation names explicit and readable.
- Do not modify unrelated backend modules.

## Expected files

- `apps/api/src/db/schema/relations.ts`
- `apps/api/src/db/schema/index.ts`

## Definition of done

- All required core relations are defined.
- Relations compile and are available through schema exports.
- Generated migration contains expected foreign keys.

## Result

Date: `2026-04-25`

Executed:

- Added `apps/api/src/db/schema/relations.ts` with all Phase 2 core relations.
- Configured owner/executor relation names to avoid ambiguity.
- Exported relations from `apps/api/src/db/schema/index.ts`.

Observed:

- Backend now has typed relation map for core document workflow entities.
