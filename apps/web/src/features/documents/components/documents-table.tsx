"use client";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { DocumentListItem, UserRole } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { StateCard } from "@/shared/ui/state-card";
import { cn } from "@/lib/cn";
import { canCompleteDocument, canDeleteDocument, canEditDocument, deadlineLabel, deadlineTone, formatDate, statusLabel } from "../document-utils";

const columnHelper = createColumnHelper<DocumentListItem>();

type DocumentsTableProps = {
  documents: DocumentListItem[];
  selectedDocumentId: number | null;
  currentUser: { id: number; role: UserRole } | null;
  publicView?: boolean;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateIcon?: string;
  emptyStateActionLabel?: string;
  onEmptyAction?: () => void;
  onSelect: (document: DocumentListItem) => void;
  onEdit?: (document: DocumentListItem) => void;
  onToggleStatus?: (document: DocumentListItem) => void;
  onDelete?: (document: DocumentListItem) => void;
};

export function DocumentsTable({
  documents,
  selectedDocumentId,
  currentUser,
  publicView = false,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateIcon,
  emptyStateActionLabel,
  onEmptyAction,
  onSelect,
  onEdit,
  onToggleStatus,
  onDelete,
}: DocumentsTableProps) {
  const columns = [
    columnHelper.accessor("registrationNumber", {
      header: "Document",
      cell: (info) => {
        const document = info.row.original;
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-zinc-950">{document.title}</span>
              {document.isControl ? <Badge tone="warning">Control</Badge> : null}
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
      header: "Deadline",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="space-y-2 text-sm">
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState)}</Badge>
            <div className="text-zinc-600">Due {formatDate(document.dueDate)}</div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "ids",
      header: "Actors",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="space-y-1 text-sm text-zinc-600">
            <div>Owner #{document.ownerId}</div>
            <div>Executor #{document.executorId}</div>
            <div>Employer {document.employerId ? `#${document.employerId}` : "—"}</div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const document = row.original;
        if (publicView) {
          return (
            <Button
              variant="ghost"
              className="h-9 px-3"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(document);
              }}
            >
              View
            </Button>
          );
        }

        const canEdit = canEditDocument(currentUser, document);
        const canDelete = canDeleteDocument(currentUser, document);
        const canComplete = canCompleteDocument(currentUser, document);

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="h-9 px-3"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(document);
              }}
            >
              Open
            </Button>
            {canEdit && onEdit ? (
              <Button
                variant="ghost"
                className="h-9 px-3"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(document);
                }}
              >
                Edit
              </Button>
            ) : null}
            {canComplete && onToggleStatus ? (
              <Button
                variant="secondary"
                className="h-9 px-3"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleStatus(document);
                }}
              >
                Complete
              </Button>
            ) : null}
            {canDelete && onDelete ? (
              <Button
                variant="danger"
                className="h-9 px-3"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(document);
                }}
              >
                Delete
              </Button>
            ) : null}
          </div>
        );
      },
    }),
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
        icon={emptyStateIcon}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
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
            const rowTone =
              document.deadlineState === "OVERDUE"
                ? "bg-red-50"
                : document.deadlineState === "DUE_SOON"
                  ? "bg-amber-50"
                  : document.deadlineState === "COMPLETED"
                    ? "bg-zinc-50"
                    : document.isControl
                      ? "bg-sky-50"
                      : "";

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
