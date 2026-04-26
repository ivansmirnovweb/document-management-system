"use client";

import type { ExecutorStatistics } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";

function percent(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

type ExecutorStatisticsTableProps = {
  statistics: ExecutorStatistics[];
};

export function ExecutorStatisticsTable({ statistics }: ExecutorStatisticsTableProps) {
  return (
    <Card className="space-y-4">
      <div>
        <CardTitle>Executor statistics</CardTitle>
        <CardDescription>Performance across the selected date range.</CardDescription>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-[0.15em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Executor</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">On time</th>
              <th className="px-4 py-3 font-semibold">Late</th>
              <th className="px-4 py-3 font-semibold">Overdue</th>
              <th className="px-4 py-3 font-semibold">Overdue %</th>
            </tr>
          </thead>
          <tbody>
            {statistics.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-zinc-500" colSpan={6}>
                  No statistics for this period.
                </td>
              </tr>
            ) : null}
            {statistics.map((item) => (
              <tr key={item.executor.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                <td className="px-4 py-4 align-top">
                  <div className="space-y-2">
                    <div className="font-semibold text-zinc-950">{item.executor.displayName}</div>
                    <div className="text-xs text-zinc-500">@{item.executor.username}</div>
                    <Badge tone={item.executor.role === "ROOT" ? "warning" : "info"}>{item.executor.role}</Badge>
                  </div>
                </td>
                <td className="px-4 py-4 align-top font-medium text-zinc-950">{item.totalDocuments}</td>
                <td className="px-4 py-4 align-top text-emerald-700">{item.completedOnTime}</td>
                <td className="px-4 py-4 align-top text-amber-700">{item.completedLate}</td>
                <td className="px-4 py-4 align-top text-red-700">{item.overdueCount}</td>
                <td className="px-4 py-4 align-top font-medium text-zinc-950">{percent(item.overduePercentage)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
