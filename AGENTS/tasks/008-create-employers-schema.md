# 008 — Create employers schema

## Goal

Add Phase 2 Drizzle schema for employers (counterparties).

## Context

Documents can be linked to external counterparties. Employers must support base profile data and soft-delete tracking.

## Scope

- Create `employers` table in Drizzle schema.
- Include legal/actual addresses and naming fields.
- Include `deleted_at` for soft-delete support.
- Export table from schema index.

## Requirements

- Table name: `employers`.
- Required fields: `id`, `full_name`, `short_name`, `legal_address`, `actual_address`, `created_at`, `updated_at`.
- Optional soft-delete field: `deleted_at`.

## Constraints

- Keep table narrowly focused on required fields.
- No employers business logic outside schema layer in this task.
- No broad refactor.

## Expected files

- `apps/api/src/db/schema/employers.ts`
- `apps/api/src/db/schema/index.ts`

## Definition of done

- `employers` Drizzle schema exists and is exported.
- Soft-delete field is present for future restore flows.
- Migration generation includes employers schema changes.

## Result

Date: `2026-04-25`

Executed:

- Added `employers` table schema in `apps/api/src/db/schema/employers.ts`.
- Added required counterparty fields and timestamps.
- Added `deleted_at` for soft-delete state.
- Exported employers schema from `apps/api/src/db/schema/index.ts`.

Observed:

- Employers schema matches shared contract shape and supports document linking.
