import {
  changePasswordRequestSchema,
  changePasswordResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  registerRequestSchema,
  registerResponseSchema,
} from "@document-flow/shared";
import type {
  AuthenticatedUser,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@document-flow/shared";
import { apiNoContent, apiRequest, isApiError } from "@/lib/api";

export type SessionResponse = { user: AuthenticatedUser | null };

export const authApi = {
  async me(): Promise<SessionResponse> {
    try {
      const result = await apiRequest("/auth/me", { method: "GET" }, loginResponseSchema);
      return result;
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        return { user: null };
      }

      throw error;
    }
  },

  async login(input: LoginRequest): Promise<LoginResponse> {
    const payload = loginRequestSchema.parse(input);
    return apiRequest("/auth/login", { method: "POST", body: payload }, loginResponseSchema);
  },

  async register(input: RegisterRequest): Promise<RegisterResponse> {
    const payload = registerRequestSchema.parse(input);
    return apiRequest("/auth/register", { method: "POST", body: payload }, registerResponseSchema);
  },

  async logout(): Promise<null> {
    return apiRequest("/auth/logout", { method: "POST" }, apiNoContent());
  },

  async changePassword(input: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const payload = changePasswordRequestSchema.parse(input);
    return apiRequest("/auth/password", { method: "PATCH", body: payload }, changePasswordResponseSchema);
  },
};
