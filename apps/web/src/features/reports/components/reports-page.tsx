"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportFilterInputSchema, type ReportFilterInput } from "@document-flow/shared";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/auth.provider";
import { reportsApi } from "../reports.api";
import { reportsKeys } from "../reports.keys";
import { ExecutorStatisticsTable } from "./executor-statistics-table";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { StateCard } from "@/shared/ui/state-card";
import { Badge } from "@/shared/ui/badge";

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
  const [appliedFilter, setAppliedFilter] = useState<ReportFilterInput>(defaultRange);

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
    mutationFn: (filter: ReportFilterInput) => reportsApi.exportDocuments(filter),
    onSuccess: (csv) => {
      const filename = `documents-report-${appliedFilter.dateFrom}-to-${appliedFilter.dateTo}.csv`;
      downloadCsv(filename, csv);
    },
  });

  const submit = form.handleSubmit((values) => setAppliedFilter(values));

  if (!auth.user) {
    return <StateCard title="Sign in required" description="Open reports after logging in." actionLabel="Go to login" actionHref="/login" icon="🔐" />;
  }

  if (auth.user.role !== "ROOT") {
    return <StateCard title="Root access required" description="Reports are visible only to the root user." icon="🛡️" />;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4 bg-zinc-950 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Reports</p>
            <CardTitle className="text-3xl text-white">Executor statistics and export</CardTitle>
            <CardDescription className="max-w-3xl text-zinc-300">
              Select a date range, refresh the report, and download the CSV export when needed.
            </CardDescription>
          </div>
          <Badge tone={auth.user?.role === "ROOT" ? "warning" : "info"}>{auth.user?.role ?? "USER"}</Badge>
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <CardTitle>Report range</CardTitle>
          <CardDescription>Use an inclusive date range for statistics and export.</CardDescription>
        </div>

        <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end" onSubmit={submit}>
          <label className="space-y-2 text-sm font-medium text-zinc-800">
            <span>From</span>
            <Input type="date" {...form.register("dateFrom")} />
            {form.formState.errors.dateFrom ? (
              <span className="text-xs text-red-600">{form.formState.errors.dateFrom.message}</span>
            ) : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-zinc-800">
            <span>To</span>
            <Input type="date" {...form.register("dateTo")} />
            {form.formState.errors.dateTo ? (
              <span className="text-xs text-red-600">{form.formState.errors.dateTo.message}</span>
            ) : null}
          </label>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Refresh report
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={exportMutation.isPending}
            onClick={() => {
              exportMutation.mutate(appliedFilter);
            }}
          >
            {exportMutation.isPending ? "Exporting..." : "Download CSV"}
          </Button>
        </form>
      </Card>

      {exportMutation.error instanceof Error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {exportMutation.error.message}
        </div>
      ) : null}

      {statisticsQuery.isPending ? (
        <StateCard title="Loading report" description="Fetching executor statistics." icon="⏳" />
      ) : null}

      {statisticsQuery.error instanceof Error ? (
        <StateCard title="Could not load report" description={statisticsQuery.error.message} icon="⚠️" />
      ) : null}

      {statisticsQuery.data ? <ExecutorStatisticsTable statistics={statisticsQuery.data} /> : null}
    </div>
  );
}
