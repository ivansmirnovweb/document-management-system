# 013 — Phase 4: Authentication and users

## Goal

Implement Phase 4 authentication and user session handling for the API.

## Context

The backend already has the users table and role enum. This phase adds cookie-based JWT auth, login/logout/me endpoints, and password-change flow.

## Scope

- `apps/api` auth module, controller, service, and guard
- Shared auth contracts only if needed for request/response shapes
- Seed/default-password behavior only as required for auth flow

## Requirements

- Login via username/password
- Logout by clearing the auth cookie
- Me endpoint returns current session user
- JWT stored in httpOnly cookie
- Roles supported: ROOT and USER
- Passwords hashed with bcrypt
- Default password behavior supported for seeded users
- Password change flow supported
- Password age tracked for 90-day expiration handling

## Constraints

- Keep scope limited to Phase 4
- Do not touch Phase 5+ document logic
- No broad refactor outside auth/user session work

## Expected files

- `apps/api/src/auth/*`
- `apps/api/src/common/*` only if needed for auth wiring
- `apps/api/src/db/seed.ts`
- `shared/src/*` only if needed for auth contracts
- `AGENTS/TASKS.md`

## Definition of done

- Auth endpoints exist and work with cookie-based JWTs
- Password change updates hash and timestamp
- Session user payload excludes password hash
- Validation/tests/build pass
- Branch and PR are created through GitHub workflow

## Result

Date: `2026-04-26`

Executed:

- Added cookie-based auth module, controller, service, and guard.
- Implemented login, logout, me, and change-password flows.
- Added JWT cookie session handling, bcrypt password checks, and password-change invalidation.
- Seed users now use the shared default password with `passwordChangedAt = null`.
- Added shared auth contract for change-password input/output.
- Verified with build, lint, and test runs.
