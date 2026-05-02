# 108 — Require owner assignment on root restore flow (restore with explicit reassign)

## Goal

Implement TZ-compliant restore flow where root restores deleted records by explicitly assigning an owner.

## Context

Current restore clears deletion flag but does not require immediate owner assignment during restore action. TZ describes restore as owner-definition workflow.

## Scope

- Define restore contract that includes owner assignment.
- Update backend restore logic and validation.
- Update root UI restore workflow to require selecting owner.

## Requirements

- Root cannot restore deleted record without target owner.
- Restored record is returned with `deletedAt = null` and assigned owner.
- Existing root reassign behavior remains coherent (no conflicting paths).

## Constraints

- Root-only restore access must remain unchanged.
- Preserve deletion audit fields and update last-change metadata.
- Avoid breaking existing API consumers without explicit migration handling.

## Expected files

- `apps/api/src/documents/dto/*restore*.dto.ts` (if new DTO is needed)
- `apps/api/src/documents/documents.controller.ts`
- `apps/api/src/documents/documents.service.ts`
- `apps/web/src/features/root/components/*`
- `shared/src/types/document.ts` and `shared/src/schemas/document.ts` (if contract changes)

## Definition of done

- Restore endpoint requires owner assignment input.
- Root UI enforces owner selection before restore.
- Tests cover restore success/failure paths.

## Result

Pending.
