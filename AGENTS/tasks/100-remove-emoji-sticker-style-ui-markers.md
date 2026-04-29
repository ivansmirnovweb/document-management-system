# 100 — Remove emoji/sticker-style UI markers

## Goal

Remove emoji/sticker-like markers from the interface and replace them with neutral, consistent UI feedback elements.

## Context

Current UI contains multiple emoji markers in states and helper blocks. This looks inconsistent with a professional workflow interface.

## Scope

- Audit frontend for emoji/sticker markers in components and page-level states.
- Replace emoji usage with design-system based visuals (text, badges, icons if already standardized in project).
- Keep semantics and meaning of statuses/messages unchanged.

## Requirements

- No emoji/sticker markers in production UI.
- Empty, loading, warning, and error states remain understandable without emojis.
- Visual language is consistent across pages.

## Constraints

- Do not introduce unrelated dependencies.
- Keep changes focused on presentation only.
- Do not alter backend behavior/contracts.

## Expected files

- `apps/web/src/features/**/components/*.tsx`
- `apps/web/src/shared/ui/*.tsx` (if shared state components are updated)

## Definition of done

- Emoji/sticker markers removed from all visible screens.
- State blocks still clearly communicate status.
- No regressions in functionality.

## Result

Pending.
