"use client";

import type { DocumentDetails, UserRole } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { canCompleteDocument, canDeleteDocument, canEditDocument, canReopenDocument, deadlineLabel, deadlineTone, formatDate, formatDateTime, kindLabel, statusLabel } from "../document-utils";

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
        <CardTitle>Детали документа</CardTitle>
        <CardDescription>Выберите строку, чтобы посмотреть запись.</CardDescription>
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
            <Badge tone={document.isControl ? "warning" : "neutral"}>{document.isControl ? "Контроль" : "Обычный"}</Badge>
            <Badge tone="info">{kindLabel(document.kind)}</Badge>
            <Badge tone={document.status === "DONE" ? "success" : "info"}>{statusLabel(document.status)}</Badge>
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState)}</Badge>
          </div>
        </div>
        <p className="text-sm text-zinc-600">{document.description || "Описание отсутствует."}</p>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <Detail label="Срок" value={formatDate(document.dueDate)} />
        <Detail label="Завершён" value={document.completedAt ? formatDateTime(document.completedAt) : "—"} />
        <Detail label="Владелец" value={`${document.owner.displayName} (@${document.owner.username})`} />
        <Detail label="Исполнитель" value={`${document.executor.displayName} (@${document.executor.username})`} />
        <Detail label="Работодатель" value={document.employer ? document.employer.fullName : "—"} />
        <Detail label="Вид" value={kindLabel(document.kind)} />
        <Detail label="Рег. номер" value={document.registrationNumber} />
        <Detail label="Входящий номер" value={document.incomingNumber ?? "—"} />
        <Detail label="Исходящий номер" value={document.outgoingNumber ?? "—"} />
        <Detail label="Обновлён" value={formatDateTime(document.updatedAt)} />
      </dl>

      {!publicView ? (
        <div className="flex flex-wrap gap-2">
          {editAllowed && onEdit ? <Button onClick={onEdit}>Редактировать</Button> : null}
          {completeAllowed && onToggleStatus ? <Button variant="secondary" onClick={onToggleStatus}>Завершить</Button> : null}
          {reopenAllowed && document.status === "DONE" && onToggleStatus ? (
            <Button variant="secondary" onClick={onToggleStatus}>Переоткрыть</Button>
          ) : null}
          {deleteAllowed && onDelete ? <Button variant="danger" onClick={onDelete}>Удалить</Button> : null}
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
