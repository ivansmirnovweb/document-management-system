# 046 — Phase 9: Frontend foundation

## Goal

Prepare the frontend application structure and API integration for Phase 9.

## Context

Phase 8 is merged. The backend already exposes auth, documents, employers, and reports APIs. This task adds the frontend foundation only, without moving into document UI screens.

## Scope

- `apps/web/src/app/*`
- `apps/web/src/features/auth/*`
- `apps/web/src/features/navigation/*`
- `apps/web/src/lib/*`
- `apps/web/src/shared/ui/*`
- `shared/src/index.ts` only if a type-only export cleanup is needed for frontend build noise
- `AGENTS/TASKS.md`

## Requirements

- Add app layout and global providers
- Set up TanStack Query
- Create a dedicated API client with cookie auth and shared contracts
- Expose auth state in the UI
- Add basic navigation
- Add a protected UI pattern
- Provide clear loading/error states

## Constraints

- Phase 9 only
- Do not implement Phase 10 document screens
- Do not add unrelated dependencies
- Keep business logic in the backend
- Keep UI simple and explicit

## Expected files

- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/providers.tsx`
- `apps/web/src/app/loading.tsx`
- `apps/web/src/app/error.tsx`
- `apps/web/src/features/auth/*`
- `apps/web/src/features/navigation/*`
- `apps/web/src/lib/*`
- `apps/web/src/shared/ui/*`
- `AGENTS/TASKS.md`

## Definition of done

- Frontend can call backend auth endpoints
- Auth state is visible in the UI
- Basic layout and navigation exist
- Protected UI areas are guarded
- Build and lint checks pass
- Branch and PR are created through GitHub workflow

## Result

Date: `2026-04-26`

Executed:

- Added a Next.js App Router shell with shared providers, layout, loading, and error states.
- Implemented a typed API client with cookie-based auth and TanStack Query session state.
- Added public and protected routes, navigation, login form, and auth status UI.
- Cleaned `shared/src/index.ts` type-only exports to remove Next build warnings.
- Verified with `pnpm --filter web lint` and `pnpm build:shared && pnpm --filter web build`.
