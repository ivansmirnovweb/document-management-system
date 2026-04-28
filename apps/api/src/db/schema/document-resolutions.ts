import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { documents } from './documents';
import { users } from './users';

export const documentResolutions = pgTable('document_resolutions', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  text: text('text').notNull(),
  resolutionDate: timestamp('resolution_date').notNull(),
  dueDate: timestamp('due_date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
