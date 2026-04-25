# 003 — Check Drizzle and PostgreSQL

## Goal

Verify PostgreSQL container startup, backend database connectivity, and Drizzle configuration operability.

## Context

Phase 0 requires a ready database foundation and functioning Drizzle tooling before moving to schema/domain implementation phases.

## Scope

- Start PostgreSQL from `docker-compose.dev.yml`.
- Validate DB readiness and port mapping.
- Validate Drizzle config and DB connectivity via CLI commands.

## Requirements

- PostgreSQL container is running.
- Port `5432` is mapped and accepting connections.
- `DATABASE_URL` works with Drizzle commands.
- `db:generate` and `db:push` complete successfully.

## Constraints

- Do not implement full domain schema in this phase.
- Fix only connectivity/configuration issues that block foundation checks.
- Keep backend as the only DB access layer.

## Expected files

- `docker-compose.dev.yml`
- `apps/api/drizzle.config.ts`
- `apps/api/src/db/schema/index.ts`
- `apps/api/drizzle/0000_outgoing_norman_osborn.sql`
- `apps/api/drizzle/meta/0000_snapshot.json`
- `apps/api/drizzle/meta/_journal.json`

## Definition of done

- PostgreSQL starts through Docker Compose and is reachable.
- Drizzle can read config and interact with PostgreSQL.
- Phase 0 database checks are fully reproducible from root scripts.

## Result

Date: `2026-04-25`

Executed:

- `docker compose -f docker-compose.dev.yml up -d postgres`
- `docker ps -a` / `docker port document-flow-postgres-dev`
- `docker exec document-flow-postgres-dev pg_isready -U postgres -d document_flow`
- `pnpm db:generate`
- `pnpm db:push`

Observed:

- PostgreSQL container `document-flow-postgres-dev` is `Up`.
- Port mapping is active: `5432 -> 0.0.0.0:5432` and `[::]:5432`.
- DB readiness check passed: `accepting connections`.
- Drizzle generate succeeded and produced initial migration artifacts.
- Drizzle push succeeded and applied schema changes.

Phase 0 definition of done confirmation:

- `pnpm install` from root: passed.
- `pnpm dev` startup path for web/api: validated.
- PostgreSQL startup via Docker Compose: passed.
- Drizzle DB connectivity: passed.
- Shared package build/import checks: passed.
