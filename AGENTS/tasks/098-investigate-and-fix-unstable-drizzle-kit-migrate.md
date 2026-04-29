# 098 — Investigate and fix unstable Drizzle migration execution (`drizzle-kit migrate`)

## Goal

Make backend database migration flow stable and reproducible in local development and CI, with `pnpm --filter api db:migrate` as the primary reliable path.

## Context

Current migration workflow is unstable:

- `drizzle-kit migrate` fails with `Exit status 1` and no actionable error details.
- Migration history/journal drift was observed (`apps/api/drizzle/meta/_journal.json` not matching existing migration files).
- Developers fell back to manual SQL apply or `db:push`, which creates non-deterministic schema states.
- `db:push` may propose destructive operations (truncate/data loss) on existing datasets.

## Scope

- Analyze and document root causes of migration instability.
- Ensure migration journal and migration files are consistent and complete.
- Add deterministic diagnostics for migration failures.
- Define and document a safe fallback path when Drizzle CLI fails silently.

Out of scope:

- Broad redesign of data model unrelated to migration reliability.
- Replacing Drizzle with another ORM/migration framework.

## Requirements

- `pnpm --filter api db:migrate` must either:
  - complete successfully on a clean database, or
  - fail with clear, actionable diagnostics (exact migration file / SQL statement context).
- `db:seed` must succeed after migrations on a clean database.
- Migration history must not require manual editing by every developer after pull.
- Team workflow should avoid destructive `db:push` for regular migration application.

## Constraints

- Use PostgreSQL and Drizzle ORM only.
- Keep current project structure.
- Do not hardcode environment-specific credentials.
- Preserve existing business data semantics (`NOT_DONE`/`DONE`, `written_off_at`, `unit`, etc.).

## Expected files

- `apps/api/drizzle/meta/_journal.json` (if normalization required)
- `apps/api/package.json` (optional: debug/fallback scripts)
- `README.md` or `docs/*` (migration workflow and troubleshooting)
- Optional helper script in `apps/api/scripts/*` for verbose migration diagnostics

## Definition of done

- On clean DB:
  - `pnpm --filter api db:migrate` runs deterministically.
  - `pnpm --filter api db:seed` succeeds.
- On migration failure:
  - logs include precise failing migration context.
- Documentation includes:
  - standard migration flow,
  - known failure modes,
  - safe fallback commands.
- No reliance on ad-hoc manual SQL in normal flow.

## Result

Pending.
