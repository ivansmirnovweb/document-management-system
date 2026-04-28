# 093 — Add executor unit model and default active visibility by user unit per TZ

## Goal

Implement TZ requirement that active documents are shown by default within the user’s unit (подразделение).

## Context

Current model has no explicit `unit` for executors/users and cannot enforce unit-scoped default visibility.

## Scope

- `apps/api/src/*`
- `apps/web/src/*`
- `shared/src/*`
- DB schema/migrations/seeds
- Filters/query defaults in documents listing

## Requirements

- Add required executor/user unit field (TZ: `*<unit>`).
- Store/populate unit in seed/demo data.
- By default, active list must be scoped to current user unit (with root/system exceptions if needed).
- Keep explicit filters compatible with existing behavior.
- Update UI to show/select unit where applicable.

## Definition of done

- Unit exists in data model and API contracts.
- Default active list follows unit-scoping rule from TZ.
- Permission/filter behavior covered by checks.
- No regression for root workflows.

## Result

Date: `TBD`

Executed:

- TBD
