# 114 — Fix backend code review iteration 1 critical/high issues (create kind contract, audit stamps, transactions, resolution 404 semantics)

## Goal

Close Iteration 1 correctness/safety issues from backend review in `apps/api` without large architectural refactor.

## Context

`AGENTS/reviews/backend-code-review.md` identified critical/high issues in document create contract consistency, audit field updates, transactional safety for multi-step resolution mutations, and missing not-found semantics.

## Scope

- Fix create-flow contract mismatch for document kind fields.
- Ensure `lastChangedAt/lastChangedById` consistency on document/resolution mutation paths.
- Add transactions for multi-step document + resolution writes.
- Enforce `404 NotFound` semantics for absent resolution in update/delete endpoints.

## Requirements

- `CreateDocumentDto` must not require outgoing-only fields for incoming/internal kinds.
- Backend mutation paths touched in this task must update immutable last-change metadata consistently.
- Multi-step resolution operations must be atomic.
- Resolution update/delete for absent target must return not found behavior.

## Constraints

- Ownership only in `apps/api/**`; `shared/**` only for strict contract alignment.
- No broad service decomposition/refactor.
- Preserve existing permissions/business rules.

## Expected files

- `apps/api/src/documents/dto/create-document.dto.ts`
- `apps/api/src/documents/documents.service.ts`
- `shared/src/schemas/document.ts`

## Definition of done

- Contradiction in create-flow kind validation is removed.
- `lastChangedAt/lastChangedById` is updated in previously missing mutation paths.
- Resolution multi-step operations are transactional.
- Resolution update/delete return `NotFoundException` when target is absent.
- Backend checks (typecheck/tests) pass for touched scope.

## Result

Done. Create payload contract was aligned to kind rules by removing unconditional outgoing-field requirement in backend DTO and shared create schema; document update/resolution update/delete now maintain consistent audit stamps (`updatedAt`, `lastChangedAt`, `lastChangedById`); resolution create/update/delete now use DB transactions for atomic document+resolution changes; update/delete resolution now throw `NotFoundException` when resolution is absent.
