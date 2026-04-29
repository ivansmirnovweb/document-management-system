# 099 — Move record details to a right slide-over sidebar

## Goal

Replace always-visible details panels with a right slide-over sidebar so data tables keep maximum horizontal space.

## Context

Current pages render list/table and details side-by-side. The details section consumes a large part of the viewport, making tables too narrow and reducing usability.

## Scope

- Introduce a reusable right slide-over sidebar pattern for record details.
- Open sidebar on row/item click.
- Use this behavior on pages where details are currently shown as a permanent second column (documents and similar record pages).
- Keep create/edit flows consistent with existing permissions and actions.

Out of scope:

- Full visual redesign of pages not affected by details panels.
- Changes to backend contracts or business rules.

## Requirements

- Table/list area should use full available width by default.
- Details must appear in a right sidebar overlay (slide-in/out).
- Sidebar must be closable by:
  - explicit close button,
  - backdrop click,
  - `Esc` key.
- Mobile behavior:
  - sidebar must be responsive and usable on small screens.
- Preserve current details content/actions for selected record.
- Keep accessibility baseline (focus handling, keyboard navigation, ARIA labels).

## Constraints

- Keep implementation simple and maintainable (KISS/SOLID).
- Do not duplicate business logic in UI components.
- Do not introduce unrelated dependencies.

## Expected files

- `apps/web/src/features/**/components/*page*.tsx`
- `apps/web/src/features/**/components/*details*.tsx`
- `apps/web/src/shared/ui/*` (if reusable slide-over component is extracted)
- Optional docs update if UX behavior is documented

## Definition of done

- Affected pages no longer reserve permanent width for details panes.
- Selecting a record opens right slide-over with corresponding details.
- Sidebar close interactions work (button, backdrop, `Esc`).
- Table readability improves on desktop (no forced narrow layout).
- No regressions in existing record actions from details view.

## Result

Pending.
