# 104 — Reduce protected-page loading flicker with SSR session/prefetch

## Goal

Minimize visible loading flicker and layout jumps in protected pages by moving first-load session/data work to server-assisted flow where possible.

## Context

Protected routes currently rely heavily on client-side `useQuery` fetches after render, which causes noticeable loading states and UI flicker during navigation.

## Scope

- Analyze current protected route data flow (auth/session + first document list/detail load).
- Add SSR/session-aware prefetch strategy for protected entry points.
- Hydrate prefetched data into client query cache.
- Rework global/app loading fallback behavior to avoid short flashing loader between route transitions.

Out of scope:

- Full rewrite of data architecture.
- Backend business-rule changes.

## Requirements

- Protected navigation should feel stable, with reduced first-paint loading flashes.
- Session check should not cause avoidable “guard spinner/card” flash on every transition.
- Existing permissions and route protection behavior must stay correct.
- UX fallback states should remain available for real slow/failing requests.

## Constraints

- Keep Next.js App Router architecture.
- Keep React Query as data layer.
- Do not bypass backend auth/permissions.

## Expected files

- `apps/web/src/app/(protected)/*`
- `apps/web/src/app/loading.tsx`
- `apps/web/src/features/auth/auth.provider.tsx`
- `apps/web/src/features/navigation/protected-view.tsx`
- `apps/web/src/features/documents/components/documents-page.tsx`
- `apps/web/src/app/providers.tsx` (if hydration wiring is added)

## Definition of done

- Noticeably fewer loading flashes on protected page open and transitions.
- No unnecessary global loader flash for normal fast navigation.
- No regressions in auth guard behavior.

## Result

Pending.
