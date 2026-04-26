# 026 — Phase 6: Documents backend core

## Goal

Implement the backend core for documents for Phase 6.

## Context

Phase 5 is already merged. The API now has auth, users, employers, and the database schema for documents. This task adds the core documents backend flows only.

## Scope

- `apps/api/src/documents/*`
- `apps/api/src/app.module.ts`
- `shared/src/*` only for document-related contracts within Phase 6 scope
- `AGENTS/TASKS.md`

## Requirements

- Create document
- List active documents
- List completed documents
- Get document details
- Update document
- Mark as completed / not completed
- Soft delete document
- Calculate deadline state consistently
- Sort by control priority and expiration date

## Constraints

- Keep scope limited to Phase 6
- Do not implement Phase 7 permissions yet
- Do not move into search/reports/frontend work
- Keep DTOs, schemas, and types aligned only for document-core needs

## Expected files

- `apps/api/src/documents/*`
- `apps/api/src/app.module.ts`
- `shared/src/enums/document-deadline-state.ts`
- `shared/src/types/document.ts`
- `shared/src/schemas/document.ts`
- `shared/src/index.ts`
- `AGENTS/TASKS.md`

## Definition of done

- Documents endpoints exist and use backend services
- Shared document contracts include deadline state
- Phase 6 build/lint/test checks pass
- Branch and PR are created through GitHub workflow

## Result

Date: `2026-04-26`

Executed:

- Added the documents backend module with list, details, create, update, status change, and soft delete flows.
- Added deadline-state calculation and consistent sorting for document lists.
- Extended shared document contracts with deadline-state support.
- Wired the documents module into the API app module.
- Verified with shared build, API build, API lint, and API test.
