"use client";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { DocumentListItem, UserRole } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { StateCard } from "@/shared/ui/state-card";
import { cn } from "@/lib/cn";
import { canCompleteDocument, canDeleteDocument, canEditDocument, deadlineLabel, deadlineTone, formatDate, kindLabel, statusLabel } from "../document-utils";

const columnHelper = createColumnHelper<DocumentListItem>();

type DocumentsTableProps = {
  documents: DocumentListItem[];
  selectedDocumentId: number | null;
  selectedExportIds?: number[];
  currentUser: { id: number; role: UserRole } | null;
  publicView?: boolean;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateActionLabel?: string;
  onEmptyAction?: () => void;
  onSelect: (document: DocumentListItem) => void;
  onEdit?: (document: DocumentListItem) => void;
  onToggleStatus?: (document: DocumentListItem) => void;
  onDelete?: (document: DocumentListItem) => void;
  onToggleExportSelect?: (documentId: number, checked: boolean) => void;
  onToggleExportSelectAll?: (checked: boolean) => void;
};

export function DocumentsTable({
  documents,
  selectedDocumentId,
  selectedExportIds = [],
  currentUser,
  publicView = false,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateActionLabel,
  onEmptyAction,
  onSelect,
  onEdit,
  onToggleStatus,
  onDelete,
  onToggleExportSelect,
  onToggleExportSelectAll,
}: DocumentsTableProps) {
  const columns = [
    ...(publicView || !onToggleExportSelect
      ? []
      : [
          columnHelper.display({
            id: "select",
            header: () => (
              <input
                type="checkbox"
                aria-label="Выбрать все документы"
                checked={documents.length > 0 && selectedExportIds.length === documents.length}
                onChange={(event) => onToggleExportSelectAll?.(event.target.checked)}
              />
            ),
            cell: ({ row }) => (
              <input
                type="checkbox"
                aria-label={`Выбрать документ ${row.original.registrationNumber}`}
                checked={selectedExportIds.includes(row.original.id)}
                onChange={(event) => onToggleExportSelect?.(row.original.id, event.target.checked)}
                onClick={(event) => event.stopPropagation()}
              />
            ),
          }),
        ]),
    columnHelper.accessor("registrationNumber", {
      header: "Документ",
      cell: (info) => {
        const document = info.row.original;
        return (
          <div className="space-y-2">
            <div className="font-semibold text-zinc-950">{document.title}</div>
            <div className="flex flex-wrap items-center gap-2">
              {document.isControl ? <Badge tone="warning">Контроль</Badge> : null}
              <Badge tone="info">{kindLabel(document.kind)}</Badge>
              <Badge tone={document.status === "DONE" ? "success" : "neutral"}>{statusLabel(document.status)}</Badge>
            </div>
            <div className="text-sm text-zinc-600">
              #{document.registrationNumber} · {formatDate(document.registrationDate)}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("dueDate", {
      header: "Срок",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="space-y-2 text-sm">
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState, document.dueDate)}</Badge>
            <div className="text-zinc-600">До {formatDate(document.dueDate)}</div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "ids",
      header: "Участники",
      cell: ({ row }) => {
        const document = row.original;
        const ownerLabel = document.owner.displayName || document.owner.username;
        const executorLabel = document.executor.displayName || document.executor.username;
        const employerLabel = document.employer?.shortName || document.employer?.fullName || "—";
        return (
          <div className="space-y-1 text-sm text-zinc-600">
            <div>Владелец {ownerLabel}</div>
            <div>Исполнитель {executorLabel}</div>
            <div>Работодатель {employerLabel}</div>
          </div>
        );
      },
    }),
    ...(publicView
      ? []
      : [
          columnHelper.display({
            id: "actions",
            header: "Действия",
            cell: ({ row }: { row: { original: DocumentListItem } }) => {
              const document = row.original;
              const canEdit = canEditDocument(currentUser, document);
              const canDelete = canDeleteDocument(currentUser, document);
              const canComplete = canCompleteDocument(currentUser, document);

              return (
                <div className="flex flex-wrap gap-2">
                  {canEdit && onEdit ? (
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-transparent px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(document);
                      }}
                    >
                      Редактировать
                    </button>
                  ) : null}
                  {canComplete && onToggleStatus ? (
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-100 px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleStatus(document);
                      }}
                    >
                      Завершить
                    </button>
                  ) : null}
                  {canDelete && onDelete ? (
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-red-600 px-3 text-sm font-medium text-white transition hover:bg-red-500"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(document);
                      }}
                    >
                      Удалить
                    </button>
                  ) : null}
                </div>
              );
            },
          }),
        ]),
  ];

  const table = useReactTable({
    data: documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (documents.length === 0) {
    return (
      <StateCard
        title={emptyStateTitle}
        description={emptyStateDescription}
        actionLabel={emptyStateActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-[980px] w-full border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-[0.15em] text-zinc-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-4 font-semibold">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const document = row.original;
            const selected = selectedDocumentId === document.id;
            const rowTone = "";
            return (
              <tr
                key={row.id}
                className={cn(
                  "border-t border-zinc-200 transition hover:bg-zinc-50",
                  rowTone,
                  selected ? "ring-2 ring-inset ring-blue-600" : "",
                )}
                onClick={() => onSelect(document)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
