"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    reportFilterInputSchema,
    type ReportFilterInput,
} from "@document-flow/shared";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/auth.provider";
import { reportsApi } from "../reports.api";
import { reportsKeys } from "../reports.keys";
import { ExecutorStatisticsTable } from "./executor-statistics-table";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { StateCard } from "@/shared/ui/state-card";

const reportRangeSchema = reportFilterInputSchema.pick({
    dateFrom: true,
    dateTo: true,
});

type ReportRange = {
    dateFrom: string;
    dateTo: string;
};

function toDateInput(value: Date): string {
    const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
}

function startOfMonth(value: Date): Date {
    const date = new Date(value);
    date.setDate(1);
    return date;
}

function downloadCsv(filename: string, csv: string) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ReportsPage() {
    const auth = useAuth();
    const defaultRange = useMemo<ReportRange>(() => {
        const today = new Date();
        return {
            dateFrom: toDateInput(startOfMonth(today)),
            dateTo: toDateInput(today),
        };
    }, []);
    const [appliedFilter, setAppliedFilter] =
        useState<ReportFilterInput>(defaultRange);

    const form = useForm<ReportRange>({
        resolver: zodResolver(reportRangeSchema),
        defaultValues: defaultRange,
    });

    const statisticsQuery = useQuery({
        queryKey: reportsKeys.executors(appliedFilter),
        queryFn: () => reportsApi.getExecutorStatistics(appliedFilter),
        enabled: Boolean(auth.user),
    });

    const exportMutation = useMutation({
        mutationFn: (filter: ReportFilterInput) =>
            reportsApi.exportDocuments(filter),
        onSuccess: (csv) => {
            const filename = `documents-report-${appliedFilter.dateFrom}-to-${appliedFilter.dateTo}.csv`;
            downloadCsv(filename, csv);
        },
    });

    const submit = form.handleSubmit((values) => setAppliedFilter(values));

    if (!auth.user) {
        return (
            <StateCard
                title="Требуется вход"
                description="Откройте отчёты после авторизации."
                actionLabel="Перейти ко входу"
                actionHref="/login"
            />
        );
    }

    if (auth.user.role !== "ROOT") {
        return (
            <StateCard
                title="Требуется доступ ROOT"
                description="Отчёты доступны только пользователю root."
            />
        );
    }

    return (
        <div className="space-y-6">
            <Card className="space-y-4 border-indigo-100 bg-indigo-50/70">
                <div className="flex flex-col items-start justify-between ">
                    <CardTitle className="text-3xl text-zinc-950">
                        Статистика исполнителей и экспорт
                    </CardTitle>
                    <CardDescription className="max-w-3xl text-zinc-700">
                        Выберите диапазон дат, обновите отчёт и при
                        необходимости скачайте CSV.
                    </CardDescription>
                </div>
            </Card>

            <Card className="space-y-4">
                <div>
                    <CardTitle>Период отчёта</CardTitle>
                    <CardDescription>
                        Используйте включительный диапазон дат для статистики и
                        экспорта.
                    </CardDescription>
                </div>

                <form
                    className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end"
                    onSubmit={submit}
                >
                    <FormField
                        label="С"
                        required
                        error={form.formState.errors.dateFrom?.message}
                    >
                        <Input
                            type="date"
                            aria-required="true"
                            {...form.register("dateFrom")}
                        />
                    </FormField>

                    <FormField
                        label="По"
                        required
                        error={form.formState.errors.dateTo?.message}
                    >
                        <Input
                            type="date"
                            aria-required="true"
                            {...form.register("dateTo")}
                        />
                    </FormField>

                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        Обновить отчёт
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={exportMutation.isPending}
                        onClick={() => {
                            exportMutation.mutate(appliedFilter);
                        }}
                    >
                        {exportMutation.isPending
                            ? "Экспортируем..."
                            : "Скачать CSV"}
                    </Button>
                </form>
            </Card>

            {exportMutation.error instanceof Error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {exportMutation.error.message}
                </div>
            ) : null}

            {statisticsQuery.isPending ? (
                <StateCard
                    title="Загрузка отчёта"
                    description="Получаем статистику исполнителей."
                />
            ) : null}

            {statisticsQuery.error instanceof Error ? (
                <StateCard
                    title="Не удалось загрузить отчёт"
                    description={statisticsQuery.error.message}
                />
            ) : null}

            {statisticsQuery.data ? (
                <ExecutorStatisticsTable statistics={statisticsQuery.data} />
            ) : null}
        </div>
    );
}
