# 109 — Add multi-select documents export flow to match TZ print/export scenario

## Goal

Support TZ scenario where users select multiple records and export/print exactly the selected subset.

## Context

Current export is range-based and does not implement explicit multi-select export from document lists.

## Scope

- Add selection state in relevant tables/lists.
- Add export action for selected records.
- Extend backend export contract to accept selected record IDs (or add separate endpoint).

## Requirements

- User can select multiple records and export only selected ones.
- Export format remains TZ-compliant (columns/order/rules).
- Access and visibility rules are preserved.

## Constraints

- Keep existing date-range export unless explicitly deprecated.
- Do not weaken backend permission checks.
- Avoid duplicating export formatting logic.

## Expected files

- `apps/web/src/features/documents/components/documents-table.tsx`
- `apps/web/src/features/documents/components/documents-page.tsx`
- `apps/web/src/features/reports/*` or `apps/web/src/features/documents/*` (depending on placement)
- `apps/api/src/reports/reports.controller.ts`
- `apps/api/src/reports/reports.service.ts`
- `shared/src/types/report.ts` and `shared/src/schemas/report.ts` (if contract changes)

## Definition of done

- Multi-select export is available and functional.
- Backend validates selected IDs and returns export for allowed records only.
- UI clearly indicates selected count and export target.

## Result

Done. Added multi-select state in documents table/page and export action for selected records; report export contract extended with selectedIds filter and CSV download for selected subset.

