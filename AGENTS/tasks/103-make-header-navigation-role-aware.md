# 103 — Make header navigation role-aware

## Goal

Show only links that are accessible to the current user role in the header navigation.

## Context

Current header shows links that some users cannot open (for example, regular user sees Reports, clicks it, and gets forbidden). This creates unnecessary friction.

## Scope

- Make header navigation dynamic based on authentication state and role.
- Render only routes the current user can access.
- Keep public navigation behavior intact for unauthenticated users.

## Requirements

- Regular user sees only allowed sections (e.g., public documents, workspace).
- Root/admin-only links are hidden for non-root users.
- No visible navigation item should consistently lead to access denied for the current role.
- Role logic should be centralized and easy to extend.

## Constraints

- Do not weaken backend authorization checks.
- Do not hardcode duplicated permission checks across multiple components.
- Keep behavior consistent with existing guards and route permissions.

## Expected files

- `apps/web/src/features/navigation/main-navigation.tsx`
- `apps/web/src/features/auth/*` (if auth-role context wiring is adjusted)
- Optional shared route-access helper in `apps/web/src/features/navigation/*`

## Definition of done

- Header links are filtered by current role.
- Manual verification for guest/user/root confirms correct visible links.
- Clicking visible links does not produce expected-forbidden navigation for that role.

## Result

- Added a centralized navigation access helper and filtered header links by auth/role so guests only see public entries and root-only routes stay hidden from non-root users.
- Verified with `pnpm --filter web lint` (existing warnings only) and `pnpm build:shared && pnpm --filter web build`.
