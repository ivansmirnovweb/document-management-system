import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['USER', 'ROOT']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('USER'),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  passwordChangedAt: timestamp('password_changed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
