# 096 — Enforce mandatory password rotation workflow every 90 days

## Goal

Implement true TZ-compliant mandatory password change cycle every 90 days.

## Context

Current implementation has 90-day session TTL and password change timestamp, but no explicit forced-rotation flow by password age.

## Scope

- `apps/api/src/auth/*`
- `apps/web/src/*` auth/profile/password UI
- `shared/src/*` auth contracts
- Middleware/guards/session checks

## Requirements

- Track password age against 90-day rule.
- Force password-change flow when expired (before normal app access).
- Keep secure session invalidation behavior.
- Preserve UX for first login/default password change if applicable.

## Definition of done

- Expired-password user cannot continue normal work until password changed.
- Post-change sessions behave correctly.
- Flow is covered by e2e/integration checks.

## Result

Date: `TBD`

Executed:

- TBD
