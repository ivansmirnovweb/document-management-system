# 082 — Translate full UI into Russian

## Goal

Translate all visible frontend UI text into Russian so product screens are consistent for Russian-speaking users.

## Scope

- App-level metadata and state screens (`layout`, loading, error)
- Auth flow (`login`, `register`, auth status, protected gate)
- Main navigation and workspace labels
- Documents module (page headers, actions, empty states, details/form labels, table headers)
- Reports module (range form, loading/error states, table headers)
- Root/deleted-documents module (warnings, actions, table/panel labels)
- Shared validation messages surfaced in forms (`shared/src/schemas/*`)

## Requirements

- No core user-facing English labels remain on main app routes.
- Date/number presentation used in UI helpers is localized for Russian locale.
- Existing behavior/permissions are unchanged.

## Definition of done

- Visible UI labels/messages are translated to Russian across public and protected screens.
- Build and lint gates pass.
- `AGENTS/TASKS.md` marks task 082 as done with a short result summary.

## Result

Date: `2026-04-28`

Executed:

- Translated app metadata + global loading/error card labels to Russian.
- Localized auth, navigation, protected-view, and sign-in/out action texts.
- Translated documents workspace (tabs, search, empty states, detail panel, form labels, table actions/headers, status/deadline labels).
- Localized reports page and executor statistics table.
- Localized root deleted-documents page, table, panel, confirmations, and action labels.
- Switched UI formatting helpers to `ru-RU` locale for date/time and percentages.
- Updated shared Zod validation messages/labels used by the frontend forms.
