import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DocumentStatus, UserRole } from '@document-flow/shared';
import { DocumentPermissionsService } from './document-permissions.service';

describe('DocumentPermissionsService', () => {
  const service = new DocumentPermissionsService();

  it('allows soft delete only for the owner', () => {
    expect(() =>
      service.assertCanSoftDelete(
        { id: 2, role: UserRole.USER, unit: 'Канцелярия' },
        { ownerId: 2, status: DocumentStatus.NOT_DONE, deletedAt: null },
      ),
    ).not.toThrow();
  });

  it('rejects root soft delete even for their own document', () => {
    expect(() =>
      service.assertCanSoftDelete(
        { id: 1, role: UserRole.ROOT, unit: 'Администрация' },
        { ownerId: 1, status: DocumentStatus.NOT_DONE, deletedAt: null },
      ),
    ).toThrow(ForbiddenException);
  });

  it('blocks repeated soft delete attempts', () => {
    expect(() =>
      service.assertCanSoftDelete(
        { id: 2, role: UserRole.USER, unit: 'Канцелярия' },
        { ownerId: 2, status: DocumentStatus.NOT_DONE, deletedAt: new Date() },
      ),
    ).toThrow(NotFoundException);
  });

  it('keeps root-only deleted record operations', () => {
    expect(() => service.assertCanRestoreDocument({ id: 1, role: UserRole.ROOT, unit: 'Администрация' })).not.toThrow();
    expect(() => service.assertCanHardDeleteDocument({ id: 1, role: UserRole.ROOT, unit: 'Администрация' })).not.toThrow();
    expect(() => service.assertCanReassignOwner({ id: 1, role: UserRole.ROOT, unit: 'Администрация' })).not.toThrow();
  });

  it('allows non-owner executor to update TZ close-out fields only', () => {
    expect(() =>
      service.assertCanUpdateDocument(
        { id: 3, role: UserRole.USER, unit: 'Канцелярия' },
        {
          ownerId: 2,
          executorId: 3,
          status: DocumentStatus.NOT_DONE,
          deletedAt: null,
        },
        {
          outgoingNumber: '123',
          outgoingDate: '2026-05-17',
          outSenderEmployerId: 2,
          about2: 'Ответ отправлен',
          broadcast: 'Почтой',
        },
      ),
    ).not.toThrow();
  });

  it('rejects non-owner executor changes outside TZ close-out fields', () => {
    expect(() =>
      service.assertCanUpdateDocument(
        { id: 3, role: UserRole.USER, unit: 'Канцелярия' },
        {
          ownerId: 2,
          executorId: 3,
          status: DocumentStatus.NOT_DONE,
          deletedAt: null,
        },
        {
          title: 'Недопустимо',
        },
      ),
    ).toThrow(ForbiddenException);
  });
});
