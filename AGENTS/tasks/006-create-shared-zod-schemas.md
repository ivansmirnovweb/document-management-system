# 006 — Create shared Zod schemas

## Goal

Add initial Phase 1 Zod schemas for shared contract validation.

## Context

Shared runtime validation is needed to keep frontend forms and backend DTO validation aligned on the same contract shapes.

## Scope

- Add `isoDateStringSchema`.
- Add schemas for:
  - `Employer`
  - `User`
  - `LoginRequest`
  - `LoginResponse`
  - `DocumentListItem`
  - `DocumentDetails`
  - `CreateDocumentInput`
  - `UpdateDocumentInput`
  - `ReportFilterInput`
- Export all schemas from shared root index.

## Requirements

- Use only `zod` and shared enums/contracts.
- Keep schemas framework-agnostic and DB-agnostic.
- Keep schema names explicit and predictable.

## Constraints

- No backend-specific decorators or frontend-specific form code.
- No broad refactor outside shared contracts area.
- Preserve KISS structure.

## Expected files

- `shared/src/schemas/common.ts`
- `shared/src/schemas/employer.ts`
- `shared/src/schemas/user.ts`
- `shared/src/schemas/auth.ts`
- `shared/src/schemas/document.ts`
- `shared/src/schemas/report.ts`
- `shared/src/index.ts`

## Definition of done

- Required Phase 1 schemas exist and compile.
- Schema exports are available from shared root.
- Shared build succeeds with new schema files.

## Result

Date: `2026-04-25`

Executed:

- Added all required Phase 1 Zod schema modules.
- Added reusable ISO date schema and used it across contracts.
- Exported schema modules from `shared/src/index.ts`.

Observed:

- Runtime validation contracts are centralized in shared package.
- Contract names map directly to Phase 1 deliverables.
- Shared package build passes with schemas included.
