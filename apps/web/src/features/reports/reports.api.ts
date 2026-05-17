import { z } from "zod";
import {
  executorStatisticsSchema,
  reportFilterInputSchema,
  type ExecutorStatistics,
  type ReportFilterInput,
} from "@document-flow/shared";
import { ApiError, apiFetch, apiRequest } from "@/lib/api";

const executorStatisticsListSchema = z.array(executorStatisticsSchema);

function buildQuery(filter: ReportFilterInput): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(filter)) {
    if (value === undefined || value === "") {
      continue;
    }
    if (Array.isArray(value)) {
      search.set(key, value.join(","));
      continue;
    }
    search.set(key, String(value));
  }

  const query = search.toString();
  return query.length > 0 ? `?${query}` : "";
}

export const reportsApi = {
  getExecutorStatistics(filter: ReportFilterInput): Promise<ExecutorStatistics[]> {
    const payload = reportFilterInputSchema.parse(filter);
    return apiRequest(`/reports/executors${buildQuery(payload)}`, { method: "GET" }, executorStatisticsListSchema);
  },

  async exportDocuments(filter: ReportFilterInput): Promise<string> {
    const payload = reportFilterInputSchema.parse(filter);
    const response = await apiFetch(`/reports/documents/export${buildQuery(payload)}`, { method: "GET" });
    const text = await response.text();

    if (!response.ok) {
      throw new ApiError(text || `Request failed with status ${response.status}`, response.status, text);
    }

    return text;
  },
};
