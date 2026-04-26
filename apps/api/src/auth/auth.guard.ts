import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../common/constants/metadata.constants';
import { AUTH_COOKIE_NAME } from './auth.constants';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest, JwtDecodedPayload } from './auth.types';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest & Request>();
    const cookies = request.cookies as
      | Record<string, string | undefined>
      | undefined;
    const token = cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    let payload: JwtDecodedPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtDecodedPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid session');
    }

    request.user = await this.authService.validateSession(payload);
    return true;
  }
}
