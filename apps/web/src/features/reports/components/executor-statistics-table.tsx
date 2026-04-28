"use client";

import type { ExecutorStatistics } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { StateCard } from "@/shared/ui/state-card";

function percent(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

type ExecutorStatisticsTableProps = {
  statistics: ExecutorStatistics[];
};

export function ExecutorStatisticsTable({ statistics }: ExecutorStatisticsTableProps) {
  if (statistics.length === 0) {
    return <StateCard title="Статистика отсутствует" description="Попробуйте другой диапазон дат или фильтры." icon="📊" />;
  }

  return (
    <Card className="space-y-4">
      <div>
        <CardTitle>Статистика исполнителей</CardTitle>
        <CardDescription>Показатели за выбранный диапазон дат.</CardDescription>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-[0.15em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Исполнитель</th>
              <th className="px-4 py-3 font-semibold">Всего</th>
              <th className="px-4 py-3 font-semibold">В срок</th>
              <th className="px-4 py-3 font-semibold">С опозданием</th>
              <th className="px-4 py-3 font-semibold">Просрочено</th>
              <th className="px-4 py-3 font-semibold">Просрочка %</th>
            </tr>
          </thead>
          <tbody>
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
