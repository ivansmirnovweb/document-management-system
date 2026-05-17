# Frontend Code Review (`apps/web`)

## Scope

- Reviewed: `apps/web` (full), `shared` (only contracts/schemas that directly affect frontend forms/API usage).
- Focus: architecture quality, oversized files/components, responsibility boundaries, KISS/SOLID violations, regression risks, and testing gaps.
- Snapshot date: 2026-05-17.

## Findings

### 1) `HIGH` — God-component in documents feature (UI + orchestration + data access + side effects)
- File: `apps/web/src/features/documents/components/documents-page.tsx` ([`/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:38`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:38), [`:170`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:170), [`:234`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:234), [`:607`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:607))
- Risk: 722 LOC component mixes query orchestration, CRUD/status mutations, CSV export side effects (Blob/DOM), view-state machine (tabs/search/sidebar/modes), and render branches. This is high regression surface: small change in one flow can silently break another (search, export, panel state, tab switching).
- Recommendation: split into focused units:
  - `useDocumentsPageController` (queries, mutations, state machine)
  - `DocumentsToolbar` (tabs/search/export/create controls)
  - `DocumentsListSection` (loading/error/empty/table wiring)
  - `DocumentSidebarController` (create/edit/details content)
  - `downloadCsv` utility reused across features.

### 2) `HIGH` — Duplicated rendering logic for table branch (drift-prone)
- File: `apps/web/src/features/documents/components/documents-page.tsx` ([`/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:472`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:472), [`:522`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:522))
- Risk: `DocumentsTable` props and selection handlers are duplicated in two large branches. Any future fix in one branch can be missed in the other branch (classic regression source).
- Recommendation: build one `tableProps` object and render `DocumentsTable` once; keep only truly variant-specific props conditional.

### 3) `MEDIUM` — Form component is oversized and contains permission-specific behavior + mapping logic
- File: `apps/web/src/features/documents/components/document-form-panel.tsx` ([`/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/document-form-panel.tsx:53`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/document-form-panel.tsx:53), [`:105`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/document-form-panel.tsx:105), [`:156`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/document-form-panel.tsx:156))
- Risk: 431 LOC combines default-value mapping, role/ownership edit restrictions, schema wiring, and full form layout. This violates single-responsibility and increases breakage probability in TZ rule changes (especially owner/executor restrictions).
- Recommendation: extract:
  - `document-form.defaults.ts` (`toFormDefaults` + date defaults)
  - `document-form.permissions.ts` (`isCloseOutOnlyEditor` and related UI disable policy)
  - sectional UI components (`RegistrationSection`, `ResponsibilitySection`, etc.)

### 4) `MEDIUM` — Repeated imperative CSV download logic across features
- Files:
  - `apps/web/src/features/documents/components/documents-page.tsx` ([`/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:248`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-page.tsx:248))
  - `apps/web/src/features/reports/components/reports-page.tsx` ([`/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/reports/components/reports-page.tsx:43`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/reports/components/reports-page.tsx:43))
- Risk: duplicated side-effect logic diverges over time (URL revoke strategy, link cleanup, filename policy, error handling). Inconsistent behavior across export entry points is likely.
- Recommendation: create shared utility (`apps/web/src/shared/lib/download-csv.ts`) and use single implementation.

### 5) `MEDIUM` — Auth provider duplicates cache writes and couples query/mutation concerns
- File: `apps/web/src/features/auth/auth.provider.tsx` ([`/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/auth/auth.provider.tsx:44`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/auth/auth.provider.tsx:44), [`:81`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/auth/auth.provider.tsx:81))
- Risk: `setQueryData` is called both in `onSuccess` of mutations and again in exposed methods (`login/register/changePassword`). Duplicate side effects complicate reasoning and can cause future inconsistency.
- Recommendation: keep cache write in one place only (prefer mutation `onSuccess`), methods should only call `mutateAsync`.

