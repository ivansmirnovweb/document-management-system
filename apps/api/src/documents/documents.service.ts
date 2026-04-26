import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, isNull, isNotNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
  DocumentDeadlineState,
  DocumentStatus,
  type DocumentDetails,
  type DocumentListItem,
  UserRole,
} from '@document-flow/shared';
import { DbService } from '../db/db.service';
import { documents } from '../db/schema/documents';
import { employers } from '../db/schema/employers';
import { users } from '../db/schema/users';
import type { CreateDocumentDto } from './dto/create-document.dto';
import type { ListDocumentsQueryDto } from './dto/list-documents-query.dto';
import type { ReassignDocumentDto } from './dto/reassign-document.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';
import {
  DocumentPermissionsService,
  type DocumentActor,
} from './document-permissions.service';

const ownerUsers = alias(users, 'document_owner_users');
const executorUsers = alias(users, 'document_executor_users');
const DUE_SOON_MS = 3 * 24 * 60 * 60 * 1000;

@Injectable()
export class DocumentsService {
  constructor(
    private readonly db: DbService,
    private readonly permissions: DocumentPermissionsService,
  ) {}

  async list(query: ListDocumentsQueryDto): Promise<DocumentListItem[]> {
    if (query.status === DocumentStatus.DONE) {
      return this.listCompleted();
    }

    return this.listActive();
  }

  async listPublic(): Promise<DocumentListItem[]> {
    return this.listActive();
  }

