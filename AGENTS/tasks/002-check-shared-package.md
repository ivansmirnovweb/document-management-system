# 002 — Check shared package

## Goal

Verify that the shared package builds correctly and is consumable by both backend and frontend.

## Context

Phase 0 requires a working shared package baseline before Phase 1 domain contracts are implemented.

## Scope

- Build shared package from root script.
- Validate compile-time integration through backend and frontend builds.

## Requirements

- `pnpm build:shared` succeeds.
- Backend build succeeds with shared dependency.
- Frontend build succeeds with shared dependency.

## Constraints

- Do not add new domain contracts in this phase.
- Fix only build/export/wiring issues if they block foundation checks.
- Keep shared package framework-agnostic.

## Expected files

- `shared/package.json`
- `shared/src/index.ts`
- `apps/api/package.json`
- `apps/web/package.json`

## Definition of done

- Shared package builds successfully.
- Shared package import path works in both frontend and backend build pipelines.

## Result

Date: `2026-04-25`

Executed:

- `pnpm build:shared`
- `pnpm --filter api build`
- `pnpm --filter web build` (required outside sandbox due environment `spawn EPERM`)

Observed:

- Shared build succeeded.
- API build succeeded.
- Web production build succeeded.

Code/config fixes were not required for this task.
