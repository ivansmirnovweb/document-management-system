# 113 — Close full PDF TZ compliance gaps after code audit (API/UI/contracts)

## Goal

Bring current implementation to full compliance with the original technical specification from `docs/Задачник_new.pdf` based on code-level audit findings.

## Context

Audit against the PDF (not backlog status) found several concrete mismatches in backend authorization/validation, restore flow, and frontend export workflow.

## Scope

- Enforce restore flow as root-only action with mandatory owner assignment in a single operation.
- Enforce root-only authorization for reports endpoints at backend level.
- Implement multi-select documents export flow (select records in list and export selected subset).
- Align non-owner editable field permissions with PDF close-out field subset.
- Align required inbox fields validation across backend DTOs, shared schemas, and frontend forms.
- Resolve remaining PDF-critical contract mismatches surfaced by audit (including default credentials policy if still required by project acceptance rules).

## Requirements

- `PATCH /documents/:id/restore` must require explicit owner assignment payload and apply it atomically.
- Reports endpoints must return forbidden for authenticated non-root users.
- User must be able to select multiple records in UI and export exactly selected records.
- Non-owner editable fields must match the PDF close-out block exactly.
- Required inbox fields from PDF must be strictly validated at API contract level and reflected in UI.
- Behavior must be covered by automated tests for access matrix and validation failures.

## Constraints

- Keep backend as source of truth for authorization and business rules.
- No broad refactoring outside documents/reports/auth related scope.
- Preserve existing lifecycle rules (soft delete, archive, restore, audit fields) unless directly required by PDF.
- Maintain TypeScript contracts consistency between `apps/api`, `apps/web`, and `shared`.

## Expected files

- `apps/api/src/documents/dto/*`
- `apps/api/src/documents/documents.controller.ts`
- `apps/api/src/documents/documents.service.ts`
- `apps/api/src/documents/document-permissions.service.ts`
- `apps/api/src/reports/reports.controller.ts`
- `apps/api/src/reports/reports.service.ts` (if export contract expands to selected IDs)
- `shared/src/schemas/document.ts`
- `shared/src/types/document.ts`
- `shared/src/schemas/report.ts` and `shared/src/types/report.ts` (if export contract changes)
- `apps/web/src/features/documents/components/documents-table.tsx`
- `apps/web/src/features/documents/components/documents-page.tsx`
- `apps/web/src/features/documents/components/document-form-panel.tsx`
- `apps/web/src/features/reports/*` (if export UX/API usage is adjusted)
- Relevant specs/e2e tests in `apps/api/src/**` and `apps/web/src/**` (where applicable)

## Definition of done

- Audit gaps are closed in code and verified by tests.
- Backend access control is sufficient even if frontend restrictions are bypassed.
- Restore, reports access, required fields, non-owner permissions, and multi-select export match PDF behavior.
- Documentation/contracts are updated where behavior or API changes.

## Result

Done. Closed audited PDF gaps in code: restore now requires explicit owner assignment; reports endpoints are root-only in backend; multi-select export from documents list is implemented end-to-end; non-owner editable subset is aligned to close-out fields; required inbox field checks were tightened in DTO/shared/API/UI flow; deleted-search visibility was made role-deterministic.
