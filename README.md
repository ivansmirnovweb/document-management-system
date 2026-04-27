# Document Flow System

Electronic document workflow system for academic delivery.

## Stack

- Frontend: Next.js
- Backend: NestJS
- Database: PostgreSQL
- ORM: Drizzle
- Shared contracts: Zod + TypeScript

## Quick start

1. Install deps

```bash
pnpm install
```

2. Start PostgreSQL

```bash
docker compose -f docker-compose.dev.yml up -d postgres
```

3. Set environment variables

- `apps/api/.env`
- `apps/web/.env`

Use `.env.example` as the reference.

To enable public sign-up, set `AUTH_SELF_REGISTRATION_ENABLED=true` in `apps/api/.env`.

4. Run database seed

```bash
pnpm --filter api db:seed
```

5. Start the app

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Useful commands

```bash
pnpm build
pnpm lint
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api db:generate
pnpm --filter api db:migrate
pnpm --filter api db:seed
```

## Demo data

The seed creates:

- root user
- regular users
- employers / counterparties
- active documents
- completed documents
- a soft-deleted document
- audit log entries

Default seed password: `ChangeMe123!`

## Feature checklist

See [`docs/FEATURE_CHECKLIST.md`](docs/FEATURE_CHECKLIST.md).

## Demo script

See [`docs/DEMO_SCENARIO.md`](docs/DEMO_SCENARIO.md).

## Screenshots

Not included in the repository. Capture them from a running local/demo instance if the teacher requests visual proof.

## Final verification

Recommended final check:

```bash
pnpm build && pnpm lint && pnpm --filter api test && pnpm --filter api test:e2e
```