  async listActive(): Promise<DocumentListItem[]> {
    const rows = await this.db.db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.status, DocumentStatus.NOT_DONE),
          isNull(documents.deletedAt),
        ),
      )
      .orderBy(
        desc(documents.isControl),
        asc(documents.dueDate),
        asc(documents.registrationDate),
        asc(documents.id),
      );

    return rows.map((row) => this.toDocumentListItem(row));
  }

  async listCompleted(): Promise<DocumentListItem[]> {
    const rows = await this.db.db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.status, DocumentStatus.DONE),
          isNull(documents.deletedAt),
        ),
      )
      .orderBy(
        desc(documents.isControl),
        asc(documents.dueDate),
        asc(documents.registrationDate),
        asc(documents.id),
      );

    return rows.map((row) => this.toDocumentListItem(row));
  }

  async listDeleted(actor: DocumentActor): Promise<DocumentListItem[]> {
    this.permissions.assertCanListDeletedDocuments(actor);

    const rows = await this.db.db
      .select()
      .from(documents)
      .where(isNotNull(documents.deletedAt))
      .orderBy(
        desc(documents.deletedAt),
        desc(documents.updatedAt),
        desc(documents.id),
      );

    return rows.map((row) => this.toDocumentListItem(row));
  }

  async getById(id: number, actor: DocumentActor): Promise<DocumentDetails> {
    const document = await this.findDocumentDetailsById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanReadDocument(actor, document);

    return document;
  }

  async getPublicById(id: number): Promise<DocumentDetails> {
    const document = await this.findDocumentDetailsById(id, false);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanReadPublicDocument(document);
    return document;
  }

  async create(
    actor: DocumentActor,
    dto: CreateDocumentDto,
  ): Promise<DocumentDetails> {
    this.permissions.assertCanCreateDocument(actor, dto.ownerId);

    const now = new Date();
    const [created] = await this.db.db
      .insert(documents)
      .values({
        registrationNumber: dto.registrationNumber,
        registrationDate: new Date(dto.registrationDate),
        title: dto.title,
        description: dto.description ?? null,
        incomingNumber: dto.incomingNumber ?? null,
        outgoingNumber: dto.outgoingNumber ?? null,
        employerId: dto.employerId ?? null,
        ownerId: actor?.role === UserRole.ROOT ? dto.ownerId : actor!.id,
        executorId: dto.executorId,
        dueDate: new Date(dto.dueDate),
        status: DocumentStatus.NOT_DONE,
        completedAt: null,
        isControl: dto.isControl ?? false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!created) {
      throw new BadRequestException('Failed to create document');
    }

    const document = await this.findDocumentDetailsById(created.id, true);
    if (!document) {
      throw new BadRequestException('Failed to load created document');
    }

    return document;
  }

  async update(
    id: number,
    actor: DocumentActor,
    dto: UpdateDocumentDto,
  ): Promise<DocumentDetails> {
    const document = await this.findDocumentById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanUpdateDocument(
      actor,
      document,
      dto as Record<string, unknown>,
    );

    if (
      dto.ownerId !== undefined &&
      actor?.role !== UserRole.ROOT &&
      dto.ownerId !== document.ownerId
    ) {
      throw new BadRequestException(
        'Use root reassign endpoint to change owner',
      );
    }

    if (dto.status !== undefined) {
      throw new BadRequestException(
        'Use status endpoint to change document status',
      );
    }

    const now = new Date();
    const values: Record<string, unknown> = {
      updatedAt: now,
    };

    if (dto.registrationNumber !== undefined) {
      values.registrationNumber = dto.registrationNumber;
    }
    if (dto.registrationDate !== undefined) {
      values.registrationDate = new Date(dto.registrationDate);
    }
    if (dto.title !== undefined) {
      values.title = dto.title;
    }
    if (dto.description !== undefined) {
      values.description = dto.description;
    }
    if (dto.incomingNumber !== undefined) {
      values.incomingNumber = dto.incomingNumber;
    }
    if (dto.outgoingNumber !== undefined) {
      values.outgoingNumber = dto.outgoingNumber;
    }
    if (dto.employerId !== undefined) {
      values.employerId = dto.employerId;
    }
    if (dto.ownerId !== undefined) {
      values.ownerId = dto.ownerId;
    }
    if (dto.executorId !== undefined) {
      values.executorId = dto.executorId;
    }
    if (dto.dueDate !== undefined) {
      values.dueDate = new Date(dto.dueDate);
    }
    if (dto.isControl !== undefined) {
      values.isControl = dto.isControl;
    }

    const [updated] = await this.db.db
      .update(documents)
      .set(values)
      .where(eq(documents.id, id))
      .returning({ id: documents.id });

    if (!updated) {
      throw new NotFoundException('Document not found');
    }

    const updatedDocument = await this.findDocumentDetailsById(id, true);
    if (!updatedDocument) {
      throw new BadRequestException('Failed to load updated document');
    }

    return updatedDocument;
  }

  async reassignOwner(
    id: number,
    actor: DocumentActor,
    dto: ReassignDocumentDto,
  ): Promise<DocumentDetails> {
    this.permissions.assertCanReassignOwner(actor);

    const document = await this.findDocumentById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const now = new Date();
    const [updated] = await this.db.db
      .update(documents)
      .set({
        ownerId: dto.ownerId,
        updatedAt: now,
      })
      .where(eq(documents.id, id))
      .returning({ id: documents.id });

    if (!updated) {
      throw new NotFoundException('Document not found');
    }

    const updatedDocument = await this.findDocumentDetailsById(id, true);
    if (!updatedDocument) {
      throw new BadRequestException('Failed to load reassigned document');
    }

    return updatedDocument;
  }

  async changeStatus(
    id: number,
    actor: DocumentActor,
    status: DocumentStatus,
  ): Promise<DocumentDetails> {
    const document = await this.findDocumentById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanChangeStatus(actor, document);

    const now = new Date();
    const [updated] = await this.db.db
      .update(documents)
      .set({
        status,
        completedAt: status === DocumentStatus.DONE ? now : null,
        updatedAt: now,
      })
      .where(eq(documents.id, id))
      .returning({ id: documents.id });

    if (!updated) {
      throw new NotFoundException('Document not found');
    }

    const updatedDocument = await this.findDocumentDetailsById(id, true);
    if (!updatedDocument) {
      throw new BadRequestException('Failed to load updated document');
    }

    return updatedDocument;
  }

  async remove(id: number, actor: DocumentActor): Promise<void> {
    const document = await this.findDocumentById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanSoftDelete(actor, document);

    const now = new Date();
    const [updated] = await this.db.db
      .update(documents)
      .set({
        deletedAt: now,
        updatedAt: now,
      })
      .where(and(eq(documents.id, id), isNull(documents.deletedAt)))
      .returning({ id: documents.id });

    if (!updated) {
      throw new NotFoundException('Document not found');
    }
  }

  async restore(id: number, actor: DocumentActor): Promise<DocumentDetails> {
    this.permissions.assertCanRestoreDocument(actor);

    const document = await this.findDocumentDetailsById(id, true);
    if (!document || !document.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    const now = new Date();
    const [updated] = await this.db.db
      .update(documents)
      .set({
        deletedAt: null,
        updatedAt: now,
      })
      .where(and(eq(documents.id, id), isNotNull(documents.deletedAt)))
      .returning({ id: documents.id });

    if (!updated) {
      throw new NotFoundException('Document not found');
    }

    const restoredDocument = await this.findDocumentDetailsById(id, true);
    if (!restoredDocument) {
      throw new BadRequestException('Failed to load restored document');
    }

    return restoredDocument;
  }

  async hardDelete(id: number, actor: DocumentActor): Promise<void> {
    this.permissions.assertCanHardDeleteDocument(actor);

    const [deleted] = await this.db.db
      .delete(documents)
      .where(and(eq(documents.id, id), isNotNull(documents.deletedAt)))
      .returning({ id: documents.id });

    if (!deleted) {
      throw new NotFoundException('Document not found');
    }
  }

  private async findDocumentById(
    id: number,
    includeDeleted: boolean,
  ): Promise<{
    ownerId: number;
    executorId: number;
    status: DocumentStatus;
    deletedAt: Date | null;
  } | null> {
    const whereClause = includeDeleted
      ? eq(documents.id, id)
      : and(eq(documents.id, id), isNull(documents.deletedAt));

    const [document] = await this.db.db
      .select({
        ownerId: documents.ownerId,
        executorId: documents.executorId,
        status: documents.status,
        deletedAt: documents.deletedAt,
      })
      .from(documents)
      .where(whereClause)
      .limit(1);

    if (!document) {
      return null;
    }

    return {
      ...document,
      status: document.status as DocumentStatus,
    };
  }

  private async findDocumentDetailsById(
    id: number,
    includeDeleted: boolean,
  ): Promise<DocumentDetails | null> {
    const whereClause = includeDeleted
      ? eq(documents.id, id)
      : and(eq(documents.id, id), isNull(documents.deletedAt));

    const [row] = await this.db.db
      .select({
        id: documents.id,
        registrationNumber: documents.registrationNumber,
        registrationDate: documents.registrationDate,
        title: documents.title,
        description: documents.description,
        incomingNumber: documents.incomingNumber,
        outgoingNumber: documents.outgoingNumber,
        employerId: documents.employerId,
        ownerId: documents.ownerId,
        executorId: documents.executorId,
        status: documents.status,
        dueDate: documents.dueDate,
        completedAt: documents.completedAt,
        isControl: documents.isControl,
        deletedAt: documents.deletedAt,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        employerIdFromJoin: employers.id,
        employerFullName: employers.fullName,
        employerShortName: employers.shortName,
        employerLegalAddress: employers.legalAddress,
        employerActualAddress: employers.actualAddress,
        employerCreatedAt: employers.createdAt,
        employerUpdatedAt: employers.updatedAt,
        employerDeletedAt: employers.deletedAt,
        ownerIdFromJoin: ownerUsers.id,
        ownerUsername: ownerUsers.username,
        ownerDisplayName: ownerUsers.displayName,
        ownerRole: ownerUsers.role,
        ownerPasswordChangedAt: ownerUsers.passwordChangedAt,
        ownerCreatedAt: ownerUsers.createdAt,
        ownerUpdatedAt: ownerUsers.updatedAt,
        executorIdFromJoin: executorUsers.id,
        executorUsername: executorUsers.username,
        executorDisplayName: executorUsers.displayName,
        executorRole: executorUsers.role,
        executorPasswordChangedAt: executorUsers.passwordChangedAt,
        executorCreatedAt: executorUsers.createdAt,
        executorUpdatedAt: executorUsers.updatedAt,
      })
      .from(documents)
      .leftJoin(employers, eq(documents.employerId, employers.id))
      .innerJoin(ownerUsers, eq(documents.ownerId, ownerUsers.id))
      .innerJoin(executorUsers, eq(documents.executorId, executorUsers.id))
      .where(whereClause)
      .limit(1);

    if (!row) {
      return null;
    }

    const employer =
      row.employerIdFromJoin === null
        ? null
        : {
            id: row.employerIdFromJoin,
            fullName: row.employerFullName!,
            shortName: row.employerShortName!,
            legalAddress: row.employerLegalAddress!,
            actualAddress: row.employerActualAddress!,
            createdAt: row.employerCreatedAt!.toISOString(),
            updatedAt: row.employerUpdatedAt!.toISOString(),
            deletedAt: row.employerDeletedAt?.toISOString() ?? null,
          };

    return {
      id: row.id,
      registrationNumber: row.registrationNumber,
      registrationDate: row.registrationDate.toISOString(),
      title: row.title,
      description: row.description,
      incomingNumber: row.incomingNumber,
      outgoingNumber: row.outgoingNumber,
      employerId: row.employerId,
      ownerId: row.ownerId,
      executorId: row.executorId,
      status: row.status as DocumentStatus,
      dueDate: row.dueDate.toISOString(),
      completedAt: row.completedAt?.toISOString() ?? null,
      isControl: row.isControl,
      deadlineState: this.calculateDeadlineState(
        row.status as DocumentStatus,
        row.dueDate,
        row.completedAt,
      ),
      deletedAt: row.deletedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      employer,
      owner: {
        id: row.ownerIdFromJoin,
        username: row.ownerUsername,
        displayName: row.ownerDisplayName,
        role: row.ownerRole as UserRole,
        passwordChangedAt: row.ownerPasswordChangedAt?.toISOString() ?? null,
        createdAt: row.ownerCreatedAt.toISOString(),
        updatedAt: row.ownerUpdatedAt.toISOString(),
      },
      executor: {
        id: row.executorIdFromJoin,
        username: row.executorUsername,
        displayName: row.executorDisplayName,
        role: row.executorRole as UserRole,
        passwordChangedAt: row.executorPasswordChangedAt?.toISOString() ?? null,
        createdAt: row.executorCreatedAt.toISOString(),
        updatedAt: row.executorUpdatedAt.toISOString(),
      },
    } satisfies DocumentDetails;
  }

  private toDocumentListItem(row: {
    id: number;
    registrationNumber: string;
    registrationDate: Date;
    title: string;
    status: 'NOT_DONE' | 'DONE';
    ownerId: number;
    executorId: number;
    employerId: number | null;
    dueDate: Date;
    completedAt: Date | null;
    isControl: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): DocumentListItem {
    return {
      id: row.id,
      registrationNumber: row.registrationNumber,
      registrationDate: row.registrationDate.toISOString(),
      title: row.title,
      status: row.status as DocumentStatus,
      ownerId: row.ownerId,
      executorId: row.executorId,
      employerId: row.employerId,
      dueDate: row.dueDate.toISOString(),
      completedAt: row.completedAt?.toISOString() ?? null,
      isControl: row.isControl,
      deadlineState: this.calculateDeadlineState(
        row.status as DocumentStatus,
        row.dueDate,
        row.completedAt,
      ),
      deletedAt: row.deletedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private calculateDeadlineState(
    status: DocumentStatus,
    dueDate: Date,
    completedAt: Date | null,
  ): DocumentDeadlineState {
    if (status === DocumentStatus.DONE || completedAt) {
      return DocumentDeadlineState.COMPLETED;
    }

    const now = Date.now();
    const dueAt = dueDate.getTime();

    if (dueAt < now) {
      return DocumentDeadlineState.OVERDUE;
    }

    if (dueAt - now <= DUE_SOON_MS) {
      return DocumentDeadlineState.DUE_SOON;
    }

    return DocumentDeadlineState.ON_TIME;
  }
}
