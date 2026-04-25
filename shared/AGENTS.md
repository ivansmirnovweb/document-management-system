# Shared Package Instructions

## Scope

Shared code for frontend and backend.

Contains:

- enums
- types
- schemas
- API contracts

## Rules

- Do not import Next.js
- Do not import NestJS
- Do not import Drizzle
- Do not import React
- Keep pure TypeScript

## Allowed

- enums
- types
- Zod schemas
- constants

## Not allowed

- DB schema
- services
- controllers
- hooks
- UI components

## Schema rules

- Use Zod
- Keep aligned with backend DTOs
- Keep aligned with frontend forms
- No DB-dependent validation

## Enum rules

Use for:

- UserRole
- DocumentStatus

Avoid duplication.

## API contracts

Describe data shape only.

Good:

type Document = { id: number }

Bad:

type DBRow = ...

## Exports

Export everything from index.ts

Use:

import { UserRole } from "@document-flow/shared"

Do not use deep imports.

## Build

- Must build independently
- Must work for both frontend and backend
