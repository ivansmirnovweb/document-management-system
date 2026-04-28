# 078 — Fix light-theme contrast and surface readability

## Goal

Improve readability in the light theme by removing dark hero blocks and fixing low-contrast UI states.

## Context

Several screens used near-black surfaces and black-focused accents in the light theme, causing inconsistent readability and visual contrast.

## Scope

- `apps/web/src/features/documents/components/documents-page.tsx`
- `apps/web/src/features/root/components/root-deleted-documents-page.tsx`
- `apps/web/src/features/reports/components/reports-page.tsx`
- `apps/web/src/features/navigation/main-navigation.tsx`
- `apps/web/src/features/auth/components/auth-status-panel.tsx`
- `apps/web/src/features/documents/components/documents-table.tsx`
- `apps/web/src/features/root/components/deleted-documents-table.tsx`
- `apps/web/src/shared/ui/button.tsx`
- `apps/web/src/shared/ui/input.tsx`
- `apps/web/src/shared/ui/select.tsx`
- `apps/web/src/shared/ui/textarea.tsx`
- `apps/web/src/shared/ui/state-card.tsx`
- `apps/web/src/app/globals.css`
- `AGENTS/TASKS.md`

## Requirements

- Remove black-on-black hero/header treatment in light theme pages.
- Keep text readable on all updated surfaces.
- Tune primary action and focus colors for better visibility on light backgrounds.
- Keep current UX flows and permissions unchanged.

## Constraints

- Frontend-only change.
- No business-logic changes.
- No unrelated refactors.
- Keep styles simple and consistent with existing Tailwind patterns.

## Expected files

- Files listed in Scope.

## Definition of done

- Dark hero blocks replaced with readable light surfaces on affected screens.
- Primary actions and active states are visually distinct and accessible in light theme.
- Form focus states are clearly visible.
- Lint/build checks for web app pass.
- Task 078 marked done in `AGENTS/TASKS.md`.

## Result

Date: `2026-04-27`

Executed:

- Replaced dark page header cards in documents, root deleted records, and reports with light tinted surfaces and higher-contrast text.
- Updated primary/active UI accents from near-black to blue, including buttons, nav active links, state-card action links, selected table row rings, and input/select/textarea focus rings.
- Tuned tab counters and base light-theme tokens to avoid low-contrast black-on-dark visual states while preserving all existing behavior.
