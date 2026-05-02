# 111 — Enforce required TZ fields for inbox record creation/update

## Goal

Enforce TZ-required inbox/document fields consistently across backend validation, shared schemas, and UI forms.

## Context

TZ marks specific record fields as mandatory, while current create/update flow allows some of them as optional or implicit defaults.

## Scope

- Map TZ required markers to concrete API/shared/UI field constraints.
- Tighten DTO and shared schema validation where needed.
- Update forms to explicitly capture and validate required fields.

## Requirements

- Required fields cannot be omitted in create flow.
- Update flow respects required constraints without breaking valid legacy behavior.
- Validation messages are clear and localized consistently.

## Constraints

- Keep migrations minimal and only if schema-level constraints are required.
- Avoid unrelated contract redesign.
- Preserve existing TZ-compliant defaults where explicitly allowed.

## Expected files

- `apps/api/src/documents/dto/create-document.dto.ts`
- `apps/api/src/documents/dto/update-document.dto.ts`
- `shared/src/schemas/document.ts`
- `apps/web/src/features/documents/components/document-form-panel.tsx`

## Definition of done

- Required TZ field set is implemented and documented.
- Backend and frontend validation are aligned.
- Tests cover missing-required-field failures.

## Result

Pending.
