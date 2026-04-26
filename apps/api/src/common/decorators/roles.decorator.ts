import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@document-flow/shared';
import { ROLES_KEY } from '../constants/metadata.constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
