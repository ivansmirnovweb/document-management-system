# 080 — SSR first-load data for public index and reduce duplicate client requests

## Goal

Reduce unnecessary client-side requests on the public index route by moving first-load fetches to server rendering where possible.

## Context

The public home page rendered a client component that fetched both:
- the public documents list, and
- the first selected document details

on mount, causing duplicate first-load client network activity that can be served during SSR.

## Scope

- `apps/web/src/app/(public)/page.tsx`
- `apps/web/src/features/documents/components/documents-page.tsx`
- `apps/web/src/features/documents/documents.api.ts`
- `AGENTS/TASKS.md`

## Requirements

- Fetch initial public list on the server for index route.
- Fetch initial selected public document details on the server when list is non-empty.
- Hydrate these results into client queries so mount does not re-request same data immediately.
- Preserve existing UI behavior and permissions.

## Constraints

- Keep changes focused to index/public data-loading path.
- No unrelated refactors.
- Validate with web lint/build gates.

## Definition of done

- Public index first load is server-fetched and passed to client as initial query data.
- Initial duplicate client requests for list/details are removed or materially reduced.
- `AGENTS/TASKS.md` marks 080 done with brief result.
- Web lint/build gates pass.

## Result

Date: `2026-04-27`

Executed:

- Implemented server-side first-load fetch in `app/(public)/page.tsx` for public list and first document details using no-store fetch semantics.
- Extended `documentsApi.listPublic` and `documentsApi.getPublicById` to accept optional request options for SSR fetch control.
- Added `initialPublicList` and `initialPublicDocument` props in `DocumentsPage` and wired them into React Query `initialData`, preventing immediate duplicate client requests on page boot.
- Updated `AGENTS/TASKS.md`: task 080 marked done and result added.
