# 094 — Restrict soft delete to owner only and align delete permissions with TZ

## Goal

Bring delete permissions to strict TZ semantics: soft delete is owner-only.

## Context

Current permissions allow root to soft-delete, which conflicts with TZ wording.

## Scope

- `apps/api/src/documents/*`
- Permission services/policies
- Relevant UI actions
- Tests for delete/restore/hard-delete flows

## Requirements

- Soft delete allowed only for document owner.
- Root keeps only TZ-listed operations for deleted records: restore, reassign owner, hard delete.
- Preserve deletion timestamp + owner reassignment behavior if already implemented by TZ tasks.
- Ensure repeated delete attempts remain blocked.

## Definition of done

- API rejects root/user soft-delete when not owner.
- Root deleted-record operations still work.
- UI action availability reflects new permission rules.
- Regression checks for delete lifecycle pass.

## Result

Date: `2026-04-28`

Executed:

- Enforced owner-only soft delete in API permissions; root now keeps only restore/reassign/hard-delete. Validation: `pnpm --filter api test -- document-permissions.service.spec.ts`, `pnpm build`.
