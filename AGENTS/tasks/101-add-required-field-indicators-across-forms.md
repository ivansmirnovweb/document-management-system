# 101 — Add required-field indicators across all forms

## Goal

Make required fields explicit and consistent in all forms so users immediately understand what must be filled.

## Context

Users cannot reliably distinguish required and optional inputs in current forms, causing validation friction and confusion.

## Scope

- Define one consistent required-field pattern (e.g., `*` in label + helper text convention).
- Apply pattern to all relevant form components and screens.
- Align client-side and server-side validation messaging wording where possible.

## Requirements

- Every required field is visibly marked before submit.
- Optional fields are either explicitly marked or clearly implied by pattern.
- Validation error text is shown close to field and understandable.
- Pattern is consistent across auth, documents, employers, reports filters, and root tools where forms are present.

## Constraints

- Keep current form libraries and architecture (React Hook Form/Zod).
- No backend contract changes unless strictly necessary.
- Keep accessibility in mind (label association and screen-reader readability).

## Expected files

- `apps/web/src/features/**/components/*form*.tsx`
- `apps/web/src/shared/ui/*` (label/input/form helpers if reused)

## Definition of done

- Required markers implemented consistently in all forms.
- Form completion flow is understandable without trial-and-error.
- No functional regressions in submit/update actions.

## Result

Pending.
