"use client";

import Link from "next/link";
import { useAuth } from "../auth.provider";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { StateCard } from "@/shared/ui/state-card";
import { cn } from "@/lib/cn";

export function AuthStatusPanel() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <StateCard
        title="Checking session"
        description="Loading the current authentication state."
        icon="⏳"
      />
    );
  }

  if (auth.error) {
    return (
      <StateCard
        title="Session unavailable"
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
        title="You are signed out"
        description="Log in to access protected document workflows."
        actionLabel="Go to login"
        actionHref="/login"
        icon="🔐"
      />
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>{auth.user.displayName}</CardTitle>
          <CardDescription>@{auth.user.username}</CardDescription>
        </div>
        <Badge tone={auth.user.role === "ROOT" ? "warning" : "info"}>{auth.user.role}</Badge>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
            "bg-blue-600 text-white hover:bg-blue-500",
          )}
        >
          Open dashboard
        </Link>
        <Button variant="secondary" onClick={() => void auth.logout()}>
          Sign out
        </Button>
      </div>
    </Card>
  );
}
