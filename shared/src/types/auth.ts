import type { User } from "./user";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: User;
};
