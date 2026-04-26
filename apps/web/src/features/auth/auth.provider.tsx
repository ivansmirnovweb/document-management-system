"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChangePasswordRequest, LoginRequest, User } from "@document-flow/shared";
import { authApi } from "./auth.api";
import { authKeys } from "./auth.keys";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: (input: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (input: ChangePasswordRequest) => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: authKeys.session,
    queryFn: () => authApi.me(),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session, { user: data.user });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session, { user: null });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session, { user: data.user });
    },
  });

  const value = useMemo<AuthContextValue>(() => {
    const refreshSession = async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
    };

    return {
      user: sessionQuery.data?.user ?? null,
      isLoading: sessionQuery.isPending,
      isRefreshing: sessionQuery.isFetching,
      isAuthenticated: Boolean(sessionQuery.data?.user),
      error: sessionQuery.error instanceof Error ? sessionQuery.error : null,
      login: async (input) => {
        const result = await loginMutation.mutateAsync(input);
        queryClient.setQueryData(authKeys.session, { user: result.user });
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
      changePassword: async (input) => {
        const result = await changePasswordMutation.mutateAsync(input);
        queryClient.setQueryData(authKeys.session, { user: result.user });
      },
      refreshSession,
    };
  }, [
    changePasswordMutation,
    loginMutation,
    logoutMutation,
    queryClient,
    sessionQuery.data?.user,
    sessionQuery.error,
    sessionQuery.isFetching,
    sessionQuery.isPending,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
