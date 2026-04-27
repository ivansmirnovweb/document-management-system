import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "./card";
import { Button } from "./button";

type StateCardProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: ReactNode;
};

export function StateCard({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  icon,
}: StateCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 text-2xl">{icon}</div> : null}
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
      {actionLabel ? (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            {actionLabel}
          </Link>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      ) : null}
    </Card>
  );
}
