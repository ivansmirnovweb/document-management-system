import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
  boolean,
  text,
} from 'drizzle-orm/pg-core';
import { employers } from './employers';
import { users } from './users';

export const documentStatusEnum = pgEnum('document_status', [
  'NOT_DONE',
  'DONE',
]);

export const documentKindEnum = pgEnum('document_kind', [
  'INCOMING',
  'OUTGOING',
  'INTERNAL',
]);

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  registrationNumber: varchar('registration_number', { length: 100 })
    .notNull()
    .unique(),
  registrationDate: timestamp('registration_date').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  about1: varchar('about1', { length: 255 }).notNull(),
  about2: varchar('about2', { length: 255 }),
  kind: documentKindEnum('kind').notNull(),
  description: text('description'),
  incomingNumber: varchar('incoming_number', { length: 100 }),
  outgoingNumber: varchar('outgoing_number', { length: 100 }),
  outgoingDate: timestamp('outgoing_date'),
  employerId: integer('employer_id').references(() => employers.id, {
    onDelete: 'set null',
  }),
  outSenderEmployerId: integer('out_sender_employer_id').references(
    () => employers.id,
    { onDelete: 'set null' },
  ),
  broadcast: varchar('broadcast', { length: 255 }).notNull().default(''),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  executorId: integer('executor_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  status: documentStatusEnum('status').notNull().default('NOT_DONE'),
  dueDate: timestamp('due_date').notNull(),
  completedAt: timestamp('completed_at'),
  writtenOffAt: timestamp('written_off_at'),
  isControl: boolean('is_control').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastChangedAt: timestamp('last_changed_at').notNull().defaultNow(),
  lastChangedById: integer('last_changed_by_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
});
