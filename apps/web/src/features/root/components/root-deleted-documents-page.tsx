"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRole, type DocumentListItem } from "@document-flow/shared";
import { useAuth } from "@/features/auth/auth.provider";
import { documentsApi } from "@/features/documents/documents.api";
import { documentsKeys } from "@/features/documents/documents.keys";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { StateCard } from "@/shared/ui/state-card";
import { DeletedDocumentsTable } from "./deleted-documents-table";
import { DeletedDocumentPanel } from "./deleted-document-panel";

export function RootDeletedDocumentsPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const deletedDocumentsQuery = useQuery({
    queryKey: [...documentsKeys.all, "deleted"] as const,
    queryFn: documentsApi.listDeleted,
    enabled: auth.user?.role === UserRole.ROOT,
  });

  const documents = useMemo(() => deletedDocumentsQuery.data ?? [], [deletedDocumentsQuery.data]);

  const selectedDocumentId = useMemo(() => {
    if (selectedId !== null && documents.some((document) => document.id === selectedId)) {
      return selectedId;
    }

    return documents[0]?.id ?? null;
  }, [documents, selectedId]);

  const selectedDocumentQuery = useQuery({
    queryKey: [...documentsKeys.all, "details", "deleted", selectedDocumentId ?? 0] as const,
    queryFn: () => documentsApi.getById(selectedDocumentId ?? 0),
    enabled: auth.user?.role === UserRole.ROOT && selectedDocumentId !== null,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: documentsKeys.all });
    await queryClient.invalidateQueries({ queryKey: [...documentsKeys.all, "deleted"] });
  };

  const restoreMutation = useMutation({
    mutationFn: documentsApi.restore,
    onSuccess: async () => {
      setSelectedId(null);
      await refresh();
    },
  });

  const reassignMutation = useMutation({
    mutationFn: ({ id, ownerId }: { id: number; ownerId: number }) => documentsApi.reassignOwner(id, ownerId),
    onSuccess: async (document) => {
      setSelectedId(document.id);
      await refresh();
    },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: documentsApi.hardDelete,
    onSuccess: async () => {
      setSelectedId(null);
      await refresh();
    },
  });

  if (auth.user?.role !== UserRole.ROOT) {
    return (
      <StateCard
        title="Root access required"
        description="Deleted records and destructive actions are visible only to the root user."
        icon="🛡️"
      />
    );
  }

  const isLoading = deletedDocumentsQuery.isPending;
  const selectedDocument = selectedDocumentQuery.data ?? null;
  const selected = selectedDocumentId !== null ? selectedDocumentId : null;

  return (
    <div className="space-y-6">
      <Card className="space-y-4 bg-zinc-950 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Root tools</p>
            <CardTitle className="text-3xl text-white">Deleted records management</CardTitle>
            <CardDescription className="max-w-3xl text-zinc-300">
              Restore documents, reassign ownership, or hard-delete records that can no longer stay in the archive.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-200">
            {auth.user?.displayName}
            <Button variant="secondary" onClick={() => void auth.logout()}>
              Sign out
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? <StateCard title="Loading deleted records" description="Fetching root queue." icon="⏳" /> : null}
      {deletedDocumentsQuery.error instanceof Error ? (
        <StateCard title="Could not load deleted records" description={deletedDocumentsQuery.error.message} icon="⚠️" />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <DeletedDocumentsTable
            documents={documents}
            selectedDocumentId={selected}
            onSelect={(document: DocumentListItem) => setSelectedId(document.id)}
          />
        </div>

        <div className="space-y-4">
          {selectedDocumentQuery.error instanceof Error ? (
            <StateCard title="Could not load record" description={selectedDocumentQuery.error.message} icon="⚠️" />
          ) : null}
          {selectedDocumentQuery.isPending && selectedDocument === null && selectedDocumentId !== null ? (
            <StateCard title="Loading record" description="Fetching selected deleted document." icon="⏳" />
          ) : null}
          <DeletedDocumentPanel
            document={selectedDocument}
            isRestoring={restoreMutation.isPending}
            isReassigning={reassignMutation.isPending}
            isHardDeleting={hardDeleteMutation.isPending}
            onRestore={() => {
              if (!selectedDocument) return;
              restoreMutation.mutate(selectedDocument.id);
            }}
            onReassign={(ownerId) => {
              if (!selectedDocument) return;
              reassignMutation.mutate({ id: selectedDocument.id, ownerId });
            }}
            onHardDelete={() => {
              if (!selectedDocument) return;
              const ok = window.confirm(
                `Hard delete ${selectedDocument.registrationNumber}? This cannot be undone.`,
              );
              if (!ok) return;
              hardDeleteMutation.mutate(selectedDocument.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
