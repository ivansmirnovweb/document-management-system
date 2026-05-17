# 110 — Clarify and enforce deleted-record visibility rules in search by role

## Goal

Make deleted-record visibility in search explicit and consistent with role/permission rules from TZ.

## Context

Current search behavior and deleted record access checks can produce inconsistent UX (record may appear in search but remain inaccessible for non-root).

## Scope

- Define expected deleted-search visibility for guest/user/root.
- Update backend search filters accordingly.
- Align frontend search expectations and messaging.

## Requirements

- Search visibility for deleted records is deterministic by role.
- Non-root users cannot access deleted records in conflict with permissions.
- Root retains full deleted queue/search visibility as required.

## Constraints

- Keep authorization checks in backend.
- Do not alter restore/hard-delete permissions.
- Preserve search performance and existing sort semantics where possible.

## Expected files

- `apps/api/src/documents/documents.service.ts`
- `apps/api/src/documents/document-permissions.service.ts`
- `apps/api/src/documents/dto/search-documents-query.dto.ts` (if needed)
- `apps/web/src/features/documents/components/documents-page.tsx`

## Definition of done

- Documented and implemented role-based deleted-search policy.
- No UX contradiction between list/search/detail access.
- Tests cover role-specific search visibility for deleted records.

## Result

Done. Search DTO/service now enforce deterministic deleted visibility: non-root cannot see deleted records in search; root can include deleted explicitly, preserving role-based access consistency.

