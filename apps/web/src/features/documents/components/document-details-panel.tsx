"use client";

import type { DocumentDetails, UserRole } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { canCompleteDocument, canDeleteDocument, canEditDocument, canReopenDocument, deadlineLabel, deadlineTone, formatDate, formatDateTime, statusLabel } from "../document-utils";

type DocumentDetailsPanelProps = {
  document: DocumentDetails | null;
  currentUser: { id: number; role: UserRole } | null;
  publicView?: boolean;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export function DocumentDetailsPanel({
  document,
  currentUser,
  publicView = false,
  onEdit,
  onToggleStatus,
  onDelete,
}: DocumentDetailsPanelProps) {
  if (!document) {
    return (
      <Card className="space-y-4" id="details">
        <CardTitle>Document details</CardTitle>
        <CardDescription>Select a row to inspect the record.</CardDescription>
      </Card>
    );
  }

  const editAllowed = !publicView && canEditDocument(currentUser, document);
  const deleteAllowed = !publicView && canDeleteDocument(currentUser, document);
  const completeAllowed = !publicView && canCompleteDocument(currentUser, document);
  const reopenAllowed = !publicView && canReopenDocument(currentUser, document);

  return (
    <Card className="space-y-6" id="details">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{document.title}</CardTitle>
            <CardDescription>
              #{document.registrationNumber} · {formatDate(document.registrationDate)}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={document.isControl ? "warning" : "neutral"}>{document.isControl ? "Control" : "Standard"}</Badge>
            <Badge tone={document.status === "DONE" ? "success" : "info"}>{statusLabel(document.status)}</Badge>
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState)}</Badge>
          </div>
        </div>
        <p className="text-sm text-zinc-600">{document.description || "No description provided."}</p>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <Detail label="Due date" value={formatDate(document.dueDate)} />
        <Detail label="Completed at" value={document.completedAt ? formatDateTime(document.completedAt) : "—"} />
        <Detail label="Owner" value={`${document.owner.displayName} (@${document.owner.username})`} />
        <Detail label="Executor" value={`${document.executor.displayName} (@${document.executor.username})`} />
        <Detail label="Employer" value={document.employer ? document.employer.fullName : "—"} />
        <Detail label="Registration number" value={document.registrationNumber} />
        <Detail label="Incoming number" value={document.incomingNumber ?? "—"} />
        <Detail label="Outgoing number" value={document.outgoingNumber ?? "—"} />
        <Detail label="Last updated" value={formatDateTime(document.updatedAt)} />
      </dl>

      {!publicView ? (
        <div className="flex flex-wrap gap-2">
          {editAllowed && onEdit ? <Button onClick={onEdit}>Edit</Button> : null}
          {completeAllowed && onToggleStatus ? <Button variant="secondary" onClick={onToggleStatus}>Complete</Button> : null}
          {reopenAllowed && document.status === "DONE" && onToggleStatus ? (
            <Button variant="secondary" onClick={onToggleStatus}>Reopen</Button>
          ) : null}
          {deleteAllowed && onDelete ? <Button variant="danger" onClick={onDelete}>Delete</Button> : null}
        </div>
      ) : null}
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-zinc-950">{value}</dd>
    </div>
  );
}
