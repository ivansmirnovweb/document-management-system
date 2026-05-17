import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentStatus, UserRole } from '@document-flow/shared';
import type { AuthenticatedUser } from '../auth/auth.types';

export type DocumentActor = Pick<AuthenticatedUser, 'id' | 'role' | 'unit'> | null;

const EXECUTION_FIELDS = new Set([
  'outgoingNumber',
  'outgoingDate',
  'outSenderEmployerId',
  'about2',
  'broadcast',
]);

@Injectable()
export class DocumentPermissionsService {
  assertCanReadDocument(
    actor: DocumentActor,
    document: { deletedAt?: string | Date | null },
  ): void {
    if (document.deletedAt && actor?.role !== UserRole.ROOT) {
      throw new NotFoundException('Document not found');
    }
  }

  assertCanReadPublicDocument(document: {
    status: DocumentStatus | 'NOT_DONE' | 'DONE';
    deletedAt?: string | Date | null;
  }): void {
    if (document.deletedAt || document.status !== DocumentStatus.NOT_DONE) {
      throw new NotFoundException('Document not found');
    }
  }

  assertCanListDeletedDocuments(actor: DocumentActor): void {
    if (actor?.role !== UserRole.ROOT) {
      throw new ForbiddenException('Root access required');
    }
  }

  assertCanCreateDocument(actor: DocumentActor, ownerId: number): void {
    if (!actor) {
      throw new ForbiddenException('Authentication required');
    }

    if (actor.role !== UserRole.ROOT && actor.id !== ownerId) {
      throw new ForbiddenException('Users can only create own documents');
    }
  }

  assertCanUpdateDocument(
    actor: DocumentActor,
    document: {
      ownerId: number;
      executorId: number;
      status: DocumentStatus | 'NOT_DONE' | 'DONE';
      deletedAt?: Date | null;
    },
    changes: Record<string, unknown>,
  ): void {
    this.assertCanReadDocument(actor, document);

    if (document.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (
      document.status === DocumentStatus.DONE
    ) {
      throw new ForbiddenException('Completed documents are read-only');
    }

    if (!actor) {
      throw new ForbiddenException('Authentication required');
    }

    if (actor.role === UserRole.ROOT) {
      return;
    }

    const changedFields = Object.entries(changes)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => key);

    if (actor.id === document.ownerId) {
      return;
    }

    if (actor.id === document.executorId) {
      const onlyExecutionFields =
        changedFields.length > 0 &&
        changedFields.every((field) => EXECUTION_FIELDS.has(field));

      if (onlyExecutionFields) {
        return;
      }
    }

    throw new ForbiddenException('Document update is not allowed');
  }

  assertCanChangeStatus(
    actor: DocumentActor,
    document: {
      ownerId: number;
      deletedAt?: Date | null;
    },
  ): void {
    this.assertCanReadDocument(actor, document);

    if (document.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (!actor) {
      throw new ForbiddenException('Authentication required');
    }

    if (actor.role === UserRole.ROOT || actor.id === document.ownerId) {
      return;
    }

    throw new ForbiddenException('Can only change status for own documents');
  }

  assertCanSoftDelete(
    actor: DocumentActor,
    document: {
      ownerId: number;
      status: DocumentStatus | 'NOT_DONE' | 'DONE';
      deletedAt?: Date | null;
    },
  ): void {
    this.assertCanReadDocument(actor, document);

    if (document.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (
      document.status === DocumentStatus.DONE
    ) {
      throw new ForbiddenException('Completed documents are read-only');
    }

    if (!actor) {
      throw new ForbiddenException('Authentication required');
    }

    if (actor.role !== UserRole.ROOT && actor.id === document.ownerId) {
      return;
    }

    throw new ForbiddenException('Can only delete own documents');
  }

  assertCanRestoreDocument(actor: DocumentActor): void {
    if (actor?.role !== UserRole.ROOT) {
      throw new ForbiddenException('Root access required');
    }
  }

  assertCanHardDeleteDocument(actor: DocumentActor): void {
    if (actor?.role !== UserRole.ROOT) {
      throw new ForbiddenException('Root access required');
    }
  }

  assertCanReassignOwner(actor: DocumentActor): void {
    if (actor?.role !== UserRole.ROOT) {
      throw new ForbiddenException('Root access required');
    }
  }
}
