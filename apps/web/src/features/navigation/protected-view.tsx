"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/auth.provider";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { StateCard } from "@/shared/ui/state-card";

export function ProtectedView({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <StateCard
        title="Загрузка защищённого раздела"
        description="Проверяем сессию перед показом приватного контента."
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
      />
    );
  }

  if (auth.user.passwordRotationRequired) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center px-4 py-8">
        <ChangePasswordForm
          title="Требуется смена пароля"
          description="Сначала обновите пароль, затем продолжайте работу."
        />
      </div>
    );
  }

  return <>{children}</>;
}
