"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DocumentStatus, type DocumentDetails, type DocumentListItem } from "@document-flow/shared";
import { useAuth } from "@/features/auth/auth.provider";
import { employersApi } from "@/features/employers/employers.api";
import { employersKeys } from "@/features/employers/employers.keys";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { StateCard } from "@/shared/ui/state-card";
import { documentsApi } from "../documents.api";
import { documentsKeys } from "../documents.keys";
import { statusLabel } from "../document-utils";
import { DocumentDetailsPanel } from "./document-details-panel";
import { DocumentFormPanel } from "./document-form-panel";
import { DocumentsTable } from "./documents-table";

const tabs: Array<{ value: DocumentStatus; label: string }> = [
  { value: DocumentStatus.NOT_DONE, label: "Активные" },
  { value: DocumentStatus.DONE, label: "Завершённые" },
];

type DocumentsPageProps = {
  variant: "public" | "private";
  initialPublicList?: DocumentListItem[];
  initialPublicDocument?: DocumentDetails | null;
};

export function DocumentsPage({ variant, initialPublicList, initialPublicDocument }: DocumentsPageProps) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<DocumentStatus>(DocumentStatus.NOT_DONE);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mode, setMode] = useState<"details" | "create" | "edit">("details");
  const currentUser = auth.user ? { id: auth.user.id, role: auth.user.role } : null;

  const publicListQuery = useQuery({
    queryKey: documentsKeys.list("public", DocumentStatus.NOT_DONE),
    queryFn: () => documentsApi.listPublic(),
    enabled: variant === "public",
    initialData: variant === "public" ? initialPublicList : undefined,
  });

  const activeListQuery = useQuery({
    queryKey: documentsKeys.list("private", DocumentStatus.NOT_DONE),
    queryFn: () => documentsApi.list(DocumentStatus.NOT_DONE),
    enabled: variant === "private" && tab === DocumentStatus.NOT_DONE && appliedSearch.length === 0,
  });

  const completedListQuery = useQuery({
    queryKey: documentsKeys.list("private", DocumentStatus.DONE),
    queryFn: () => documentsApi.list(DocumentStatus.DONE),
    enabled: variant === "private" && tab === DocumentStatus.DONE && appliedSearch.length === 0,
  });

  const searchQuery = useQuery({
    queryKey: documentsKeys.search("private", tab, appliedSearch),
    queryFn: () => documentsApi.search({ q: appliedSearch, status: tab }),
    enabled: variant === "private" && appliedSearch.length > 0,
  });

  const list = useMemo(() => {
    if (variant === "public") {
      return publicListQuery.data ?? [];
    }

    if (appliedSearch.length > 0) {
      return searchQuery.data ?? [];
    }

    return tab === DocumentStatus.DONE ? completedListQuery.data ?? [] : activeListQuery.data ?? [];
  }, [
    activeListQuery.data,
    appliedSearch.length,
    completedListQuery.data,
    publicListQuery.data,
    searchQuery.data,
    tab,
    variant,
  ]);

  const listError =
    variant === "public"
      ? publicListQuery.error
      : appliedSearch.length > 0
        ? searchQuery.error
        : tab === DocumentStatus.DONE
          ? completedListQuery.error
          : activeListQuery.error;

  const selectedDocumentId = useMemo(() => {
    if (selectedId !== null && list.some((document) => document.id === selectedId)) {
      return selectedId;
    }

    return list[0]?.id ?? null;
  }, [list, selectedId]);

  const selectedDocumentQuery = useQuery({
    queryKey: documentsKeys.details(variant, selectedDocumentId ?? 0),
    queryFn: () =>
      variant === "public"
        ? documentsApi.getPublicById(selectedDocumentId ?? 0)
        : documentsApi.getById(selectedDocumentId ?? 0),
    enabled: selectedDocumentId !== null,
    initialData:
      variant === "public" && selectedDocumentId !== null && initialPublicDocument?.id === selectedDocumentId
        ? initialPublicDocument
        : undefined,
  });

  const selectedDocument = selectedDocumentQuery.data ?? null;

  const employersQuery = useQuery({
    queryKey: employersKeys.list(),
    queryFn: employersApi.list,
    enabled: variant === "private" && (mode === "create" || mode === "edit"),
  });

  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ queryKey: documentsKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: documentsApi.create,
    onSuccess: async (document) => {
      setSelectedId(document.id);
      setMode("details");
      await invalidateAll();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof documentsApi.update>[1] }) =>
      documentsApi.update(id, input),
    onSuccess: async (document) => {
      setSelectedId(document.id);
      setMode("details");
      await invalidateAll();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: DocumentStatus }) => documentsApi.changeStatus(id, status),
    onSuccess: async (document) => {
      setSelectedId(document.id);
      setMode("details");
      await invalidateAll();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: documentsApi.remove,
    onSuccess: async () => {
      setMode("details");
      setSelectedId(null);
      await invalidateAll();
    },
  });

  const createResolutionMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: { text: string; resolutionDate: string; dueDate: string } }) =>
      documentsApi.createResolution(id, input),
    onSuccess: async (document) => {
      setSelectedId(document.id);
      await invalidateAll();
    },
  });

  const writeOffMutation = useMutation({
    mutationFn: documentsApi.writeOff,
    onSuccess: async (document) => {
      setSelectedId(document.id);
      await invalidateAll();
    },
  });

  const isLoading =
    variant === "public"
      ? publicListQuery.isPending
      : appliedSearch.length > 0
        ? searchQuery.isPending
        : tab === DocumentStatus.DONE
          ? completedListQuery.isPending
          : activeListQuery.isPending;

  const actionError =
    createMutation.error ??
    updateMutation.error ??
    statusMutation.error ??
    deleteMutation.error ??
    createResolutionMutation.error ??
    writeOffMutation.error;

  const emptyState = (() => {
    if (variant === "public") {
      return {
        title: "Нет активных документов",
        description: "Сейчас нет доступных публичных записей.",
      };
    }

    if (appliedSearch.length > 0) {
      return {
        title: "Ничего не найдено",
        description: `По запросу "${appliedSearch}" нет результатов в разделе «${statusLabel(tab).toLowerCase()}».`,
      };
    }

    if (tab === DocumentStatus.DONE) {
      return {
        title: "Нет завершённых документов",
        description: "Завершённые записи появятся здесь после окончания работ.",
      };
    }

    return {
      title: "Нет активных документов",
      description: "Активные записи появятся здесь после регистрации.",
    };
  })();

  const panel = (() => {
    if (mode === "create") {
      if (variant !== "private" || !currentUser) {
        return <StateCard title="Недоступно" description="Создание доступно только в защищённой зоне." icon="🔒" />;
      }

      return (
        <DocumentFormPanel
          key={`create-${variant}`}
          mode="create"
          document={null}
          currentUser={currentUser}
          employers={employersQuery.data ?? []}
          isSaving={createMutation.isPending}
          onCancel={() => setMode("details")}
          onSubmit={async (input) => {
            await createMutation.mutateAsync(input as Parameters<typeof documentsApi.create>[0]);
          }}
        />
      );
    }

    if (mode === "edit") {
      if (variant !== "private" || !currentUser) {
        return <StateCard title="Недоступно" description="Редактирование доступно только в защищённой зоне." icon="🔒" />;
      }

      if (selectedDocumentQuery.error instanceof Error) {
        return <StateCard title="Не удалось загрузить документ" description={selectedDocumentQuery.error.message} icon="⚠️" />;
      }

      if (!selectedDocument) {
        return <StateCard title="Загрузка документа" description="Ждём загрузки выбранного документа." icon="⏳" />;
      }

      return (
        <DocumentFormPanel
          key={`edit-${selectedDocument.id}`}
          mode="edit"
          document={selectedDocument}
          currentUser={currentUser}
          employers={employersQuery.data ?? []}
          isSaving={updateMutation.isPending}
          onCancel={() => setMode("details")}
          onSubmit={async (input) => {
            await updateMutation.mutateAsync({
              id: selectedDocument.id,
              input: input as Parameters<typeof documentsApi.update>[1],
            });
          }}
        />
      );
    }

    if (selectedDocumentQuery.error instanceof Error) {
      return <StateCard title="Не удалось загрузить документ" description={selectedDocumentQuery.error.message} icon="⚠️" />;
    }

    if (selectedDocumentId !== null && selectedDocumentQuery.isPending && !selectedDocument) {
      return <StateCard title="Загрузка документа" description="Получаем выбранную запись." icon="⏳" />;
    }

    return (
      <DocumentDetailsPanel
        document={selectedDocument}
        currentUser={currentUser}
        publicView={variant === "public"}
        onEdit={variant === "private" ? () => setMode("edit") : undefined}
        onToggleStatus={
          variant === "private" && selectedDocument
            ? async () => {
                const nextStatus = selectedDocument.status === DocumentStatus.DONE ? DocumentStatus.NOT_DONE : DocumentStatus.DONE;
                await statusMutation.mutateAsync({ id: selectedDocument.id, status: nextStatus });
              }
            : undefined
        }
        onDelete={
          variant === "private" && selectedDocument
            ? async () => {
                await deleteMutation.mutateAsync(selectedDocument.id);
              }
            : undefined
        }
        onCreateResolution={
          variant === "private" && selectedDocument
            ? async (input) => {
                await createResolutionMutation.mutateAsync({ id: selectedDocument.id, input });
              }
            : undefined
        }
        onWriteOff={
          variant === "private" && selectedDocument
            ? async () => {
                await writeOffMutation.mutateAsync(selectedDocument.id);
              }
            : undefined
        }
      />
    );
  })();

  const listState = (() => {
    if (listError instanceof Error) {
      return <StateCard title="Не удалось загрузить документы" description={listError.message} icon="⚠️" />;
    }

    if (!isLoading && list.length === 0) {
      return (
        <DocumentsTable
          documents={list}
          selectedDocumentId={selectedDocumentId}
          currentUser={currentUser}
          publicView={variant === "public"}
          emptyStateTitle={emptyState.title}
          emptyStateDescription={emptyState.description}
          emptyStateActionLabel={variant === "private" ? "Создать документ" : undefined}
          onEmptyAction={variant === "private" ? () => setMode("create") : undefined}
          onSelect={(document) => {
            setSelectedId(document.id);
            setMode("details");
          }}
        />
      );
    }

    return (
      <DocumentsTable
        documents={list}
        selectedDocumentId={selectedId}
        currentUser={currentUser}
        publicView={variant === "public"}
        emptyStateTitle={emptyState.title}
        emptyStateDescription={emptyState.description}
        emptyStateActionLabel={variant === "private" ? "Создать документ" : undefined}
        onEmptyAction={variant === "private" ? () => setMode("create") : undefined}
        onSelect={(document) => {
          setSelectedId(document.id);
          setMode("details");
        }}
        onEdit={
          variant === "private"
            ? (document) => {
                setSelectedId(document.id);
                setMode("edit");
              }
            : undefined
        }
        onToggleStatus={
          variant === "private"
            ? (document) => {
                setSelectedId(document.id);
                void statusMutation.mutateAsync({
                  id: document.id,
                  status: document.status === DocumentStatus.DONE ? DocumentStatus.NOT_DONE : DocumentStatus.DONE,
                });
              }
            : undefined
        }
        onDelete={
          variant === "private"
            ? (document) => {
                setSelectedId(document.id);
                void deleteMutation.mutateAsync(document.id);
              }
            : undefined
        }
      />
    );
  })();

  return (
    <div className="space-y-6">
      <Card className="space-y-4 border-blue-100 bg-blue-50/70">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-700/80">Документооборот</p>
            <CardTitle className="text-3xl text-zinc-950">
              {variant === "public" ? "Публичные активные документы" : "Рабочая область документов"}
            </CardTitle>
            <CardDescription className="max-w-3xl text-zinc-700">
              {variant === "public"
                ? "Активные записи доступны без входа."
                : "Просматривайте, ищите, создавайте, редактируйте и завершайте документы в одном месте."}
            </CardDescription>
          </div>
          {variant === "private" && currentUser ? (
            <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-white/90 px-4 py-3">
              <div>
                <div className="text-sm font-semibold">{auth.user?.displayName}</div>
                <div className="text-xs text-zinc-500">@{auth.user?.username}</div>
              </div>
              <Badge tone={currentUser.role === "ROOT" ? "warning" : "info"}>{currentUser.role}</Badge>
              <Button variant="secondary" onClick={() => void auth.logout()}>
                Выйти
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      {variant === "private" ? (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {tabs.map((item) => (
                <Button
                  key={item.value}
                  variant={tab === item.value ? "primary" : "secondary"}
                  onClick={() => {
                    setTab(item.value);
                    setMode("details");
                  }}
                >
                  {item.label}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      tab === item.value ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {item.value === DocumentStatus.DONE ? completedListQuery.data?.length ?? 0 : activeListQuery.data?.length ?? 0}
                  </span>
                </Button>
              ))}
            </div>
            <Button onClick={() => setMode("create")}>Создать документ</Button>
          </div>

          <form
            className="flex flex-wrap gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setAppliedSearch(searchInput.trim());
              setMode("details");
            }}
          >
            <Input
              className="max-w-md"
              placeholder="Поиск по рег. номеру, названию, датам или логинам"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <Button type="submit">Найти</Button>
            {appliedSearch ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSearchInput("");
                  setAppliedSearch("");
                }}
              >
                Очистить
              </Button>
            ) : null}
          </form>
        </div>
      ) : null}

      {isLoading ? <StateCard title="Загрузка документов" description="Получаем актуальные записи." icon="⏳" /> : null}

      {actionError instanceof Error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError.message}
        </div>
      ) : null}

      {variant === "private" && appliedSearch ? (
        <div className="text-sm text-zinc-600">
          Результаты поиска по <span className="font-medium text-zinc-950">{appliedSearch}</span> в разделе «{statusLabel(tab).toLowerCase()}».
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">{listState}</div>

        <div className="space-y-4">{panel}</div>
      </div>
    </div>
  );
}
