import type { User } from "./user";

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
  user: User;
};

export type RegisterResponse = {
  user: User;
};

export type ChangePasswordResponse = {
  user: User;
};