### 6) `MEDIUM` — No automated frontend tests found
- Scope evidence: no `*.test.ts(x)` / `*.spec.ts(x)` files detected in `apps/web`.
- Risk: large stateful UI modules (`documents-page`, root deleted flow, report filters/export) are vulnerable to silent regressions after refactors.
- Recommendation: add at least integration-level tests for:
  - documents page state transitions (tabs/search/sidebar modes)
  - export selection behavior
  - auth guard behavior (`ProtectedView`) for unauthenticated/root/password-rotation states.

### 7) `LOW` — UI includes actions that depend on local permission helpers, increasing policy drift risk
- Files:
  - `apps/web/src/features/documents/document-utils.ts` ([`/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/document-utils.ts:85`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/document-utils.ts:85))
  - `apps/web/src/features/documents/components/documents-table.tsx` ([`/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-table.tsx:128`](/C:/Users/sid36/web_projects/document-flow/apps/web/src/features/documents/components/documents-table.tsx:128))
- Risk: frontend helper rules (`canEdit/canDelete/canComplete`) can drift from backend policy and create confusing UX (buttons shown/hidden inconsistently with server outcomes).
- Recommendation: keep helpers minimal and document that backend remains source of truth; where possible, consume permission flags from API DTO in future iterations.

## Large Files Audit

| File | LOC | Why problematic | Refactor target |
|---|---:|---|---|
| `apps/web/src/features/documents/components/documents-page.tsx` | 722 | Multi-responsibility orchestrator, high branching and side effects, duplicate render blocks | Split into controller hook + toolbar/list/sidebar subcomponents |
| `apps/web/src/features/documents/components/document-form-panel.tsx` | 431 | Large monolithic form with mapping + permissions + layout | Split defaults/permissions/sections + keep shell component thin |
| `apps/web/src/features/documents/components/documents-table.tsx` | 227 | Table configuration and action policy rendering tightly coupled | Extract columns factory + action cell component |
| `apps/web/src/features/reports/components/reports-page.tsx` | 182 | Page includes filter state, query lifecycle, export side effects | Move export/download and filter logic into dedicated hooks/utils |
| `apps/web/src/features/root/components/root-deleted-documents-page.tsx` | 164 | Page-level orchestration with modal/detail/mutations in one place | Introduce `useDeletedDocumentsController` and presentational split |

## Quick Wins

1. Remove duplicated `DocumentsTable` rendering in `documents-page.tsx`.
2. Extract shared `downloadCsv` utility and reuse in reports/documents.
3. Eliminate duplicate `setQueryData` calls in `auth.provider.tsx`.
4. Move selection handlers (`onToggleExportSelect*`) to memoized callbacks.
5. Replace ad-hoc query key `[..., "deleted"]` with dedicated key factory entry in `documents.keys.ts`.
6. Extract `panel` render state machine from `documents-page.tsx` into a dedicated component.
7. Extract form sections from `document-form-panel.tsx` for readability and targeted tests.
8. Add smoke tests for `ProtectedView` states.
9. Add integration test for tab/search/export selection flow.
10. Add lint rule or CI check for max component LOC threshold (soft threshold warning).

## Suggested Refactor Plan

### Iteration 1 (Safety + duplication removal)
- Deduplicate `DocumentsTable` rendering in `documents-page.tsx`.
- Extract shared CSV download helper.
- Simplify `auth.provider.tsx` mutation side effects.
- Add regression tests for these exact flows.

### Iteration 2 (Documents feature decomposition)
- Introduce `useDocumentsPageController` hook for queries/mutations/state.
- Extract toolbar/list/sidebar presentational components.
- Keep behavior unchanged; verify with integration tests.

### Iteration 3 (Form modularization)
- Split `document-form-panel.tsx` into defaults/permissions/sections.
- Add focused tests for close-out-only edit restrictions and schema error rendering.

### Iteration 4 (Permission/contract hardening)
- Align frontend permission helpers with API-provided capabilities (if backend exposes them).
- Add contract tests around shared schemas used by UI forms and API client parsing.
