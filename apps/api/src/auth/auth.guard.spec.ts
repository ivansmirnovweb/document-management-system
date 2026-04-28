import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtCookieAuthGuard } from './auth.guard';
import type { AuthService } from './auth.service';
import type { JwtService } from '@nestjs/jwt';
import type { Reflector } from '@nestjs/core';

describe('JwtCookieAuthGuard password rotation gate', () => {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(false),
  } as unknown as Reflector;
  const jwtService = {
    verifyAsync: jest.fn(),
  } as unknown as JwtService;
  const authService = {
    validateSession: jest.fn(),
  } as unknown as AuthService;

  const guard = new JwtCookieAuthGuard(reflector, jwtService, authService);

  function createContext(path: string, method = 'GET') {
    const request = {
      path,
      url: path,
      method,
      cookies: { auth_token: 'token' },
    };

    return {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({ getRequest: () => request }),
    } as never;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.verifyAsync = jest.fn().mockResolvedValue({ sub: 1, username: 'root', role: 'ROOT' });
  });

  it('allows auth routes even when password rotation is required', async () => {
    authService.validateSession = jest.fn().mockResolvedValue({
      id: 1,
      username: 'root',
      displayName: 'Root User',
      unit: 'Администрация',
      role: 'ROOT',
      passwordChangedAt: null,
      passwordRotationRequired: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });

    await expect(guard.canActivate(createContext('/auth/me'))).resolves.toBe(true);
  });

  it('blocks protected routes until the password is changed', async () => {
    authService.validateSession = jest.fn().mockResolvedValue({
      id: 1,
      username: 'root',
      displayName: 'Root User',
      unit: 'Администрация',
      role: 'ROOT',
      passwordChangedAt: null,
      passwordRotationRequired: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });

    await expect(guard.canActivate(createContext('/documents'))).rejects.toThrow(ForbiddenException);
  });

  it('still rejects missing sessions', async () => {
    (jwtService.verifyAsync as jest.Mock).mockRejectedValueOnce(new Error('bad token'));

    await expect(guard.canActivate(createContext('/documents'))).rejects.toThrow(UnauthorizedException);
  });
});
