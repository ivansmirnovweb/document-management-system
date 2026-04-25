# Project Roadmap

## Purpose

This roadmap describes the full development plan for the electronic document workflow system.

# Phase 0 — Project foundation check

## Goal

Verify that the base monorepo setup is stable before implementing business logic.

## Current expected state

The project should already contain:

- Next.js frontend in `apps/web`
- NestJS backend in `apps/api`
- Shared package in `shared`
- PostgreSQL in Docker Compose
- Drizzle installed in backend
- Basic workspace scripts
- Basic `AGENTS.md` files

## Deliverables

- Working `pnpm dev`
- Working Next.js app on port `3000`
- Working NestJS app on port `4000`
- Working PostgreSQL container on port `5432`
- Working Drizzle config
- Working shared package build

## Suggested tasks

- `001-check-monorepo-setup.md`
- `002-check-shared-package.md`
- `003-check-drizzle-and-postgres.md`

## Definition of done

- `pnpm install` works from root
- `pnpm dev` starts frontend and backend
- PostgreSQL starts through Docker Compose
- Drizzle can connect to PostgreSQL
- Shared package can be imported by both frontend and backend

---

# Phase 1 — Domain model and shared contracts

## Goal

Define the core domain language and shared contracts before implementing database and API logic.

## Business context

The system manages an electronic document workflow. It must support document registration, execution control, archiving, searching, deleted records, and reports.

The required domain entities are:

- users / executors
- employers / counterparties
- documents / inbox records

The assignment requires document registration, execution tracking, archive behavior, search, reports, user roles, and PostgreSQL as the database. :contentReference[oaicite:0]{index=0}

## Deliverables

- Shared enums
- Shared types
- Initial Zod schemas
- Clear domain naming

## Suggested shared entities

- `UserRole`
- `DocumentStatus`
- `DocumentListItem`
- `DocumentDetails`
- `Employer`
- `User`
- `LoginRequest`
- `LoginResponse`
- `CreateDocumentInput`
- `UpdateDocumentInput`
- `ReportFilterInput`

## Suggested tasks

- `004-create-shared-enums.md`
- `005-create-shared-types.md`
- `006-create-shared-zod-schemas.md`

## Definition of done

- Shared package contains core enums and types
- Frontend and backend can import shared contracts
- No backend-only or frontend-only code is placed in `shared`
- Shared package builds successfully

---

# Phase 2 — Database schema and migrations

## Goal

Create the real PostgreSQL schema using Drizzle ORM.

## Main tables

- `executors` / users
- `employers` / counterparties
- `inbox` / documents
- `document_audit_logs`

## Required database behavior

The schema must support:

- users with roles
- default password behavior
- password change tracking
- employers / counterparties
- document owner
- document executor
- document status
- document deadline
- control priority
- soft delete
- deleted records
- restore by root
- hard delete by root
- last modification information
- audit logs

## Suggested tasks

- `007-create-users-schema.md`
- `008-create-employers-schema.md`
- `009-create-documents-schema.md`
- `010-create-audit-log-schema.md`
- `011-create-db-relations.md`
- `012-create-initial-seed.md`

## Definition of done

- Drizzle schema exists for all core entities
- Migrations can be generated and applied
- Seed creates:
    - root user
    - several regular users
    - several employers
    - several test documents
- Database structure covers the assignment requirements

---

# Phase 3 — Backend infrastructure

## Goal

Prepare the NestJS backend foundation before implementing business modules.

## Deliverables

- Config module
- Database module
- Common error handling
- Common guards/decorators
- Common response conventions
- Health endpoint

## Suggested backend modules

- `DbModule`
- `ConfigModule`
- `AuthModule`
- `UsersModule`
- `EmployersModule`
- `DocumentsModule`
- `ReportsModule`

## Suggested tasks

- `013-create-db-module.md`
- `014-create-config-module.md`
- `015-create-common-decorators-and-guards.md`
- `016-create-health-endpoint.md`

## Definition of done

- Backend starts without errors
- Backend can access environment variables
- Backend can query PostgreSQL through Drizzle
- Basic health endpoint works
- Common backend structure is ready

---

# Phase 4 — Authentication and users

## Goal

Implement authentication, user identity, roles, and password rules.

## Required behavior

The system must support:

- login by username and password
- JWT authentication through httpOnly cookies
- logout
- current user endpoint
- password hashing with bcrypt
- root and regular user roles
- default password behavior
- password change through web interface
- password expiration after 90 days

