# 001 — Check monorepo setup

## Goal

Verify that the root workspace can install dependencies and start frontend/backend development processes on the required ports.

## Context

Phase 0 from `AGENTS/ROADMAP.md` requires a stable foundation before business logic implementation.

## Scope

- Validate `pnpm install` from repository root.
- Validate dev startup flow for web and api.
- Confirm target ports:
  - web: `3000`
  - api: `4000`

## Requirements

- Root install command completes successfully.
- Dev processes can be started from root workspace scripts.
- Web is reachable on `3000`.
- API is reachable on `4000`.

## Constraints

- Do not implement business features.
- Fix only infrastructure-level issues related to startup.
- Keep project architecture unchanged.

## Expected files

- `package.json` (workspace scripts, if fixes are needed)
- `apps/web/.env`
- `apps/api/.env`

## Definition of done

- `pnpm install` works from root.
- `pnpm dev` startup path is valid and can run web/api.
- Ports `3000` and `4000` are confirmed during runtime check.

## Result

Date: `2026-04-25`

Executed:

- `pnpm install` (required running outside sandbox due `spawn EPERM` in this environment)
- `pnpm dev` / `pnpm dev:web` / `pnpm dev:api`
- runtime port check via `Get-NetTCPConnection` after launching both processes

Observed:

- Dependencies installed successfully.
- Web and API startup commands are valid.
- Runtime verification confirmed:
  - `3000=True`
  - `4000=True`

Code/config fixes were not required for this task.
