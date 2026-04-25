# Backend Agent Instructions

## Scope

This is the NestJS backend.

Responsibilities:

- Authentication
- Authorization
- Business logic
- Database access
- Reports
- Permissions

## Stack

- NestJS
- TypeScript
- PostgreSQL
- Drizzle ORM
- JWT
- bcrypt

## Rules

- Use modules
- Keep controllers thin
- Put logic in services
- Use DTO validation
- Use guards for permissions
- Use Drizzle for DB
- Do not use Prisma
- Do not access DB outside backend
- Do not hard-delete except root

## Structure

src/

- auth
- users
- employers
- documents
- reports
- db
- common

## Database rules

- Use Drizzle schema
- Use PostgreSQL types
- Use migrations
- Required entities:
  - users
  - employers
  - documents

## Auth rules

- Use password login
- Hash passwords
- Support password change
- Use JWT cookies

## Roles

- USER
- ROOT

## Permissions

Guest:

- Read only

User:

- Create documents
- Edit own documents
- Delete own documents
- Change own status
- Partial edit of others

Root:

- View deleted
- Restore
- Reassign
- Hard delete

## Document logic

- NOT_DONE → active
- DONE → archived
- deleted → soft delete

## Audit

Track:

- who changed
- when
- what

## Reports

- filter by date
- executor stats
- completion metrics

## Do not

- Do not put logic in controllers
- Do not trust frontend
- Do not expose sensitive data
- Do not ignore errors
