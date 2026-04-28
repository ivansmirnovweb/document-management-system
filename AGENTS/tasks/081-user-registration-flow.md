# 081 — User registration flow

## Goal

Add and expose a proper user registration flow, and make self-registration support explicit and safe.

## Context

Before this task, new users were created only via database seed/manual DB operations. There was no public registration endpoint or registration page.

## Scope

- `apps/api/src/auth/*`
- `apps/api/src/config/app-config.service.ts`
- `apps/web/src/features/auth/*`
- `apps/web/src/app/(public)/register/page.tsx`
- `shared/src/schemas/auth.ts`
- `shared/src/types/auth.ts`
- `AGENTS/TASKS.md`

## Requirements

- Add backend registration endpoint for new users.
- Keep self-registration safe (no elevated role assignment from client input).
- Expose registration flow in frontend UI.
- Keep contracts synced via shared schemas/types.

## Constraints

- Keep changes scoped to auth/registration.
- Do not allow direct privileged account creation through public registration.
- Follow branch/PR workflow (no direct `main` push).

## Definition of done

- Public `POST /auth/register` exists.
- Registration creates only `USER` accounts and hashes passwords.
- Self-registration can be enabled/disabled via config flag.
- Frontend has a working register page/form and login/register cross-links.
- Lint/build/tests pass for relevant api/web gates.

## Result

Date: `2026-04-27`

Executed:

- Added `POST /auth/register` in API with new `RegisterDto` validation and `AuthService.register` implementation.
- Enforced safe behavior: role is always `USER`; username uniqueness checked; password hashed; session cookie issued on successful registration.
- Added `AUTH_SELF_REGISTRATION_ENABLED` config gate (default `false`) to explicitly control public self-signup support.
- Added shared register contracts (`registerRequestSchema`, `registerResponseSchema`, `RegisterRequest`, `RegisterResponse`).
- Added frontend `/register` page + `RegisterForm`, wired `authApi.register` and `AuthProvider.register`, and added login/register links.
- Updated `.env.example` and README with self-registration toggle note.
