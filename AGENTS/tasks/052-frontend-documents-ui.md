# 052 — Phase 10: Frontend documents UI

## Goal

Implement the main document workflow UI for Phase 10.

## Context

Phase 9 is merged. The frontend foundation already exists, and Phase 10 adds the actual document screens only.

## Scope

- `apps/web/src/app/(public)/page.tsx`
- `apps/web/src/app/(protected)/dashboard/page.tsx`
- `apps/web/src/features/documents/*`
- `apps/web/src/features/employers/*` only for document form support
- `apps/web/src/features/navigation/*`
- `apps/web/src/shared/ui/*` only for small UI helpers used by the documents screens
- `AGENTS/TASKS.md`

## Requirements

- Public active documents view
- Login page access remains intact
- Active and completed document tabs
- Document create and edit forms
- Document details view
- Search UI through backend API
- Deadline and control-priority visual states
- Role/ownership-based action visibility in the UI

## Constraints

- Phase 10 only
- Do not implement Phase 11 root/report UI
- Do not change backend business rules
- Do not add unrelated dependencies
- Keep UI simple and explicit

## Expected files

- `apps/web/src/app/(public)/page.tsx`
- `apps/web/src/app/(protected)/dashboard/page.tsx`
- `apps/web/src/features/documents/*`
- `apps/web/src/features/employers/*`
- `apps/web/src/features/navigation/*`
- `apps/web/src/shared/ui/select.tsx`
- `apps/web/src/shared/ui/textarea.tsx`
- `AGENTS/TASKS.md`

## Definition of done

- Users can view active documents publicly
- Authenticated users can browse active and completed documents
- Authenticated users can create, edit, complete, and delete allowed documents
- Search works through the backend API
- Deadline and priority states are visible in the UI
- Build and lint checks pass
- Branch and PR are created through GitHub workflow

## Result

Date: `2026-04-26`

Executed:

- Replaced the homepage with a public active-documents view and made the protected dashboard the document workspace.
- Added TanStack Table-based document lists, search, details, create/edit forms, deadline badges, and control-priority row styling.
- Added minimal employer lookup support for the document form and small shared UI helpers for select/textarea.
- Verified with `pnpm --filter web lint` and `pnpm build:shared && pnpm --filter web build`.
