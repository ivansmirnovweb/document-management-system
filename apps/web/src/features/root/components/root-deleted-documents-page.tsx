"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRole, type DocumentListItem } from "@document-flow/shared";
import { authApi } from "@/features/auth/auth.api";
import { useAuth } from "@/features/auth/auth.provider";
import { documentsApi } from "@/features/documents/documents.api";
import { documentsKeys } from "@/features/documents/documents.keys";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { SlideOver } from "@/shared/ui/slide-over";
import { StateCard } from "@/shared/ui/state-card";
import { DeletedDocumentPanel } from "./deleted-document-panel";
import { DeletedDocumentsTable } from "./deleted-documents-table";

export function RootDeletedDocumentsPage() {
    const auth = useAuth();
    const queryClient = useQueryClient();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const deletedDocumentsQuery = useQuery({
        queryKey: [...documentsKeys.all, "deleted"] as const,
        queryFn: documentsApi.listDeleted,
        enabled: auth.user?.role === UserRole.ROOT,
    });

    const documents = useMemo(
        () => deletedDocumentsQuery.data ?? [],
        [deletedDocumentsQuery.data],
    );

    const selectedDocumentQuery = useQuery({
        queryKey: [
            ...documentsKeys.all,
            "details",
            "deleted",
            selectedId ?? 0,
        ] as const,
        queryFn: () => documentsApi.getById(selectedId ?? 0),
        enabled: auth.user?.role === UserRole.ROOT && selectedId !== null,
    });

    const usersQuery = useQuery({
        queryKey: ["auth", "users"] as const,
        queryFn: authApi.listUsers,
        enabled: auth.user?.role === UserRole.ROOT,
    });

    const refresh = async () => {
        await queryClient.invalidateQueries({ queryKey: documentsKeys.all });
        await queryClient.invalidateQueries({
            queryKey: [...documentsKeys.all, "deleted"],
        });
    };

    const closeSidebar = () => {
        setSelectedId(null);
    };

    const restoreMutation = useMutation({
        mutationFn: documentsApi.restore,
        onSuccess: async () => {
            closeSidebar();
            await refresh();
        },
    });

    const reassignMutation = useMutation({
        mutationFn: ({ id, ownerId }: { id: number; ownerId: number }) =>
            documentsApi.reassignOwner(id, ownerId),
        onSuccess: async (document) => {
            setSelectedId(document.id);
            await refresh();
        },
    });

    const hardDeleteMutation = useMutation({
        mutationFn: documentsApi.hardDelete,
        onSuccess: async () => {
            closeSidebar();
            await refresh();
        },
    });

    const actionError =
        restoreMutation.error ??
        reassignMutation.error ??
        hardDeleteMutation.error;

    if (auth.user?.role !== UserRole.ROOT) {
        return (
            <StateCard
                title="Требуется доступ ROOT"
                description="Удалённые записи и опасные действия доступны только пользователю root."
            />
        );
    }

    const isLoading = deletedDocumentsQuery.isPending;
    const selectedDocument = selectedDocumentQuery.data ?? null;
    const sidebarOpen = selectedId !== null;

    return (
        <div className="space-y-6">
            <Card className="space-y-4 border-red-100 bg-red-50/70">
                <div className="flex flex-col items-start justify-between">
                    <CardTitle className="text-3xl text-zinc-950">
                        Управление удалёнными записями
                    </CardTitle>
                    <CardDescription className="max-w-3xl text-zinc-700">
                        Восстанавливайте документы, переназначайте владельца или
                        выполняйте безвозвратное удаление из архива.
                    </CardDescription>
                </div>
            </Card>

            {isLoading ? (
                <StateCard
                    title="Загрузка удалённых записей"
                    description="Получаем root-очередь."
                />
            ) : null}
            {deletedDocumentsQuery.error instanceof Error ? (
                <StateCard
                    title="Не удалось загрузить удалённые записи"
                    description={deletedDocumentsQuery.error.message}
                />
            ) : null}
            {actionError instanceof Error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {actionError.message}
                </div>
            ) : null}

            <div className="space-y-4">
                <DeletedDocumentsTable
                    documents={documents}
                    selectedDocumentId={selectedId}
                    onSelect={(document: DocumentListItem) =>
                        setSelectedId(document.id)
                    }
                />
            </div>

            <SlideOver
                open={sidebarOpen}
                title="Удалённая запись"
                description="Просмотр и управление выбранным удалённым документом."
                onClose={closeSidebar}
                className="sm:max-w-[40rem]"
            >
                {selectedDocumentQuery.error instanceof Error ? (
                    <StateCard
                        title="Не удалось загрузить запись"
                        description={selectedDocumentQuery.error.message}
                    />
                ) : null}
                {selectedDocumentQuery.isPending &&
                selectedDocument === null &&
                selectedId !== null ? (
                    <StateCard
                        title="Загрузка записи"
                        description="Получаем выбранный удалённый документ."
                    />
                ) : null}
                <DeletedDocumentPanel
                    document={selectedDocument}
                    isRestoring={restoreMutation.isPending}
                    isReassigning={reassignMutation.isPending}
                    isHardDeleting={hardDeleteMutation.isPending}
                    users={usersQuery.data?.users ?? []}
                    onRestore={() => {
                        if (!selectedDocument) return;
                        restoreMutation.mutate(selectedDocument.id);
                    }}
                    onReassign={(ownerId) => {
                        if (!selectedDocument) return;
                        reassignMutation.mutate({
                            id: selectedDocument.id,
                            ownerId,
                        });
                    }}
                    onHardDelete={() => {
                        if (!selectedDocument) return;
                        const ok = window.confirm(
                            `Безвозвратно удалить ${selectedDocument.registrationNumber}? Действие нельзя отменить.`,
                        );
                        if (!ok) return;
                        hardDeleteMutation.mutate(selectedDocument.id);
                    }}
                />
            </SlideOver>
        </div>
    );
}
