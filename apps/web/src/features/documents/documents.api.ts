import { z } from "zod";
import {
  createDocumentInputSchema,
  documentDetailsSchema,
  documentListItemSchema,
  updateDocumentInputSchema,
  type CreateDocumentInput,
  type DocumentDetails,
  type DocumentListItem,
  type DocumentStatus,
  type UpdateDocumentInput,
} from "@document-flow/shared";
import { apiNoContent, apiRequest } from "@/lib/api";

const documentListSchema = z.array(documentListItemSchema);

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }

    search.set(key, String(value));
  }

  const query = search.toString();
  return query.length > 0 ? `?${query}` : "";
}

export const documentsApi = {
  listPublic(): Promise<DocumentListItem[]> {
    return apiRequest("/documents/public", { method: "GET" }, documentListSchema);
  },

  list(status?: DocumentStatus): Promise<DocumentListItem[]> {
    return apiRequest(
      `/documents${buildQuery({ status })}`,
      { method: "GET" },
      documentListSchema,
    );
  },

  search(params: { q?: string; status?: DocumentStatus }): Promise<DocumentListItem[]> {
    return apiRequest(
      `/documents/search${buildQuery({ q: params.q?.trim(), status: params.status })}`,
      { method: "GET" },
      documentListSchema,
    );
  },

  getPublicById(id: number): Promise<DocumentDetails> {
    return apiRequest(`/documents/public/${id}`, { method: "GET" }, documentDetailsSchema);
  },

  getById(id: number): Promise<DocumentDetails> {
    return apiRequest(`/documents/${id}`, { method: "GET" }, documentDetailsSchema);
  },

  create(input: CreateDocumentInput): Promise<DocumentDetails> {
    const payload = createDocumentInputSchema.parse(input);
    return apiRequest("/documents", { method: "POST", body: payload }, documentDetailsSchema);
  },

  update(id: number, input: UpdateDocumentInput): Promise<DocumentDetails> {
    const payload = updateDocumentInputSchema.parse(input);
    return apiRequest(`/documents/${id}`, { method: "PATCH", body: payload }, documentDetailsSchema);
  },

  changeStatus(id: number, status: DocumentStatus): Promise<DocumentDetails> {
    return apiRequest(
      `/documents/${id}/status`,
      { method: "PATCH", body: { status } },
      documentDetailsSchema,
    );
  },

  remove(id: number): Promise<null> {
    return apiRequest(`/documents/${id}`, { method: "DELETE" }, apiNoContent());
  },
};
