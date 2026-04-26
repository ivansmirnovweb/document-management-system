import type { DocumentStatus } from "@document-flow/shared";

export const documentsKeys = {
  all: ["documents"] as const,
  list: (scope: "public" | "private", status: DocumentStatus | "search") =>
    [...documentsKeys.all, scope, status] as const,
  search: (scope: "private", status: DocumentStatus, query: string) =>
    [...documentsKeys.all, scope, "search", status, query.trim()] as const,
  details: (scope: "public" | "private", id: number) =>
    [...documentsKeys.all, scope, "details", id] as const,
};
