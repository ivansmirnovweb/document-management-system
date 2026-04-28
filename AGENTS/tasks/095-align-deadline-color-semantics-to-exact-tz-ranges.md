# 095 — Align deadline color semantics to exact TZ ranges

## Goal

Implement exact TZ deadline coloring ranges in UI and supporting logic.

## Context

Current deadline-state buckets do not exactly match TZ ranges.

## Scope

- `apps/web/src/*` deadline visuals
- `shared/src/*` deadline enums/helpers if needed
- Optional API-calculated helpers (if currently used)

## Requirements

- Green: from 7 to 4 days before deadline.
- Yellow: from 3 to 1 day before deadline.
- Red: deadline day and overdue.
- Outside these ranges: neutral/no fill.
- Keep archived/completed display consistent and non-misleading.

## Definition of done

- Visual states match TZ thresholds exactly.
- Edge cases around timezone/day boundaries are covered.
- No regressions in document lists/cards/details.

## Result

Date: `2026-04-28`

Executed:

- Deadline state calculation now uses Amsterdam day boundaries with exact TZ buckets (neutral >7 days, green 7–4, yellow 3–1, red due/overdue, completed preserved). Frontend badges/row tones follow the same states. Validation: `pnpm --filter api test -- document-deadline-state.spec.ts document-permissions.service.spec.ts`, `pnpm build`.
