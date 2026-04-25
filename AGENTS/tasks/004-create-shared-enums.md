# 004 — Create shared enums

## Goal

Finalize and verify core shared enums for Phase 1 domain language.

## Context

Phase 1 requires stable cross-layer enum contracts for roles and document lifecycle status before adding richer types and schemas.

## Scope

- Confirm `UserRole` enum values.
- Confirm `DocumentStatus` enum values.
- Ensure enum exports are available from shared root index.

## Requirements

- `UserRole` supports `USER` and `ROOT`.
- `DocumentStatus` supports `NOT_DONE` and `DONE`.
- Enums are importable from `@document-flow/shared` (no deep imports).

## Constraints

- Keep shared package framework-agnostic.
- Do not add backend-only/frontend-only logic.
- Do not introduce unrelated enum changes.

## Expected files

- `shared/src/enums/user-role.ts`
- `shared/src/enums/document-status.ts`
- `shared/src/index.ts`

## Definition of done

- Required enums exist and match Phase 1 assumptions.
- Enums are exported from shared package root.

## Result

Date: `2026-04-25`

Executed:

- Validated existing `UserRole` and `DocumentStatus` values.
- Confirmed root exports from `shared/src/index.ts`.

Observed:

- `UserRole` is aligned: `USER | ROOT`.
- `DocumentStatus` is aligned: `NOT_DONE | DONE`.
- Enums are available via package root import path.
