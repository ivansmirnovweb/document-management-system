import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const healthChecks = pgTable("health_checks", {
  id: serial("id").primaryKey(),
  message: varchar("message", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
