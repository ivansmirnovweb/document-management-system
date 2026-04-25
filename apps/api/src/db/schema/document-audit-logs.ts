import {
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { documents } from './documents';
import { users } from './users';

export const documentAuditLogs = pgTable('document_audit_logs', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id').references(() => documents.id, {
    onDelete: 'set null',
  }),
  changedById: integer('changed_by_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  action: varchar('action', { length: 100 }).notNull(),
  changes: jsonb('changes').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
