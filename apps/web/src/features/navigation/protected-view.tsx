"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/auth.provider";
import { StateCard } from "@/shared/ui/state-card";

export function ProtectedView({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <StateCard
        title="Загрузка защищённого раздела"
        description="Проверяем сессию перед показом приватного контента."
        icon="🔎"
      />
    );
  }

  if (auth.error) {
    return (
      <StateCard
        title="Не удалось загрузить сессию"
        description={auth.error.message}
        actionLabel="Повторить"
        onAction={auth.refreshSession}
        icon="⚠️"
      />
    );
  }

  if (!auth.user) {
    return (
      <StateCard
        title="Требуется доступ"
        description="Это защищённая зона. Войдите, чтобы продолжить."
        actionLabel="Перейти ко входу"
        actionHref="/login"
        icon="🔐"
      />
    );
  }

  return <>{children}</>;
}
