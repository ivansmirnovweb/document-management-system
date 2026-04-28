import { relations } from 'drizzle-orm';
import { users } from './users';
import { employers } from './employers';
import { documents } from './documents';
import { documentAuditLogs } from './document-audit-logs';
import { documentResolutions } from './document-resolutions';

export const usersRelations = relations(users, ({ many }) => ({
  ownedDocuments: many(documents, { relationName: 'document_owner' }),
  executedDocuments: many(documents, { relationName: 'document_executor' }),
  documentChanges: many(documentAuditLogs),
  authoredResolutions: many(documentResolutions),
}));

export const employersRelations = relations(employers, ({ many }) => ({
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  employer: one(employers, {
    fields: [documents.employerId],
    references: [employers.id],
  }),
  owner: one(users, {
    fields: [documents.ownerId],
    references: [users.id],
    relationName: 'document_owner',
  }),
  executor: one(users, {
    fields: [documents.executorId],
    references: [users.id],
    relationName: 'document_executor',
  }),
  auditLogs: many(documentAuditLogs),
  resolutions: many(documentResolutions),
}));

export const documentAuditLogsRelations = relations(
  documentAuditLogs,
  ({ one }) => ({
    document: one(documents, {
      fields: [documentAuditLogs.documentId],
      references: [documents.id],
    }),
    changedBy: one(users, {
      fields: [documentAuditLogs.changedById],
      references: [users.id],
    }),
  }),
);

export const documentResolutionsRelations = relations(
  documentResolutions,
  ({ one }) => ({
    document: one(documents, {
      fields: [documentResolutions.documentId],
      references: [documents.id],
    }),
    author: one(users, {
      fields: [documentResolutions.authorId],
      references: [users.id],
    }),
  }),
);
