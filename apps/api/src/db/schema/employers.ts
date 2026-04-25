import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const employers = pgTable('employers', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  shortName: varchar('short_name', { length: 255 }).notNull(),
  legalAddress: varchar('legal_address', { length: 500 }).notNull(),
  actualAddress: varchar('actual_address', { length: 500 }).notNull(),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
