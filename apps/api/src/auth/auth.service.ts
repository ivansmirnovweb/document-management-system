import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import {
  UserRole,
  type ChangePasswordResponse,
  type LoginResponse,
  type RegisterResponse,
} from '@document-flow/shared';
import { AppConfigService } from '../config/app-config.service';
import { DbService } from '../db/db.service';
import { users } from '../db/schema/users';
import { AUTH_COOKIE_NAME, PASSWORD_EXPIRATION_MS } from './auth.constants';
import type {
  AuthenticatedUser,
  JwtDecodedPayload,
  JwtSessionPayload,
} from './auth.types';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async login(dto: LoginDto, response: Response): Promise<LoginResponse> {
    const user = await this.findUserByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.setSessionCookie(response, user);

    return { user: this.toAuthenticatedUser(user) };
  }

  async register(
    dto: RegisterDto,
    response: Response,
  ): Promise<RegisterResponse> {
    if (!this.config.selfRegistrationEnabled) {
      throw new ForbiddenException('Self-registration is disabled');
    }

    const normalizedUsername = dto.username.trim().toLowerCase();
    const displayName = dto.displayName.trim();

    const existingUser = await this.findUserByUsername(normalizedUsername);
    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const now = new Date();

    const [createdUser] = await this.db.db
      .insert(users)
      .values({
        username: normalizedUsername,
        displayName,
        unit: dto.unit.trim(),
        role: 'USER',
        passwordHash,
        passwordChangedAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await this.setSessionCookie(response, createdUser);

    return { user: this.toAuthenticatedUser(createdUser) };
  }

  logout(response: Response): void {
    response.clearCookie(AUTH_COOKIE_NAME, this.cookieOptions());
  }

  async me(userId: number): Promise<LoginResponse> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { user: this.toAuthenticatedUser(user) };
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
    response: Response,
  ): Promise<ChangePasswordResponse> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const currentPasswordMatches = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!currentPasswordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new ForbiddenException('New password must be different');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    const now = new Date();

    await this.db.db
      .update(users)
      .set({
        passwordHash,
        passwordChangedAt: now,
        updatedAt: now,
      })
      .where(eq(users.id, userId));

    const updatedUser = {
      ...user,
      passwordHash,
      passwordChangedAt: now,
      updatedAt: now,
    };

    await this.setSessionCookie(response, updatedUser);

    return { user: this.toAuthenticatedUser(updatedUser) };
  }

  async validateSession(
    payload: JwtDecodedPayload,
  ): Promise<AuthenticatedUser> {
    const user = await this.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid session');
    }

    if (
      user.passwordChangedAt &&
      payload.iat &&
      payload.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      throw new UnauthorizedException('Session expired');
    }

    return this.toAuthenticatedUser(user);
  }

  async findUserById(id: number) {
    const [user] = await this.db.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  async findUserByUsername(username: string) {
    const [user] = await this.db.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return user ?? null;
  }

  private async setSessionCookie(
    response: Response,
    user: { id: number; username: string; role: 'USER' | 'ROOT' },
  ): Promise<void> {
    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      role: user.role,
    } satisfies JwtSessionPayload);

    response.cookie(AUTH_COOKIE_NAME, token, this.cookieOptions());
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: this.config.nodeEnv === 'production',
      path: '/',
      maxAge: PASSWORD_EXPIRATION_MS,
    };
  }

  private isPasswordRotationRequired(passwordChangedAt: Date | null): boolean {
    if (!passwordChangedAt) {
      return true;
    }

    return Date.now() - passwordChangedAt.getTime() >= PASSWORD_EXPIRATION_MS;
  }

  private toAuthenticatedUser(user: {
    id: number;
    username: string;
    displayName: string;
    unit: string;
    role: 'USER' | 'ROOT';
    passwordChangedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): AuthenticatedUser {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      unit: user.unit,
      role: user.role as UserRole,
      passwordChangedAt: user.passwordChangedAt?.toISOString() ?? null,
      passwordRotationRequired: this.isPasswordRotationRequired(
        user.passwordChangedAt,
      ),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
