import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AppConfigService } from '../config/app-config.service';
import { DbService } from '../db/db.service';

describe('AuthService password rotation', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });
  const service = new AuthService(
    {
      db: {} as never,
    } as DbService,
    {} as JwtService,
    { nodeEnv: 'test', selfRegistrationEnabled: true } as AppConfigService,
  );

  it('marks missing password change timestamps as rotation required', async () => {
    jest.spyOn(service, 'findUserById').mockResolvedValue({
      id: 1,
      username: 'root',
      displayName: 'Root User',
      unit: 'Администрация',
      role: 'ROOT',
      passwordHash: 'hash',
      passwordChangedAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    } as never);

    await expect(
      service.validateSession({ sub: 1, iat: Math.floor(Date.now() / 1000) }),
    ).resolves.toMatchObject({ passwordRotationRequired: true });
  });

  it('marks recent password changes as not requiring rotation', async () => {
    jest.spyOn(service, 'findUserById').mockResolvedValue({
      id: 2,
      username: 'user',
      displayName: 'Normal User',
      unit: 'Канцелярия',
      role: 'USER',
      passwordHash: 'hash',
      passwordChangedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    } as never);

    await expect(
      service.validateSession({ sub: 2, iat: Math.floor(Date.now() / 1000) }),
    ).resolves.toMatchObject({ passwordRotationRequired: false });
  });
});
