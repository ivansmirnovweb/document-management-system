# 105 — Move document creation to a right slide-over sidebar

## Goal

Open document creation in a right slide-over sidebar instead of rendering the form inline/below list content.

## Context

Current create flow appears in-page and is easy to miss, which makes UX confusing and disrupts table/list workflow.

## Scope

- Trigger create action to open right sidebar.
- Render `DocumentFormPanel` in create mode inside sidebar.
- Keep list/table visible in background without losing context.
- Preserve submit/cancel behavior and existing permissions.

## Requirements

- “Создать документ” opens a right slide-over panel.
- Sidebar supports close by:
  - close button,
  - backdrop click,
  - `Esc`.
- On successful create:
  - sidebar closes (or transitions to details per UX decision),
  - list refreshes and selects created record.
- Mobile layout must remain usable.

## Constraints

- Keep current validation/business rules.
- Do not duplicate form logic.
- Prefer reusable sidebar component/pattern aligned with task `099`.

## Expected files

- `apps/web/src/features/documents/components/documents-page.tsx`
- `apps/web/src/features/documents/components/document-form-panel.tsx`
- `apps/web/src/shared/ui/*` (if shared slide-over component is extracted/reused)

## Definition of done

- Create flow is fully accessible via right sidebar.
- No inline “hard to notice” create form placement remains.
- Existing create behavior and permissions continue to work.

## Result

Pending.
