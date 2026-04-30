# Tasks

## Todo

- [ ] 106 — Replace raw ID display with human-readable entity labels across UI, search, and exports

## Done

- [x] 083 — Add explicit document kind classification (incoming/outgoing/internal) and enforce it across API/DB/UI
- [x] 084 — Implement leadership resolutions model and workflow (author, text, date, due date, linked document)
- [x] 085 — Implement control assignment from resolution and keep control priority ordering in lists
- [x] 086 — Implement case write-off workflow ("списание в дело") as a dedicated lifecycle action/state
- [x] 087 — Align document field mapping with formal TZ fields/defaults (about1/about2, out_sender=id_employer, broadcast, dates)
- [x] 088 — Enforce expiration rule: default +30 days and no extension without changing registration date
- [x] 089 — Implement owner-on-delete reassignment to root with deletion timestamp fixation per TZ
- [x] 090 — Implement immutable last-change block (date/time/user) visible in edit dialog (read-only)
- [x] 091 — Expand search to guaranteed coverage of active/archived/deleted by required fields from TZ
- [x] 092 — Extend text export and executor KPI report format to match TZ columns and overdue-percent rules
- [x] 093 — Add executor unit model and enforce default "active by user unit" visibility per TZ
- [x] 094 — Restrict soft delete strictly to owner and align delete permissions with TZ
- [x] 095 — Align deadline color semantics to exact TZ ranges (7–4 green, 3–1 yellow, due/overdue red)
- [x] 096 — Enforce mandatory password rotation workflow every 90 days (not only session TTL)
- [x] 097 — Align status domain to strict binary TZ semantics `{1,0}` and reconcile WRITTEN_OFF behavior
- [x] 098 — Investigate and fix unstable Drizzle migration execution (`drizzle-kit migrate`), including broken journal/history and silent failures
- [x] 099 — Move record details to a right slide-over sidebar to keep tables full-width across pages
- [x] 100 — Remove emoji/sticker-style visual markers from UI and replace with neutral design-system feedback
- [x] 101 — Add clear required-field indicators across all forms with consistent validation UX
- [x] 102 — Add global toast/snackbar notifications for form and API errors to ensure immediate visibility
- [x] 103 — Make header navigation role-aware and show only links accessible to the current user
- [ ] 104 — Reduce protected-page loading flicker via SSR session/prefetch and remove global loading flash
- [x] 105 — Move document creation flow into a right slide-over sidebar
- [x] 082 — Translate the full UI into Russian; ensure all visible interface text is localized
- [x] 079 — Find and fix the cause of frontend requests failing before reaching the API (verify base URL, CORS, proxy, and container/network wiring)
- [x] 081 — Add or expose a proper user registration flow; verify how new users are created and whether self-registration should be supported
- [x] 080 — Reduce unnecessary client-side requests on the index page and move first-load data fetching to SSR/server rendering where appropriate
- [x] 078 — Audit and fix light-theme contrast issues so text remains readable across all screens (remove black-on-black states; tune primary surface color)
- [x] 052 — Phase 10 frontend documents UI
- [x] 046 — Phase 9 frontend foundation
- [x] 041 — Phase 8 search, filters, reports, and export
- [x] 077 — Phase 13 final build check
- [x] 076 — Phase 13 demo script
- [x] 075 — Phase 13 feature checklist
- [x] 074 — Phase 13 demo seed data
- [x] 073 — Phase 13 README and delivery docs
- [x] 026 — Phase 6 documents backend core
- [x] 013 — Phase 4 authentication and users
- [x] 001 — Init project
- [x] 001 — Check monorepo setup
- [x] 002 — Check shared package
- [x] 003 — Check Drizzle and PostgreSQL
- [x] 004 — Create shared enums
- [x] 005 — Create shared types
- [x] 006 — Create shared zod schemas
- [x] 007 — Create users schema
- [x] 008 — Create employers schema
- [x] 009 — Create documents schema
- [x] 010 — Create audit log schema
- [x] 011 — Create db relations
- [x] 012 — Create initial seed
