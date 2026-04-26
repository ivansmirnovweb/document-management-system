import type { ReportFilterInput } from "@document-flow/shared";

function normalizeReportsFilterKey(filter: ReportFilterInput) {
  return [
    filter.dateFrom,
    filter.dateTo,
    filter.executorId ?? "",
    filter.ownerId ?? "",
    filter.employerId ?? "",
    filter.status ?? "",
    filter.includeDeleted ? "1" : "0",
  ] as const;
}

export const reportsKeys = {
  all: ["reports"] as const,
  executors: (filter: ReportFilterInput) => [...reportsKeys.all, "executors", ...normalizeReportsFilterKey(filter)] as const,
};
