"use client";

import { useState } from "react";
import type { DocumentDetails, UserRole } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { canCompleteDocument, canDeleteDocument, canEditDocument, canReopenDocument, canWriteOffDocument, deadlineLabel, deadlineTone, formatDate, formatDateTime, kindLabel, statusLabel } from "../document-utils";

type DocumentDetailsPanelProps = {
  document: DocumentDetails | null;
  currentUser: { id: number; role: UserRole } | null;
  publicView?: boolean;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  onCreateResolution?: (input: { text: string; resolutionDate: string; dueDate: string }) => Promise<void>;
  onWriteOff?: () => Promise<void>;
};

export function DocumentDetailsPanel({
  document,
  currentUser,
  publicView = false,
  onEdit,
  onToggleStatus,
  onDelete,
  onCreateResolution,
  onWriteOff,
}: DocumentDetailsPanelProps) {
  const [resolutionText, setResolutionText] = useState("");
  const [resolutionDate, setResolutionDate] = useState(new Date().toISOString().slice(0, 10));
  const [resolutionDueDate, setResolutionDueDate] = useState(new Date().toISOString().slice(0, 10));

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
  const writeOffAllowed = !publicView && canWriteOffDocument(currentUser, document);

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
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState, document.dueDate)}</Badge>
          </div>
        </div>
        <p className="text-sm text-zinc-600">{document.description || "Описание отсутствует."}</p>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <Detail label="Статус" value={statusLabel(document.status)} />
        <Detail label="Срок" value={formatDate(document.dueDate)} />
        <Detail label="Завершён" value={document.completedAt ? formatDateTime(document.completedAt) : "—"} />
        <Detail label="Владелец" value={`${document.owner.displayName} (@${document.owner.username}) · ${document.owner.unit}`} />
        <Detail label="Исполнитель" value={`${document.executor.displayName} (@${document.executor.username}) · ${document.executor.unit}`} />
        <Detail label="Работодатель" value={document.employer?.shortName || document.employer?.fullName || "—"} />
        <Detail label="Вид" value={kindLabel(document.kind)} />
        <Detail label="Рег. номер" value={document.registrationNumber} />
        <Detail label="Входящий номер" value={document.incomingNumber ?? "—"} />
        <Detail label="Исходящий номер" value={document.outgoingNumber ?? "—"} />
        <Detail label="Обновлён" value={formatDateTime(document.updatedAt)} />
      </dl>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-zinc-950">Резолюции</div>
        {document.resolutions.length === 0 ? (
          <div className="text-sm text-zinc-500">Пока нет резолюций.</div>
        ) : (
          <div className="space-y-2">
            {document.resolutions.map((resolution) => (
              <div key={resolution.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
                <div className="font-medium text-zinc-900">{resolution.text}</div>
                <div className="mt-1 text-zinc-600">
                  Автор: {resolution.author.displayName} · Дата: {formatDate(resolution.resolutionDate)} · Срок: {formatDate(resolution.dueDate)}
                </div>
              </div>
            ))}
          </div>
        )}
        {!publicView && onCreateResolution ? (
          <div className="space-y-2 rounded-xl border border-zinc-200 p-3">
            <Textarea value={resolutionText} onChange={(event) => setResolutionText(event.target.value)} placeholder="Текст резолюции" />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input type="date" value={resolutionDate} onChange={(event) => setResolutionDate(event.target.value)} />
              <Input type="date" value={resolutionDueDate} onChange={(event) => setResolutionDueDate(event.target.value)} />
            </div>
            <Button
              variant="secondary"
              onClick={async () => {
                await onCreateResolution({ text: resolutionText, resolutionDate, dueDate: resolutionDueDate });
                setResolutionText("");
              }}
            >
              Добавить резолюцию
            </Button>
          </div>
        ) : null}
      </div>

      {!publicView ? (
        <div className="sticky bottom-0 z-10 -mx-1 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
          {editAllowed && onEdit ? <Button onClick={onEdit}>Редактировать</Button> : null}
          {completeAllowed && onToggleStatus ? <Button variant="secondary" onClick={onToggleStatus}>Завершить</Button> : null}
          {reopenAllowed && document.status === "DONE" && onToggleStatus ? (
            <Button variant="secondary" onClick={onToggleStatus}>Переоткрыть</Button>
          ) : null}
          {writeOffAllowed && onWriteOff ? <Button variant="secondary" onClick={() => void onWriteOff()}>Списать в дело</Button> : null}
          {deleteAllowed && onDelete ? <Button variant="danger" onClick={onDelete}>Удалить</Button> : null}
          </div>
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
