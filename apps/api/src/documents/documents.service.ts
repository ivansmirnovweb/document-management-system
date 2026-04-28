import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  isNull,
  isNotNull,
  or,
  sql,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
  DocumentKind,
  DocumentStatus,
  getDocumentDeadlineState,
  type DocumentDetails,
  type DocumentListItem,
  UserRole,
} from '@document-flow/shared';
import { DbService } from '../db/db.service';
import { documents } from '../db/schema/documents';
import { employers } from '../db/schema/employers';
import { users } from '../db/schema/users';
import { documentResolutions } from '../db/schema/document-resolutions';
import type { CreateDocumentDto } from './dto/create-document.dto';
import type { ListDocumentsQueryDto } from './dto/list-documents-query.dto';
import type { SearchDocumentsQueryDto } from './dto/search-documents-query.dto';
import type { ReassignDocumentDto } from './dto/reassign-document.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';
import type { CreateResolutionDto } from './dto/create-resolution.dto';
import type { UpdateResolutionDto } from './dto/update-resolution.dto';
import {
  DocumentPermissionsService,
  type DocumentActor,
} from './document-permissions.service';

const ownerUsers = alias(users, 'document_owner_users');
const executorUsers = alias(users, 'document_executor_users');
const lastChangedByUsers = alias(users, 'document_last_changed_by_users');

@Injectable()
export class DocumentsService {
  constructor(
    private readonly db: DbService,
    private readonly permissions: DocumentPermissionsService,
  ) {}

  async list(
    actor: DocumentActor,
    query: ListDocumentsQueryDto,
  ): Promise<DocumentListItem[]> {
    if (query.status === DocumentStatus.DONE) {
      return this.listCompleted();
    }

    return this.listActive(actor);
  }

  async listPublic(): Promise<DocumentListItem[]> {
    return this.listActive();
  }

