# 007 — Create users schema

## Goal

Add Phase 2 Drizzle schema for application users with role and password tracking fields.

## Context

Users are required for authentication, ownership, execution assignments, and role-based permissions.

## Scope

- Create `users` table in Drizzle schema.
- Add role enum with `USER` and `ROOT`.
- Include password hash and password change tracking fields.
- Export table from schema index.

## Requirements

- Table name: `users`.
- Required fields: `id`, `username`, `display_name`, `role`, `password_hash`, `password_changed_at`, `created_at`, `updated_at`.
- `username` must be unique.
- `role` must be constrained to `USER | ROOT`.

## Constraints

- Keep implementation backend-only.
- Keep structure explicit and simple (KISS).
- No auth module/controller changes in this task.

## Expected files

- `apps/api/src/db/schema/users.ts`
- `apps/api/src/db/schema/index.ts`

## Definition of done

- `users` Drizzle schema exists and is exported.
- Role enum and uniqueness constraints are applied.
- Migration generation includes users schema changes.

## Result

Date: `2026-04-25`

Executed:

- Added `users` table schema in `apps/api/src/db/schema/users.ts`.
- Added `user_role` enum with `USER` and `ROOT`.
- Included password fields and tracking timestamps.
- Exported users schema from `apps/api/src/db/schema/index.ts`.

Observed:

- Users schema now supports role/identity and password lifecycle tracking for upcoming auth phase.
