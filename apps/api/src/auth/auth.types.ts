import type { User } from '@document-flow/shared';

export type JwtRole = 'USER' | 'ROOT';

export type JwtSessionPayload = {
  sub: number;
  username: string;
  role: JwtRole;
};

export type JwtDecodedPayload = JwtSessionPayload & {
  iat?: number;
  exp?: number;
};

export type AuthenticatedUser = User;

export type AuthenticatedRequest = {
  user?: AuthenticatedUser;
} & {
  cookies?: Record<string, string | undefined>;
};
