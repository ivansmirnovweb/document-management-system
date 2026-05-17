# Backend Code Review: `apps/api`

## Scope
- Reviewed: `apps/api/src/**` (NestJS backend code, guards, DTOs, services, filters, controllers, tests).
- Reviewed partially: `shared/src/**` only where contracts/schemas directly affect backend behavior.
- Not changed: application code. Only this review file is created/updated.

## Findings

### 1) [Critical] API create-flow for document kinds is internally contradictory (incoming/internal creation can be blocked)
- Severity: Critical
- File: `apps/api/src/documents/dto/create-document.dto.ts:45`, `apps/api/src/documents/dto/create-document.dto.ts:49`, `apps/api/src/documents/documents.service.ts:468`, `apps/api/src/documents/documents.service.ts:1428`
- Risk: `CreateDocumentDto` requires `outgoingNumber` and `outgoingDate` for all creates, while `validateKindFields` forbids outgoing fields for `INCOMING` and `INTERNAL`. This creates a hard conflict in API contract and business rules, and can make legal create scenarios impossible through the API.
- Recommendation: Align DTO with domain rules per kind. Make kind-dependent validation explicit (custom validator or service-level validator before persistence) and ensure `shared` schemas match exactly.

### 2) [High] `lastChangedAt/lastChangedById` is not consistently updated on document modifications
- Severity: High
- File: `apps/api/src/documents/documents.service.ts:579`, `apps/api/src/documents/documents.service.ts:650`, `apps/api/src/documents/documents.service.ts:726`, `apps/api/src/documents/documents.service.ts:778`
- Risk: Core audit metadata becomes stale/inaccurate for normal update paths and resolution edit/delete paths. This violates immutable "last change" expectations and degrades traceability.
- Recommendation: Centralize audit-stamp update in one helper (or repository layer) and enforce it for every write path affecting a document.

### 3) [High] Multi-step write operations are not transactional
- Severity: High
- File: `apps/api/src/documents/documents.service.ts:683`, `apps/api/src/documents/documents.service.ts:693`, `apps/api/src/documents/documents.service.ts:764`, `apps/api/src/documents/documents.service.ts:773`, `apps/api/src/documents/documents.service.ts:778`
- Risk: Partial updates can leave inconsistent state (`resolution` inserted but `isControl`/audit not updated, or vice versa) on runtime failures/races.
- Recommendation: Wrap coupled operations in `db.transaction(...)` and commit document + resolution updates atomically.

### 4) [Medium] Resolution update/delete does not verify affected rows
- Severity: Medium
- File: `apps/api/src/documents/documents.service.ts:732`, `apps/api/src/documents/documents.service.ts:764`
- Risk: API may return success with unchanged data if `resolutionId` does not exist for document, producing false-positive client behavior and weak error semantics.
- Recommendation: Use `.returning()` and throw `NotFoundException` when no row was affected.

### 5) [Medium] `DocumentsService` is a God-class (1344 LOC) with mixed responsibilities
- Severity: Medium
- File: `apps/api/src/documents/documents.service.ts:1`
- Risk: Violates SRP/KISS, raises change risk, increases regression probability, and makes testing difficult.
- Recommendation: Split into focused services/repositories:
  - query/read service
  - command/write service
  - resolution service
  - mapper/assembler for API DTOs
  - validation policy service

### 6) [Medium] Contract drift between `shared` and backend DTO/types
- Severity: Medium
- File: `shared/src/types/document.ts:59`, `shared/src/schemas/document.ts:62`, `apps/api/src/documents/dto/create-document.dto.ts:45`
- Risk: Different optionality/requirements across shared type/schema/backend DTO causes integration bugs and hidden runtime mismatches.
- Recommendation: Define a single source of truth for create/update payloads (prefer shared zod schema + derived TS types), then map to backend DTO validation consistently.

### 7) [Low] Observability gap in global exception filter
- Severity: Low
- File: `apps/api/src/common/filters/all-exceptions.filter.ts:40`
- Risk: Unexpected server errors are hidden from logs in filter itself, complicating incident triage.
- Recommendation: Add structured logging for non-HTTP exceptions (with correlation/request metadata, without leaking secrets).

### 8) [Low] Test coverage is fragmented; critical business workflows in `DocumentsService` are mostly untested
- Severity: Low
- File: `apps/api/src/documents/documents.service.ts:462`, `apps/api/src/documents/documents.service.ts:521`, `apps/api/src/documents/documents.service.ts:905`, `apps/api/src/documents/documents.service.ts:941`
- Risk: Regressions in permissions/lifecycle/audit logic likely remain unnoticed.
- Recommendation: Add unit/integration tests for create/update/status/write-off/delete/restore/hard-delete + resolution lifecycle + transactional rollback cases.

## Large Files Audit

| File | LOC | Why problematic | Refactor target |
|---|---:|---|---|
| `apps/api/src/documents/documents.service.ts` | 1344 | Mixed read models, writes, validation, permissions orchestration, mapping, and audit updates in one class | Split into `documents-query.service`, `documents-command.service`, `document-resolutions.service`, `document-mapper.ts`, `document-policy.service` |
| `apps/api/src/db/seed.ts` | 539 | Very large seed script likely hard to evolve and verify deterministically | Split by entity/domain with shared seed helpers + deterministic fixtures |
| `apps/api/src/reports/reports.service.ts` | 234 | Query building + analytics + CSV rendering in one service | Separate query layer from report calculators/export formatter |
| `apps/api/src/auth/auth.service.ts` | 220 | Auth, session cookies, password policy, user mapping all in one place | Separate `auth-session.service`, `auth-user.service`, password-policy utility |
| `apps/api/src/documents/documents.controller.ts` | 155 | Broad endpoint surface tied to single service hotspot | Keep controller thin but route methods by feature sub-controller (resolutions/status/lifecycle) |

## Quick Wins
1. Fix `CreateDocumentDto`/kind validation contradiction first.
2. Add `lastChangedAt/lastChangedById` updates to all update/resolution paths.
3. Wrap create/update/delete resolution flows in DB transactions.
4. Ensure `updateResolution`/`deleteResolution` throw 404 when resolution is absent.
5. Extract duplicated select-shapes/mappers for document list/details.
6. Introduce typed repository helpers for document fetch/write operations.
7. Add tests for document lifecycle edge cases (deleted, done, write-off, restore).
8. Add tests for per-role/per-owner/per-executor permission matrix.
9. Add structured logging inside global exception filter for unknown errors.
10. Add contract consistency checks between `shared` schemas and backend DTOs.

## Suggested Refactor Plan

### Iteration 1 (Safety + correctness)
- Resolve create DTO vs kind-rule conflict.
- Fix audit fields (`lastChanged*`) for all mutation paths.
- Add missing 404 semantics for resolution update/delete.
- Introduce transactions for multi-step resolution/document updates.

### Iteration 2 (Architecture)
- Split `DocumentsService` into query/command/resolution components.
- Extract mapping layer (`row -> DocumentListItem/DocumentDetails`) to dedicated pure functions.
- Extract validation/policy checks into focused domain policy service(s).

### Iteration 3 (Contracts + tests)
- Unify shared/backend payload contracts (single source of truth).
- Add integration tests for full document lifecycle and permission matrix.
- Add regression tests for report filters (`selectedIds`, date range, includeDeleted).

### Iteration 4 (Maintainability)
- Refactor large seed script into domain fixture modules.
- Add lightweight architecture docs for backend boundaries and mutation invariants.
