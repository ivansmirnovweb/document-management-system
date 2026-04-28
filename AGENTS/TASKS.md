# Tasks

## Todo

- [ ] 083 — Add explicit document kind classification (incoming/outgoing/internal) and enforce it across API/DB/UI
- [ ] 084 — Implement leadership resolutions model and workflow (author, text, date, due date, linked document)
- [ ] 085 — Implement control assignment from resolution and keep control priority ordering in lists
- [ ] 086 — Implement case write-off workflow ("списание в дело") as a dedicated lifecycle action/state
- [ ] 087 — Align document field mapping with formal TZ fields/defaults (about1/about2, out_sender=id_employer, broadcast, dates)
- [ ] 088 — Enforce expiration rule: default +30 days and no extension without changing registration date
- [ ] 089 — Implement owner-on-delete reassignment to root with deletion timestamp fixation per TZ
- [ ] 090 — Implement immutable last-change block (date/time/user) visible in edit dialog (read-only)
- [ ] 091 — Expand search to guaranteed coverage of active/archived/deleted by required fields from TZ
- [ ] 092 — Extend text export and executor KPI report format to match TZ columns and overdue-percent rules
- [ ] 093 — Add executor unit model and enforce default "active by user unit" visibility per TZ
- [ ] 094 — Restrict soft delete strictly to owner and align delete permissions with TZ
- [ ] 095 — Align deadline color semantics to exact TZ ranges (7–4 green, 3–1 yellow, due/overdue red)
- [ ] 096 — Enforce mandatory password rotation workflow every 90 days (not only session TTL)
- [ ] 097 — Align status domain to strict binary TZ semantics `{1,0}` and reconcile WRITTEN_OFF behavior

## Done

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

## Result

- 082: Translated visible frontend UI text to Russian across auth, navigation, documents workspace, reports, root/deleted-documents tooling, and app-level loading/error metadata.
