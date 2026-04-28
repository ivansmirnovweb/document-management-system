# 079 — Fix frontend-to-API connection failure

## Goal

Find and fix why the frontend cannot reach the API during startup or requests.

## Context

Current failure observed in API process startup:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../shared/dist/enums/user-role' imported from .../shared/dist/index.js
```

This indicates the API crashes before serving requests because the shared package output contains ESM import paths that are not resolvable in Node runtime.

## Scope

- `shared/src/index.ts`
- `shared/src/schemas/*`
- `shared/src/types/*`
- `shared` build output verification (`dist/index.js`)
- `AGENTS/TASKS.md`

## Requirements

- API starts without module resolution errors.
- `shared/dist/index.js` resolves all imported files it references.
- Frontend requests can reach the API once backend is running.
- Document exact root cause and fix.

## Definition of done

- Reproducible startup succeeds.
- No `ERR_MODULE_NOT_FOUND` from shared dist imports.
- Frontend-to-API requests work end-to-end.
- `AGENTS/TASKS.md` task 079 reflects the fix.

## Result

Date: `2026-04-28`

Executed:

- Updated shared source exports/imports to explicit `.js` ESM specifiers in `shared/src/index.ts` and internal relative imports across `shared/src/{schemas,types}`.
- Rebuilt shared package and verified `shared/dist/index.js` now imports/exports `./*.js` paths.
- Verified full project build succeeds after fix (`pnpm build`).

Root cause:

- `shared/dist/index.js` had extensionless relative imports (e.g. `./enums/user-role`) that fail under Node ESM resolution in the target runtime.
