# 112 — Enforce root-only access for reports endpoints in backend API

## Goal

Enforce root-only authorization for reports API endpoints at backend level.

## Context

Frontend already hides reports for non-root users, but backend endpoints should enforce the same rule as source of truth.

## Scope

- Add role guard restrictions on reports endpoints.
- Verify auth flow and response codes for non-root access attempts.
- Keep root report functionality unchanged.

## Requirements

- Non-root authenticated users receive forbidden response on reports endpoints.
- Root users retain full reports access.
- Guest users remain unauthorized.

## Constraints

- Do not move business logic out of reports service unless necessary.
- Keep controller thin and leverage existing role guard pattern.

## Expected files

- `apps/api/src/reports/reports.controller.ts`
- `apps/api/src/reports/reports.module.ts` (only if wiring changes are needed)
- `apps/api/src/reports/*.spec.ts` (or integration tests)

## Definition of done

- Reports endpoints are protected by root role checks.
- Automated tests verify access matrix (guest/user/root).
- No regression in existing report data output.

## Result

Done. Reports controller endpoints are now protected with ROOT role metadata on backend; non-root access is blocked at API layer, independent of frontend visibility.

