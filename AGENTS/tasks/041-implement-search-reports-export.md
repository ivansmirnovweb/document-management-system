# 041 — Phase 8: Search, filters, reports, and export

## Goal

Implement backend search, report filtering, executor statistics, and document export for Phase 8.

## Context

Phase 7 is merged. The backend already supports documents, permissions, and deleted-record rules. This task adds the Phase 8 reporting layer only.

## Scope

- `apps/api/src/documents/*` for document search endpoint
- `apps/api/src/reports/*` for export and executor statistics
- `apps/api/src/app.module.ts`
- `shared/src/*` only for report-related contracts within Phase 8 scope
- `AGENTS/TASKS.md`

## Requirements

- Search documents across active, completed, and deleted records
- Search by document text fields and user login fields
- Export documents for a date range
- Provide executor statistics with completed on time, completed late, and overdue percentage
- Keep backend permissions intact

## Constraints

- Phase 8 only
- Do not start frontend work
- Do not change unrelated modules or business rules
- Keep DTOs and shared contracts limited to reporting/search needs

## Expected files

- `apps/api/src/documents/documents.controller.ts`
- `apps/api/src/documents/documents.service.ts`
- `apps/api/src/documents/dto/search-documents-query.dto.ts`
- `apps/api/src/reports/*`
- `apps/api/src/app.module.ts`
- `shared/src/types/report.ts`
- `shared/src/schemas/report.ts`
- `AGENTS/TASKS.md`

## Definition of done

- `/documents/search` works
- `/reports/documents/export` works
- `/reports/executors` works
- Phase 8 build/lint/test checks pass
- Branch and PR are created through GitHub workflow

## Result

Date: `2026-04-26`

Executed:

- Added `/documents/search` with permission-aware search across active, completed, and deleted records for root.
- Added `/reports/documents/export` CSV export and `/reports/executors` statistics with date-range filtering.
- Extended shared report contracts with executor statistics.
- Verified with `pnpm build:shared`, `pnpm --filter api build`, `pnpm --filter api lint`, and `pnpm --filter api test --runInBand`.
