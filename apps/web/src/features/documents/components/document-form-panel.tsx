"use client";

import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createDocumentInputSchema,
    updateDocumentInputSchema,
    type DocumentDetails,
    type DocumentKind,
    type UserRole,
} from "@document-flow/shared";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { formatDateTime } from "../document-utils";

type EmployerOption = {
    id: number;
    fullName: string;
};

type DocumentFormValues = {
    registrationNumber: string;
    registrationDate: string;
    title: string;
    about1: string;
    kind: DocumentKind;
    description?: string | null;
    incomingNumber?: string | null;
    outgoingNumber?: string | null;
    outgoingDate: string;
    employerId?: number | null;
    ownerId: number;
    executorId: number;
    dueDate: string;
    isControl?: boolean;
};

type DocumentFormPanelProps = {
    mode: "create" | "edit";
    document: DocumentDetails | null;
    currentUser: { id: number; role: UserRole };
    employers: EmployerOption[];
    isSaving?: boolean;
    onCancel: () => void;
    onSubmit: (input: DocumentFormValues) => Promise<void>;
};

function toFormDefaults(
    document: DocumentDetails | null,
    currentUser: { id: number },
) {
    if (!document) {
        return {
            registrationNumber: "",
            registrationDate: new Date().toISOString().slice(0, 10),
            title: "",
            about1: "",
            kind: "INTERNAL" as DocumentKind,
            description: "",
            incomingNumber: "",
            outgoingNumber: "",
            outgoingDate: new Date().toISOString().slice(0, 10),
            employerId: undefined,
            ownerId: currentUser.id,
            executorId: currentUser.id,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10),
            isControl: false,
        };
    }

    return {
        registrationNumber: document.registrationNumber,
        registrationDate: document.registrationDate.slice(0, 10),
        title: document.title,
        about1: document.about1,
        kind: document.kind,
        description: document.description ?? "",
        incomingNumber: document.incomingNumber ?? "",
        outgoingNumber: document.outgoingNumber ?? "",
        outgoingDate: document.outgoingDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        employerId: document.employerId ?? undefined,
        ownerId: document.ownerId,
        executorId: document.executorId,
        dueDate: document.dueDate.slice(0, 10),
        isControl: document.isControl,
    };
}

