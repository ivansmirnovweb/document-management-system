"use client";

import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { showErrorToast } from "@/shared/ui/toast.store";

function shouldToast(meta: unknown): boolean {
  return !(meta && typeof meta === "object" && (meta as { toast?: boolean }).toast === false);
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (!shouldToast(query.meta)) {
          return;
        }

        showErrorToast(error, "Не удалось загрузить данные");
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (!shouldToast(mutation.meta)) {
          return;
        }

        showErrorToast(error, "Не удалось выполнить действие");
      },
    }),
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
