"use client";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { DocumentListItem } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { StateCard } from "@/shared/ui/state-card";
import { cn } from "@/lib/cn";
import { deadlineLabel, deadlineTone, formatDate, statusLabel } from "@/features/documents/document-utils";

const columnHelper = createColumnHelper<DocumentListItem>();

type DeletedDocumentsTableProps = {
  documents: DocumentListItem[];
  selectedDocumentId: number | null;
  onSelect: (document: DocumentListItem) => void;
};

export function DeletedDocumentsTable({ documents, selectedDocumentId, onSelect }: DeletedDocumentsTableProps) {
  const columns = [
    columnHelper.accessor("registrationNumber", {
      header: "Документ",
      cell: (info) => {
        const document = info.row.original;
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-zinc-950">{document.title}</span>
              <Badge tone="danger">Удалён</Badge>
              <Badge tone={document.status === "DONE" ? "success" : "neutral"}>{statusLabel(document.status)}</Badge>
            </div>
            <div className="text-sm text-zinc-600">
              #{document.registrationNumber} · {formatDate(document.registrationDate)}
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "meta",
      header: "Метаданные",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="space-y-2 text-sm text-zinc-600">
            <div>Владелец #{document.ownerId}</div>
            <div>Исполнитель #{document.executorId}</div>
            <div>Удалён {document.deletedAt ? formatDate(document.deletedAt) : "—"}</div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "deadline",
      header: "Срок",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="space-y-2 text-sm">
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState)}</Badge>
            <div className="text-zinc-600">До {formatDate(document.dueDate)}</div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <Button
            variant="secondary"
            className="h-9 px-3"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(document);
            }}
          >
            Открыть
          </Button>
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
    return <StateCard title="Нет удалённых записей" description="Удалённые документы появятся здесь для пользователей root." icon="🗂️" />;
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
                  : "bg-zinc-50/40";

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
