"use client";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { DocumentListItem } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
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
            <div className="font-semibold text-zinc-950">{document.title}</div>
            <div className="flex flex-wrap items-center gap-2">
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
        const ownerLabel = document.owner.displayName || document.owner.username;
        const executorLabel = document.executor.displayName || document.executor.username;
        return (
          <div className="space-y-2 text-sm text-zinc-600">
            <div>Владелец {ownerLabel}</div>
            <div>Исполнитель {executorLabel}</div>
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
            <Badge tone={deadlineTone(document.deadlineState)}>{deadlineLabel(document.deadlineState, document.dueDate)}</Badge>
            <div className="text-zinc-600">До {formatDate(document.dueDate)}</div>
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
    return <StateCard title="Нет удалённых записей" description="Удалённые документы появятся здесь для пользователей root." />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-[860px] w-full border-collapse text-left text-sm">
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
