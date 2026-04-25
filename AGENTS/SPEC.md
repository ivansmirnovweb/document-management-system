# Project Specification

## Overview

Electronic document workflow system.

## Core features

- Register documents (incoming, outgoing, internal)
- Track deadlines
- Mark as completed
- Archive completed documents
- Soft-delete documents
- Restore deleted documents (root)
- Search documents
- Generate reports

## Entities

- User (executor)
- Employer (counterparty)
- Document

## Roles

Guest:

- Read-only access to active documents

User:

- Create documents
- Edit own documents
- Delete own documents (soft delete)
- Change status of own documents
- Partial edit of others

Root:

- View deleted documents
- Restore documents
- Reassign owner
- Hard delete

## Document lifecycle

NOT_DONE → active  
DONE → archived  
deleted → soft deleted

## Architecture

Frontend: Next.js  
Backend: NestJS  
Database: PostgreSQL  
ORM: Drizzle

## Important rules

- Backend is source of truth
- Frontend only calls API
- Soft delete by default
- Hard delete only for root
