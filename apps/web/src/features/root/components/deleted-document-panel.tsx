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
  ownerId: z.string().trim().regex(/^\d+$/, "ID владельца должен быть положительным числом"),
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
        <CardTitle>Удалённая запись</CardTitle>
        <CardDescription>Выберите удалённый документ для управления.</CardDescription>
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
              #{document.registrationNumber} · удалён {formatDateTime(document.deletedAt ?? document.updatedAt)}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="danger">Удалён</Badge>
            <Badge tone={document.status === "DONE" ? "success" : "neutral"}>{statusLabel(document.status)}</Badge>
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState)}</Badge>
          </div>
        </div>
        <p className="text-sm text-zinc-600">{document.description || "Описание отсутствует."}</p>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <Detail label="Удалён" value={formatDateTime(document.deletedAt ?? document.updatedAt)} />
        <Detail label="Срок" value={formatDate(document.dueDate)} />
        <Detail label="ID владельца" value={String(document.ownerId)} />
        <Detail label="ID исполнителя" value={String(document.executorId)} />
        <Detail label="ID работодателя" value={document.employerId ? String(document.employerId) : "—"} />
        <Detail label="Обновлён" value={formatDateTime(document.updatedAt)} />
      </dl>

      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950">Переназначить владельца</h3>
          <p className="text-sm text-zinc-600">Введите ID нового владельца и сохраните изменение.</p>
        </div>
        <form className="flex flex-wrap items-end gap-3" onSubmit={submit}>
          <label className="min-w-48 flex-1 space-y-2 text-sm font-medium text-zinc-800">
            <span>ID нового владельца</span>
            <Input type="number" min="1" {...form.register("ownerId", { valueAsNumber: true })} />
            {form.formState.errors.ownerId ? (
              <span className="text-xs text-red-600">{form.formState.errors.ownerId.message}</span>
            ) : null}
          </label>
          <Button type="submit" disabled={isReassigning}>
            {isReassigning ? "Сохраняем..." : "Переназначить"}
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onRestore} disabled={isRestoring}>
          {isRestoring ? "Восстанавливаем..." : "Восстановить"}
        </Button>
        <Button
          variant="danger"
          onClick={onHardDelete}
          disabled={isHardDeleting}
        >
          {isHardDeleting ? "Удаляем..." : "Удалить навсегда"}
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
