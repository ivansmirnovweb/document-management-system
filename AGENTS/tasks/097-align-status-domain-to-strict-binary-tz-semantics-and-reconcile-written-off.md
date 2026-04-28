# 097 — Align status domain to strict binary TZ semantics and reconcile WRITTEN_OFF

## Goal

Resolve mismatch between TZ status model (`{1,0}`) and current tri-state model with `WRITTEN_OFF`.

## Context

TZ defines status strictly as done/not-done, while implementation introduced dedicated write-off status.

## Scope

- DB schema and enums
- API DTOs/validation
- Frontend status UX and filtering
- Reports/export/status labels
- Migration/compatibility strategy for existing data

## Requirements

- Decide and implement one compliant strategy:
  - A) keep write-off as non-status attribute/lifecycle marker while status remains binary, or
  - B) remove write-off from active status domain and map behavior to TZ-compliant fields.
- Ensure archives/reopen flows remain correct.
- Update reports and search semantics consistently.

## Definition of done

- Status semantics are TZ-compliant and documented.
- Existing data migrated safely.
- UI/API/reporting behavior is consistent end-to-end.

## Result

Date: `TBD`

Executed:

- TBD