  async listActive(actor?: DocumentActor): Promise<DocumentListItem[]> {
    const conditions = [
      eq(documents.status, DocumentStatus.NOT_DONE),
      isNull(documents.deletedAt),
    ];

    if (actor && actor.role !== UserRole.ROOT) {
      conditions.push(eq(executorUsers.unit, actor.unit));
    }

    const rows = await this.db.db
      .select({
        id: documents.id,
        registrationNumber: documents.registrationNumber,
        registrationDate: documents.registrationDate,
        title: documents.title,
        about1: documents.about1,
        about2: documents.about2,
        kind: documents.kind,
        status: documents.status,
        ownerId: documents.ownerId,
        executorId: documents.executorId,
        employerId: documents.employerId,
        outSenderEmployerId: documents.outSenderEmployerId,
        outgoingDate: documents.outgoingDate,
        broadcast: documents.broadcast,
        dueDate: documents.dueDate,
        completedAt: documents.completedAt,
        writtenOffAt: documents.writtenOffAt,
        isControl: documents.isControl,
        deletedAt: documents.deletedAt,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        lastChangedAt: documents.lastChangedAt,
      })
      .from(documents)
      .innerJoin(executorUsers, eq(documents.executorId, executorUsers.id))
      .where(and(...conditions))
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
          or(
            eq(documents.status, DocumentStatus.DONE),
          ),
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

  async search(
    actor: DocumentActor,
    query: SearchDocumentsQueryDto,
  ): Promise<DocumentListItem[]> {
    const searchText = query.q?.trim();
    const searchConditions = searchText
      ? [
          ilike(documents.registrationNumber, `%${searchText}%`),
          ilike(documents.title, `%${searchText}%`),
          ilike(documents.about1, `%${searchText}%`),
          ilike(documents.about2, `%${searchText}%`),
          ilike(documents.description, `%${searchText}%`),
          ilike(documents.broadcast, `%${searchText}%`),
          ilike(documents.incomingNumber, `%${searchText}%`),
          ilike(documents.outgoingNumber, `%${searchText}%`),
          ilike(sql`${documents.registrationDate}::text`, `%${searchText}%`),
          ilike(sql`${documents.outgoingDate}::text`, `%${searchText}%`),
          ilike(sql`${documents.dueDate}::text`, `%${searchText}%`),
          ilike(ownerUsers.username, `%${searchText}%`),
          ilike(executorUsers.username, `%${searchText}%`),
        ]
      : [];

    const statusCondition =
      query.status === DocumentStatus.DONE
        ? or(
            eq(documents.status, DocumentStatus.DONE),
          )
        : query.status
          ? eq(documents.status, query.status)
          : undefined;

    const conditions = [statusCondition].filter(
      (condition): condition is NonNullable<typeof condition> =>
        condition !== undefined,
    );

    if (searchConditions.length > 0) {
      const searchClause = or(...searchConditions);
      if (searchClause) {
        conditions.push(searchClause);
      }
    }

    const rows = await this.db.db
      .select({
        id: documents.id,
        registrationNumber: documents.registrationNumber,
        registrationDate: documents.registrationDate,
        title: documents.title,
        about1: documents.about1,
        about2: documents.about2,
        kind: documents.kind,
        status: documents.status,
        ownerId: documents.ownerId,
        executorId: documents.executorId,
        employerId: documents.employerId,
        outSenderEmployerId: documents.outSenderEmployerId,
        outgoingDate: documents.outgoingDate,
        broadcast: documents.broadcast,
        dueDate: documents.dueDate,
        completedAt: documents.completedAt,
        writtenOffAt: documents.writtenOffAt,
        isControl: documents.isControl,
        deletedAt: documents.deletedAt,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        lastChangedAt: documents.lastChangedAt,
      })
      .from(documents)
      .innerJoin(ownerUsers, eq(documents.ownerId, ownerUsers.id))
      .innerJoin(executorUsers, eq(documents.executorId, executorUsers.id))
      .innerJoin(
        lastChangedByUsers,
        eq(documents.lastChangedById, lastChangedByUsers.id),
      )
      .where(and(...conditions))
      .orderBy(
        desc(documents.isControl),
        asc(documents.dueDate),
        asc(documents.registrationDate),
        asc(documents.id),
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

    this.validateKindFields({
      kind: dto.kind,
      incomingNumber: dto.incomingNumber ?? null,
      outgoingNumber: dto.outgoingNumber ?? null,
    });

    const now = new Date();
    const registrationDate = new Date(dto.registrationDate);
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(registrationDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [created] = await this.db.db
      .insert(documents)
      .values({
        registrationNumber: dto.registrationNumber,
        registrationDate,
        title: dto.title,
        about1: dto.about1 ?? dto.title,
        about2: dto.about2 ?? dto.about1 ?? dto.title,
        kind: dto.kind,
        description: dto.description ?? null,
        incomingNumber: dto.incomingNumber ?? null,
        outgoingNumber: dto.outgoingNumber ?? null,
        outgoingDate: dto.outgoingDate ? new Date(dto.outgoingDate) : null,
        employerId: dto.employerId ?? null,
        outSenderEmployerId: dto.outSenderEmployerId ?? dto.employerId ?? null,
        broadcast: dto.broadcast ?? '',
        ownerId: actor?.role === UserRole.ROOT ? dto.ownerId : actor!.id,
        executorId: dto.executorId,
        dueDate,
        status: DocumentStatus.NOT_DONE,
        completedAt: null,
        isControl: dto.isControl ?? false,
        createdAt: now,
        updatedAt: now,
        lastChangedAt: now,
        lastChangedById: actor!.id,
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

    if (dto.dueDate !== undefined) {
      const nextDueDate = new Date(dto.dueDate);
      const registrationDateWillChange = dto.registrationDate !== undefined;
      const extendsDeadline =
        nextDueDate.getTime() > document.dueDate.getTime();

      if (extendsDeadline && !registrationDateWillChange) {
        throw new BadRequestException(
          'Due date extension requires changing registration date per TZ rule',
        );
      }
    }

    this.validateKindFields({
      kind: dto.kind ?? document.kind,
      incomingNumber:
        dto.incomingNumber !== undefined
          ? dto.incomingNumber
          : document.incomingNumber,
      outgoingNumber:
        dto.outgoingNumber !== undefined
          ? dto.outgoingNumber
          : document.outgoingNumber,
    });

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
    if (dto.about1 !== undefined) {
      values.about1 = dto.about1;
    }
    if (dto.about2 !== undefined) {
      values.about2 = dto.about2;
    }
    if (dto.kind !== undefined) {
      values.kind = dto.kind;
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
    if (dto.outgoingDate !== undefined) {
      values.outgoingDate = dto.outgoingDate
        ? new Date(dto.outgoingDate)
        : null;
    }
    if (dto.employerId !== undefined) {
      values.employerId = dto.employerId;
    }
    if (dto.outSenderEmployerId !== undefined) {
      values.outSenderEmployerId = dto.outSenderEmployerId;
    }
    if (dto.broadcast !== undefined) {
      values.broadcast = dto.broadcast;
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
      if (dto.isControl === false) {
        const [{ count }] = await this.db.db
          .select({ count: sql<number>`count(*)` })
          .from(documentResolutions)
          .where(eq(documentResolutions.documentId, id));

        if (Number(count) > 0) {
          throw new BadRequestException(
            'Control flag is assigned from resolutions and cannot be unset while resolutions exist',
          );
        }
      }

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

  async createResolution(
    id: number,
    actor: DocumentActor,
    dto: CreateResolutionDto,
  ): Promise<DocumentDetails> {
    const document = await this.findDocumentById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanUpdateDocument(actor, document, {
      description: dto.text,
    });

    const now = new Date();
    await this.db.db.insert(documentResolutions).values({
      documentId: id,
      authorId: actor!.id,
      text: dto.text,
      resolutionDate: new Date(dto.resolutionDate),
      dueDate: new Date(dto.dueDate),
      createdAt: now,
      updatedAt: now,
    });

    await this.db.db
      .update(documents)
      .set({
        isControl: true,
        updatedAt: now,
        lastChangedAt: now,
        lastChangedById: actor!.id,
      })
      .where(eq(documents.id, id));

    const updatedDocument = await this.findDocumentDetailsById(id, true);
    if (!updatedDocument) {
      throw new BadRequestException('Failed to load updated document');
    }

    return updatedDocument;
  }

  async updateResolution(
    id: number,
    resolutionId: number,
    actor: DocumentActor,
    dto: UpdateResolutionDto,
  ): Promise<DocumentDetails> {
    const document = await this.findDocumentById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanUpdateDocument(actor, document, {
      description: dto.text,
    });

    const values: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.text !== undefined) values.text = dto.text;
    if (dto.resolutionDate !== undefined)
      values.resolutionDate = new Date(dto.resolutionDate);
    if (dto.dueDate !== undefined) values.dueDate = new Date(dto.dueDate);

    await this.db.db
      .update(documentResolutions)
      .set(values)
      .where(
        and(
          eq(documentResolutions.id, resolutionId),
          eq(documentResolutions.documentId, id),
        ),
      );

    const updatedDocument = await this.findDocumentDetailsById(id, true);
    if (!updatedDocument) {
      throw new BadRequestException('Failed to load updated document');
    }

    return updatedDocument;
  }

  async deleteResolution(
    id: number,
    resolutionId: number,
    actor: DocumentActor,
  ): Promise<DocumentDetails> {
    const document = await this.findDocumentById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanUpdateDocument(actor, document, {
      description: 'delete',
    });

    await this.db.db
      .delete(documentResolutions)
      .where(
        and(
          eq(documentResolutions.id, resolutionId),
          eq(documentResolutions.documentId, id),
        ),
      );

    const [{ count }] = await this.db.db
      .select({ count: sql<number>`count(*)` })
      .from(documentResolutions)
      .where(eq(documentResolutions.documentId, id));

    await this.db.db
      .update(documents)
      .set({ isControl: Number(count) > 0, updatedAt: new Date() })
      .where(eq(documents.id, id));

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
        lastChangedAt: now,
        lastChangedById: actor!.id,
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
        writtenOffAt: status === DocumentStatus.NOT_DONE ? null : undefined,
        updatedAt: now,
        lastChangedAt: now,
        lastChangedById: actor!.id,
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

  async writeOff(id: number, actor: DocumentActor): Promise<DocumentDetails> {
    const document = await this.findDocumentById(id, true);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.permissions.assertCanChangeStatus(actor, document);

    if (document.status !== DocumentStatus.DONE) {
      throw new BadRequestException(
        'Only completed documents can be written off to case',
      );
    }

    const now = new Date();
    const [updated] = await this.db.db
      .update(documents)
      .set({
        status: DocumentStatus.DONE,
        completedAt: now,
        writtenOffAt: now,
        updatedAt: now,
        lastChangedAt: now,
        lastChangedById: actor!.id,
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

    const [rootUser] = await this.db.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, UserRole.ROOT))
      .limit(1);

    if (!rootUser) {
      throw new BadRequestException('Root user not found');
    }

    const now = new Date();
    const [updated] = await this.db.db
      .update(documents)
      .set({
        ownerId: rootUser.id,
        deletedAt: now,
        updatedAt: now,
        lastChangedAt: now,
        lastChangedById: actor!.id,
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
        lastChangedAt: now,
        lastChangedById: actor!.id,
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
    kind: DocumentKind;
    incomingNumber: string | null;
    outgoingNumber: string | null;
    registrationDate: Date;
    dueDate: Date;
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
        kind: documents.kind,
        incomingNumber: documents.incomingNumber,
        outgoingNumber: documents.outgoingNumber,
        registrationDate: documents.registrationDate,
        dueDate: documents.dueDate,
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
      kind: document.kind as DocumentKind,
      incomingNumber: document.incomingNumber,
      outgoingNumber: document.outgoingNumber,
      registrationDate: document.registrationDate,
      dueDate: document.dueDate,
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
        about1: documents.about1,
        about2: documents.about2,
        kind: documents.kind,
        description: documents.description,
        incomingNumber: documents.incomingNumber,
        outgoingNumber: documents.outgoingNumber,
        outgoingDate: documents.outgoingDate,
        employerId: documents.employerId,
        outSenderEmployerId: documents.outSenderEmployerId,
        broadcast: documents.broadcast,
        ownerId: documents.ownerId,
        executorId: documents.executorId,
        status: documents.status,
        dueDate: documents.dueDate,
        completedAt: documents.completedAt,
        writtenOffAt: documents.writtenOffAt,
        isControl: documents.isControl,
        deletedAt: documents.deletedAt,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        lastChangedAt: documents.lastChangedAt,
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
        ownerUnit: ownerUsers.unit,
        ownerRole: ownerUsers.role,
        ownerPasswordChangedAt: ownerUsers.passwordChangedAt,
        ownerCreatedAt: ownerUsers.createdAt,
        ownerUpdatedAt: ownerUsers.updatedAt,
        executorIdFromJoin: executorUsers.id,
        executorUsername: executorUsers.username,
        executorDisplayName: executorUsers.displayName,
        executorUnit: executorUsers.unit,
        executorRole: executorUsers.role,
        executorPasswordChangedAt: executorUsers.passwordChangedAt,
        executorCreatedAt: executorUsers.createdAt,
        executorUpdatedAt: executorUsers.updatedAt,
        lastChangedById: lastChangedByUsers.id,
        lastChangedByUsername: lastChangedByUsers.username,
        lastChangedByDisplayName: lastChangedByUsers.displayName,
        lastChangedByUnit: lastChangedByUsers.unit,
        lastChangedByRole: lastChangedByUsers.role,
        lastChangedByPasswordChangedAt: lastChangedByUsers.passwordChangedAt,
        lastChangedByCreatedAt: lastChangedByUsers.createdAt,
        lastChangedByUpdatedAt: lastChangedByUsers.updatedAt,
      })
      .from(documents)
      .leftJoin(employers, eq(documents.employerId, employers.id))
      .innerJoin(ownerUsers, eq(documents.ownerId, ownerUsers.id))
      .innerJoin(executorUsers, eq(documents.executorId, executorUsers.id))
      .innerJoin(
        lastChangedByUsers,
        eq(documents.lastChangedById, lastChangedByUsers.id),
      )
      .where(whereClause)
      .limit(1);

    if (!row) {
      return null;
    }

    const resolutionRows = await this.db.db
      .select({
        id: documentResolutions.id,
        documentId: documentResolutions.documentId,
        authorId: documentResolutions.authorId,
        text: documentResolutions.text,
        resolutionDate: documentResolutions.resolutionDate,
        dueDate: documentResolutions.dueDate,
        createdAt: documentResolutions.createdAt,
        updatedAt: documentResolutions.updatedAt,
        authorIdFromJoin: users.id,
        authorUsername: users.username,
        authorDisplayName: users.displayName,
        authorUnit: users.unit,
        authorRole: users.role,
        authorPasswordChangedAt: users.passwordChangedAt,
        authorCreatedAt: users.createdAt,
        authorUpdatedAt: users.updatedAt,
      })
      .from(documentResolutions)
      .innerJoin(users, eq(documentResolutions.authorId, users.id))
      .where(eq(documentResolutions.documentId, row.id))
      .orderBy(
        desc(documentResolutions.createdAt),
        desc(documentResolutions.id),
      );

    const resolutions = resolutionRows.map((resolution) => ({
      id: resolution.id,
      documentId: resolution.documentId,
      authorId: resolution.authorId,
      text: resolution.text,
      resolutionDate: resolution.resolutionDate.toISOString(),
      dueDate: resolution.dueDate.toISOString(),
      createdAt: resolution.createdAt.toISOString(),
      updatedAt: resolution.updatedAt.toISOString(),
      author: {
        id: resolution.authorIdFromJoin,
        username: resolution.authorUsername,
        displayName: resolution.authorDisplayName,
        unit: resolution.authorUnit,
        role: resolution.authorRole as UserRole,
        passwordChangedAt:
          resolution.authorPasswordChangedAt?.toISOString() ?? null,
        createdAt: resolution.authorCreatedAt.toISOString(),
        updatedAt: resolution.authorUpdatedAt.toISOString(),
      },
    }));

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
      about1: row.about1,
      about2: row.about2,
      kind: row.kind as DocumentKind,
      description: row.description,
      incomingNumber: row.incomingNumber,
      outgoingNumber: row.outgoingNumber,
      outgoingDate: row.outgoingDate?.toISOString() ?? null,
      employerId: row.employerId,
      outSenderEmployerId: row.outSenderEmployerId,
      broadcast: row.broadcast,
      ownerId: row.ownerId,
      executorId: row.executorId,
      status: row.status as DocumentStatus,
      dueDate: row.dueDate.toISOString(),
      completedAt: row.completedAt?.toISOString() ?? null,
      writtenOffAt: row.writtenOffAt?.toISOString() ?? null,
      isControl: row.isControl,
      deadlineState: getDocumentDeadlineState(
        row.status as DocumentStatus,
        row.dueDate,
        row.completedAt,
      ),
      deletedAt: row.deletedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      lastChangedAt: row.lastChangedAt.toISOString(),
      employer,
      owner: {
        id: row.ownerIdFromJoin,
        username: row.ownerUsername,
        displayName: row.ownerDisplayName,
        unit: row.ownerUnit,
        role: row.ownerRole as UserRole,
        passwordChangedAt: row.ownerPasswordChangedAt?.toISOString() ?? null,
        createdAt: row.ownerCreatedAt.toISOString(),
        updatedAt: row.ownerUpdatedAt.toISOString(),
      },
      resolutions,
      lastChangedBy: {
        id: row.lastChangedById,
        username: row.lastChangedByUsername,
        displayName: row.lastChangedByDisplayName,
        unit: row.lastChangedByUnit,
        role: row.lastChangedByRole as UserRole,
        passwordChangedAt:
          row.lastChangedByPasswordChangedAt?.toISOString() ?? null,
        createdAt: row.lastChangedByCreatedAt.toISOString(),
        updatedAt: row.lastChangedByUpdatedAt.toISOString(),
      },
      executor: {
        id: row.executorIdFromJoin,
        username: row.executorUsername,
        displayName: row.executorDisplayName,
        unit: row.executorUnit,
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
    about1: string;
    about2: string | null;
    kind: 'INCOMING' | 'OUTGOING' | 'INTERNAL';
    status: 'NOT_DONE' | 'DONE' | 'WRITTEN_OFF';
    ownerId: number;
    executorId: number;
    employerId: number | null;
    outSenderEmployerId: number | null;
    outgoingDate: Date | null;
    broadcast: string;
    dueDate: Date;
    completedAt: Date | null;
    writtenOffAt: Date | null;
    isControl: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    lastChangedAt: Date;
  }): DocumentListItem {
    return {
      id: row.id,
      registrationNumber: row.registrationNumber,
      registrationDate: row.registrationDate.toISOString(),
      title: row.title,
      about1: row.about1,
      about2: row.about2,
      kind: row.kind as DocumentKind,
      status: row.status as DocumentStatus,
      ownerId: row.ownerId,
      executorId: row.executorId,
      employerId: row.employerId,
      outSenderEmployerId: row.outSenderEmployerId,
      outgoingDate: row.outgoingDate?.toISOString() ?? null,
      broadcast: row.broadcast,
      dueDate: row.dueDate.toISOString(),
      completedAt: row.completedAt?.toISOString() ?? null,
      writtenOffAt: row.writtenOffAt?.toISOString() ?? null,
      isControl: row.isControl,
      deadlineState: getDocumentDeadlineState(
        row.status as DocumentStatus,
        row.dueDate,
        row.completedAt,
      ),
      deletedAt: row.deletedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      lastChangedAt: row.lastChangedAt.toISOString(),
    };
  }

  private validateKindFields(input: {
    kind: DocumentKind;
    incomingNumber: string | null;
    outgoingNumber: string | null;
  }): void {
    const incoming = input.incomingNumber?.trim() ?? null;
    const outgoing = input.outgoingNumber?.trim() ?? null;

    if (input.kind === DocumentKind.INCOMING) {
      if (!incoming) {
        throw new BadRequestException(
          'Incoming document requires incomingNumber',
        );
      }
      if (outgoing) {
        throw new BadRequestException(
          'Incoming document must not have outgoingNumber',
        );
      }
      return;
    }

    if (input.kind === DocumentKind.OUTGOING) {
      if (!outgoing) {
        throw new BadRequestException(
          'Outgoing document requires outgoingNumber',
        );
      }
      if (incoming) {
        throw new BadRequestException(
          'Outgoing document must not have incomingNumber',
        );
      }
      return;
    }

    if (incoming || outgoing) {
      throw new BadRequestException(
        'Internal document must not have incoming/outgoing numbers',
      );
    }
  }

}
