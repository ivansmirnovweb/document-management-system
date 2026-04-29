# 102 — Add global toast/snackbar notifications for form and API errors

## Goal

Ensure users always see operation errors immediately via global toast/snackbar notifications instead of subtle or off-screen inline messages.

## Context

At the moment, errors like `Outgoing document requires outgoingNumber` can appear in places users miss. This creates confusion and failed actions without clear feedback.

## Scope

- Introduce a global notification mechanism (toast/snackbar) in frontend app shell.
- Show notifications for:
  - failed form submissions,
  - failed API mutations,
  - important fetch failures where inline UI may be missed.
- Keep inline field-level validation where it already exists; toast is additive for visibility.

## Requirements

- Error notifications are visible and readable without scrolling.
- Notifications include clear backend/client error message text.
- Success notifications may be added selectively for key actions (create/update/delete), without noise.
- Notification style and timing are consistent across pages.

## Constraints

- Prefer existing project UI stack; add dependency only if justified.
- Do not duplicate error handling logic in many components; centralize pattern where possible.
- Preserve current business behavior; change only UX feedback layer.

## Expected files

- `apps/web/src/app/**` (provider/shell wiring)
- `apps/web/src/lib/api.ts` and/or query/mutation wrappers
- `apps/web/src/features/**/components/*.tsx` (mutation handlers)
- `apps/web/package.json` (only if new toast lib is introduced)

## Definition of done

- Users see immediate visible error feedback for failed actions.
- Critical errors are no longer easy to miss.
- Existing flows remain functional, with no duplicated noisy alerts.

## Result

Pending.
