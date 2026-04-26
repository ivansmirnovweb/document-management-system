import { loginRequestSchema, loginResponseSchema, changePasswordRequestSchema, changePasswordResponseSchema } from "@document-flow/shared";
import type { LoginRequest, ChangePasswordRequest, LoginResponse, ChangePasswordResponse } from "@document-flow/shared";
import { apiNoContent, apiRequest, isApiError } from "@/lib/api";
import type { User } from "@document-flow/shared";

export type SessionResponse = { user: User | null };

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

  async logout(): Promise<null> {
    return apiRequest("/auth/logout", { method: "POST" }, apiNoContent());
  },

  async changePassword(input: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const payload = changePasswordRequestSchema.parse(input);
    return apiRequest("/auth/password", { method: "PATCH", body: payload }, changePasswordResponseSchema);
  },
};
