import 'dotenv/config';
import bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { documentAuditLogs } from './schema/document-audit-logs';
import { documents } from './schema/documents';
import { employers } from './schema/employers';
import { users } from './schema/users';

const DEFAULT_PASSWORD = 'ChangeMe123!';

async function seed(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    await db.delete(documentAuditLogs);
    await db.delete(documents);
    await db.delete(employers);
    await db.delete(users);

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const now = new Date();

    const [rootUser] = await db
      .insert(users)
      .values({
        username: 'root',
        displayName: 'System Root',
        role: 'ROOT',
        passwordHash,
        passwordChangedAt: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const regularUsers = await db
      .insert(users)
      .values([
        {
          username: 'alice',
          displayName: 'Alice Johnson',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: 'bob',
          displayName: 'Bob Williams',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: 'charlie',
          displayName: 'Charlie Brown',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .returning();

    const [userAlice, userBob, userCharlie] = regularUsers;

    const insertedEmployers = await db
      .insert(employers)
      .values([
        {
          fullName: 'Northwind Industrial Solutions LLC',
          shortName: 'Northwind',
          legalAddress: '120 Industrial Ave, Springfield',
          actualAddress: '120 Industrial Ave, Springfield',
          createdAt: now,
          updatedAt: now,
        },
        {
          fullName: 'Contoso Logistics Group Inc',
          shortName: 'Contoso',
          legalAddress: '77 Harbor Road, Boston',
          actualAddress: '77 Harbor Road, Boston',
          createdAt: now,
          updatedAt: now,
        },
        {
          fullName: 'Globex Technologies CJSC',
          shortName: 'Globex',
          legalAddress: '5 Science Park, San Diego',
          actualAddress: '5 Science Park, San Diego',
          createdAt: now,
          updatedAt: now,
        },
      ])
      .returning();

    const [northwind, contoso, globex] = insertedEmployers;

    const insertedDocuments = await db
      .insert(documents)
      .values([
        {
          registrationNumber: 'REG-2026-0001',
          registrationDate: new Date('2026-01-10T09:00:00.000Z'),
          title: 'Purchase contract review',
          about1: 'Purchase contract review',
          about2: 'Purchase contract review',
          kind: 'INCOMING',
          description: 'Review draft contract and prepare legal remarks.',
          incomingNumber: 'IN-501',
          outgoingNumber: null,
          employerId: northwind.id,
          outSenderEmployerId: northwind.id,
          broadcast: '',
          ownerId: rootUser.id,
          executorId: userAlice.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-05-02T09:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0002',
          registrationDate: new Date('2026-01-12T09:00:00.000Z'),
          title: 'Invoice package approval',
          about1: 'Invoice package approval',
          about2: 'Invoice package approval',
          kind: 'OUTGOING',
          description: 'Validate invoice package and attach confirmation.',
          incomingNumber: null,
          outgoingNumber: 'OUT-9002',
          outgoingDate: new Date('2026-01-30T10:00:00.000Z'),
          employerId: contoso.id,
          outSenderEmployerId: contoso.id,
          broadcast: '',
          ownerId: userAlice.id,
          executorId: userBob.id,
          status: 'DONE',
          dueDate: new Date('2026-02-01T09:00:00.000Z'),
          completedAt: new Date('2026-01-30T10:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0003',
          registrationDate: new Date('2026-01-15T09:00:00.000Z'),
          title: 'Regulatory response drafting',
          about1: 'Regulatory response drafting',
          about2: 'Regulatory response drafting',
          kind: 'INCOMING',
          description: 'Prepare response for regulator inquiry.',
          incomingNumber: 'IN-503',
          outgoingNumber: null,
          employerId: globex.id,
          outSenderEmployerId: globex.id,
          broadcast: '',
          ownerId: userBob.id,
          executorId: userCharlie.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-04-28T09:00:00.000Z'),
          isControl: true,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0004',
          registrationDate: new Date('2026-01-18T09:00:00.000Z'),
          title: 'Internal memo without employer',
          about1: 'Internal memo without employer',
          about2: 'Internal memo without employer',
          kind: 'INTERNAL',
          description: 'Internal process update memo.',
          incomingNumber: null,
          outgoingNumber: null,
          employerId: null,
          outSenderEmployerId: null,
          broadcast: '',
          ownerId: userCharlie.id,
          executorId: userAlice.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-05-12T09:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0005',
          registrationDate: new Date('2026-01-20T09:00:00.000Z'),
          title: 'Archived soft-deleted record',
          about1: 'Archived soft-deleted record',
          about2: 'Archived soft-deleted record',
          kind: 'INCOMING',
          description: 'Document is soft-deleted for restore flow checks.',
          incomingNumber: 'IN-505',
          outgoingNumber: null,
          employerId: northwind.id,
          outSenderEmployerId: northwind.id,
          broadcast: '',
          ownerId: rootUser.id,
          executorId: userBob.id,
          status: 'DONE',
          dueDate: new Date('2026-02-15T09:00:00.000Z'),
          completedAt: new Date('2026-02-14T11:00:00.000Z'),
          isControl: false,
          deletedAt: new Date('2026-03-01T08:30:00.000Z'),
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
      ])
      .returning();

    await db.insert(documentAuditLogs).values([
      {
        documentId: insertedDocuments[0].id,
        changedById: rootUser.id,
        action: 'DOCUMENT_CREATED',
        changes: { status: 'NOT_DONE' },
        createdAt: now,
      },
      {
        documentId: insertedDocuments[1].id,
        changedById: userBob.id,
        action: 'STATUS_CHANGED',
        changes: { from: 'NOT_DONE', to: 'DONE' },
        createdAt: now,
      },
      {
        documentId: insertedDocuments[4].id,
        changedById: rootUser.id,
        action: 'SOFT_DELETED',
        changes: { deletedAt: '2026-03-01T08:30:00.000Z' },
        createdAt: now,
      },
    ]);

    console.log('Database seed completed successfully.');
  } finally {
    await pool.end();
  }
}

seed().catch((error: unknown) => {
  console.error('Database seed failed:', error);
  process.exit(1);
});