## Suggested endpoints

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/change-password`
- `GET /users`
- `POST /users`

## Suggested tasks

- `017-create-auth-module.md`
- `018-implement-login-logout.md`
- `019-implement-current-user.md`
- `020-implement-password-change.md`
- `021-implement-password-expiration.md`
- `022-create-users-module.md`

## Definition of done

- Users can log in
- Users can log out
- Backend returns current user
- Passwords are hashed
- Password expiration is checked
- Role information is available to backend and frontend

---

# Phase 5 — Employers / counterparties backend

## Goal

Implement backend functionality for employers / counterparties.

## Required behavior

Employers are used as document counterparties.

They must contain:

- full name
- short name
- legal address
- actual address

## Suggested endpoints

- `GET /employers`
- `GET /employers/:id`
- `POST /employers`
- `PATCH /employers/:id`
- `DELETE /employers/:id`

## Suggested tasks

- `023-create-employers-module.md`
- `024-implement-employers-crud.md`
- `025-add-employer-validation.md`

## Definition of done

- Employers can be created
- Employers can be listed
- Employers can be edited
- Employers can be selected when creating a document

---

# Phase 6 — Documents backend core

## Goal

Implement core document management.

## Required behavior

The system must support:

- create document
- list active documents
- list completed documents
- get document details
- update document
- mark as completed
- mark as not completed
- soft delete document
- calculate deadline state
- sort by control priority and expiration date

## Suggested endpoints

- `GET /documents`
- `GET /documents/:id`
- `POST /documents`
- `PATCH /documents/:id`
- `PATCH /documents/:id/status`
- `DELETE /documents/:id`

## Suggested tasks

- `026-create-documents-module.md`
- `027-implement-create-document.md`
- `028-implement-documents-list.md`
- `029-implement-document-details.md`
- `030-implement-update-document.md`
- `031-implement-document-status-change.md`
- `032-implement-document-soft-delete.md`
- `033-implement-deadline-state.md`

## Definition of done

- Documents can be created
- Documents can be listed
- Documents can be edited
- Documents can be completed
- Completed documents are treated as archived
- Documents can be soft-deleted
- Deadline state is calculated consistently

---

# Phase 7 — Backend permissions and workflow rules

## Goal

Implement real business permissions and workflow restrictions.

## Required behavior

Guest:

- can view active documents in read-only mode

User:

- can create documents
- can fully edit own documents
- can soft-delete own documents
- can change status only for own documents
- can partially fill execution fields of other documents where allowed

Root:

- can view deleted documents
- can restore deleted documents
- can reassign owner
- can hard-delete documents

## Important workflow rules

- Completed documents are read-only except status-related logic
- Soft-deleted documents are hidden from normal users
- Root sees deleted documents
- Hard delete is root-only
- Frontend permission checks are only UX
- Backend must enforce all permissions

## Suggested tasks

- `034-implement-document-permission-service.md`
- `035-restrict-owner-only-actions.md`
- `036-implement-partial-update-for-non-owners.md`
- `037-implement-completed-document-restrictions.md`
- `038-implement-root-deleted-documents.md`
- `039-implement-restore-and-reassign.md`
- `040-implement-root-hard-delete.md`

## Definition of done

- Permission rules are enforced by backend
- Unauthorized users cannot mutate restricted data
- Root-only logic works
- Soft delete and restore flow works

---

# Phase 8 — Search, filters, reports, and export

## Goal

Implement search and reporting functionality required by the assignment.

## Required search behavior

Search must work across:

- active documents
- completed documents
- deleted documents

Search fields include:

- incoming/outgoing text
- registration text
- expiration date
- login
- outgoing registration text

## Required report behavior

Reports must support:

- date range filter
- document list export
- executor statistics
- completed on time
- completed late
- overdue percentage

## Suggested endpoints

- `GET /documents/search`
- `GET /reports/documents/export`
- `GET /reports/executors`

## Suggested tasks

- `041-implement-document-search.md`
- `042-implement-date-range-filter.md`
- `043-implement-text-export.md`
- `044-implement-executor-statistics.md`
- `045-implement-report-endpoints.md`

## Definition of done

- Search works across all document states
- Reports can be filtered by date range
- Export file can be downloaded
- Executor statistics are calculated correctly

---

# Phase 9 — Frontend foundation

## Goal

Prepare the frontend application structure and API integration.

## Deliverables

- App layout
- TanStack Query provider
- API client
- Auth state
- Basic navigation
- Protected UI areas
- Error/loading states

## Suggested tasks

- `046-create-frontend-layout.md`
- `047-setup-tanstack-query.md`
- `048-create-api-client.md`
- `049-create-auth-ui.md`
- `050-create-navigation.md`
- `051-create-protected-ui-patterns.md`

## Definition of done

- Frontend can call backend
- Auth state is available in UI
- Basic layout and navigation exist
- API errors are displayed clearly
- Shared contracts are used where possible

---

# Phase 10 — Frontend documents UI

## Goal

Implement the main document workflow UI.

## Required screens

- public active documents view
- login page
- active documents tab
- completed documents tab
- document create form
- document edit form
- document details view
- search UI

## Required UI behavior

- active documents are shown by default
- completed documents are separated
- control documents are visually prioritized
- deadline colors are shown
- buttons depend on user role and ownership
- completed records are mostly read-only
- search works through backend API

## Suggested tasks

- `052-create-public-documents-page.md`
- `053-create-documents-table.md`
- `054-implement-deadline-row-colors.md`
- `055-implement-control-priority-ui.md`
- `056-create-document-form.md`
- `057-create-document-edit-dialog.md`
- `058-create-completed-documents-tab.md`
- `059-create-search-ui.md`
- `060-connect-document-mutations.md`

## Definition of done

- Users can view active documents
- Users can create documents after login
- Users can edit allowed documents
- Users can complete documents
- Users can search documents
- UI reflects deadline and priority states

---

# Phase 11 — Root UI and reports UI

## Goal

Implement administrative and reporting screens.

## Required root UI

Root user can:

- view deleted records
- restore deleted records
- reassign owner
- hard-delete records

## Required reports UI

Users can:

- select date range
- generate export
- view executor statistics

## Suggested tasks

- `061-create-root-deleted-documents-page.md`
- `062-create-restore-document-action.md`
- `063-create-reassign-owner-action.md`
- `064-create-hard-delete-action.md`
- `065-create-reports-page.md`
- `066-create-export-action.md`
- `067-create-executor-statistics-table.md`

## Definition of done

- Root can manage deleted documents
- Reports can be generated from UI
- Export can be downloaded
- Statistics are visible and understandable

---

# Phase 12 — Audit, polish, and consistency

## Goal

Improve reliability, consistency, and final quality.

## Required improvements

- audit information visible in edit dialog
- consistent validation messages
- consistent empty states
- consistent loading states
- clear error messages
- final data checks
- final permission checks

## Suggested tasks

- `068-implement-audit-display.md`
- `069-polish-validation-errors.md`
- `070-polish-loading-and-empty-states.md`
- `071-check-permission-edge-cases.md`
- `072-check-document-lifecycle-edge-cases.md`

## Definition of done

- Audit information is visible where required
- Main user flows are stable
- Permission edge cases are checked
- UI is understandable for demonstration

---

# Phase 13 — Final academic delivery

## Goal

Prepare the project for submission and demonstration.

## Deliverables

- README
- setup instructions
- environment example
- database seed
- feature checklist
- screenshots if needed
- demo scenario

## Suggested tasks

- `073-write-readme.md`
- `074-create-demo-seed-data.md`
- `075-create-feature-checklist.md`
- `076-create-demo-script.md`
- `077-final-build-check.md`

## Definition of done

- Project can be installed from scratch
- Project can be launched with documented commands
- Demo data exists
- Main requirements are traceable
- Final build works
- The project is ready to show to the teacher

---

# Suggested implementation order

Use this order unless there is a strong reason to change it:

1. Foundation check
2. Shared contracts
3. Database schema
4. Backend infrastructure
5. Auth and users
6. Employers backend
7. Documents backend
8. Permissions
9. Search and reports
10. Frontend foundation
11. Frontend documents UI
12. Root and reports UI
13. Polish
14. Final delivery

Backend should be implemented before the main frontend screens.

The frontend must not invent business behavior that does not exist in the backend.

---

# MVP boundary

The minimum acceptable version must include:

- PostgreSQL database
- users with roles
- login
- active documents list
- completed documents list
- document creation
- document editing
- document completion
- soft delete
- root deleted-records screen
- restore or hard-delete by root
- search
- date-range export
- basic executor statistics

Everything else is secondary.
