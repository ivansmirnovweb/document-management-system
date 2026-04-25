# Agent Instructions

## Project overview

This repository contains a fullstack electronic document workflow system.

The application is used to register, track, complete, archive, delete, restore, search, and export document records.

The project is built as a monorepo:

- `apps/web` — Next.js frontend
- `apps/api` — NestJS backend
- `shared` — shared types, enums, schemas, and API contracts
- `AGENTS/tasks` — detailed development tasks

## Required reading before work

Before making changes, always read:

1. `AGENTS/SPEC.md`
2. `AGENTS/TASKS.md`
3. The current task file from `AGENTS/tasks/`
4. The local `AGENTS.md` file if working inside `apps/web`, `apps/api`, or `shared`

## Global stack

- Language: TypeScript
- Monorepo: pnpm workspaces
- Frontend: Next.js, TanStack Query, TanStack Table, React Hook Form, Zod
- Backend: NestJS, Drizzle ORM, PostgreSQL
- Shared package: TypeScript types, enums, Zod schemas, API contracts
- Database: PostgreSQL
- Runtime: Node.js
- Local infrastructure: Docker Compose

## Global rules

- Keep frontend and backend responsibilities separated.
- The frontend must never access PostgreSQL directly.
- All database access must go through the backend API.
- The backend is the source of truth for business rules and permissions.
- Do not use Prisma.
- Use Drizzle ORM for database schema, migrations, and queries.
- Use PostgreSQL as the only database.
- Do not introduce unrelated dependencies.
- Do not perform broad refactoring unless the current task explicitly requires it.
- Do not change project structure without a clear reason.
- Do not hard-delete documents except in root-only backend logic.
- Do not bypass backend permission checks.
- Keep code simple, explicit, and easy to explain for an academic project.

## Development workflow

1. Pick a task from `AGENTS/TASKS.md`.
2. Open the corresponding task file from `AGENTS/tasks/` (if it does not exist yet, create it first using the required task file sections from this document).
3. Implement only the requested scope.
4. Update the task status in `AGENTS/TASKS.md`.
5. Add a short implementation result to the task file.
6. Run relevant checks when possible.

## Task file rules

Each task file should contain:

- Goal
- Context
- Scope
- Requirements
- Constraints
- Expected files
- Definition of done
- Result

Do not create unnecessary task-management folders such as `todo`, `doing`, `done`, or `logs`.

## Coding rules

- Use TypeScript everywhere.
- Prefer explicit types for public functions, DTOs, and shared contracts.
- Keep business logic out of UI components.
- Keep business logic out of NestJS controllers.
- Keep database queries inside backend services or repository-like helpers.
- Validate external input.
- Handle errors explicitly.
- Avoid hidden side effects.
- Prefer readable code over clever code.

## Environment rules

- Use `.env.example` to document required environment variables.
- Do not commit real secrets.
- Do not hardcode credentials.
- Keep local ports consistent:
    - Web: `3000`
    - API: `4000`
    - PostgreSQL: `5432`

## Documentation rules

Update documentation when changing:

- Project structure
- Environment variables
- Scripts
- API contracts
- Database schema
- Business rules
- Permissions
