# 115 — Fix frontend code review iteration 1 duplication hotspots (single DocumentsTable render path, shared CSV helper, auth cache side-effect source)

## Goal

Устранить три конкретные проблемы дублирования из frontend code review без широкого рефакторинга архитектуры.

## Context

В `AGENTS/reviews/frontend-code-review.md` отмечены риски регрессий из-за дублированных рендер-веток и повторяющихся side-effects в `apps/web`.

## Scope

- Убрать дублированный рендер `DocumentsTable` в `documents-page.tsx`.
- Вынести общий helper скачивания CSV и переиспользовать его в документах и отчётах.
- Убрать дублирование cache update в `auth.provider.tsx`, оставив единый источник side-effect.

## Requirements

- `DocumentsTable` должен рендериться через единый путь c общим props object.
- Императивная логика скачивания CSV должна быть в одном месте внутри `apps/web/src/shared/lib`.
- `AuthProvider` не должен дублировать `setQueryData` в публичных методах и в `onSuccess` одних и тех же мутаций.

## Constraints

- Ownership только `apps/web/**` (документация задач в `AGENTS/**`).
- Без изменений backend и без широкого рефакторинга.
- Сохранить текущее поведение UI и API-вызовов.

## Expected files

- `apps/web/src/features/documents/components/documents-page.tsx`
- `apps/web/src/features/reports/components/reports-page.tsx`
- `apps/web/src/features/auth/auth.provider.tsx`
- `apps/web/src/shared/lib/download-csv.ts`

## Definition of done

- Удалён дубль рендера таблицы документов.
- `downloadCsv` используется повторно минимум в двух страницах (`documents`, `reports`).
- В `AuthProvider` side-effect обновления query cache находится в одном месте.
- Прогнаны релевантные frontend проверки (lint/typecheck или ближайший эквивалент).

## Result

Done. В `documents-page.tsx` оставлен единый рендер `DocumentsTable` через `tableProps`; логика CSV-скачивания вынесена в `src/shared/lib/download-csv.ts` и подключена в `documents-page.tsx` и `reports-page.tsx`; в `auth.provider.tsx` удалены дублирующие `setQueryData` из `login/register/changePassword`, cache обновляется через `onSuccess` мутаций.
