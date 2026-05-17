import 'reflect-metadata';
import { UserRole } from '@document-flow/shared';
import { ROLES_KEY } from '../common/constants/metadata.constants';
import { ReportsController } from './reports.controller';

describe('ReportsController roles', () => {
  it('protects export and executor reports for root only', () => {
    const exportRoles = Reflect.getMetadata(
      ROLES_KEY,
      ReportsController.prototype.exportDocuments,
    ) as UserRole[] | undefined;
    const executorRoles = Reflect.getMetadata(
      ROLES_KEY,
      ReportsController.prototype.getExecutorStatistics,
    ) as UserRole[] | undefined;

    expect(exportRoles).toEqual([UserRole.ROOT]);
    expect(executorRoles).toEqual([UserRole.ROOT]);
  });
});

