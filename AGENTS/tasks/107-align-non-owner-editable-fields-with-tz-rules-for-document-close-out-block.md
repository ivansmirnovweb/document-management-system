# 107 — Align non-owner editable fields with TZ rules for document close-out block

## Goal

Align backend permission rules for non-owner users with TZ-defined editable fields for document close-out updates.

## Context

TZ states that users other than owner must be able to fill a specific close-out field subset when needed. Current permission checks allow a narrower field set.

## Scope

- Review TZ field-level edit rules for non-owner workflow.
- Update backend permission checks for non-owner updates.
- Keep owner/root behavior unchanged.
- Align frontend edit UX with backend-allowed fields where needed.

## Requirements

- Non-owner field access exactly matches TZ-defined close-out block.
- Forbidden updates for fields outside allowed subset remain enforced.
- Existing owner/root permissions keep current behavior.

## Constraints

- No broad refactor of documents module.
- Keep backend as source of truth for permissions.
- Keep DTO and shared contract compatibility unless strictly required by TZ.

## Expected files

- `apps/api/src/documents/document-permissions.service.ts`
- `apps/api/src/documents/documents.service.ts`
- `apps/web/src/features/documents/components/document-form-panel.tsx` (if UX alignment is needed)
- `apps/api/src/documents/*.spec.ts` (permission tests)

## Definition of done

- Non-owner editable fields are TZ-compliant.
- Permission checks are covered by tests for allowed/forbidden fields.
- No regressions in owner/root update flows.

## Result

Done. Backend non-owner update permissions aligned to TZ close-out subset; UI edit access opened for executor and non-close-out fields are read-only for non-owner edit mode; permission tests extended for allow/deny cases.

