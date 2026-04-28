import type { User } from "./user";

export type AuthUser = User & {
  passwordRotationRequired: boolean;
};

export type AuthenticatedUser = AuthUser;

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  displayName: string;
  unit: string;
  password: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type LoginResponse = {
  user: AuthUser;
};

export type RegisterResponse = {
  user: AuthUser;
};

export type ChangePasswordResponse = {
  user: AuthUser;
};
