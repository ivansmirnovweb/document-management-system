# 005 — Create shared types

## Goal

Add core Phase 1 shared TypeScript contracts for domain entities and API payloads.

## Context

Frontend and backend must share the same domain language for users, employers, documents, auth payloads, and report filters.

## Scope

- Add `IsoDateString` alias.
- Add entity/view types: `Employer`, `User`, `DocumentListItem`, `DocumentDetails`.
- Add API input/output types: `LoginRequest`, `LoginResponse`, `CreateDocumentInput`, `UpdateDocumentInput`, `ReportFilterInput`.
- Export all contracts from `shared/src/index.ts`.

## Requirements

- Contracts are pure TypeScript, framework-agnostic.
- `LoginResponse` excludes token field.
- Soft-delete fields use `deletedAt?: IsoDateString | null`.
- No deep import required for shared consumers.

## Constraints

- Keep types explicit and readable.
- Avoid broad refactor and unrelated model expansion.
- Keep naming consistent with Phase 1 roadmap.

## Expected files

- `shared/src/types/common.ts`
- `shared/src/types/employer.ts`
- `shared/src/types/user.ts`
- `shared/src/types/auth.ts`
- `shared/src/types/document.ts`
- `shared/src/types/report.ts`
- `shared/src/index.ts`

## Definition of done

- All required Phase 1 type contracts exist.
- Contracts are exported from shared root.
- Types compile in shared package build.

## Result

Date: `2026-04-25`

Executed:

- Added all required Phase 1 domain and API type contracts.
- Introduced `IsoDateString` alias and applied it to date/time fields.
- Updated shared root exports for all new type files.

Observed:

- Required contracts are available from `@document-flow/shared`.
- `LoginResponse` includes only `user` payload (no token).
- Soft-delete date modeling uses `deletedAt?: IsoDateString | null` where applicable.
