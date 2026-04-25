# 012 — Create initial seed

## Goal

Provide initial reproducible seed data for Phase 2 schema.

## Context

Seed data is required for development and demonstration scenarios before full business modules are implemented.

## Scope

- Add DB seed script entry in `apps/api/package.json`.
- Implement seed entrypoint in backend DB layer.
- Seed minimum dataset:
  - 1 root user
  - several regular users
  - several employers
  - several documents covering workflow states

## Requirements

- Seed command must run from API package scripts.
- Documents dataset must include:
  - active `NOT_DONE`
  - `DONE` with `completed_at`
  - control document (`is_control = true`)
  - document with `employer_id = null`
  - soft-deleted document (`deleted_at` set)
- Data should be deterministic enough for local QA.

## Constraints

- No real secrets in seed.
- Keep implementation simple and idempotent for local reruns.
- No broad infrastructure refactor.

## Expected files

- `apps/api/package.json`
- `apps/api/src/db/seed.ts`

## Definition of done

- `db:seed` script exists in API package.
- Seed inserts required users, employers, and documents.
- Seed supports local rerun by clearing dependent tables in safe order.

## Result

Date: `2026-04-25`

Executed:

- Added `db:seed` script to `apps/api/package.json`.
- Implemented `apps/api/src/db/seed.ts` with deterministic sample data.
- Seed now creates root/regular users, employers, documents, and sample audit logs.
- Added document coverage for required states (done, not done, control, null employer, soft-deleted).

Observed:

- Project now has a runnable DB seed baseline for backend and UI integration testing.