export function DocumentFormPanel({
    mode,
    document,
    currentUser,
    employers,
    isSaving = false,
    onCancel,
    onSubmit,
}: DocumentFormPanelProps) {
    const isCloseOutOnlyEditor =
        mode === "edit" &&
        document !== null &&
        currentUser.role !== "ROOT" &&
        currentUser.id !== document.ownerId &&
        currentUser.id === document.executorId;
    const schema =
        mode === "create"
            ? createDocumentInputSchema
            : updateDocumentInputSchema;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const formDefaults = useMemo(
        () => toFormDefaults(document, currentUser),
        [document?.id, document?.updatedAt, currentUser.id, currentUser.role],
    );
    const form = useForm<DocumentFormValues>({
        resolver: zodResolver(
            schema,
        ) as unknown as Resolver<DocumentFormValues>,
        defaultValues: formDefaults,
    });

    useEffect(() => {
        form.reset(formDefaults);
    }, [form, formDefaults, mode]);

    const submit = form.handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <Card className="space-y-6">
            <div>
                <CardTitle>
                    {mode === "create"
                        ? "Создать документ"
                        : "Редактировать документ"}
                </CardTitle>
                <CardDescription>
                    {mode === "create"
                        ? "Зарегистрируйте новый документ в потоке работ."
                        : document
                          ? `Редактирование: ${document.title} (${document.registrationNumber})`
                          : "Редактирование документа."}
                </CardDescription>
            </div>

            {mode === "edit" && document ? (
                <AuditInfo document={document} />
            ) : null}

            <form
                key={`${mode}-${document?.id ?? "new"}`}
                className="space-y-4"
                onSubmit={submit}
            >
                <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-600">
                        Регистрация
                    </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        label="Регистрационный номер"
                        required
                        error={
                            form.formState.errors.registrationNumber?.message
                        }
                    >
                        <Input
                            aria-required="true"
                            disabled={isCloseOutOnlyEditor}
                            {...form.register("registrationNumber")}
                        />
                    </FormField>
                    <FormField
                        label="Дата регистрации"
                        required
                        error={form.formState.errors.registrationDate?.message}
                    >
                        <Input
                            type="date"
                            aria-required="true"
                            disabled={isCloseOutOnlyEditor}
                            {...form.register("registrationDate")}
                        />
                    </FormField>
                    <FormField
                        label="Название"
                        required
                        className="sm:col-span-2"
                        error={form.formState.errors.title?.message}
                    >
                        <Input
                            aria-required="true"
                            disabled={isCloseOutOnlyEditor}
                            {...form.register("title")}
                        />
                    </FormField>
                    <FormField
                        label="Тема входящего"
                        required
                        className="sm:col-span-2"
                        error={form.formState.errors.about1?.message}
                    >
                        <Input
                            aria-required="true"
                            disabled={isCloseOutOnlyEditor}
                            {...form.register("about1")}
                        />
                    </FormField>
                    <FormField
                        label="Вид документа"
                        required
                        error={form.formState.errors.kind?.message}
                    >
                        <Select aria-required="true" disabled={isCloseOutOnlyEditor} {...form.register("kind")}>
                            <option value="INTERNAL">Внутренний</option>
                            <option value="INCOMING">Входящий</option>
                            <option value="OUTGOING">Исходящий</option>
                        </Select>
                    </FormField>
                </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-600">
                        Ответственные и сроки
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                        label="Срок"
                        required
                        error={form.formState.errors.dueDate?.message}
                    >
                        <Input
                            type="date"
                            aria-required="true"
                            disabled={isCloseOutOnlyEditor}
                            {...form.register("dueDate")}
                        />
                    </FormField>
                    <FormField
                        label="Исполнитель"
                        required
                        error={form.formState.errors.executorId?.message}
                    >
                        <Input
                            type="number"
                            min={1}
                            aria-required="true"
                            disabled={isCloseOutOnlyEditor}
                            {...form.register("executorId")}
                        />
                    </FormField>
                    {currentUser.role === "ROOT" ? (
                        <FormField
                            label="Владелец"
                            required
                            error={form.formState.errors.ownerId?.message}
                        >
                            <Input
                                type="number"
                                min={1}
                                aria-required="true"
                                disabled={isCloseOutOnlyEditor}
                                {...form.register("ownerId")}
                            />
                        </FormField>
                    ) : (
                        <input type="hidden" {...form.register("ownerId")} />
                    )}
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-600">
                        Контрагент и отправка
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                        label="Работодатель"
                        required
                        helperText="Выберите контрагента по документу."
                        error={form.formState.errors.employerId?.message}
                    >
                        <Select
                            disabled={isCloseOutOnlyEditor}
                            {...form.register("employerId", {
                                setValueAs: (value) =>
                                    value === "" ? null : Number(value),
                            })}
                        >
                            <option value="">Выберите работодателя</option>
                            {employers.map((employer) => (
                                <option key={employer.id} value={employer.id}>
                                    {employer.fullName}
                                </option>
                            ))}
                        </Select>
                    </FormField>
                    <FormField
                        label="Входящий номер"
                        optional
                        error={form.formState.errors.incomingNumber?.message}
                    >
                        <Input
                            {...form.register("incomingNumber", {
                                setValueAs: (value) =>
                                    String(value).trim() === ""
                                        ? null
                                        : String(value),
                            })}
                            disabled={isCloseOutOnlyEditor}
                        />
                    </FormField>
                    <FormField
                        label="Исходящий номер"
                        required
                        error={form.formState.errors.outgoingNumber?.message}
                    >
                        <Input
                            {...form.register("outgoingNumber", {
                                setValueAs: (value) =>
                                    String(value).trim() === ""
                                        ? ""
                                        : String(value),
                            })}
                            disabled={isCloseOutOnlyEditor}
                        />
                    </FormField>
                    <FormField
                        label="Дата исходящего"
                        required
                        error={form.formState.errors.outgoingDate?.message}
                    >
                        <Input
                            type="date"
                            aria-required="true"
                            disabled={isCloseOutOnlyEditor}
                            {...form.register("outgoingDate")}
                        />
                    </FormField>
                </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-600">
                        Дополнительно
                    </h3>
                <FormField
                    label="Описание"
                    optional
                    helperText="Необязательное пояснение к документу."
                    error={form.formState.errors.description?.message}
                >
                    <Textarea
                        disabled={isCloseOutOnlyEditor}
                        {...form.register("description", {
                            setValueAs: (value) =>
                                String(value).trim() === ""
                                    ? null
                                    : String(value),
                        })}
                    />
                </FormField>
                </section>

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting || isSaving}
                    >
                        {form.formState.isSubmitting || isSaving
                            ? "Сохраняем..."
                            : mode === "create"
                              ? "Создать документ"
                              : "Сохранить изменения"}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Card>
    );
}

function AuditInfo({ document }: { document: DocumentDetails }) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-3 text-sm font-semibold text-zinc-950">
                Аудит
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <AuditField
                    label="Создан"
                    value={formatDateTime(document.createdAt)}
                />
                <AuditField
                    label="Обновлён"
                    value={formatDateTime(document.updatedAt)}
                />
                <AuditField
                    label="Последнее изменение"
                    value={formatDateTime(document.lastChangedAt)}
                />
                <AuditField
                    label="Кем изменён"
                    value={`${document.lastChangedBy.displayName} (@${document.lastChangedBy.username})`}
                />
                <AuditField
                    label="Завершён"
                    value={
                        document.completedAt
                            ? formatDateTime(document.completedAt)
                            : "—"
                    }
                />
                <AuditField
                    label="Удалён"
                    value={
                        document.deletedAt
                            ? formatDateTime(document.deletedAt)
                            : "—"
                    }
                />
            </dl>
        </div>
    );
}

function AuditField({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2">
            <dt className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                {label}
            </dt>
            <dd className="mt-1 font-medium text-zinc-950">{value}</dd>
        </div>
    );
}
