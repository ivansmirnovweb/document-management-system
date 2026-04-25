<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Scope

This directory contains the Next.js frontend application.

The frontend is responsible for:

- Rendering pages and UI
- Fetching data from the NestJS API
- Displaying document tables
- Handling forms
- Showing role-based UI states
- Providing search, filters, and export actions through the API

The frontend must not contain authoritative business logic.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- TanStack Query
- TanStack Table
- React Hook Form
- Zod
- Shared types and schemas from `@document-flow/shared`

## Rules

- Use the Next.js App Router.
- Use TypeScript for all code.
- Use TanStack Query for server-state management.
- Use TanStack Table for document tables.
- Use React Hook Form for forms.
- Use Zod for frontend validation.
- Prefer shared schemas from `@document-flow/shared` when possible.
- Do not access PostgreSQL directly.
- Do not import backend-only code.
- Do not import Drizzle schema.
- Do not duplicate backend permission logic as the source of truth.
- UI may hide or disable buttons based on user role, but backend must still enforce permissions.
- Keep components focused and small.
- Keep API calls in a dedicated API/client layer.
- Keep feature-specific code grouped by feature.

## Suggested structure

Use this structure when adding frontend functionality:

```txt
src/
├── app/
├── features/
│   ├── auth/
│   ├── documents/
│   ├── employers/
│   └── reports/
├── shared/
│   ├── api/
│   ├── ui/
│   └── lib/
└── entities/
```

## API interaction rules

- Read NEXT_PUBLIC_API_URL from environment variables.
- Send requests only to the NestJS API.
- Use credentials: "include" when working with cookie-based auth.
- Keep API functions separate from UI components.
- Keep query keys stable and explicit.
- Invalidate related queries after mutations.

## Forms

- Use React Hook Form.
- Use Zod schemas for validation.
- Prefer shared Zod schemas from @document-flow/shared.
- Show validation errors near fields.
- Keep form submit logic readable.
- Do not silently ignore API errors.

## Tables

Document tables should support:

- Active documents
- Completed documents
- Search results
- Deleted documents for root users where applicable

Rows should visually reflect:

- Deadline state
- Control priority
- Completion status
- Deleted state where applicable

## Styling

- Use Tailwind CSS.
- Keep UI clean and simple.
- Do not over-engineer design.
- Prioritize usability over visual complexity.
- Use consistent spacing, typography, and table states.

## Permissions in UI

The frontend may conditionally show:

- Edit button
- Delete button
- Complete button
- Restore button
- Reassign button
- Hard-delete button

However, these checks are only for UX. The backend must always enforce real permissions.

## Do not

- Do not create mock business rules that conflict with backend logic.
- Do not store sensitive auth data in localStorage.
- Do not call the database directly.
- Do not add global state unless TanStack Query is insufficient.
- Do not create unnecessary abstractions.
