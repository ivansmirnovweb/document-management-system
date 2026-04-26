"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/auth.provider";
import { StateCard } from "@/shared/ui/state-card";

export function ProtectedView({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <StateCard
        title="Loading protected area"
        description="Checking your session before showing private content."
        icon="🔎"
      />
    );
  }

  if (auth.error) {
    return (
      <StateCard
        title="Could not load session"
        description={auth.error.message}
        actionLabel="Retry"
        onAction={auth.refreshSession}
        icon="⚠️"
      />
    );
  }

  if (!auth.user) {
    return (
      <StateCard
        title="Access required"
        description="This area is protected. Sign in to continue."
        actionLabel="Go to login"
        actionHref="/login"
        icon="🔐"
      />
    );
  }

  return <>{children}</>;
}
