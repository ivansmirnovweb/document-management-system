"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { DocumentDetails } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { deadlineLabel, deadlineTone, formatDate, formatDateTime, statusLabel } from "@/features/documents/document-utils";

const reassignSchema = z.object({
  ownerId: z.string().trim().regex(/^\d+$/, "Owner ID must be a positive number"),
});

type DeletedDocumentPanelProps = {
  document: DocumentDetails | null;
  isRestoring: boolean;
  isReassigning: boolean;
  isHardDeleting: boolean;
  onRestore: () => void;
  onReassign: (ownerId: number) => void;
  onHardDelete: () => void;
};

export function DeletedDocumentPanel({
  document,
  isRestoring,
  isReassigning,
  isHardDeleting,
  onRestore,
  onReassign,
  onHardDelete,
}: DeletedDocumentPanelProps) {
  const form = useForm<z.infer<typeof reassignSchema>>({
    resolver: zodResolver(reassignSchema),
    defaultValues: { ownerId: String(document?.ownerId ?? "") },
  });

  useEffect(() => {
    form.reset({ ownerId: String(document?.ownerId ?? "") });
  }, [document?.ownerId, form]);

  if (!document) {
    return (
      <Card className="space-y-4" id="details">
        <CardTitle>Deleted record</CardTitle>
        <CardDescription>Select a deleted document to manage it.</CardDescription>
      </Card>
    );
  }

  const submit = form.handleSubmit((values) => onReassign(Number(values.ownerId)));

  return (
    <Card className="space-y-6" id="details">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{document.title}</CardTitle>
            <CardDescription>
              #{document.registrationNumber} · deleted {formatDateTime(document.deletedAt ?? document.updatedAt)}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="danger">Deleted</Badge>
            <Badge tone={document.status === "DONE" ? "success" : "neutral"}>{statusLabel(document.status)}</Badge>
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState)}</Badge>
          </div>
        </div>
        <p className="text-sm text-zinc-600">{document.description || "No description provided."}</p>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <Detail label="Deleted at" value={formatDateTime(document.deletedAt ?? document.updatedAt)} />
        <Detail label="Due date" value={formatDate(document.dueDate)} />
        <Detail label="Owner ID" value={String(document.ownerId)} />
        <Detail label="Executor ID" value={String(document.executorId)} />
        <Detail label="Employer ID" value={document.employerId ? String(document.employerId) : "—"} />
        <Detail label="Last updated" value={formatDateTime(document.updatedAt)} />
      </dl>

      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950">Reassign owner</h3>
          <p className="text-sm text-zinc-600">Enter the target owner ID and save the change.</p>
        </div>
        <form className="flex flex-wrap items-end gap-3" onSubmit={submit}>
          <label className="min-w-48 flex-1 space-y-2 text-sm font-medium text-zinc-800">
            <span>New owner ID</span>
            <Input type="number" min="1" {...form.register("ownerId", { valueAsNumber: true })} />
            {form.formState.errors.ownerId ? (
              <span className="text-xs text-red-600">{form.formState.errors.ownerId.message}</span>
            ) : null}
          </label>
          <Button type="submit" disabled={isReassigning}>
            {isReassigning ? "Saving..." : "Reassign"}
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onRestore} disabled={isRestoring}>
          {isRestoring ? "Restoring..." : "Restore"}
        </Button>
        <Button
          variant="danger"
          onClick={onHardDelete}
          disabled={isHardDeleting}
        >
          {isHardDeleting ? "Deleting..." : "Hard delete"}
        </Button>
      </div>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
      <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-zinc-950">{value}</dd>
    </div>
  );
}
